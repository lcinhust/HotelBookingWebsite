const APIServerPort = 3000
const database = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123', /// thay doi password
    database: 'bookingapp' // ghi ten database cua minh vao
  };

module.exports = {
    database,
    APIServerPort
}