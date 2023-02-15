const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * It returns an array of room numbers of a given room type.
 * @param roomType - id of type of room
 * @returns An array of room numbers which type is the same with roomType.
 */
async function getRoomsOfType(roomType) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            db.query(`SELECT number 
                    FROM room 
                    WHERE type_id = ? AND status = 0`, [roomType], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
    return response.map(row => row.number);
}

// async function getRoomPrices(roomTypes, month, year) {
//     const priceMap = {};
//     const query = `
//         SELECT type_id, price_each_day
//         FROM month_price
//         WHERE month = ? AND year = ?
//     `;
//     const values = [month, year];
//     const results = await db.query(query, values);
//     results.forEach(row => {
//         const roomType = row.type_id;
//         const price = row.price_each_day;
//         priceMap[roomType] = price;
//     });
//     return roomTypes.map(roomType => ({ [`${month}/${year}`]: priceMap[roomType] }));
// }

// router.post('/booking', async (req, res) => {
//     console.log(req.body);
//     const roomCounts = req.body.room.reduce((counts, room) => {
//         counts[room] = (counts[room] || 0) + 1;
//         return counts;
//     }, {});
//     console.log(roomCounts);
//     const resData = await Promise.all(Object.keys(roomCounts).map(async roomType => {
//         const roomIds = await getRoomsOfType(roomType);
//         const numRoomsOfType = roomIds.length;
//         if (numRoomsOfType < roomCounts[roomType]) {
//             throw new Error(`Not enough rooms available of type ${roomType}`);
//         }
//         const arrivalDate = new Date(req.body['arrival-date']);
//         const departureDate = new Date(req.body['departure-date']);
//         const arrivalYear = arrivalDate.getFullYear();
//         const arrivalMonth = arrivalDate.getMonth() + 1; // Note: month is zero-based, so we add 1 to get the actual month number
//         const departureYear = departureDate.getFullYear();
//         const departureMonth = departureDate.getMonth() + 1;
//         const prices = await getRoomPrices(roomType, arrivalMonth, arrivalYear);
//         return { type: roomType, roomOfType: roomIds, numRoomsOfType: numRoomsOfType, prices };
//     }));
//     res.json(resData);
// })

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
    const { 'arrival-date': arrivalDate, 'departure-date': departureDate } = req.body;
    console.log(arrivalDate, departureDate);
    const roomCounts = req.body.room.reduce((counts, room) => {
        counts[room] = (counts[room] || 0) + 1;
        return counts;
    }, {});
    console.log(roomCounts);
    const resData = await Promise.all(Object.keys(roomCounts).map(async roomType => {
        const roomIds = await getRoomsOfType(roomType);
        const numRoomsOfType = roomIds.length;
        if (numRoomsOfType < roomCounts[roomType]) {
            throw new Error(`Not enough rooms available of type ${roomType}`);
        }
        let price = await calculatePrice(roomType, arrivalDate, departureDate);
        return { type: roomType, roomOfType: roomIds, numRoomsOfType: numRoomsOfType, price: price };
    }));
    res.json(resData);
});

module.exports = router