const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const StartupService = require("../services/StartupService");
const StartupUpdateService = require("../services/StartupUpdateService");
const UserService = require("../services/UserService");
const router = express.Router();

// Get trending startups
router.get('/trending', 
    async (req, res) => {
        try{
            const data = await StartupService.findMany({
                take: 10
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
);

// * Create a new startup
router.post('/', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            let {name, summary, industry, economic_sector, constitution_date, constitution_country, headquarters_country, international_operations_countries} = req.body;
            constitution_date = new Date(constitution_date);
            const data = await StartupService.create({
                data: {
                    name, 
                    summary, 
                    industry, 
                    economic_sector, 
                    constitution_date,
                    constitution_country, 
                    headquarters_country, 
                    international_operations_countries, 
                    Startup_Admin: {
                        create: {
                            user_id: req.user.user_id, 
                            priviledge: "admin"
                        }
                    }
                }
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
);

// * Update startup data
router.put('/:startup_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        try{
            await StartupService.update({
                where: {startup_id: parseInt(req.params.startup_id)}, 
                data: req.body
            })
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// * Get startup data
router.get('/:startup_id', 
    AuthenticationService.authenticate(false), 
    async (req, res) => {
        try{
            const startup = await StartupService.findUnique({
                where: {startup_id: parseInt(req.params.startup_id)}, 
            });
            if(!startup) res.json({error: "Startup does not exist"}).status(404);
            //
            if(req.user){
                startup.following = await UserService.followsStartup({ user_id: req.user.user_id, following_startup_id: startup.startup_id });
                startup.current_user_permissions = await StartupService.getUserPermissions({ user_id: req.user.user_id, startup_id: startup.startup_id });
            }
            res.json(startup);
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// * Follow a startup
router.post('/:startup_id/follow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            await UserService.followStartup({
                user_id: req.user.user_id, 
                following_startup_id: parseInt(req.params.startup_id)
            });
            res.json({message: "Success"});
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// * Unfollow a startup
router.post('/:startup_id/unfollow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            await UserService.unfollowStartup({
                user_id: req.user.user_id, 
                following_startup_id: parseInt(req.params.startup_id)
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// * Get startup admins (only for admins)
router.get('/:startup_id/admins', 
    AuthenticationService.authenticate(true),
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Return admins
            res.json(
                await StartupService.getAdmins({startup_id: parseInt(req.params.startup_id)})
            )
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
)

// * Create startup admins
router.post('/:startup_id/admins/', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        const {user_id, priviledge} = req.body;
        try{
            // Create admins
            await StartupService.addAdmin({
                user_id: parseInt(user_id), priviledge, 
                startup_id: parseInt(req.params.startup_id), 
            })
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// ? Delete startup admins
router.delete('/:startup_id/admins/:user_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        // If is only admin
        if(req.user.user_id == req.params.user_id)
            return res.json({error: "You cannot delete yourself"})
        try{
            // Delete record
            await StartupService.removeAdmin({
                startup_id: parseInt(req.params.startup_id), 
                user_id: parseInt(req.params.user_id)
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
)

// * Get employees
router.get('/:startup_id/employees', 
    async (req, res) => {
        try{
            const data = await StartupService.getEmployees({
                startup_id: parseInt(req.params.startup_id)
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
); 

// * Add employee
router.post('/:startup_id/employees', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        const {user_id, role, role_description} = req.body;
        try{
            // Add record
            await StartupService.addEmployee({
                user_id: parseInt(user_id), role, role_description, 
                startup_id: parseInt(req.params.startup_id)
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
)

// * Delete employee
router.delete('/:startup_id/employees/:user_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Delete record
            await StartupService.removeEmployee({
                startup_id: parseInt(req.params.startup_id), 
                user_id: parseInt(req.params.user_id)
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// * Get all updates (references)
router.get('/:startup_id/updates', 
    async (req, res) => {
        try{
            const data = await StartupUpdateService.findMany({
                where: {
                    startup_id: parseInt(req.params.startup_id),
                }, 
                select: {
                    data: false, 
                    date: true, 
                    description: true, 
                    resource_url: true, 
                    startup_id: true, 
                    startup_update_id: true, 
                    title: true, 
                    type: true
                }
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
);

// * Post an update
router.post('/:startup_id/updates', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            let {title, description, type, date, resource_url, data} = req.body;
            date = new Date(date);
            data = JSON.parse(data);
            // Validate types
            if(["news", "balancesheet", "cashflow", "operations"].findIndex(e => e == type) == -1)    
                return res.json({error: "Enter a valid update type"});
            // Validate data
            if(!StartupUpdateService.validateDataField({type, data}))
                return res.json({error: "Invalid data"});
            await StartupUpdateService.create({
                data: {
                    startup_id: parseInt(req.params.startup_id), 
                    title, 
                    description, 
                    type, 
                    date, 
                    resource_url, 
                    data
                }
            });
            res.json({message: "Success"})
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// * Update an update
router.put('/:startup_id/updates/:startup_update_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        if(req.body?.data && !StartupUpdateService.validateDataField({type: req.body?.type, data: req.body?.data}))
            return res.json({error: "Invalid data"})
        // Delete fields from body
        delete req.body?.date;
        delete req.body?.type;
        delete req.body?.startup_id;
        delete req.body?.startup_update_id;
        try {
            // Find
            let data = await StartupUpdateService.findFirst({
                where: {
                    startup_id: parseInt(req.params.startup_id), 
                    startup_update_id: parseInt(req.params.startup_update_id)
                }, 
                select: {
                    startup_update_id: true
                }
            })
            // Update
            await StartupUpdateService.update({
                where: {startup_update_id: data.startup_update_id}, 
                data: req.body
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// * Delete an update
router.delete('/:startup_id/updates/:startup_update_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try {
            // Find
            let data = await StartupUpdateService.findFirst({
                where: {
                    startup_id: parseInt(req.params.startup_id), 
                    startup_update_id: parseInt(req.params.startup_update_id)
                }, 
                select: {
                    startup_update_id: true
                }
            });
            // Delete
            await StartupUpdateService.delete({
                where: {startup_update_id: data.startup_update_id}
            });
            res.json({message: "Success"});
        } catch (e) {
            res.json(e);
        }
    }
);

module.exports = router;