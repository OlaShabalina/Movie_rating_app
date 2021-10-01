require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const session = require('express-session')

const app = express();
const PORT = process.env.PORT || 3000;

// Will be using flash to display success and error messages
const flash = require('express-flash');
app.use(flash());

// routers

const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const detailsRouter = require('./routes/details');
const apiRouter = require('./routes/api');
const pageNotFoundRouter = require('./routes/notfound')

// BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));

// VIEW ENGINE
app.set('view engine', 'ejs');

//Set our static folder(CSS)
app.use(express.static('public'));
// Session config
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    name: 'movies',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET
  })
);

//displaying pages using router
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/api', apiRouter);
app.use('/', detailsRouter);
app.use('/*', pageNotFoundRouter)

app.listen(PORT, () => {
  console.log(`server is lisning in : http://localhost:${PORT}`);
});
