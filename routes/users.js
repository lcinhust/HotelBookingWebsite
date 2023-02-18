const express = require('express');
const router = express.Router();
const db=require('../database');
const bcrypt=require('bcrypt');


router.post('/signup', async (req,res)=>{
    const {email,password} = req.body;
    let hashedPassword= await bcrypt.hash(password,10);
    db.query(`select * from account where email='${email}'`,(err,results)=>{
        if (err) throw err;
        if (results.length>0)
        {
            req.flash('error','Email already registered');
            res.redirect('/signupform')
        }
        else{
            db.query(`insert into account (email,password) values ('${email}','${hashedPassword}')`, (err)=>{
                if (err) throw err;
                const {fname,lname,phone,dob} = req.body;
                
                db.query(`select id from account where email='${email}'`,(err,results)=>{
                    if (err) throw err;
                    const id=results[0].id;
                    db.query(`insert into booker values (${id},'${fname}','${lname}','${dob}','${phone}')`, (err)=>{
                        if (err) throw err;
                        res.redirect('/index');
                    })
                })
                
            })
        }        
    })
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