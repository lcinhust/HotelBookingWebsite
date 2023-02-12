const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt')

router.post('/signup', async (req, res) => {
    const { fname, lname, email, password, phone } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    db.query(`select * from account where email='${email}'`, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.status(404).json({ message: 'Email already registered' });
        }
        else {
            // db.query(`insert into account (email,password,type_of_account) values ('${email}','${hashedPassword}','booker')`, (err)=>{
            //     if (err) throw err;
            //     res.redirect('/index');
            // })

            // Double insert
            db.beginTransaction(function (err) {
                if (err) { throw err; }
                db.query(`insert into account (email,password,type_of_account) values ('${email}','${hashedPassword}','booker')`, (err, result) => {
                    if (err) {
                        return db.rollback(function () {
                            throw err;
                        });
                    }
                    let accountId = result.insertId;
                    db.query(`insert into booker (id, first_name, last_name, phone) values (${accountId},'${fname}','${lname}',${phone})`, (err) => {
                        if (err) {
                            return db.rollback(function () {
                                throw err;
                            });
                        }
                        db.commit(function (err) {
                            if (err) {
                                return db.rollback(function () {
                                    throw err;
                                });
                            }
                            console.log("Transaction Complete.");
                            res.redirect('/index');
                        });
                    });
                });
            });
        }
    })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email | !password)
        res.status(404).json({ message: 'Please enter all fields' });
    else {
        db.query(`select * from account where email='${email}'`, (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (err, isMatch) => { // password'll be hashed = bcrypt.hash(password,10)
                    if (err) throw err;
                    if (isMatch) {
                        session = req.session;
                        session.userId = user.id;
                        res.redirect('/booking');
                    }
                    else res.status(404).json({ message: 'password is not correct' });
                })
            }
            else res.status(404).json({ message: 'email is not registered' });
        })
    }
})

module.exports = router;