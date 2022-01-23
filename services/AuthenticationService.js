/* const passport = require("passport");
const Database = require("./database");

const LocalStrategy = require('passport-local');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserService = require("./user");

const JWT_SECRET = "1nv3stInC"

passport.use('local',
    new LocalStrategy(async (username, password, next) => {
        try{
            // Try finding by email
            let user = await Database.user.findUnique({where: {email: username}, include: {LegalEntity: true}});
            // Try finding by username
            if(user == undefined) user = await Database.user.findUnique({where: {username}, include: {LegalEntity: true}})
            // If still not found...
            if(user == undefined) return next(null, false, {message: "User not found"});
            if(user.password != password) return next(null, false, {message: "Incorrect password"});
            return next(null, user);
        } catch(e){
            next(e);
        }
    })
)

passport.use('jwt',
    new JWTstrategy(
        {
            secretOrKey: JWT_SECRET, 
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try{
                // Try finding user
                let user = await UserService.findUnique({where: {legalEntity_id: token.user.legalEntity_id}, include: {LegalEntity: true}})
                // If not found
                if(user == undefined) return next(null, false, {message: "User not found"});
                return done(null, user)
            } catch(e){
                done(e)
            }
        }
    )
)


passport.serializeUser((user, next) => {
    process.nextTick(()=>{
        next(null, user.legalEntity_id)
    })
})

passport.deserializeUser((id, next) => {
    process.nextTick(async ()=>{
        const user = await Database.user.findUnique({
            where: {legalEntity_id: id}, 
            include: {LegalEntity: true}}
        );
        next(null, user)
    })
})

const AuthenticationService = {};

AuthenticationService.authenticate = (optional) => (
    async (req, res, next) => {
        passport.authenticate('jwt', (err, user, info) => {
            req.user = user;
            next()
        })(req, res, next)
    }
)

module.exports = AuthenticationService; */

const passport = require('passport');
const Database = require('../database');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserService = require('./UserService');

const JWT_SECRET = "1nv3stInC";

passport.use('local', 
    new LocalStrategy(async (username, password, next) => {
        try{
            // Try finding by email
            let user = await UserService.findFirst({
                where: {email: username}
            });
            // Try finding by username
            if(user == undefined) user = await UserService.findFirst({
                where: {username}
            });
            // If still not found
            if(user == undefined) return next (null, false, {message: "User not found"});
            // If incorrect password
            // TODO: Hash password
            if(user.password_hash != password) return next(null, false, {message: "Wrong password"});
            // Else...
            return next(null, user);
        }catch(e){
            next(e);
        }
    })
)

passport.use('jwt', 
    new JwtStrategy(
        {
            secretOrKey: JWT_SECRET, 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, 
        async (token, done) => {
            // Try finding user
            let user = await UserService.findUnique({
                where: {user_id: token.user.user_id}
            });
            if(user == undefined) return next(null, false, {message: "User not found"});
            // If found
            return done(null, user);
        }
    )
)

passport.serializeUser((user, next) => {
    process.nextTick(()=>{
        next(null, user.user_id);
    });
});

passport.deserializeUser((user_id, next) => {
    process.nextTick(async ()=>{
        const user = await UserService.findUnique({
            where: {user_id}
        });
        return next(null, user);
    });
});

const AuthenticationService = {};

AuthenticationService.JWT_SECRET = JWT_SECRET;

AuthenticationService.authenticate = (optional) => (
    async (req, res, next) => {
        passport.authenticate('jwt', (err, user, info) => {
            req.user = user;
            next();
        })(req, res, next);
    }
);

module.exports = AuthenticationService;