<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const db=require('../database');
const bcrypt=require('bcrypt')


router.post('/signup', async (req,res)=>{
    const {email,password} = req.body;
    let hashedPassword= await bcrypt.hash(password,10);
    db.query(`select * from account where email='${email}'`,(err,results)=>{
        if (err) throw err;
        if (results.length>0)
        {
            res.status(404).json({message: 'Email already registered'});
        }
        else{
            db.query(`insert into account (email,password) values ('${email}','${hashedPassword}')`, (err)=>{
                if (err) throw err;
                res.redirect('/index');
            })
        }        
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if (!email | !password)
        res.status(404).json({message: 'Please enter all fields'});
    else{
        db.query(`select * from account where email='${email}'`,(err,results)=>{
            if (err) throw err;
            if (results.length>0){
                const user=results[0];
                bcrypt.compare(password,user.password, (err,isMatch)=>{
                    if (err) throw err;
                    if (isMatch){
                        session=req.session;
                        session.userId=user.id;
                        res.redirect('/booking');
                    } 
                    else res.status(404).json({message: 'password is not correct'});
                })
            }
            else res.status(404).json({message: 'email is not registered'});
        })
    }
})



=======
const express = require('express');
const router = express.Router();
const db=require('../database');
const bcrypt=require('bcrypt')


router.post('/signup', async (req,res)=>{
    const {email,password} = req.body;
    let hashedPassword= await bcrypt.hash(password,10);
    db.query(`select * from account where email='${email}'`,(err,results)=>{
        if (err) throw err;
        if (results.length>0)
        {
            res.status(404).json({message: 'Email already registered'});
        }
        else{
            db.query(`insert into account (email,password) values ('${email}','${hashedPassword}')`, (err)=>{
                if (err) throw err;
                res.redirect('/index');
            })
        }        
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if (!email | !password)
        res.status(404).json({message: 'Please enter all fields'});
    else{
        db.query(`select * from account where email='${email}'`,(err,results)=>{
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
                    else res.status(404).json({message: 'password is not correct'});
                })
            }
            else res.status(404).json({message: 'email is not registered'});
        })
    }
})



>>>>>>> DinhVietQuang
module.exports = router;