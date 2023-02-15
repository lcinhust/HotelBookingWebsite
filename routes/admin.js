const express = require('express');
const router = express.Router();
const db = require('../database');

function dateFormatting(dateType){
    let date = dateType.getDate();
    let month = dateType.getMonth()+1;
    let year= dateType.getFullYear();
    const dateFormat = [(date>9 ? '' : '0') + date,(month>9 ? '' : '0') + month,year].join('/');
    return dateFormat;
}

router.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (!email | !password)
        res.status(404).json({ message: 'Please enter all fields' });
    else {
        db.query(`select * from account where email='${email}' and type_of_account = 'admin'`, (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const admin = results[0];
                if (admin.password === password) {
                    session = req.session;
                    session.adminID = admin.id;
                    res.redirect('/admin/dashboard');
                } else {
                    req.flash('error', 'Password is not correct');
                    res.redirect('/admin/login');
                }
            }
            else {
                req.flash('error', 'Email is not registered');
                res.redirect('/admin/login');
            }
        })
    }
})

router.post('/admin/accept/:id',(req,res)=>{
    const {id} = req.params;
    db.query(`update reservation set status = 'accept' where id = '${id}';`,(err,result)=>{
        if(err) throw err;
        else{
            res.redirect('/admin/dashboard')
        }
    })
    
})
router.post('/admin/decline/:id',(req,res)=>{
    const {id} = req.params;
    console.log(id);
    db.query(`update reservation set status = 'decline' where id = '${id}';`,(err,result)=>{
        if(err) throw err;
        else{
            res.redirect('/admin/dashboard')
        }
    })
    
})

function dateFormatting(dateType){
    let date = dateType.getDate();
    let month = dateType.getMonth()+1;
    let year= dateType.getFullYear();
    const dateFormat = [(date>9 ? '' : '0') + date,(month>9 ? '' : '0') + month,year].join('/');
    return dateFormat;
}
function isLoggedInAdmin(req,res,next)
{
    if (req.session.adminID)
        next();
    else res.redirect('/admin/login');
}

function isLoggedOutAdmin(req,res,next){
    if (req.session.adminID)
        res.redirect('/admin/dashboard');
    else next();
}

router.get('/admin/reservation',isLoggedInAdmin,(req,res)=>{
    res.render('reservation.ejs')
})

router.get('/admin/dashboard', isLoggedInAdmin,async (req, res) => {
    let response1;
    let userReservation = [];
    try {
        response1 = await new Promise((resolve, reject) => {
            db.query(`select re.id,b.id as booker_id,concat(b.first_name,' ',b.last_name) as name,b.phone,re.date_in,re.date_out,re.description
            from reservation as re,booker as b
            where b.id = re.booker_id and re.status = 'pending'`, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    for(let record of response1){
        userReservation.push({
            id : record.id,
            booker_id:record.booker_id,
            name: record.name,
            phone:record.phone,
            date_in:dateFormatting(record.date_in),
            date_out:dateFormatting(record.date_out),
            description:record.description
        });
    }
    res.render('adminDashboard.ejs',{userReservation});
}) //must login to see

router.get('/admin/login', isLoggedOutAdmin, (req, res) => {
    res.render('adminLogin.ejs',{message:req.flash('error')});
})//if already logged in, redirect to /adminDashboard

router.get('/admin/logout', isLoggedInAdmin, (req,res)=>{
    req.session.destroy();
    res.redirect('/admin/login')
})

router.post('/admin/search',async (req,res)=>{
    const {search} = req.body;
    let record;
    let userReservation;
    try {
        record = await new Promise((resolve, reject) => {
            db.query(`select re.id,b.id as booker_id,concat(b.first_name,' ',b.last_name) as name,b.phone,re.date_in,re.date_out,re.description,re.status
            from reservation as re,booker as b
            where b.id = re.booker_id and re.id = ${search}`, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    userReservation = {
        id : record[0].id,
        booker_id:record[0].booker_id,
        name: record[0].name,
        phone:record[0].phone,
        date_in:dateFormatting(record[0].date_in),
        date_out:dateFormatting(record[0].date_out),
        description:record[0].description,
        status:record[0].status
    };
    
    res.render('reservation.ejs',userReservation);
})

router.get('/admin/editReservation', isLoggedInAdmin, (req, res) => {
    res.render('admin_editReservation.ejs');
})

module.exports = router;