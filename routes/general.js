const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/index', (req, res) => {
    res.sendFile('index.html', { root: 'D:\\practice\\pages'});
})

router.get('/rooms', (req, res) => {
    res.sendFile('rooms.html', { root: 'D:\\practice\\pages' });
})

router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: 'D:\\practice\\pages' });
})

router.get('/booking', (req, res) => {
    res.sendFile('booking.html', { root: 'D:\\practice\\pages' });
})

router.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: 'D:\\practice\\pages' });
})

router.get('/loginform', (req, res) => {
    res.sendFile('loginform.html', { root: 'D:\\practice\\pages' });
})

router.get('/restaurant', (req, res) => {
    res.sendFile('restaurant.html', { root: 'D:\\practice\\pages' });
})

router.get('/spa', (req, res) => {
    res.sendFile('spa.html', { root: 'D:\\practice\\pages' });
})

module.exports = router