function listAllUsers(req, res) {
    const connection = req.app.locals.connection;
    connection.query(`select * from users`, (error,result) =>{
        if(error){
            return res.status(500).json(error);
        }else{
            return res.status(200).json(result);
        }
    })
}
// function ListOneUser(req, res) {
//     const connection = req.app.locals.connection;
//     const id = +req.params.id;
//     connection.query(`select * from users where id = ${connection.escape(id)}`, (error, result) => {
//         if (error) {
//             return res.status(500).json(error);
//         };
//         if (result.length > 0) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(404).json(`Employee with ID ${id} cannot be found.`);
//         }
//     });
// }

// function CreateUser(req, res) {
//     const connection = req.app.locals.connection;
//     const payload = req.body
//     const mandatory = ['username', 'password'];
//     const payloadKeys = Object.keys(payload);
//     const mandatoryColumnExists = mandatory.every(mc => payloadKeys.includes(mc));
//     if (mandatoryColumnExists) {
//         connection.query(`INSERT INTO users SET ?`, payload, (error, results) => {
//             if (error) {
//                 return res.status(500).json(error);
//             }
//             return res.status(201).json(`Created employee with ID: ${results.insertId}`);
//         });
//     } else {
//         return res.status(400).json(`The following columns are mandatory: ${mandatory.toString()}`)
//     }
// }
// function updateUsers(req, res) {
//     const connection = req.app.locals.connection;
//     const id = +req.params.id;
//     const payload = req.body;
//     const keys = Object.keys(payload).map(p => `${p} = ?`);
//     const values = [`${connection.escape(...Object.values(payload))}`, `${connection.escape(id)}`];

//     connection.query(`UPDATE users SET ${keys} WHERE id = ?`, values, function (error, results) {
//         if (error) {
//             return res.status(500).json(error);
//         }
//         if (+results.affectedRows === 1) {
//             return res.status(204).json();
//         } else {
//             return res.status(400).json('Error occured');
//         }
//     });
// }

module.exports = {
    listAllUsers
}