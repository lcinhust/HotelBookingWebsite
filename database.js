const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LCgonnarunthisgame', /// thay doi password
    database: 'bookingapp' // ghi ten database cua minh vao
  });

db.connect((err)=>{
  if (!err) 
      console.log('Connect successfully');
  else console.log(err);
})

module.exports=db;