const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/booking', (req, res) => {
    let { roomtype, adultNum, childrenNum, arrivalDay, arrivalMonth,
        arrivalYear, departureDay, departureMonth, departureYear } = req.body;
    adultNum = parseInt(adultNum);
    childrenNum = parseInt(childrenNum);
    let capacity = adultNum + childrenNum;
    capacity = parseInt(capacity)
    // console.log(capacity);
    if (adultNum * 3 < childrenNum) {
        return res.status(400).json({ success: false, msg: 'The number of children is too high.' })
    }
    else if (capacity <= 3) { // 1 room
        let cap1 = capacity;
        db.query(`select r.id, r.number
                from room r
                inner join type t on r.type_id = t.id 
                where t.capacity='${cap1}'`, (err, results) => {
            if (err) throw err;
            // console.log(results);
            res.send(`${results[0].number}`)
        })
    }
    else if (capacity < 6) { // 2 rooms
        let cap1 = parseInt(capacity / 2 + 0.5);
        let cap2 = capacity - cap1;
        let id1 = 0;
        let array = [];
        db.query(`select r.id, r.number
                from room r
                inner join type t on r.type_id = t.id 
                where t.capacity= ${cap1} and r.status = 0`, (err, results) => {
            if (err) throw err;
            array.push(results[0].number);
            db.query(`update room
            set status = 1
            where number = ${array[0]}`, (err) => {
                if (err) throw err;
            })
        })
        // db.query(`update room
        //         set status = 1
        //         where number = ${array[0]}`, (err) => {
        //     if (err) throw err;
        // })
        // db.query(`select r.id, r.number
        //         from room r
        //         inner join type t on r.type_id = t.id 
        //         where t.capacity='${cap2}' and r.status = 0`, (err, results) => {
        //     if (err) throw err;
        //     array.push(results[0].number);
        // })
        // res.status(200).json(array);
    }
    // else if (capacity == 6) { // 2 rooms or 3 rooms, each room 2 persons
    // }
    // else if (capacity > 6) { // 3 rooms
    // }
})

module.exports = router