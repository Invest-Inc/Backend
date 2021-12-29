const express = require("express");
const AuthenticationService = require("../services/authentication");
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

router.put('/:username', AuthenticationService.authenticate(), async (req, res) => {
    try{
        const username = req.params.username;
        const user = await UserService.update({
            data: req.body, 
            where: { username }
        })
        res.json({message: "Success"})
    } catch(e){
        res.json(e)
    }
})


// Profiles
router.get('/:username/profiles', async (req, res) => {
    const username = req.params.username;
    const user = await UserService.findUnique({ where: {username} })
    // Find profiles
    if(!user) return res.json({error: "User does not exist"}).status(404);
    // Return profiles
    try{
        res.json(await UserService.getProfiles(user.legalEntity_id))
    } catch(e){
        res.json(e);
    }
});

router.post('/:username/profiles', AuthenticationService.authenticate(), async (req, res) => {
    if(!req.isAuthenticated() || req.user.username != req.params.username)
        return res.json({error: "Unauthorized"});
    const {provider, username, url} = req.body;
    try{
        await UserService.createProfile({user_id: req.user.legalEntity_id, provider, username, url})
        res.json({message: "Success"})
    } catch(e){
        res.json(e)
    }
})

router.delete('/:username/profiles', async (req, res) => {
    if(!req.isAuthenticated() || req.user.username != req.params.username)
        return res.json({error: "Unauthorized"});
    const {id} = req.body;
    try{
        await UserService.deleteProfile({user_id: req.user.legalEntity_id, id})
        res.json({message: "Success"})
    } catch(e){
        res.json(e)
    }
})

// Investments
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