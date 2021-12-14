// Read environment variables
require('dotenv').config();

// Configure express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; 

// Configure auth0
const { auth, requiresAuth } = require('express-openid-connect');
app.use(
    auth({
        authRequired: false,
        auth0Logout: true, 
        issuerBaseURL: process.env.ISSUER_BASE_URL, 
        baseURL: process.env.BASE_URL, 
        clientID: process.env.CLIENT_ID, 
        secret: process.env.SECRET
    })
)

app.get('/', (req, res)=>{
    res.send(`
        <h1>Welcome to Invest Inc's API</h1>
        <p>You are ${req.oidc.isAuthenticated() ? "" : "not"} logged in!</p>
    `)
})

app.get('/me', requiresAuth(), (req, res)=>{
    res.json(req.oidc.user)
})

app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})