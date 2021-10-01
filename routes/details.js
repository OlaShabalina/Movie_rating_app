const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    // check if the user left rating for the movie
    db.oneOrNone('SELECT rating FROM movies WHERE users_id = $1 AND movie_id = $2', [ userId, id ] )
        .then((rating) => {

            if (rating) {
                res.render('pages/details', { id, userId, rating: rating.rating })
            } else {
                res.render('pages/details', { id, userId })
            }
        })
        .catch((err) => {
            res.json(err)
        })
})

router.post('/:id', (req,res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.session.userId;

    db.none("INSERT INTO movies (movie_id, users_id, rating) VALUES ($1, $2, $3);", [id, userId, rating])
    .then(() => {

      res.redirect("/:id");
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
})

module.exports = router;