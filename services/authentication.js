const passport = require("passport");
const LocalStrategy = require('passport-local');
const UserModel = require("../models/user");

passport.use(
    new LocalStrategy(async (username, password, callback) => {
        try{
            const row = (await UserModel.find({email: username}))[0];
            
            if(!row) return callback(null, false, {message: "Incorrect username or password!"});
            if(row.password != password) return callback(null, false, {message: "Incorrect username or password!"});

            return callback(null, row);
        } catch(e){
            callback(e);
            console.log(e)
        }
    })
)

passport.serializeUser((user, callback) => {
    process.nextTick(()=>{
        callback(null, {id: user.id, email: user.email})
    })
})


passport.deserializeUser((user, callback) => {
    process.nextTick(()=>{
        callback(null, user)
    })
})

module.exports = passport;