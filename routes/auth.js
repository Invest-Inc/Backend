const UserModel = require("../models/user");
const express = require("express");
const router = express.Router();
const AuthenticationServices = require('../services/authenticationServices');

router.post('/login', 
    AuthenticationServices.authenticate('local', {
        failureRedirect: '/login.html'
    }), 
    (req, res) => {
        res.json(req.user);
    }
)

router.post('/register', 
    async (req, res, next) => {
        try{
            const user = new UserModel(req.body);
            // Upload to database
            await UserModel.upload(user);
            // Sign in
            req.logIn(user, next);
        } catch(e){
            res.json({error: e});
        }
    }, 
    (req, res) => {
        res.json(req.user);
    }
)

router.get('/register/:username',
    async (req, res) => {
        try{
            res.json({message: await UserModel.isUsernameAvailable(req.params.username)})
        } catch(e){
            res.json({message: false})
        }
    }
)

router.get('/logout',
    (req, res) => {
        req.logOut();
        res.json({message: "Logged out"})
    }
)

router.get('/user', 
    (req, res) => {
        if(req.isAuthenticated()){
            res.json(req.user)
        } else {
            res.json({message: "Unauthorized"}).status(400)
        }
    }
)

module.exports = router;