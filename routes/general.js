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

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(`${__dirname}/../pages`)});
})

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

module.exports = router