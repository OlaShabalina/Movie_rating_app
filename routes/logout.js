const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    req.session.destroy(err => {
        if(err) {
        console.log(err)
        res.send(err)
        } else{
            res.clearCookie('movies')
            res.redirect('/')

        }
    })

})
module.exports = router;