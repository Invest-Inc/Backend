const express = require("express");
const passport = require("passport");
const UserService = require("../services/UserService");

const router = express.Router();
const jwt = require('jsonwebtoken');
const AuthenticationService = require("../services/AuthenticationService");
const res = require("express/lib/response");
const JWT_SECRET = AuthenticationService.JWT_SECRET;

router.post('/login', 
    async (req, res, next) => {
        passport.authenticate('local', async (err, user, info) => {
            try{
                if(err || !user) return next(new Error("An error ocurred"));
                req.login(user, {session: true}, async (error) => {
                    if (error) return next(error);
                    return res.json(
                        jwt.sign({user: {
                            user_id: user.user_id
                        }}, JWT_SECRET)
                    )
                });
            } catch(e){
                console.log(e)
                return next(e);
            }
        })(req, res, next);
    }
);

router.post('/register',
    async (req, res, next) => {
        let {name, email, password_hash, birthday, nationality, username, summary, legal_full_name} = req.body;
        birthday = new Date(birthday);
        legal_full_name = name;
        try{
            const user = await UserService.create({
                data: {name, email, password_hash, birthday, nationality, username, summary, legal_full_name}
            });
            req.logIn(user, {session: true}, async (error) => {
                if (error) return next(error);
                return res.json(
                    jwt.sign({user: {
                        user_id: user.user_id
                    }}, JWT_SECRET)
                )
            });
        } catch(e) {
            console.log(e);
            res.json({error: e});
        }
    }
);

router.get('/available/:username', 
    async (req, res, next) => {
        try{
            const availability = await UserService.checkUsernameAvailability({
                username: req.params.username
            })
            res.json({ available: availability });
        } catch(e){
            res.json({ available: false });
        }
    }
);

router.get('/logout',
    (req, res) => {
        req.logout();
        res.json({ message: "Logged out." });
    }
);

router.get('/current',
    AuthenticationService.authenticate(),
    async (req, res) => {
        if(req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.json({error: "Unauthorized"}).status(400);
        }
    }
);

module.exports = router;