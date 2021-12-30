const express = require("express");
const BusinessService = require("../services/business");
const BusinessNewsService = require("../services/businessNews");
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
    try{
        const business = await BusinessService.findUnique({
            where: {legalEntity_id: req.params.legalEntity_id}
        });
        console.log(business)
        // If business does not exist
        if(!business)
            return res.json({error: "Business does not exist"}).status(404);
        // Return business
        res.json(business)
    } catch(e){
        console.error(e)
        res.json(e)
    }
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

router.get('/:legalEntity_id/news', async (req, res) => {
    try{
        const news = await BusinessNewsService.findMany({
            where: {business_id: req.params.legalEntity_id}
        });
        res.json(news);
    } catch(e){
        res.json(e);
    }
})


module.exports = router; 