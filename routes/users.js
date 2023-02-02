const express = require('express');
const userController = require('../Controllers/users')
const router = express.Router();

router.post('/signup', async (req,res)=>{
    const {email,password,fname,lname,phone,age} = req.body;
    connection = req.app.locals.connection;
    connection.query('select * from account where email = ?',email,(err,result)=>{
        if(err){
            res.json(err)
        }else{
            if(result.length > 0){
                res.json({error: 'Email in use'});
            }
        }
    })
    connection.query(`insert into account (email,password,type_of_account)
    values(?,?,'booker')`,[email,password],(err,result)=>{
        if(err){
            res.json(err)
        }else{
            req.session.email = email;
            res.redirect('/booking');
        }
    })
})

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
    connection = req.app.locals.connection;
    connection.query('select * from account where email = ?',email,(err,result)=>{
        if(err){
            res.json(err)
        }else{
            if(result.length > 0){
                if(password === result[0].password){
                    res.redirect('/booking');
                }else{
                    res.json({error: 'Invalid password'});
                }
            }else{
                res.json({error: 'Email not found'});
            }
        }
    })
})

router.get('/accounts',async (req,res)=>{
    const records = await userController.getAllAccount(req,res);
    // console.log(a)
})

module.exports = router;