const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/:id', (req,res) => {
    const { id } = req.params;
    const userId = req.session.userId;
    res.render('./pages/details', { userId, id });
});

router.post('/:id', (req,res) => {
    console.log(req.body.rating);
    console.log(req.session.userId);
    console.log(req.params.id);
    db.none(
    "INSERT INTO movies (movie_id, users_id, rating) VALUES ($1, $2, $3);",
    [req.params.id, req.session.userId, req.body.rating])
    .then(() => {
      // console.log(rating);
      console.log(req.session.userId);
      res.redirect("/:id");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});


module.exports = router;