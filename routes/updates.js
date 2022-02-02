const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const StartupService = require("../services/StartupService");
const StartupUpdateService = require("../services/StartupUpdateService");

const router = express();

router.get('/:startup_update_id', 
    async (req, res) => {
        try{
            const data = await StartupUpdateService.findUnique({
                where: {startup_update_id: parseInt(req.params.startup_update_id)}
            });
            if(req.user != undefined){
                data.current_user_permissions = await StartupService.getUserPermissions({
                    user_id: req.user.user_id, 
                    startup_id: data.startup_id
                });
            }
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
);

module.exports = router;