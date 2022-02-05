const express = require("express");
const AuthenticationService = require("../services/AuthenticationService");
const UserService = require("../services/UserService");
const router = express.Router();

// * Get user info
router.get('/', 
    (req, res, next) => {
        if(req.headers.authorization == undefined){
            const {token} = req.query;
            req.headers.authorization = token;
        }
        console.log(req.headers.authorization);
        next();
    }, 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            const user = await UserService.findUnique({
                where: {
                    user_id: req.user.user_id
                }
            });
            user.is_current_user = true;
            res.json(user);
        } catch(e){
            console.log(e)
            res.json(e);
        }
    }
);

// * Update user info
router.put('/', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.update({
                where: {user_id: req.user.user_id}, 
                data: req.body
            })
            res.json({message: "Success"})
        } catch (e) {
            res.json(e);
        }
    }
);

router.get('/following/startups', 
    AuthenticationService.authenticate(true),
    async (req, res) => {
        try{
            const following = await UserService.getFollowedStartups({user_id: req.user.user_id});
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
            const following = await UserService.getFollowedUsers({user_id: req.user.user_id});
            res.json(following);
        } catch(e){
            res.json(e);
        }
    }
);

// * Add social media
router.post('/social', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        const {provider, username, url} = req.body;
        if(!provider || !username || !url)
            res.json({error: "Add all parameters"});
        try{
            await UserService.addSocialNetwork({
                provider, username, url,
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch(e){
            res.json(e);
        }
    }
);

// * Remove social media
router.delete('/social/:provider', 
    AuthenticationService.authenticate(true),
    async (req, res) => {
        try{
            await UserService.removeSocialNetwork({
                user_id: req.user.user_id, 
                provider: req.params.provider
            })
            res.json({message: "Success"})
        } catch(e){
            res.json(e);
        }
    }
);

// * Get curricular activity
router.get('/curriculum', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try{
            let data = await UserService.getCurricularActivity({
                user_id: req.user.user_id
            });
            res.json(data);
        } catch(e){
            res.json(e);
        }
    }
)

// * Add curricular activity
router.post('/curriculum', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            let {type, start_date, end_date, organization, name, description} = req.body
            start_date = new Date(start_date);
            end_date = new Date(end_date);

            await UserService.addCurricularActivity({
                type, 
                start_date, 
                end_date, 
                organization, 
                name, 
                description,  
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch (e) {
            console.log(e)
            res.json(e);
        }
    }
)

// * Update curricular activity
router.put('/curriculum/:user_curricular_activity_id', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            let {type, start_date, end_date, organization, name, description} = req.body
            start_date = new Date(start_date);
            end_date = new Date(end_date);
            await UserService.modifyCurricularActivity({
                type, 
                start_date, 
                end_date, 
                organization, 
                name, 
                description,
                user_curricular_activity_id: parseInt(req.params.user_curricular_activity_id),
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch (e) {
            res.json(e);
        }
    }
);

// * Delete curricular activity
router.delete('/curriculum/:user_curricular_activity_id', 
    AuthenticationService.authenticate(true), 
    async (req, res) => {
        try {
            await UserService.removeCurricularActivity({
                user_curricular_activity_id: parseInt(req.params.user_curricular_activity_id), 
                user_id: req.user.user_id
            });
            res.json({message: "Success"});
        } catch (e) {
            console.log(e)
            res.json(e);
        }
    }
);

module.exports = router;