import db from '../../../lib/db';


import bcrypt from 'bcrypt';
import api_functions from '../../../helpers/api_functions';

export default async function handle(req, res) {
  
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const token = req.body.token;
      
      api_functions.validateUserWithToken(token, username).then((status) => {
        if (status) {
          
          db.query(`SELECT * FROM User WHERE username='${username}'` , (err, result) => {
            if (err) {
              res.status(500).json({ error: err, status: false });
            } else {
              res.status(200).json({ success: true, status: result[0].status  }); 
            }
          });
        } else {
          res.status(401).json({ message: 'Validation failed. Please login again', status: false });
        }
      }).catch((err) => {
        res.status(401).json({ error: err, status: false });
      });
      
      break;
    default:
      break;
  }
  

}