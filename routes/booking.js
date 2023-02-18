const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * It returns an array of room numbers of a given room type.
 * @param roomType - id of type of room
 * @returns An array of room numbers which type is the same with roomType.
 */
async function getRoomsOfType(roomType, arrivalDate, departureDate) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            db.query(`SELECT number 
                    FROM room 
                    WHERE type_id = ?
                    AND id NOT IN (
                        SELECT room_id 
                        FROM room_reserved
                        WHERE reservation_id IN(
                            SELECT id
                            FROM reservation
                            WHERE (status = 'accept' OR status = 'pending' OR status = 'checkin') AND ((date_in <= ? AND ? < date_out) OR (date_in < ? AND ? <= date_out) OR (? < date_in AND date_out < ?))
                        )
                    )`, [roomType, arrivalDate, arrivalDate, departureDate, departureDate, arrivalDate, departureDate], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    return response.map(row => row.number);
}

// AND NOT IN (
//     SELECT 
//     FROM 

async function calculatePrice(type_id, arrivalDate, departureDate) {
    type_id = Number(type_id);
    const parsedArrivalDate = new Date(Date.parse(arrivalDate));
    const parsedDepartureDate = new Date(Date.parse(departureDate));

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`
            SELECT month, year, price_each_day
            FROM month_price
            WHERE type_id = ? `,
                [type_id],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        // Calculate the total price for the entire stay
        let totalPrice = 0;
        let currentDate = new Date(parsedArrivalDate.getTime());
        while (currentDate < parsedDepartureDate) {
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            const matchingRow = results.find((row) => row.month === currentMonth && row.year === currentYear);
            if (matchingRow) {
                totalPrice += matchingRow.price_each_day;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return totalPrice;
    } catch (error) {
        console.log(error);
    }
}

router.post('/booking', async (req, res) => {
    try{
        const { 'arrival-date': arrivalDate, 'departure-date': departureDate } = req.body;
        console.log(arrivalDate, departureDate);
        const roomTypeName = new Map([
            ['1', 'Single'],
            ['2', 'Double'],
            ['3', 'Triple'],
            ['4', 'Quad'],
            ['5', 'President'],
            ['6', 'Rooftop']
        ]);
        const roomCounts = req.body.room.reduce((counts, room) => {
            counts[room] = (counts[room] || 0) + 1;
            return counts;
        }, {});
        console.log(roomCounts);
        let errors=[];
        const resData = await Promise.all(Object.keys(roomCounts).map(async roomType => {
            const roomIds = await getRoomsOfType(roomType, arrivalDate, departureDate);
            const numRoomsOfType = roomIds.length;
            if (numRoomsOfType < roomCounts[roomType]) {
                errors.push(`Not enough rooms available of type ${roomType}`);
            }
            let price = await calculatePrice(roomType, arrivalDate, departureDate);
            return { arrivalDate, departureDate, userId: req.session.userId, type: roomType, nameofType: roomTypeName.get(roomType), roomOfType: roomIds, numRoomsOfType: numRoomsOfType, price: price, numRoomsChosen: roomCounts[roomType] };
        }));
        if (errors.length>0){
            req.flash('errors',errors);
            res.redirect('/booking');
        }
        else
        {
            console.log(resData);
            res.render('roomSelect.ejs', {resData} );
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal server error');
    }
    
});

router.post('/roomSelect',(req,res)=>{
    console.log(req.body);
    req.flash('success','Thanks for your booking. Wish you have a good time at our hotel');
    res.redirect('/index');
})

module.exports = router