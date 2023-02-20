const express = require('express');
const router = express.Router();
const db=require('../database');
const bcrypt=require('bcrypt');

router.post('/signup', async (req,res)=>{
    const {email,password} = req.body;
    let hashedPassword= await bcrypt.hash(password,10);
    db.beginTransaction((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM account WHERE email='${email}'`, (err, results) => {
            if (err) {
                db.rollback(() => {
                    throw err;
                });
            }
            if (results.length > 0) {
                req.flash('error', 'Email already registered');
                res.redirect('/signupform');
                db.rollback();
            } else {
                db.query(`INSERT INTO account (email,password) VALUES ('${email}','${hashedPassword}')`, (err) => {
                    if (err) {
                        db.rollback(() => {
                            throw err;
                        });
                    }
                    const { fname, lname, phone, dob } = req.body;
                    db.query(`SELECT id FROM account WHERE email='${email}'`, (err, results) => {
                        if (err) {
                            db.rollback(() => {
                                throw err;
                            });
                        }
                        const id = results[0].id;
                        db.query(`INSERT INTO booker VALUES (${id},'${fname}','${lname}','${dob}','${phone}')`, (err) => {
                            if (err) {
                                db.rollback(() => {
                                    throw err;
                                });
                            }
                            db.commit((err) => {
                                if (err) {
                                    db.rollback(() => {
                                        throw err;
                                    });
                                }
                                res.redirect('/index');
                            });
                        });
                    });
                });
            }
        });
    });
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if (!email | !password)
        res.status(404).json({message: 'Please enter all fields'});
    else{
        db.query(`select * from account where email='${email}' and type_of_account = 'booker'`,(err,results)=>{
            if (err) throw err;
            if (results.length>0){
                const user=results[0];
                bcrypt.compare(password,user.password, (err,isMatch)=>{
                    if (err) throw err;
                    if (isMatch){
                        session=req.session;
                        session.userId=user.id;
                    
                        res.redirect('/index');
                    } 
                    else {
                        req.flash('error','Password is not correct');
                        res.redirect('/loginform')
                    }
                })
            }
            else {
                req.flash('error','Email is not registered');
                res.redirect('/loginform')
            }
        })
    }
})



module.exports = router;