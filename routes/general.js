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
    res.render('index.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/rooms', (req, res) => {
    res.render('rooms.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/about', (req, res) => {
    res.render('about.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/booking', checkAuthProtectedRoute, (req, res) => {
    res.render('booking.ejs', { root: path.join(`${__dirname}/../pages`)});
}) //must log in to see

router.get('/contact', (req, res) => {
    res.render('contact.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/loginform', checkAuthLogin, (req, res) => {
    res.render('loginform.ejs', { root: path.join(`${__dirname}/../pages`)});
})//if already logged in, redirect to /booking

router.get('/restaurant', (req, res) => {
    res.render('restaurant.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/spa', (req, res) => {
    res.render('spa.ejs', { root: path.join(`${__dirname}/../pages`)});
})

router.get('/profile', (req, res) => {
    res.render('profile.ejs', { root: path.join(`${__dirname}/../pages`)});
})
router.get('/editProfile', (req, res) => {
    res.render('editProfile.ejs', { root: path.join(`${__dirname}/../pages`)});
})
router.get('/editPassword', (req, res) => {
    res.render('editPassword.ejs', { root: path.join(`${__dirname}/../pages`)});
})


module.exports = router