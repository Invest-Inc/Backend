const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const StartupService = require("../services/StartupService");
const UpdateNewsService = require("../services/UpdateNewsService");
const UserService = require("../services/UserService");
const router = express.Router();

// Create a new startup
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

// Get startup data
router.get('/:startup_id', 
    AuthenticationService.authenticate(false), 
    async (req, res) => {
        try{
            const startup = await StartupService.findUnique({
                where: {startup_id: parseInt(req.params.startup_id)}, 
            });
            if(!startup) res.json({error: "Startup does not exist"}).status(404);
            startup.following = req.user && UserService.followsStartup({ user_id: req.user.user_id, following_startup_id: startup.startup_id });
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
            await UserService.followStartup({
                user_id: req.user.user_id, 
                following_startup_id: parseInt(req.params.startup_id)
            });
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
            await UserService.unfollowStartup({
                user_id: req.user.user_id, 
                following_startup_id: parseInt(req.params.startup_id)
            });
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
router.post('/:startup_id/admins/', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
        try{
            // Create admins
            await StartupService.addAdmin({
                ...req.body,
                startup_id: parseInt(req.params.startup_id), 
            })
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// Delete startup admins
router.delete('/:startup_id/admins/:user_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin"), 
    async (req, res) => {
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

// Get employees
router.get('/:startup_id/employees', 
    async (req, res) => {
        try{
            const data = await StartupService.getEmployees({startup_id: parseInt(req.params.startup_id)})
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
            await StartupService.addEmployee({
                ...req.body, 
                startup_id: parseInt(req.params.startup_id)
            })
        } catch(e){
            res.json(e);
        }
    }
)

// Delete employee
router.delete('/:startup_id/employees/:user_id', 
    AuthenticationService.authenticate(true), 
    StartupService.permissionsMiddleware("admin", "editor"), 
    async (req, res) => {
        try{
            // Delete record
            await StartupService.removeEmployee({
                startup_id: parseInt(req.params.startup_id), 
                user_id: parseInt(req.params.user_id)
            })
        } catch(e){
            res.json(e);
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