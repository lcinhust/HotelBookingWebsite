const express = require('express');
const settings = require(`./settings`);
const generalRouter = require('./routes/general');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const userRepo = require('./Controllers/users');
const usersRouter = require('./routes/users');


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(generalRouter);
app.use(usersRouter);


const connection = mysql.createConnection(settings.database);
app.locals.connection = connection; // ve sau khi muon goi connecttion thi chi can  connection = req.locals.connection

app.listen(settings.APIServerPort, () => {
  console.log(`Example app listening on port ${settings.APIServerPort}`)
})

module.exports = connection