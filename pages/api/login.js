import db from '../../lib/db';

import bcrypt from 'bcrypt';

export default async function handle(req, res) {
  
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const password = req.body.password;
      db.query(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err, status: false });
        } else {
          if (result.length > 0) {

            const token =  bcrypt.hashSync(result[0].password, 10);
            
            return res.status(200).json({ message: 'Login success', status: true, token, username:result[0].username,  fullname:result[0].fullname,  answered_count:result[0].status,  });
          } else {
            return res.status(401).json({ message: 'Invalid username or password', status: false });
          }
        }
      });
      
      break;
    default:
      break;
  }
  

}