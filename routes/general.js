const express = require('express');
const router = express.Router();
const path = require('path');
const db=require('../database');
const bcrypt=require('bcrypt');

router.get('/',(req,res)=>{
    res.redirect('/index');
})

router.get('/index', (req, res) => {
    res.render('index.ejs', {message: req.flash('success')});
})

router.get('/rooms', (req, res) => {
    res.render('rooms.ejs');
})

router.get('/about', (req, res) => {
    res.render('about.ejs');
})


router.get('/contact', (req, res) => {
    res.render('contact.ejs');
})


router.get('/restaurant', (req, res) => {
    res.render('restaurant.ejs');
})

router.get('/spa', (req, res) => {
    res.render('spa.ejs');
})




module.exports = router