import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
})

export default prisma
