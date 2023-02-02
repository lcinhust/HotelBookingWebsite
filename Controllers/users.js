// const app = require('../index').app;
// const connection = app.locals.connection;
async function getAllAccount(req,res) {
    const records = await connection.query('select * from account')
    console.log(records);
    return records;
}

module.exports = {
    getAllAccount
}