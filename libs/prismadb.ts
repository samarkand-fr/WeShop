// Import the PrismaClient from the Prisma client library.
import { PrismaClient } from "@prisma/client";

// Declare a global variable to make PrismaClient globally available.
declare global {
    var prisma: PrismaClient | undefined;
}

// To make prisma globally accessible, initialize it or use the existing global instance.
// Create a new PrismaClient instance if it doesn't exist in the global context.
const client = globalThis.prisma || new PrismaClient();

// If the environment is not in production, set the global prisma variable to the client instance.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// Export the PrismaClient instance for use in other parts of the application.
export default client;
