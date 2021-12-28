const express = require("express");
const BusinessService = require("../services/business");
const router = express.Router();


router.post('/', async (req, res) => {
    if(!req.isAuthenticated())
        return res.json({error: "Unauthorized"});
    try{
        await BusinessService.create({
            ...req.body, 
            userID: req.user.legalEntity_id
        })
    } catch(e){
        res.json(e)
    }
})

router.get('/:legalEntity_id', async (req, res) => {
    const business = await BusinessService.findUnique({
        where: {legalEntity_id}
    });
    // If business does not exist
    if(!business)
        return res.json({error: "Business does not exist"}).status(404);
})

router.get('/:legalEntity_id/admins', async (req, res) => {
    if(!req.isAuthenticated())
        return res.json({error: "Unauthorized"});
    try{
        // Who can see admins?
        if(await BusinessService.getUserPermissions({
            user_id: req.user.legalEntity_id, 
            business_id: req.params.legalEntity_id
        }) == "None")
            return res.json({error: "Unauthorized"});
        // Return admins
        res.json(
            await BusinessService.getBusinessAdmins(req.params.legalEntity_id)
        )
    } catch(e){
        res.json(e);
    }
    
})

router.get