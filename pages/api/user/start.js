import db from '../../../lib/db';

// import {  } from 'crypto-js';
import bcrypt from 'bcrypt';
import api_functions from '../../../helpers/api_functions';

export default async function handle(req, res) {
  //db.state === 'disconnected' && db.connect();
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const token = req.body.token;
      //get user password from db
      api_functions.validateUserWithToken(token, username).then((status) => {
        if (status) {
          
          db.query(`UPDATE User SET status = 0 WHERE username = '${username}'`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err, status: false });
            } else {
              res.status(200).json({ message: 'Quiz started successfully.', status: true, result });
            }
          });
        } else {
          res.status(401).json({ message: 'Validation failed. Please login again', status: false });
        }
      }).catch((err) => {
        res.status(401).json({ error: err, status: false });
      });
      // res.json(req.body);
      break;
    default:
      break;
  }
  //db.end();
}