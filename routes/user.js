const express = require("express");
const Authentication = require("../services/authentication");
const Database = require("../services/database");
const InvestmentService = require("../services/investment");
const UserService = require("../services/user");

const router = express.Router();

router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const user = await UserService.findUnique({
        where: {username},
        include: {LegalEntity: true}
    })
    // If user does not exist
    if(!user) return res.json({error: "User does not exist"}).status(404);
    // If not current user
    if(user.username != req.user?.username) UserService.hidePrivateFields(user);
    // Return 
    res.json(user);
});

router.get('/:username/profiles', async (req, res) => {
    const username = req.params.username;
    // Find profiles
    
});

router.get('/:username/investments', async (req, res) => {
    const username = req.params.username;
    const user = await UserService.findUnique({
        where: {username}
    });
    // If user does not exist
    if(!user) return res.json({error: "User does not exist"}).status(404);
    // Find investments from user
    const investments = await InvestmentService.findMany({
        where: {investor_id: user.legalEntity_id},
        select: {
            id: true,
            business_id: true,
            currency: true, 
            date: true,
            value: true,
            valueUSD: true
        }
    })
    // Return 
    res.json(investments)
})

module.exports = router;