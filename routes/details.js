const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/:id([0-9]+)', (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    // check if the user left rating for the movie
    db.oneOrNone('SELECT rating FROM movies WHERE users_id = $1 AND movie_id = $2', [ userId, id ] )
        .then((rating) => {

            if (rating) {
                const movieRating = rating.rating;
                res.render('pages/details', { id, userId, movieRating })
            } else {
                res.render('pages/details', { id, userId })
            }
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
})

router.post('/:id', (req,res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.session.userId;

    const cleanedRating = Number(rating);
    const movieId = Number(id);

    db.none("INSERT INTO movies (users_id, movie_id, rating) VALUES ($1, $2, $3);", [userId, movieId, cleanedRating])
    .then(() => {

      res.redirect(`/movie/${movieId}`);
    })
    .catch((err) => {

      res.json(err);
    });
})

module.exports = router;