const {connection} = require('../index')
async function getUserByEmail(email) {
    try{
        const record = await connection.query('select * from account where email = ?',email)
        return record;
    }catch{
        
    }
}

module.exports = {
    getUserByEmail
}