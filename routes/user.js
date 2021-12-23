const express = require("express");
const Authentication = require("../services/authentication");
const Database = require("../services/database");

const router = express.Router();

router.get('/:username', async (req, res) => {
    const username = req.params.username;
    // Find user
    const user = await Database.user.findUnique({
        where: {username}, 
        include: {LegalEntity: true}
    });
    // If user does not exist
    if(!user) return res.json({error: "User does not exist"}).status(404);
    // Delete fields if not current user
    if(user.username != req.user.username){
        delete user.LegalEntity;
        delete user.email;
        delete user.phoneNumber;
        delete user.password;
    }
    // Return 
    res.json(user);
});

router.get('/:username/profiles', async (req, res) => {
    const username = req.params.username;
    // Find profiles
    
});