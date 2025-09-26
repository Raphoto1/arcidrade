// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default prisma;

import { PrismaClient } from "@/generated/prisma"
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
export default prisma