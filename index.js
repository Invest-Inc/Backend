const PORT = process.env.PORT || 8080;

// Imports
const express = require("express");
const expressSession = require("express-session");
const passport = require('./services/authentication')
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
    res.send("Hello!")
})

app.use('/api/1/auth', require('./routes/auth'))


app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})