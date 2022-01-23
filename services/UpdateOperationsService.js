const Database = require("../database");
const UpdateNewsService = require("./UpdateNewsService");

const UpdateOperationsService = {
    ...Database.update_Operations
}

module.exports = UpdateNewsService;