const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const StartupAdminService = require("../services/StartupAdminService");
const StartupEmployeeService = require("../services/StartupEmployeeService");
const StartupService = require("../services/StartupService");
const UpdateNewsService = require("../services/UpdateNewsService");
const UserService = require("../services/UserService");
const router = express.Router();

// Create a new startup
router.post('/', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            const data = await StartupService.create({
                data: {
                    ...req.body,
                    Startup_Admin: {
                        create: {
                            user_id: req.user.user_id
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

// Get startup data
router.get('/:startup_id', 
    async (req, res) => {
        try{
            const startup = await StartupService.findUnique({
                where: {startup_id: parseInt(req.params.startup_id)}, 
            });
            if(!startup) res.json({error: "Startup does not exist"}).status(404);
            res.json(startup);
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// Follow a startup
router.post('/:startup_id/follow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            await UserService.followStartup(
                parseInt(req.user.user_id), 
                parseInt(req.params.startup_id)
            );
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// Unfollow a startup
router.post('/:startup_id/unfollow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            await UserService.unfollowStartup(
                parseInt(req.user.user_id), 
                parseInt(req.params.startup_id)
            )
        } catch(e){
            res.json(e);
        }
    }
);

// Get startup admins (only for admins)
router.get('/:startup_id/admins', 
    AuthenticationService.authenticate(true),
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Return admins
            res.json(
                await StartupService.getAdmins(parseInt(req.params.startup_id))
            )
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
)

// Create startup admins
router.post('/:startup_id/admins', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        try{
            // Create admins
            await StartupAdminService.create({
                data: {
                    ...req.body
                }
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// Delete startup admins
router.delete('/:startup_id/admins/:startup_admin_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        try{
            // Delete record
            await StartupAdminService.delete({
                where: {
                    startup_admin_id: parseInt(req.params.startup_admin_id)
                }
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
)

// Get employees
router.get('/:startup_id/employees', 
    async (req, res) => {
        try{
            const data = await StartupEmployeeService.findMany({
                where: {startup_id: req.params.startup_id}
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
); 

// Add employee
router.post('/:startup_id/employees', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Add record
            await StartupEmployeeService.create({
                data: {
                    ...req.body
                }
            })
        } catch(e){
            res.json(e);
        }
    }
)

// Delete employee
router.delete('/:startup_id/employees/:startup_employee_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            if(priviledges.permissions == "none")
                return res.json({error: "Unauthorized"}).status(400);
            // Delete record
            await StartupEmployeeService.delete({
                where: {
                    startup_employee_id: parseInt(req.params.startup_employee_id)
                }
            })
        } catch(e){

        }
    }
);

// Get all news
router.get('/:startup_id/news', 
    async (req, res) => {
        try{
            const data = await UpdateNewsService.findMany({
                where: {
                    startup_id: parseInt(req.params.startup_id)
                }, 
                include: {
                    Startup: true
                }
            });
            res.json(data);
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// Create news
router.post('/:startup_id/news', 
    AuthenticationService.authenticate(true),
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Create
            await UpdateNewsService.create({
                data: {
                    ...req.body
                }
            })
        } catch(e){
            res.json(e)
        }
    }
);

// Update news
router.put('/:startup_id/news/:news_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Update
            await UpdateNewsService.update({
                where: {
                    update_news_id: parseInt(req.params.news_id), 
                }, 
                data: {
                    ...req.body
                }
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// Delete news
router.delete('/:startup_id/news/:news_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"),
    async (req, res) => {
        try{
            // Delete
            await UpdateNewsService.delete({
                where: {
                    update_news_id: parseInt(req.params.news_id)
                }
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
)

module.exports = router;