const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    console.log(req.params.id)

    db.oneOrNone(
      "SELECT movie_id, users_id, rating FROM movies WHERE users_id = $1 AND movie_id = $2;",
      [userId, id]
    )
      .then((rating) => {

        console.log(rating)
        
        if (rating) {
          res.render('./pages/details', { userId, id, rating: rating.rating });
        } else {
          res.render("./pages/details", { id, userId });
        }
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
});

router.post('/:id', (req, res) => {
    let { id } = req.params;

    console.log(id)
    console.log(res.body.rating);
    console.log(req.session.userId);
    console.log(req.params.id);

    console.log('we are there')

    db.none(
    "INSERT INTO movies (movie_id, users_id, rating) VALUES ($1, $2, $3);",
    [req.params.id, req.session.userId, req.body.rating])
    .then(() => {
      // console.log(rating);
      console.log(req.session.userId);
      res.redirect('/:id');
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});


module.exports = router;