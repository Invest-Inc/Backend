// Read environment variables
require('dotenv').config();

// Configure express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; 

// Configure auth0
const { auth } = require('express-openid-connect');
app.use(
    auth({
        issuerBaseURL: process.env.ISSUER_BASE_URL, 
        baseURL: process.env.BASE_URL, 
        clientID: process.env.CLIENT_ID, 
        secret: process.env.SECRET
    })
)

app.get('/', (req, res)=>{
    res.send(req.oidc.isAuthenticated() ? "Logged in!" : "Not logged in!");
})


app.listen(PORT, ()=>{
    console.log(`App listening at port ${PORT}`)
})