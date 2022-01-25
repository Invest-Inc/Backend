const passport = require('passport');
const Database = require('../database');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserService = require('./UserService');

const JWT_SECRET = "1nv3stInC";

/**
 * Passport strategy for simple email and password login
 * A form receives the data and the API returns a bearer token for future transactions
 */
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

/**
 * Passport strategy for using a JSON web token for authentication
 * The token is generated after logging in with an email and password
 * This strategy is used throughout the system for authenticated endpoints
 */
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

/**
 * The user_id is stored
 */
passport.serializeUser((user, next) => {
    process.nextTick(()=>{
        next(null, user.user_id);
    });
});

/**
 * From the stored user_id, the whole user object is retrieved
 */
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

/**
 * Express Middleware for optionally authenticating users
 * @param {Bool} required Throw error if user is not authenticated?
 * @returns {}
 */
AuthenticationService.authenticate = (required = false) => (
    async (req, res, next) => {
        passport.authenticate('jwt', (err, user, info) => {
            req.user = user;
            if(required && !req.user) return res.json({error: "Unauthorized"}).status(400)
            next();
        })(req, res, next);
    }
);

module.exports = AuthenticationService;