<<<<<<< HEAD
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'quenmkroi123', /// thay doi password
    database: 'bookingapp' // ghi ten database cua minh vao
  });

db.connect((err)=>{
  if (!err) 
      console.log('Connect successfully');
  else console.log(err);
})

=======
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'quenmkroi123', /// thay doi password
    database: 'bookingapp' // ghi ten database cua minh vao
  });

db.connect((err)=>{
  if (!err) 
      console.log('Connect successfully');
  else console.log(err);
})

>>>>>>> DinhVietQuang
module.exports=db;