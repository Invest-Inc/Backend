const express = require("express");
// const Authentication = require("../services/authentication");
const UserService = require("../services/user");
const passport = require("passport");

const router = express.Router();
const jwt = require('jsonwebtoken');
const AuthenticationService = require("../services/authentication");

const JWT_SECRET = "1nv3stInC"

/* router.post('/login', 
    Authentication.authenticate('local', {failureRedirect: '/login.html'}),
    (req, res) => {
        console.log(req.body)
        res.json(req.user);
    }
) */

router.post('/login',
    async (req, res, next) => {
        passport.authenticate('local', async (err, user, info) => {
            try {
                if (err || !user) return next(new Error("An error occurred."));
                req.login(user, {session: false}, async (error) => {
                    if (error) return next(error);
                    return res.json(
                        jwt.sign({user: {
                            legalEntity_id: user.legalEntity_id, 
                            id: user.legalEntity_id
                        }}, JWT_SECRET)
                    )
                })
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);

router.post('/register',
    async (req, res, next) => {
        try {
            const user = await UserService.create(req.body)
            req.logIn(user, next);
        } catch (e) {
            console.log(e)
            res.json({ error: e })
        }
    },
    (req, res) => {
        res.json({ message: "Created new user" })
    }
)

router.get('/available/:username',
    async (req, res, next) => {
        try {
            res.json({ available: await UserService.checkUsernameAvailability(req.params.username) });
        } catch (e) {
            res.json({ available: false });
        }
    }
)

router.get('/logout',
    (req, res) => {
        req.logout();
        res.json({ message: "Logged out" });
    }
)

router.get('/current', AuthenticationService.authenticate(),
    async (req, res) => {
        if (req.isAuthenticated()) {
            res.json(req.user)
        } else {
            res.json({ error: "Unauthorized" }).status(400);
        }
    }
)

module.exports = router;