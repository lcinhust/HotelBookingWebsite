const express = require('express');
require('dotenv').config();
const session=require('express-session');

const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const generalRouter = require('./routes/general');
const bookingRouter = require('./routes/booking');

const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecretkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.use(generalRouter);
app.use(usersRouter);
app.use(bookingRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
