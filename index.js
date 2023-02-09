<<<<<<< HEAD
const express = require('express');
require('dotenv').config();
const session=require('express-session');

const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const generalRouter = require('./routes/general');


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




app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
=======
const express = require('express');
// const ejs = require('ejs');
require('dotenv').config();
const session=require('express-session');

const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const generalRouter = require('./routes/general');


const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecretkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
}));

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set('views', 'pages');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.use((req,res,next)=>{
  res.locals.session=req.session;
  next();
})

app.use(generalRouter);
app.use(usersRouter);




app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
>>>>>>> DinhVietQuang
