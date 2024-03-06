import { PrismaClient } from "@prisma/client";

declare global {
    var prisma : PrismaClient | undefined
}
// to make prisma globaly if exist or if not create a new one
const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client
export default client