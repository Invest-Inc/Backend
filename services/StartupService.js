const Database = require("../database");
const StartupAdminService = require("./StartupAdminService");

const permissionsMiddleware = (...priviledge) => (
    async (req, res, next) => {
        let priviledges = await StartupAdminService.findFirst({
            where: {
                startup_id: parseInt(req.params.startup_id), 
                user_id: parseInt(req.user.user_id)
            }
        })
        for(let priviledge of priviledges){
            if(priviledges.priviledge == priviledge) return next();
        }
        return res.json({error: "Unauthorized"}).status(400);
    }
)


const getUserPermissions = async ({user_id, startup_id}) => {
    const row = await StartupAdminService.findFirst({
        where: {
            startup_id, 
            AND: {
                user_id
            }
        }
    });
    if(row == undefined) return {permissions: "none"}
    return {permissions: row.priviledge}
}

const getAdmins = async startup_id => {
    return await StartupAdminService.findMany({
        where: {startup_id}
    });
}

const StartupService = {
    ...Database.startup,
    permissionsMiddleware, 
    getUserPermissions,
    getAdmins
}

module.exports = StartupService;