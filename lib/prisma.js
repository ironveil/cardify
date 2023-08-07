// --- Prisma Module ---

// Import the Prisma client
import { PrismaClient } from "@prisma/client"

// Create the prisma variable
let prisma

// Production node
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {

    // Allows auto-refresh to happen & not create a new connection
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }

    prisma = global.prisma
}

// Exports Prisma
export default prisma