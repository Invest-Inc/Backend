const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const UserService = require("../services/UserService");
const router = express.Router();

router.get('/', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            const user = await UserService.findUnique({
                where: {
                    user_id: req.user.user_id
                }
            });
            res.json(user);
        } catch(e){
            res.json(e);
        }
    }
);

router.put('/', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.update({
                where: {user_id: req.user.user_id}, 
                data: req.body
            })
        } catch (e) {
            res.json(e);
        }
    }
);

router.get('/following/startups', 
    AuthenticationService.authenticate(true),
    async (req, res) => {
        try{
            const following = await UserService.getFollowedStartups(req.user.user_id);
            res.json(following);
        } catch(e){
            res.json(e);
        }
    }
);

router.get('/following/users', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            const following = await UserService.getFollowedUsers(req.user.user_id);
            res.json(following);
        } catch(e){
            res.json(e);
        }
    }
);

router.post('/social', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            await UserService.addSocialNetwork(req.body);
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

router.delete('/social/:provider', 
    AuthenticationService.authenticate(true),
    async (req, res) => {
        try{
            await UserService.removeSocialNetwork({
                user_id: req.user.user_id, 
                provider: req.params.provider
            })
        } catch(e){
            res.json(e);
        }
    }
);

router.post('/curriculum', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.addCurricularActivity(req.body);
            res.json({message: "Success"});
        } catch (e) {
            res.json(e);
        }
    }
)

router.put('/curriculum/:user_curricular_activity_id', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.modifyCurricularActivity({
                ...req.body, 
                user_curricular_activity_id: req.params.user_curricular_activity_id,
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch (e) {
            res.json(e);
        }
    }
);

router.delete('/curriculum/:user_curricular_activity_id', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.removeCurricularActivity({
                user_curricular_activity_id: req.params.user_curricular_activity_id, 
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch (e) {
            res.json(e);
        }
    }
);