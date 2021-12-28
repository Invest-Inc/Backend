const express = require("express");
const Database = require("../services/database");
const Authentication = require("../services/authentication");
const UserService = require("../services/user");

const router = express.Router();

router.post('/login', 
    Authentication.authenticate('local', {failureRedirect: '/login.html'}),
    (req, res) => {
        console.log(req.body)
        res.json(req.user);
    }
)

router.post('/register', 
    async (req, res, next) => {
        try{
            const user = await UserService.create(req.body)
            req.logIn(user, next);
        } catch(e){
            console.log(e)
            res.json({error: e})
        }
    },
    (req, res)=>{
        res.json({message: "Created new user"})
    }
)

router.get('/available/:username', 
    async (req, res, next) => {
        try{
            res.json({available: await UserService.checkUsernameAvailability(req.params.username)});
        } catch(e){
            res.json({available: false});
        }
    }
)

router.get('/logout', 
    (req, res) => {
        req.logout();
        res.json({message: "Logged out"});
    }
)

router.get('/current', 
    async (req, res) => {
        if(req.isAuthenticated()){
            res.json(req.user)
        } else {
            res.json({error: "Unauthorized"}).status(400);
        }
    }
)

module.exports = router;