const Database = require("../database");
const StartupAdminService = require("./StartupAdminService");


const getUserPermissions = async ({user_id, startup_id}) => {
    const row = await StartupAdminService.findFirst({
        where: {
            startup_id, 
            AND: {
                user_id
            }
        }
    });
    if(row == undefined) return {premissions: "none"}
    return {premissions: row.priviledge}
}

const getAdmins = async startup_id => {
    return await StartupAdminService.findMany({
        where: {startup_id}
    });
}

const StartupService = {
    ...Database.startup,
    getUserPermissions,
    getAdmins
}

module.exports = StartupService;