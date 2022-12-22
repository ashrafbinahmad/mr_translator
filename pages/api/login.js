import db from '../../lib/db';
// import {  } from 'crypto-js';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
  db.connect();
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const password = req.body.password;
      db.query(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
        if (err) {
          res.status(500).json({ error: err, status: false });
        } else {
          if (result.length > 0) {

            const token =  bcrypt.hashSync(result[0].password, 10);
            // const decrypted = bcrypt.compareSync(JSON.stringify(usernameAndPass), token);
            res.status(200).json({ message: 'Login success', status: true, token, username:result[0].username });
          } else {
            res.status(401).json({ message: 'Invalid username or password', status: false });
          }
        }
      });
      // res.json(req.body);
      break;
    default:
      break;
  }
  //db.end();

}