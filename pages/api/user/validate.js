import db from '../../../lib/db';
// import {  } from 'crypto-js';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    db.connect();
    switch (req.method) {
        case 'GET':
        case 'POST':
            const username = req.body.username;
            const token = req.body.token;
            //get user password from db
            db.query(`SELECT * FROM User WHERE username = '${username}'`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err, status: false });
                } else {
                    if (result.length > 0) {
                        const password = result[0].password;
                        const decrypted = bcrypt.compareSync(password, token);
                        if (decrypted) {
                            res.status(200).json({ message: 'Validation successfull', status: true });
                        } else {
                            res.status(401).json({ message: 'Validation failed', status: false });
                        }
                    } else {
                        res.status(401).json({ message: 'Validation failed', status: false });
                    }
                }
            });
            // res.json(req.body);
            break;
        default:
            break;
    }
    db.end();

}