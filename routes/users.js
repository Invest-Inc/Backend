const UserModel = require("../models/user");
const express = require("express");
const UserSocialProfileModel = require("../models/userSocialProfile");
const router = express.Router();

router.get('/:username', 
    async (req, res) => {
        try{
            // Get user
            const user = (await UserModel.find({username: req.params.username}))[0];
            // 404 if not found
            if(!user) return res.json({error: "User not found"}).status(404);
            // Delete fields if not same authenticated user
            if(user.id != req.user?.id){
                delete user.email;
                delete user.password;
                delete user.verifiedEmail;
                delete user.phoneNumber;
            }
            // Return user
            res.json(user);
        } catch(e){
            res.json({error: e});
        }
    }
)

router.get('/:username/profiles', 
    async (req, res) => {
        try{
            // Get user id
            const id = await UserModel.getIdFromUsername(req.params.username);
            if(!id) return res.json({error: "User not found"}).status(404);
            // Get social profiles
            res.json(await UserSocialProfileModel.find(id));
        } catch(e){
            console.log(e)
            res.json([])
        }
    }
)

router.post('/:username/profiles', 
    async (req, res) => {
        try{
            // Get user id
            const id = await UserModel.getIdFromUsername(req.params.username);
            if(!id) return res.json({error: "User not found"}).status(404);
            // Veriffy auth
            if(id != req.user.id) return res.json({error: "Unauthorized"}).status(400);
            // Create object with new profile
            await UserSocialProfileModel.upload(new UserSocialProfileModel(req.body));
            res.json({message: "Success"});
        } catch(e){
            res.json({error: e})
        }
    }
)

router.delete('/:username/profiles',
    async (req, res) => {
        try{
            // Get user id
            const id = await UserModel.getIdFromUsername(req.params.username);
            if(!id) return res.json({error: "User not found"}).status(404);
            // Veriffy auth
            if(id != req.user.id) return res.json({error: "Unauthorized"}).status(400);
            // Delete
            await UserSocialProfileModel.delete(new UserSocialProfileModel(req.body));
            res.json({message: "Success"});
        } catch(e){
            res.json({error: e})
        }
    }
)

module.exports = router;