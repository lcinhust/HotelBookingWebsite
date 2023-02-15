const express = require('express');
const router = express.Router();
const path = require('path');
const db=require('../database');
const bcrypt=require('bcrypt');



router.get('/index', (req, res) => {
    res.render('index.ejs');
})

router.get('/rooms', (req, res) => {
    res.render('rooms.ejs');
})

router.get('/about', (req, res) => {
    res.render('about.ejs');
})

router.get('/booking', isLoggedIn, (req, res) => {
    res.render('booking.ejs');
}) //must log in to see

router.get('/contact', (req, res) => {
    res.render('contact.ejs');
})

router.get('/loginform', isLoggedOut, (req, res) => {
    res.render('loginform.ejs',{message:req.flash('error')});
})//if already logged in, redirect to /booking

router.get('/signupform', (req, res) => {
    res.render('signupform.ejs',{message:req.flash('error')});
})

router.get('/restaurant', (req, res) => {
    res.render('restaurant.ejs');
})

router.get('/spa', (req, res) => {
    res.render('spa.ejs');
})

function isLoggedOut(req,res,next){
    if (req.session.userId)
        res.redirect('/booking');
    else next();
}

function isLoggedIn(req,res,next)
{
    if (req.session.userId)
        next();
    else res.redirect('/loginform');
}

router.get('/profile', isLoggedIn, (req, res) => {
    db.query(`select * 
              from account join booker on account.id=booker.id 
              where account.id=${req.session.userId}`, (err,results)=>{
                if (err) throw err;
                const userData=results[0];
                db.query(`select reservation_id,date_in,date_out,number
                        from reservation a join room_reserved b on a.id=b.reservation_id 
                        join room c on b.room_id=c.id
                        where booker_id=${req.session.userId}
                        order by reservation_id`,(err,results)=>{
                            if (err) throw err;
                            const userReservation = [];
                            let i=0; //number of reservations
                            results.forEach((element,index,arr) => {
                                if (index===0 || element.reservation_id != arr[index-1].reservation_id)
                                {
                                    userReservation.push({
                                        reservation_id: element.reservation_id,
                                        date_in: element.date_in,
                                        date_out: element.date_out,
                                        roomList: [element.number]
                                    });
                                    i++;
                                }
                                else
                                {
                                    userReservation[i-1].roomList.push(element.number);
                                }
                            });
                            res.render('profile.ejs',{userData, userReservation});
                        })
              })
})
router.get('/editProfile', isLoggedIn, (req, res) => {
    const id=req.query.id;
    if (id)  //param id exists
    {
        if (Number(id)===req.session.userId)  //user can only edit their own profile 
        {
            db.query(`select * 
                    from account join booker on account.id=booker.id 
                    where account.id=${id}`,(err,results)=>{
                        if (err) throw err;
                        const userData=results[0];
                        if (userData){    //user exists in database
                            res.render('editProfile.ejs',{userData, message: req.flash('error')});
                        }
                        else res.redirect('/index')  

        })
        }
        else res.redirect('/index')   //not allow editing others' profiles
        
    }
    else res.redirect('/index'); //param id not exists
   
    
})

router.post('/editProfile',(req,res)=>{
    //check not duplicated email
    const {id,fname,lname,email,phone,dob}=req.body;
    db.query(`select * from account where email='${email}' and id<>${id}`,(err,results)=>{
        if (err) throw err;
        if (results.length>0) //duplicated email
        {
            // res.json({error:'Email already registered'})
            req.flash('error','Email already registered');
            res.redirect(`/editProfile?id=${id}`);
        }
        else  db.query(`update account, booker
                        set first_name='${fname}',last_name='${lname}',email='${email}',phone='${phone}',birth_date='${dob}'
                        where account.id=booker.id
                        and account.id=${id}`,(err)=>{
                            if (err) throw err;
                            res.redirect('/profile');
        })
    })
   
})

router.get('/editPassword', isLoggedIn, (req, res) => {
    const id=req.query.id;
    if (id)  //param id exists
    {
        if (Number(id)===req.session.userId)  //user can only edit their own profile 
        {
            res.render('editPassword.ejs',{id,message: req.flash('error')});
        }
        else res.redirect('/index')   //not allow editing others' profiles
        
    }
    else res.redirect('/index'); //param id not exists
    
})

router.post('/editPassword', (req,res)=>{
    const {id,oldPassword,newPassword,newPassword2}=req.body;
    db.query(`select password from account where id=${id}`,(err,results)=>{
        if (err) throw err;
        if (results.length>0)  //account exists
        {
            const {password}=results[0];
            bcrypt.compare(oldPassword,password,async (err,isMatch)=>{
                if (err) throw err;
                if (isMatch)  //password valid
                {
                    if (newPassword===newPassword2)  //new password confirmed
                    {
                        let hashedPassword= await bcrypt.hash(newPassword,10);
                        db.query(`update account set password='${hashedPassword}' where id=${id}`,(err)=>{
                            if (err) throw err;
                            res.redirect('/profile');
                        })
                    }
                    else {
                        req.flash('error','new password is not matching');
                        res.redirect(`/editPassword?id=${id}`);
                    }
                }
                else {
                    req.flash('error','you enter the wrong password');
                    res.redirect(`/editPassword?id=${id}`);
                }
            })
        }
        else res.redirect('/index');
    })

})

router.get('/logout', isLoggedIn, (req,res)=>{
    req.session.destroy();
    res.redirect('/loginform')
})






module.exports = router