const express = require("express");
const Database = require("../database");
const SearchService = require("../services/SearchService");

const router = express.Router();

router.get('/', 
    async (req, res) => {
        try{
            const {q} = req.query;
            const results = await SearchService.searchAll(q);
            res.json(results);
        } catch(e){
            res.json(e);
        }
    }
)

module.exports = router;