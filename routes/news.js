const express = require("express");
const BusinessNewsService = require("../services/businessNews");
const showdown = require('showdown');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const data = await BusinessNewsService.findUnique({
            where: { id: Number.parseInt(req.params.id) },
            include: { Business: true }
        });
        data.content = new showdown.Converter().makeHtml(data.content);
        res.json(data);
    } catch (e) {
        console.log(e)
        res.json(e);
    }
})

module.exports = router;