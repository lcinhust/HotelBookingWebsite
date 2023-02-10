const express = require('express');
const router = express.Router();
const path = require('path');

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
    res.render('loginform.ejs');
})//if already logged in, redirect to /booking

router.get('/signupform', (req, res) => {
    res.render('signupform.ejs');
})

router.get('/restaurant', (req, res) => {
    res.render('restaurant.ejs');
})

router.get('/spa', (req, res) => {
    res.render('spa.ejs');
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs');
})

router.get('/editProfile', isLoggedIn, (req, res) => {
    res.render('editProfile.ejs');
})

router.get('/editPassword', isLoggedIn, (req, res) => {
    res.render('editPassword.ejs');
})

router.get('/logout', isLoggedIn, (req,res)=>{
    req.session.destroy();
    res.redirect('/loginform')
})

module.exports = router