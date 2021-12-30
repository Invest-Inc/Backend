const { Prisma } = require("@prisma/client");
const Database = require("./database");

const BusinessNewsService = {
    ...Database.businessNews
};

module.exports = BusinessNewsService;