const Database = require("../database");

/**
 * Express Middleware to handle startup pages admin permissions
 * @param  {...any} priviledge List of required priviledge tags
 * @returns {}
 */
const permissionsMiddleware = (...priviledges) => (
    async (req, res, next) => {
        const admin = await Database.startup_Admin.findFirst({
            where: {
                startup_id: parseInt(req.params.startup_id), 
                user_id: parseInt(req.user.user_id)
            }
        })
        if(admin == undefined) 
            return res.json({error: "Unauthorized"}).status(400);
        for(let priviledge of priviledges){
            if(admin.priviledge == priviledge) return next();
        }
        return res.json({error: "Unauthorized"}).status(400);
    }
)

/**
 * Returns a list of a strartup's admins
 * @param {Int} startup_id Id of startup to get admins from
 */
 const getAdmins = async ({startup_id}) => {
    return await Database.startup_Admin.findMany({
        where: {startup_id}
    });
}

/**
 * Creates a new admin for the startup
 * @param {{user_id: Number, startup_id: Number, priviledge: String}} param0 
 */
const addAdmin = async ({user_id, startup_id, priviledge}) => {
    await Database.startup_Admin.create({
        data: {user_id, startup_id, priviledge}
    })
}

/**
 * Removes an admin from the startup
 * @param {{user_id: Number, startup_id: Number}} param0 
 */
const removeAdmin = async ({user_id, startup_id, priviledge}) => {
    const row = await Database.startup_Admin.findFirst({
        where: {user_id, startup_id}
    });
    if(row == undefined) return;
    await Database.startup_Admin.delete({
        where: {startup_admin_id: row.startup_admin_id}
    });
}

/**
 * Get a list of registered employees in the startup
 * @param {{startup_id: Number}} param0 
 * @returns 
 */
const getEmployees = async ({startup_id}) => {
    return await Database.startup_Employee.findMany({
        where: {startup_id}
    })
}

/**
 * Registers an employee for the startup
 * @param {{startup_id: Number, user_id: Number, role: String, role_description: String}} param0 
 */
const addEmployee = async ({startup_id, user_id, role, role_description}) => {
    await Database.startup_Employee.create({
        data: {startup_id, user_id, role, role_description}
    });
}

const removeEmployee = async ({startup_id, user_id}) => {
    const row = await Database.startup_Employee.findFirst({
        where: {startup_id, user_id}
    });
    if(row == undefined) return;
    await Database.startup_Employee.delete({
        where: {startup_employee_id: row.startup_employee_id}
    });
}

const getUserPermissions = async ({user_id, startup_id}) => {
    const row = await Database.startup_Admin.findFirst({
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
const StartupService = {
    ...Database.startup,
    permissionsMiddleware, 
    // Admins
    getAdmins, 
    addAdmin, 
    removeAdmin, 
    // Employees
    getEmployees, 
    addEmployee, 
    removeEmployee,


    getUserPermissions,
}

module.exports = StartupService;