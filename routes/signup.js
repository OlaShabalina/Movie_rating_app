const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// Registration
router.get('/', (req, res) => {
    res.render('pages/signup');
});

router.post('/', (req, res) => {
    let { name, email, password, confirmed_password } = req.body;
    

    // Backend validation for the form
    const errors = [];

    if (!name || !email || !password || !confirmed_password) {
        console.log(errors)
        errors.push({ message: "Please enter all fields." });
    }

    if ( password.length < 6 ) {
        errors.push({ message: "Password should be at least 6 characters." });
    }

    if ( password !== confirmed_password ) {
        errors.push({ message: "Your confirmation password doesn't match" });
    }

    errors.forEach(error => console.log(error.message))

    if (errors.length > 0) {
        res.render('pages/signup', { errors });
    } else {
        // IF it gets here - means the form validation has passed

        db.oneOrNone("SELECT * FROM users WHERE email = $1;", email)
        .then(userExists => {
            if (userExists) {
                errors.push({ message: "Email is already registered" });
                res.render('pages/signup', { errors });
            } else {
                // Hash password and clean the email
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                const cleanedEmail = email.toLowerCase().trim()

                // savind data in db
                db.none('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, cleanedEmail, hash])
                .then(() => {
                    req.flash("success_msg", "You are now registered, please log in");
                    res.redirect('/login');
                })
                .catch((error) => {
                    console.log(error)
                    res.json(error)
                });
            };
        }); 
    }

})



module.exports = router;