const express = require('express');
const router = express.Router();
const db = require('../database');

async function getRoomsByCapacity(array, cap) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            // add type, description of room
            db.query(`select r.id, r.number 
            from room r
            inner join type t on r.type_id = t.id 
            where t.capacity='${cap}' and r.status = 0`, (err, results) => {
                if (err) reject(new Error(err.message));
                var room = { success: true, id: results[0].number }; 
                array.push({ ...room });
                resolve(room.id); // results/room.number 
            });
        });
    } catch (error) {
        console.log(error);
    }
    console.log(response);
    return response;
}

async function updateRoomStatus(roomNumber) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            db.query(`update room 
            set status = 1 
            where number = '${db.escape(roomNumber)}'`, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    return response;
}

async function resetRoomsStatus(rooms) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            let query = `update room set status = 0 where number in (`;
            for (let i = 0; i < rooms.length; i++) {
                if (i === rooms.length - 1) {
                    query += `${rooms[i].id})`;
                } else {
                    query += `${rooms[i].id},`; 
                }
            }
            db.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    return response;
}

router.post('/booking', async (req, res) => {
    let { roomtype, adultNum, childrenNum, arrivalDay, arrivalMonth,
        arrivalYear, departureDay, departureMonth, departureYear } = req.body;
    adultNum = parseInt(adultNum);
    childrenNum = parseInt(childrenNum);
    let capacity = adultNum + childrenNum;
    let rooms = [];
    // console.log(capacity);
    if (adultNum * 3 < childrenNum) {
        return res.status(400).json({ success: false, msg: 'The number of children is too high.' })
    }
    else if (capacity <= 3) { // 1 room
        let cap1 = capacity;
        let roomNumber1 = await getRoomsByCapacity(rooms, cap1);
        await updateRoomStatus(roomNumber1)
            .then(() => {
                res.status(200).json(rooms);
            })
            .then(() => {
                resetRoomsStatus(rooms);
            });
    }
    else if (capacity < 6) { // 2 rooms
        let cap1 = parseInt(capacity / 2 + 0.5);
        let cap2 = capacity - cap1;
        let roomNumber1 = await getRoomsByCapacity(rooms, cap1);
        await updateRoomStatus(roomNumber1);
        let roomNumber2 = await getRoomsByCapacity(rooms, cap2);
        await updateRoomStatus(roomNumber2)
            .then(() => {
                res.status(200).json(rooms);
            });
    }
    else if (capacity >= 6) { // 3 rooms
        let cap1 = parseInt(capacity / 3 + 0.5);
        let cap2 = parseInt(capacity / 3 + 0.5);
        let cap3 = capacity - cap1 - cap2;
        let roomNumber1 = await getRoomsByCapacity(rooms, cap1);
        await updateRoomStatus(roomNumber1);
        let roomNumber2 = await getRoomsByCapacity(rooms, cap2);
        await updateRoomStatus(roomNumber2);
        let roomNumber3 = await getRoomsByCapacity(rooms, cap3);
        await updateRoomStatus(roomNumber3)
            .then(() => {
                res.status(200).json(rooms);
            });
    }
})

module.exports = router