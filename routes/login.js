const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('pages/login');
});

router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Backend validation for the login form
    if ( !email || !password ) {
        req.flash("error", "Please enter all fields");
        res.redirect('/login');
    } else {
        // If the validation has passed:

        // checking if the email exists in the database
        db.oneOrNone('SELECT * FROM users WHERE email = $1;', email)
        .then(user => {
            if (!user) {
                req.flash("error", "Either this email doesn't exists or password is not correct");
                res.redirect('/login');
            } else {

                // if user exists, verify his password
                bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        // if password is correct -> we create a user ID inside the session
                        req.session.userId = user.users_id;
                        req.flash("success_msg", "You are now logged in and can rate movies");
                        res.redirect('/');
                    } else {
                        req.flash("error", "Either this email doesn't exists or password is not correct");
                        res.redirect('/login')
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            };
        });
    };
});

module.exports = router;