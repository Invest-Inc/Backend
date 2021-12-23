const passport = require("passport");
const Database = require("./database");
const LocalStrategy = require('passport-local');

passport.use(
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

passport.serializeUser((user, next) => {
    process.nextTick(()=>{
        next(null, user.legalEntity_id)
    })
})

passport.deserializeUser((id, next) => {
    process.nextTick(async ()=>{
        const user = await Database.user.findUnique({where: {legalEntity_id: id}, include: {LegalEntity: true}});
        next(null, user)
    })
})

const Authentication = passport

module.exports = Authentication;