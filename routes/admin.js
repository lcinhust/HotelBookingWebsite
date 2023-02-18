const express = require('express');
const router = express.Router();
const db = require('../database');

function dateFormatting(dateType) {

    let date = dateType.getDate();
    let month = dateType.getMonth() + 1;
    let year = dateType.getFullYear();
    const dateFormat = [(date > 9 ? '' : '0') + date, (month > 9 ? '' : '0') + month, year].join('/');
    return dateFormat;
}
function dateFormatting2(dateType) {
    let date = dateType.getDate();
    let month = dateType.getMonth() + 1;
    let year = dateType.getFullYear();
    const dateFormat = [year, (month > 9 ? '' : '0') + month, (date > 9 ? '' : '0') + date].join('-');
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

function isLoggedInAdmin(req, res, next) {
    if (req.session.adminID)
        next();
    else res.redirect('/admin/login');
}

function isLoggedOutAdmin(req, res, next) {
    if (req.session.adminID)
        res.redirect('/admin/dashboard');
    else next();
}

router.get('/admin/login', isLoggedOutAdmin, (req, res) => {
    res.render('adminLogin.ejs', { message: req.flash('error') });
})//if already logged in, redirect to /adminDashboard

router.get('/admin/logout', isLoggedInAdmin, (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login')
})
//DASHBOARD
router.get('/admin/dashboard', isLoggedInAdmin, async (req, res) => {
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
    for (let record of response1) {
        userReservation.push({
            id: record.id,
            booker_id: record.booker_id,
            name: record.name,
            phone: record.phone,
            date_in: dateFormatting(record.date_in),
            date_out: dateFormatting(record.date_out),
            description: record.description
        });
    }
    res.render('adminDashboard.ejs', { userReservation });
}) //must login to see

router.post('/admin/accept/:id',isLoggedInAdmin, (req, res) => {
    const { id } = req.params;
    db.query(`update reservation set status = 'accept' where id = '${id}';`, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/dashboard')
        }
    })

})
router.post('/admin/decline/:id',isLoggedInAdmin, (req, res) => {
    const { id } = req.params;
    db.query(`update reservation set status = 'decline' where id = '${id}';`, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/dashboard')
        }
    })

})

//Reservation

router.get('/admin/reservation', isLoggedInAdmin, (req, res) => {
    let userReservation;
    res.render('reservation.ejs', { userReservation, message: req.flash('error') })
})

router.post('/admin/search',isLoggedInAdmin, async (req, res) => {
    const { search } = req.body;
    let record;
    let userReservation;
    if (search) {
        try {
            record = await new Promise((resolve, reject) => {
                db.query(`select re.id,b.id as booker_id,concat(b.first_name,' ',b.last_name) as name,b.phone,re.date_in,re.date_out,re.description,re.status,total_price,payment_date 
                from reservation as re, booker as b,payment as p
                where b.id = re.booker_id and re.id=p.reservation_id and re.id = ${search}`, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        } catch (error) {
            req.flash('error', 'ID not found');
        }
        console.log()
        if (record.length > 0) {
            userReservation = {
                id: record[0].id,
                booker_id: record[0].booker_id,
                name: record[0].name,
                phone: record[0].phone,
                date_in: dateFormatting(record[0].date_in),
                date_out: dateFormatting(record[0].date_out),
                description: record[0].description,
                status: record[0].status,
                price: record[0].total_price,
                payment_date: dateFormatting(record[0].payment_date)
            };
            console.log(userReservation);
        } else {
            req.flash('error', 'ID not found');
        }
    }
    res.render('reservation.ejs', { userReservation, message: req.flash('error') });
})


// router.get('/admin/editReservation/:id',isLoggedInAdmin, async (req, res) => {
//     const {id} = req.params;
//     console.log(id);
//     let record;
//     let userReservation;
//     if (id) {
//         try {
//             record = await new Promise((resolve, reject) => {
//                 db.query(`select re.id,b.id as booker_id,concat(b.first_name,' ',b.last_name) as name,b.phone,re.date_in,re.date_out,re.description,re.status,total_price,payment_date 
//                 from reservation as re, booker as b,payment as p
//                 where b.id = re.booker_id and re.id=p.reservation_id and re.id = '${id}'`, (err, results) => {
//                     if (err) reject(new Error(err.message));
//                     resolve(results);
//                 });
//             });
//         } catch (error) {
//             req.flash('error', 'ID not found');
//         }
//         if (record.length > 0) {
//             userReservation = {
//                 id: record[0].id,              
//                 phone: record[0].phone,
//                 date_in: dateFormatting2(record[0].date_in),
//                 date_out: dateFormatting2(record[0].date_out),
//                 status:record[0].status,
//                 description: record[0].description
//             };
//             // console.log(userReservation);
//         } else {
//             req.flash('error', 'ID not found');
//         }
//     }
//     res.render('admin_editReservation.ejs', { userReservation, message: req.flash('error') });
// })

router.get('/admin/checkin/:id',isLoggedInAdmin, async (req, res) => {
    const { id } = req.params;
    db.query(`select * from reservation where id = '${id}'`, (err, result) => {
        if (err) throw err;
        else {
            if (result[0].status === 'accept') {
                db.query(`update reservation set status = 'checkin' where id = '${id}';`, (err, result) => {
                    if (err) throw err;
                    else {
                        res.redirect('/admin/reservation');
                    }
                })
            } else {
                res.redirect('/admin/reservation');
            }
        }
    })

})

router.get('/admin/checkout/:id',isLoggedInAdmin, async (req, res) => {
    const { id } = req.params;

    db.query(`select * from reservation where id = '${id}'`, (err, result) => {
        if (err) throw err;
        else {
            if (result[0].status === 'checkin') {
                db.query(`update reservation set status = 'checkout' where id = '${id}';`, (err, result) => {
                    if (err) throw err;
                    else {
                        db.query('update payment set payment_date = curdate();', (err, result) => {
                            if (err) throw err;
                            else {
                                res.redirect('/admin/reservation')
                            }
                        })

                    }
                })
            }else{
                res.redirect('/admin/reservation');
            }
        }
    })


})

// router.post('/admin/editReservation/:id',isLoggedInAdmin,async (req,res)=>{
//     const {id} = req.params;
//     const {din,dout,status} = req.body;
//     let record;
//     try {
//         await new Promise((resolve, reject) => {
//             db.query(`update reservation set date_in = '${din}', date_out = '${dout}',status = '${status}'`, (err, results) => {
//                 if (err) reject(new Error(err.message));
//                 resolve(results);
//             });
//         });
//     } catch (error) {
//         console.log(error);
//     }
// })

router.get('/admin/decline/:id',isLoggedInAdmin, (req, res) => {
    const { id } = req.params;
    db.query(`select * from reservation where id = '${id}'`, (err, result) => {
        if (err) throw err;
        else {
            if (result[0].status === 'accept') {
                db.query(`update reservation set status = 'decline' where id = '${id}';`, (err, result) => {
                    if (err) throw err;
                    else {
                        res.redirect('/admin/reservation');
                    }
                })
            } else {
                res.redirect('/admin/reservation');
            }
        }
    })

})

module.exports = router;