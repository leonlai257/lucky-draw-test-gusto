import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    //Seeding the users table
    const user = await prisma.users.upsert({
        where: { phone_no: '12345678' },
        update: {},
        create: {
            phone_no: '12345678'
        },
    })

    //Seeding the prize_pool table
    const twoCashCoupon = await prisma.prizes_pool.create({
        data: {
            name: 'Two Dollars Cash Coupon',
            daily_limit: 500,
            total_limit: 5000,
            stock: 500
        },
    })

    const fiveCashCoupon = await prisma.prizes_pool.create({
        data: {
            name: 'Five Dollars Cash Coupon',
            daily_limit: 100,
            total_limit: 500,
            stock: 100
        },
    })

    const buyOneCoupon = await prisma.prizes_pool.create({
        data: {
            name: 'Buy One Get One Free Coupon',
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })