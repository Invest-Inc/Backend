const { PrismaClient } = require("@prisma/client")

const Database = new PrismaClient()

module.exports = Database;