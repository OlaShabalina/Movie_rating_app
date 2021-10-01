const express = require('express');
const router = express.Router();
const db = require('../database');

// This route is for passing the data from db to front-end

router.get('/', (req,res) => {

    // getting all the ratings from the db
    db.any('SELECT movie_id, users_id, rating FROM movies;')
    .then((ratings) => {


        console.log(ratings);
        
        res.json({ ratings });
    })
    .catch((error) => {
        console.log(error)
        res.status(400).json({"error_message":"this page is not available"});
    });

});

module.exports = router;