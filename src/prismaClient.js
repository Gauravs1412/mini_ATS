// src/prismaClient.js
const { PrismaClient } = require("../generated/prisma")

// Singleton pattern to ensure only one instance of PrismaClient is created.
let prisma;

// Check if Prisma Client has already been instantiated
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, reuse Prisma Client across hot reloads to avoid multiple connections
  if (!global.prisma) {
    console.log("creating new instance of prisma")
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}


module.exports = prisma;
