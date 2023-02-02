const express = require('express');
const userController = require('../Controllers/users')
const router = express.Router();

router.post('/signin', (req,res)=>{
    const {email,password} = req.body;
    const record = userController
    
})

module.exports = router;