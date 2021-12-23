const PORT = process.env.PORT || 8080;

const express = require("express");
const expressSession = require('express-session');
const passport = require("passport");
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({secret: 'mySecretKey'}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/1/auth', require('./routes/auth'))
app.use('/api/1/users', require('./routes/users'))

app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})