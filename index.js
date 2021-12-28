const PORT = process.env.PORT || 8080;

// Imports
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const AuthenticationService = require("./services/authentication");

// const passport = require('./services/authentication')

// Configure app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({secret: 'mySecretKey'}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res)=>{
    res.send(`
        <h1>Invest Inc. API</h1>
        <i>Under development, v.0.0.2</i>
    `)
})

app.use('/api/1/auth', require('./routes/auth'))
app.use('/api/1/currency', require('./routes/currency'))
app.use('/api/1/users', require('./routes/user'))

app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})