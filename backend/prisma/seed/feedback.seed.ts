import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
    const eligibleBookings = await prisma.booking.findMany({
        where: {
            status: "Completed",
            feedback: null,
        },
        select: { id: true, userId: true },
    });

    if (eligibleBookings.length === 0) {
        console.log("No eligible bookings found");
        return;
    }

    const feedbacks = await Promise.all(
        eligibleBookings.map((booking) =>
        prisma.feedback.create({
            data: {
                userId: booking.userId,
                bookingId: booking.id,
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: faker.lorem.paragraphs(2),
            },
        })
        )
    );

    console.log(`✓ Created ${feedbacks.length} feedbacks`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());