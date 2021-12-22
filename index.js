const PORT = process.env.PORT || 8080;

const express = require("express");
const expressSession = require('express-session');
const passport = require("passport");
const UserModel = require("./models/user");
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({secret: 'mySecretKey'}));

const AuthenticationServices = require('./services/authentication');

app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/login', 
    AuthenticationServices.authenticate('local', {failureRedirect: '/login.html'}),
    (req, res) => {
        res.json(req.user)
    }
)

app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.json({message: "Logged out"})
})

app.get('/me', (req, res)=>{
    res.send(req.isAuthenticated())
})

app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})