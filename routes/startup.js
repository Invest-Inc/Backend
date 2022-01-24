const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const StartupEmployeeService = require("../services/StartupEmployeeService");
const StartupService = require("../services/StartupService");
const UpdateNewsService = require("../services/UpdateNewsService");
const router = express.Router();

router.post('/', 
    AuthenticationService.authenticate(), 
    async (req, res) => {
        if(!req.isAuthenticated()) res.json({error: "Unauthorized"}).status(400);
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

router.get('/:startup_id', 
    async (req, res) => {
        try{
            const startup = await StartupService.findUnique({
                where: {startup_id: parseInt(req.params.startup_id)}
            });
            if(!startup) res.json({error: "Startup does not exist"}).status(404);
            res.json(startup);
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

router.get('/:startup_id/admins', 
    AuthenticationService.authenticate(),
    async (req, res) => {
        try{
            // Authenticate
            if(!req.user) return res.json({error: "Unauthorized"}).status(400);
            // Who can see admins
            let priviledges = await StartupService.getUserPermissions({
                user_id: parseInt(req.user.user_id), 
                startup_id: parseInt(req.params.startup_id)
            });
            if(priviledges.permission == "none")
                return res.json({error: "Unauthorized"}).status(400);
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

router.get('/:startup_id/news', 
    async (req, res) => {
        try{
            const data = await UpdateNewsService.findMany({
                where: {startup_id: req.params.startup_id}, 
                include: {
                    Startup: true
                }
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
);

module.exports = router;