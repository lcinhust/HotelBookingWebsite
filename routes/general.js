<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const path = require('path');

function checkAuthLogin(req,res,next){
    if (req.session.userId)
        res.redirect('/booking');
    else next();
}

function checkAuthProtectedRoute(req,res,next)
{
    if (req.session.userId)
        next();
    else res.redirect('/loginform');
}

router.get('/index', (req, res) => {
    res.sendFile('index.html', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/rooms', (req, res) => {
    res.sendFile('rooms.html', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/booking', checkAuthProtectedRoute, (req, res) => {
    res.sendFile('booking.html', { root: path.join(`${__dirname}/../pages`)});
}) //must log in to see

router.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/loginform', checkAuthLogin, (req, res) => {
    res.sendFile('loginform.html', { root: path.join(`${__dirname}/../pages`)});
})//if already logged in, redirect to /booking

router.get('/restaurant', (req, res) => {
    res.sendFile('restaurant.html', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/spa', (req, res) => {
    res.sendFile('spa.html', { root: path.join(`${__dirname}/../pages`)});
})

=======
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

router.get('/restaurant', (req, res) => {
    res.render('restaurant.ejs');
})

router.get('/spa', (req, res) => {
    res.render('spa.ejs');
})

router.get('/profile', (req, res) => {
    res.render('profile.ejs');
})
router.get('/editProfile', (req, res) => {
    res.render('editProfile.ejs');
})
router.get('/editPassword', (req, res) => {
    res.render('editPassword.ejs');
})

router.get('/logout', isLoggedIn, (req,res)=>{
    req.session.destroy();
    res.redirect('/loginform')
})

>>>>>>> DinhVietQuang
module.exports = router