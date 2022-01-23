const Database = require("../database");

const StartupService = {
    ...Database.startup
}

module.exports = StartupService;