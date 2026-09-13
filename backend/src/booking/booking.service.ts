import { getBookingStayWindow } from 'src/lib/utils/booking-stay.util';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccommodationStayOption, Prisma } from 'src/generated/prisma/client';
import { BookingSource, BookingStatus } from 'src/generated/prisma/enums';
import { UserSession } from 'src/lib/decorators/User.decorator';
import { ValidationException } from 'src/lib/exception/ValidationException';
import { toDateOnly } from 'src/lib/utils/date.util';
import { getPaginationArgs, getPaginationMeta } from 'src/lib/utils/paginate';
import { cleanPrismaWhere } from 'src/lib/utils/prisma-filter';
import { PaymentService } from 'src/payment/payment.service';
import { PreOrderService } from 'src/pre-order/pre-order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingServicesService } from 'src/services/booking-services.service';
import { ChangeStatusDto, CreateBookingDto, CreateManualBookingDto, CreateWalkInBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { GetBookingsByUserQuery, GetBookingsQuery, GetStaffBookingsQuery } from './query/getBookings.query';
import { ClosureService } from 'src/closure/closure.service';
import { BookingEmailService } from './booking-email.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly preOrderService: PreOrderService,
        private readonly bookingServicesService: BookingServicesService,
        private readonly paymentService: PaymentService,
        private readonly closureService: ClosureService,
        private readonly bookingEmailService: BookingEmailService,
    ) {}

    private calculateGuestFee(adultGuests: number, seniorGuests: number, kidGuests: number, stayOptionCode: string) {
        const adultFee = stayOptionCode.toLowerCase() === 'daystay' ? 150 : 180 // full price
        const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
        const kidsFee = 100 // just a kid 4-7 years old

        const adultTotal = adultGuests * adultFee;
        const seniorTotal = seniorGuests * seniorFee;
        const kidsTotal = kidGuests * kidsFee; 

        return adultTotal + seniorTotal + kidsTotal
    }

    private buildBookingReferenceCode(bookingId: string, stayDate: Date) {
        const year = stayDate.getUTCFullYear();
        const month = String(stayDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(stayDate.getUTCDate()).padStart(2, '0');
        const suffix = bookingId.slice(-5).toUpperCase();

        return `BK-${year}${month}${day}-${suffix}`;
    }

    private async attachReferenceCode(
        booking: { id: string; bookingDate: Date },
        tx: Prisma.TransactionClient,
    ) {
        return tx.booking.update({
            where: { id: booking.id },
            data: {
                referenceCode: this.buildBookingReferenceCode(booking.id, booking.bookingDate),
            },
        });
    }

    private async findStayOptionOrThrow(accommodationId: string, stayOptionId: string, tx: Prisma.TransactionClient = this.prisma) {
        const stayOption = await tx.accommodationStayOption.findFirst({
            where: {
                id: stayOptionId,
                accommodationId,
                isActive: true,
            }
        });

        if(!stayOption) {
            throw new NotFoundException('Stay option not found for this accommodation')
        }

        return stayOption;
    }

    private assertBookingDateIsThreeDaysAhead(bookingDate: Date) {
        const earliestDate = toDateOnly(new Date(Date.now()));
        earliestDate.setUTCDate(earliestDate.getUTCDate() + 3);
        if (toDateOnly(bookingDate) < earliestDate) {
            throw new BadRequestException('Booking date must be at least 3 days ahead.');
        }
    }

    private async ensureBookingSlotAvailable(
        accommodationId: string,
        checkIn: Date,
        stayOptionId: string,
        tx: Prisma.TransactionClient
    ) {
        const existingBooking = await tx.booking.findFirst({
            where: {
                accommodationId,
                bookingDate: checkIn,
                stayOptionId,
                status: { notIn: ['Cancelled'] }
            },
            select: { id: true }
        });

        if(existingBooking) {
            throw new ConflictException('Accommodation is already booked for the selected date and time slot');
        }

        const isClosed = await this.closureService.validateClosureDate(accommodationId, checkIn);

        if(isClosed) {
            throw new ConflictException('Accommodation is closed for the selected date');
        }
    }

    async bookAccommodation(body: CreateBookingDto, user: UserSession) {

        this.assertBookingDateIsThreeDaysAhead(body.checkIn);

        // this sohuld be on the accommodation module
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id: body.accommodationId } })

        if(!accommodation || accommodation.retiredAt) {
            throw new NotFoundException('Accommodation not found')
        }

        if(!body.adultGuests  && !body.seniorGuests && !body.kidGuests) {
            throw new ValidationException({
                field: 'numberOfGuests',
                message: ["at least 1 guests is required"]
            })
        }
   
        const booking = await this.prisma.$transaction(async (txprisma) => {
            const stayOption = await this.findStayOptionOrThrow(body.accommodationId, body.stayOptionId, txprisma);
            await this.ensureBookingSlotAvailable(body.accommodationId, body.checkIn, body.stayOptionId, txprisma);

            const createdBooking = await this.createBooking(body, user.id, stayOption, accommodation.isGuestFeeWaived, txprisma);
            const newBooking = await this.attachReferenceCode(createdBooking, txprisma);

            const { total: preOrderTotal } = await this.preOrderService.createBulkPreOrder(newBooking.id, body.preOrderItems || [], txprisma);
            const guestFeeTotal = accommodation.isGuestFeeWaived
                ? 0
                : this.calculateGuestFee(body.adultGuests, body.seniorGuests, body.kidGuests, stayOption.code)

            const { total: addOnServiceTotal } = await this.bookingServicesService.createBulk(newBooking.id, body.addOnServices || [], txprisma);

            await txprisma.bookedAccommodation.create({
                data: {
                    bookingId: newBooking.id,
                    name: accommodation.name,
                    type: accommodation.type,
                    price: accommodation.price,
                    imageUrl: accommodation.imageUrl,
                    capacity: accommodation.capacity,
                    description: accommodation.description,
                    amenities: accommodation.amenities,
                }
            })

            const { paymentId, referenceNumber } = await this.paymentService.createPayment({
                bookingId: newBooking.id,
                methodId: body.paymentMethodId,
                proofImageUrl: body.proofImageUrl,
                accommodationFee: accommodation.price,
                guestFee: guestFeeTotal,
                preOrderFee: preOrderTotal,
                addOnServiceFee: addOnServiceTotal,
                paymentType: body.paymentType,
            }, txprisma)

            return {
                ...newBooking,
                paymentId,
                referenceNumber
            }
        })

        await this.bookingEmailService.sendSubmittedEmail(booking.id);

        return booking
    }

    async createManualBooking(body: CreateManualBookingDto, user: UserSession) {
        return this.createAdminBooking(body, user, BookingSource.Manual, true);
    }

    async createWalkInBooking(body: CreateWalkInBookingDto, user: UserSession) {
        return this.createAdminBooking(
            { ...body, checkIn: toDateOnly(new Date(Date.now())), paymentType: 'Full' },
            user,
            BookingSource.WalkIn,
            false,
        );
    }

    private async createAdminBooking(
        body: CreateManualBookingDto,
        user: UserSession,
        source: BookingSource,
        enforceThreeDayRule: boolean,
    ) {
        if (enforceThreeDayRule) this.assertBookingDateIsThreeDaysAhead(body.checkIn);
        const accommodation = await this.prisma.accommodation.findUnique({ where: { id: body.accommodationId } });

        if(!accommodation || accommodation.retiredAt) {
            throw new NotFoundException('Accommodation not found');
        }

        const numberOfGuests = body.adultGuests + body.seniorGuests + body.kidGuests;

        if(numberOfGuests < 1) {
            throw new ValidationException({
                field: 'adultGuests',
                message: ['at least 1 guest is required']
            });
        }

        if(numberOfGuests > accommodation.capacity) {
            throw new ValidationException({
                field: 'adultGuests',
                message: [`Maximum capacity for ${accommodation.name} is ${accommodation.capacity} guests`]
            });
        }

        const booking = await this.prisma.$transaction(async (txprisma) => {
            const stayOption = await this.findStayOptionOrThrow(body.accommodationId, body.stayOptionId, txprisma);
            await this.ensureBookingSlotAvailable(body.accommodationId, body.checkIn, body.stayOptionId, txprisma);

            const bookingPayload = {
                ...body,
                email: body.email.trim().toLowerCase(),
            };

            const createdBooking = await this.createBooking(
                bookingPayload,
                null,
                stayOption,
                accommodation.isGuestFeeWaived,
                txprisma,
                'Confirmed',
                source,
            );
            const newBooking = await this.attachReferenceCode(createdBooking, txprisma);

            const { total: preOrderTotal } = await this.preOrderService.createBulkPreOrder(
                newBooking.id,
                body.preOrderItems || [],
                txprisma
            );

            const { total: addOnServiceTotal } = await this.bookingServicesService.createBulk(
                newBooking.id,
                body.addOnServices || [],
                txprisma
            );

            const guestFeeTotal = accommodation.isGuestFeeWaived
                ? 0
                : this.calculateGuestFee(bookingPayload.adultGuests, bookingPayload.seniorGuests, bookingPayload.kidGuests, stayOption.code);

            await txprisma.bookedAccommodation.create({
                data: {
                    bookingId: newBooking.id,
                    name: accommodation.name,
                    type: accommodation.type,
                    price: accommodation.price,
                    imageUrl: accommodation.imageUrl,
                    capacity: accommodation.capacity,
                    description: accommodation.description,
                    amenities: accommodation.amenities,
                }
            });

            const { paymentId, referenceNumber } = await this.paymentService.createManualPayment({
                bookingId: newBooking.id,
                accommodationFee: accommodation.price,
                guestFee: guestFeeTotal,
                preOrderFee: preOrderTotal,
                addOnServiceFee: addOnServiceTotal,
                paymentType: body.paymentType,
                proofImageUrl: body.proofImageUrl,
                verifiedById: user.id,
            }, txprisma);

            return {
                ...newBooking,
                paymentId,
                referenceNumber
            };
        });

        await this.paymentService.sendApprovedPaymentEmail(booking.paymentId);

        return booking;
    }

    async createBooking(
        body: Pick<CreateBookingDto, 'accommodationId' | 'checkIn' | 'stayOptionId' | 'paymentType' | 'specialRequest' | 'name' | 'email' | 'contactNo' | 'kidGuests' | 'adultGuests' | 'seniorGuests'>,
        userId: string | null,
        stayOption: AccommodationStayOption,
        isGuestFeeWaived: boolean,
        tx: Prisma.TransactionClient,
        status: BookingStatus = 'Pending',
        source: BookingSource = BookingSource.Online,
    ) {
        const totalNumberofGuest = body.seniorGuests + body.adultGuests + body.kidGuests

        const newBooking = await tx.booking.create({
            data: {
                userId,
                accommodationId: body.accommodationId,
                bookingDate: body.checkIn,
                stayOptionId: body.stayOptionId,
                stayOptionCodeSnapshot: stayOption.code,
                stayOptionLabelSnapshot: stayOption.label,
                stayDurationHoursSnapshot: stayOption.durationHours,
                guestFeeWaivedSnapshot: isGuestFeeWaived,
                paymentType: body.paymentType,
                numberOfGuests: totalNumberofGuest,
                specialRequests: body.specialRequest,
                guestName: body.name,
                email: body.email,
                contactNo: body.contactNo,
                kidGuests: body.kidGuests,
                adultGuests: body.adultGuests,
                seniorGuest: body.seniorGuests,
                status,
                source,
            }
        })
          
        return newBooking;
    }

    async getBookings(query: GetBookingsQuery) {
        const currentDate = new Date();
        const { search, page, limit, bookingDate, ...rest } = cleanPrismaWhere(query)

        const searchFilter = search ? {
            OR: [
                { id: { contains: search, mode: 'insensitive' as const } },
                { referenceCode: { contains: search, mode: 'insensitive' as const } },
                { guestName: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {}

        const bookingDateFilter = bookingDate
            ? { bookingDate }
            : { bookingDate: { gte: currentDate } }

        const where = {
            ...bookingDateFilter,
            ...rest,
            ...searchFilter,
        }

        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                include: {
                    accommodation: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            imageUrl: true,
                        }
                    },
                    stayOption: true,
                },
                ...getPaginationArgs(page, limit),
                orderBy: { bookingDate: 'desc' }
            }),
            this.prisma.booking.count({ where })
        ])

        return {
            data,
            meta: getPaginationMeta(total, page, limit)
        }
    }

    async getBookingOverview(date?: Date) {
        const overviewDate = toDateOnly(date ?? new Date());
        const bookingSummarySelect = {
            id: true,
            referenceCode: true,
            guestName: true,
            bookingDate: true,
            stayOptionLabelSnapshot: true,
            stayOptionCodeSnapshot: true,
            paymentType: true,
            status: true,
            createdAt: true,
            accommodation: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    imageUrl: true,
                },
            },
            payment: {
                select: {
                    id: true,
                    status: true,
                    amountPaid: true,
                    amountToPaid: true,
                    totalAmount: true,
                },
            },
        } satisfies Prisma.BookingSelect;

        const todayWhere: Prisma.BookingWhereInput = {
            bookingDate: overviewDate,
            status: { not: 'Cancelled' },
        };

        const [todayCount, todaySchedule, upcomingBookings, recentBookings] =
            await Promise.all([
                this.prisma.booking.count({ where: todayWhere }),
                this.prisma.booking.findMany({
                    where: todayWhere,
                    select: bookingSummarySelect,
                    orderBy: [
                        { stayOption: { sortOrder: 'asc' } },
                        { createdAt: 'asc' },
                    ],
                }),
                this.prisma.booking.findMany({
                    where: {
                        bookingDate: { gte: overviewDate },
                        status: { in: ['Pending', 'Confirmed'] },
                    },
                    select: bookingSummarySelect,
                    take: 5,
                    orderBy: [
                        { bookingDate: 'asc' },
                        { stayOption: { sortOrder: 'asc' } },
                    ],
                }),
                this.prisma.booking.findMany({
                    select: bookingSummarySelect,
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                }),
            ]);

        return {
            todayCount,
            todaySchedule,
            upcomingBookings,
            recentBookings,
        };
    }

    private getManilaDateOnly() {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());

        const year = parts.find((part) => part.type === 'year')?.value;
        const month = parts.find((part) => part.type === 'month')?.value;
        const day = parts.find((part) => part.type === 'day')?.value;

        return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    async getStaffBookings(query: GetStaffBookingsQuery) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const search = query.search?.trim();
        const where: Prisma.BookingWhereInput = {
            status: 'Confirmed',
            bookingDate: { gte: this.getManilaDateOnly() },
            ...(search ? {
                OR: [
                    { id: { contains: search, mode: 'insensitive' } },
                    { referenceCode: { contains: search, mode: 'insensitive' } },
                    { guestName: { contains: search, mode: 'insensitive' } },
                    { contactNo: { contains: search, mode: 'insensitive' } },
                ]
            } : {}),
        };

        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                select: {
                    id: true,
                    referenceCode: true,
                    guestName: true,
                    contactNo: true,
                    bookingDate: true,
                    numberOfGuests: true,
                    status: true,
                    stayOptionCodeSnapshot: true,
                    stayOptionLabelSnapshot: true,
                    stayDurationHoursSnapshot: true,
                    guestFeeWaivedSnapshot: true,
                    accommodation: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            imageUrl: true,
                        }
                    },
                    stayOption: {
                        select: {
                            sortOrder: true,
                            startTime: true,
                            endTime: true,
                        }
                    },
                },
                ...getPaginationArgs(page, limit),
                orderBy: [
                    { bookingDate: 'asc' },
                    { stayOption: { sortOrder: 'asc' } },
                ],
            }),
            this.prisma.booking.count({ where }),
        ]);

        return {
            data,
            meta: getPaginationMeta(total, page, limit),
        };
    }

    async getStaffBookingById(bookingId: string) {
        const booking = await this.prisma.booking.findFirst({
            where: {
                id: bookingId,
                status: 'Confirmed',
                bookingDate: { gte: this.getManilaDateOnly() },
            },
            select: {
                id: true,
                referenceCode: true,
                guestName: true,
                email: true,
                contactNo: true,
                adultGuests: true,
                kidGuests: true,
                seniorGuest: true,
                numberOfGuests: true,
                specialRequests: true,
                bookingDate: true,
                status: true,
                stayOptionCodeSnapshot: true,
                stayOptionLabelSnapshot: true,
                stayDurationHoursSnapshot: true,
                guestFeeWaivedSnapshot: true,
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true,
                    }
                },
                stayOption: {
                    select: {
                        startTime: true,
                        endTime: true,
                        sortOrder: true,
                    }
                },
                addOns: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        price: true,
                    },
                    orderBy: { name: 'asc' },
                },
                preOrders: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        category: true,
                        quantity: true,
                        status: true,
                    },
                    orderBy: { name: 'asc' },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Confirmed upcoming booking not found');
        }

        return booking;
    }

    async getBookingsByAccommodation(accommodationId: string) {
        const bookings = await this.prisma.booking.findMany({
            where: { 
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: { 
                    notIn: ['Cancelled']
                }
            },
            select: {
                bookingDate: true,
                stayOptionId: true,
                stayOptionLabelSnapshot: true,
            },
        })

        const groupMap = new Map<string, { id: string, label: string }[]>()
        bookings.forEach(booking => {
            const dateKey = booking.bookingDate.toISOString().split('T')[0]

            if(!groupMap.has(dateKey)) {
                groupMap.set(dateKey, [])
            }

            groupMap.get(dateKey)?.push({
                id: booking.stayOptionId,
                label: booking.stayOptionLabelSnapshot
            })
        })

        const activeStayOptionCount = await this.prisma.accommodationStayOption.count({
            where: { accommodationId, isActive: true }
        });

        const result = Array.from(groupMap.entries()).map(([date, stayOptions]) => {
            const bookingStatus = stayOptions.length >= activeStayOptionCount ? 'Full' : 'Partial';

            return {
                bookingDate: date,
                bookingStatus,
                timeSlotsOccupied: stayOptions.map((option) => option.id),
                stayOptionsOccupied: stayOptions
            }
        })

        return result
    }

    async getBookingsForClosure(accommodationId?: string) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                accommodationId: accommodationId,
                bookingDate: { gte: new Date() },
                status: {
                    notIn: ['Cancelled']
                }
            },
            select: { bookingDate: true, id: true },
            orderBy: { bookingDate: 'asc' }
        });

        const groupMap = new Map<string, string[]>();
        bookings.forEach(booking => {
            const dateKey = booking.bookingDate.toISOString().split('T')[0];

            if(!groupMap.has(dateKey)) {
                groupMap.set(dateKey, []);
            }

            groupMap.get(dateKey)?.push(booking.id)
        })

        const result = Array.from(groupMap.entries()).map(([date, bookingIds]) => {
            return { bookingDate: date, bookingIds }
        })

        return result
    }

    async getBookingById(bookingId: string, user: UserSession) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true,
                    }
                },
                payment: {
                    select: {
                        id: true,
                        status: true,
                        referenceNumber: true,
                        proofImageUrl: true,
                        rejectionNote: true,
                        refundReason: true,
                        refundProofImageUrl: true,
                        refundedAt: true,
                        refundedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        verifiedAt: true,
                        method: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                accountName: true,
                                accountNumber: true,
                                instructions: true,
                                qrCodeUrl: true,
                            }
                        },
                        accommodationAmount: true,
                        preOrderAmount: true,
                        addOnAmount: true,
                        guestFeeAmount: true,
                        amountPaid: true,
                        amountToPaid: true,
                        totalAmount: true,
                    },
                },
                preOrders: true,
                addOns: true,
                stayOption: true,
                reports: {
                    where: {
                        type: {
                            in: ['checkIn', 'checkOut'],
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        proofImages: true,
                        type: true,
                        status: true,
                        severity: true,
                        createdAt: true,
                        rejectionNote: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                contactNo: true,
                                role: true,
                            },
                        },
                    },
                },
            }
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        if(user.role === 'GUEST' && (!booking.userId || booking.userId !== user.id)) {
            throw new ForbiddenException('You do not have permission to view this booking')
        }

        return booking
    }

    async getBookingsByUser(user: UserSession, query: GetBookingsByUserQuery) {
        const { status } = cleanPrismaWhere(query);

        const bookings = await this.prisma.booking.findMany({
            where: { userId: user.id, status },
            include: {
                accommodation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        imageUrl: true
                    }
                },
                feedback: true,
                stayOption: true,
                reports: {
                    where: {
                        type: {
                            in: ['checkIn', 'checkOut'],
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        proofImages: true,
                        type: true,
                        status: true,
                        severity: true,
                        createdAt: true,
                        rejectionNote: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                contactNo: true,
                                role: true,
                            },
                        },
                    },
                },
            }
        })

        return bookings 
    }

    async rescheduleBooking(bookingId: string, body: RescheduleBookingDto) {
        this.assertBookingDateIsThreeDaysAhead(body.bookingDate);
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    select: {
                        name: true,
                        type: true,
                    },
                },
            },
        })

        if(!booking) {
            throw new NotFoundException('Booking not found')
        }

        const isClosed = await this.closureService.validateClosureDate(booking.accommodationId, body.bookingDate);

        if (isClosed) {
            throw new BadRequestException('The selected date is closed for bookings');
        }

        const stayOption = await this.findStayOptionOrThrow(booking.accommodationId, body.stayOptionId);

        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                accommodationId: booking.accommodationId,
                bookingDate: body.bookingDate,
                stayOptionId: body.stayOptionId,
                status: { not: 'Cancelled' },
                id: { not: bookingId } //  exclude self to avoid false conflict
            }
        })

        if(existingBooking) {
            throw new ConflictException('A booking already exists for the selected date and time slot')
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                bookingDate: body.bookingDate,
                stayOptionId: body.stayOptionId,
                stayOptionCodeSnapshot: stayOption.code,
                stayOptionLabelSnapshot: stayOption.label,
                stayDurationHoursSnapshot: stayOption.durationHours,
            }
        })

        await this.bookingEmailService.sendRescheduledEmail({
            bookingReference: updatedBooking.referenceCode ?? updatedBooking.id,
            guestName: updatedBooking.guestName,
            email: updatedBooking.email,
            accommodationName: booking.accommodation.name,
            previousBookingDate: booking.bookingDate,
            previousStayOptionLabel: booking.stayOptionLabelSnapshot,
            newBookingDate: updatedBooking.bookingDate,
            newStayOptionLabel: updatedBooking.stayOptionLabelSnapshot,
        });

        return updatedBooking
    }

    async changeStatus(bookingId: string, body: ChangeStatusDto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                stayOption: true,
                accommodation: {
                    select: {
                        name: true,
                        type: true,
                    },
                },
            },
        })

        if(!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (body.status === BookingStatus.Completed) {
            if (booking.status !== BookingStatus.Confirmed) {
                throw new BadRequestException('Only confirmed bookings can be marked Completed.');
            }
            if (!(booking.stayOption?.startTime instanceof Date) || !Number.isFinite(booking.stayOption.startTime.getTime())
                || !(booking.stayOption.endTime instanceof Date) || !Number.isFinite(booking.stayOption.endTime.getTime())) {
                throw new BadRequestException('Stay schedule is unavailable. Cannot complete this booking.');
            }
            const window = getBookingStayWindow({ bookingDate: booking.bookingDate, ...booking.stayOption });
            const availableAt = Math.max(window.checkIn.getTime(), window.checkOut.getTime() - 2 * 60 * 60 * 1000);
            if (Date.now() < availableAt) {
                const time = new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' }).format(availableAt);
                throw new BadRequestException(`Completion is available from ${time} (Philippine time).`);
            }
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: body.status }
        })

        if (updatedBooking.status === BookingStatus.Cancelled) {
            await this.bookingEmailService.sendCancelledEmail({
                bookingReference: updatedBooking.referenceCode ?? updatedBooking.id,
                guestName: updatedBooking.guestName,
                email: updatedBooking.email,
                accommodationName: booking.accommodation.name,
                accommodationType: booking.accommodation.type,
                bookingDate: updatedBooking.bookingDate,
                stayOptionLabel: updatedBooking.stayOptionLabelSnapshot,
            });
        } else {
            await this.bookingEmailService.sendStatusUpdatedEmail({
                bookingReference: updatedBooking.referenceCode ?? updatedBooking.id,
                guestName: updatedBooking.guestName,
                email: updatedBooking.email,
                accommodationName: booking.accommodation.name,
                bookingDate: updatedBooking.bookingDate,
                stayOptionLabel: updatedBooking.stayOptionLabelSnapshot,
                status: updatedBooking.status,
            });
        }

        return updatedBooking
    }
}
