const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    const userId = req.session.userId;
    res.render('./pages/home', { userId });
});

router.get('/:id', (req,res) => {
    const { id } = req.params;
    const userId = req.session.userId;
    res.render('./pages/details', { userId, id });
});


module.exports = router;