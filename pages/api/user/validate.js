import db from '../../../lib/db';

import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    
    switch (req.method) {
        case 'GET':
        case 'POST':
            const username = req.body.username;
            const token = req.body.token;
            
            db.query(`SELECT * FROM User WHERE username = '${username}'`, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err, status: false });
                } else {
                    if (result.length > 0) {
                        const password = result[0].password;
                        const decrypted = bcrypt.compareSync(password, token);
                        if (decrypted) {
                            return res.status(200).json({ message: 'Validation successfull', status: true });
                        } else {
                            return res.status(401).json({ message: 'Validation failed', status: false });
                        }
                    } else {
                        return res.status(401).json({ message: 'Validation failed', status: false });
                    }
                }
            });
            
            break;
        default:
            break;
    }
    

}