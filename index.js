const PORT = process.env.PORT || 8080;

// Imports
const express = require("express");
const cors = require('cors')
const expressSession = require("express-session");
const passport = require("passport");
const AuthenticationService = require("./services/AuthenticationService");

// Configure app
const app = express();
app.use(cors())
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
    secret: AuthenticationService.JWT_SECRET, 
    saveUninitialized: true, 
    cookie: {maxAge: 1000 * 60 * 60 * 24}, 
    resave: false
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', 
    (req, res) => {
        res.send(`
            <h1> Invest, Inc. API </h1>
            <i>Under development, v.2.0.0</i>
        `);
    }
);

app.use('/schemas', express.static('schemas'))

app.use('/api/2/auth', require('./routes/auth'));
app.use('/api/2/currency', require('./routes/currency'));
app.use('/api/2/startup', require('./routes/startup'));
app.use('/api/2/user', require('./routes/user'));
app.use('/api/2/me', require('./routes/me'));
app.use('/api/2/updates', require('./routes/updates'));
app.use('/api/2/search', require('./routes/search'));

app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})