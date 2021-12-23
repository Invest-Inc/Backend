const express = require("express");
const Database = require("../services/database");
const Authentication = require("../services/authentication")

const router = express.Router();

router.post('/login', 
    Authentication.authenticate('local', {failureRedirect: '/login.html'}),
    (req, res) => {
        console.log(req.body)
        res.json(req.user);
    }
)

router.post('/register', 
    async (req, res, next) => {
        const data = req.body;
        try{
            const user = await Database.user.create({
                data: {
                    LegalEntity: {
                        create: {
                            id: data.id, 
                            type: "Person", 
                            registrationDate: new Date(), 
                            birthdate: new Date(data.birthdate), 
                            addressCountry: data.addressCountry, 
                            addressRegion: data.addressRegion, 
                            addressLocality: data.addressLocality, 
                            addressPostalCode: data.addressPostalCode, 
                            addressText: data.addressText, 
                            nationality: data.nationality, 
                            personFirstName: data.personFirstName, 
                            personFamilyName: data.personFamilyName
                        }
                    }, 
                    biography: data.biography, 
                    email: data.email, 
                    phoneNumber: data.phoneNumber,
                    username: data.username, 
                    profileName: data.profileName,
                    password: data.password
                }
            })

            req.logIn(user, next);
        } catch(e){
            console.log(e)
            res.json({error: e})
        }
    },
    (req, res)=>{
        res.json({message: "Created new user"})
    }
)

router.get('/available/:username', 
    async (req, res, next) => {
        try{
            const users = await Database.user.count({where: {username: req.params.username}});
            res.json({available: users == 0});
        } catch(e){
            res.json({available: false});
        }
    }
)

router.get('/logout', 
    (req, res) => {
        req.logout();
        res.json({message: "Logged out"});
    }
)

router.get('/current', 
    async (req, res) => {
        if(req.isAuthenticated()){
            res.json(req.user)
        } else {
            res.json({error: "Unauthorized"}).status(400);
        }
    }
)

module.exports = router;