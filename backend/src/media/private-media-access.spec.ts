import { Role } from 'src/generated/prisma/enums';
import { BookingController } from 'src/booking/booking.controller';
import { MaintenanceController } from 'src/maintenance/maintenance.controller';
import { PaymentController } from 'src/payment/payment.controller';
import { PaymentMethodsController } from 'src/payment-methods/payment-methods.controller';
import { StaffReportsController } from 'src/staff-reports/staff-reports.controller';
import { IS_PUBLIC_KEY } from 'src/lib/decorators/Public.decorator';
import { ROLES_KEY } from 'src/lib/decorators/Roles.decorator';

const getRoles = (handler: (...args: any[]) => any) =>
  Reflect.getMetadata(ROLES_KEY, handler) as Role[] | undefined;

describe('Permanent private media access policy', () => {
  it('limits payment records containing proofs to Admin', () => {
    expect(getRoles(PaymentController.prototype.getPayments)).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(PaymentController.prototype.getPaymentById)).toEqual([
      Role.ADMIN,
    ]);
  });

  it('allows Guest and Admin booking-detail access before ownership checks', () => {
    expect(getRoles(BookingController.prototype.GetBookingById)).toEqual([
      Role.ADMIN,
      Role.GUEST,
    ]);
  });

  it('limits direct staff-report proof reads to Resort Staff and Admin', () => {
    expect(getRoles(StaffReportsController.prototype.viewReportByUserId)).toEqual([
      Role.RESORT_STAFF,
    ]);
    expect(getRoles(StaffReportsController.prototype.viewReportById)).toEqual([
      Role.RESORT_STAFF,
      Role.ADMIN,
    ]);
  });

  it('limits maintenance media to Admin or assigned Maintenance Staff routes', () => {
    expect(getRoles(MaintenanceController.prototype.getMaintenances)).toEqual([
      Role.ADMIN,
    ]);
    expect(
      getRoles(MaintenanceController.prototype.getAssignedActiveMaintenances),
    ).toEqual([Role.MAINTENANCE_STAFF]);
    expect(
      getRoles(MaintenanceController.prototype.getAssignedMaintenanceHistory),
    ).toEqual([Role.MAINTENANCE_STAFF]);
    expect(
      getRoles(MaintenanceController.prototype.getAssignedMaintainanceById),
    ).toEqual([Role.MAINTENANCE_STAFF]);
  });

  it('keeps active payment methods and their QR codes public', () => {
    expect(
      Reflect.getMetadata(
        IS_PUBLIC_KEY,
        PaymentMethodsController.prototype.getActivePaymentMethods,
      ),
    ).toBe(true);
  });

  it('keeps public booking availability separate from private booking details', () => {
    expect(
      Reflect.getMetadata(
        IS_PUBLIC_KEY,
        BookingController.prototype.GetBookingsByAccommodation,
      ),
    ).toBe(true);
    expect(
      Reflect.getMetadata(
        IS_PUBLIC_KEY,
        BookingController.prototype.GetBookingById,
      ),
    ).not.toBe(true);
  });
});
