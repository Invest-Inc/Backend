const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const UserService = require("../services/UserService");
const router = express.Router();

// Get user
router.get('/:username', 
    AuthenticationService.authenticate(false), 
    async (req, res) => {
        try{
            if(req.user.username == req.params.username)
                res.redirect('../../me');
            let user = await UserService.findUnique({
                where: {
                    username: req.params.username
                }, 
                include: {
                    User_Curricular_Activity: true, 
                    User_Social_Newtorks: true
                }
            });
            // Delete private data
            delete user.password_hash;
            delete user.official_identification_src;
            delete user.official_identification_type;
            delete user.email;
            delete user.telephone;
            res.json(user);
        } catch(e){

        }
    }
);

// Follow a user
router.post('/:username/follow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            // Find user
            let user = await UserService.findUnique({
                where: {
                    username: req.params.username
                }
            });
            if(user == undefined) return res.json({error: "User not found"}).status(404)
            await UserService.followUser(
                parseInt(req.user.user_id), 
                user.user_id
            );
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// Unfollow a user
router.post('/:username/unfollow', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            // Find user
            let user = await UserService.findUnique({
                where: {
                    username: req.params.username
                }
            })
            if(user == undefined) return res.json({error: "User not found"}).status(404)
            await UserService.unfollowUser(
                parseInt(req.user.user_id), 
                user.user_id
            );
            res.json({error: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

module.exports = router;