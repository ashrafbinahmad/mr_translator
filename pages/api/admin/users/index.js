import db from '../../../../lib/db';
import bcrypt from 'bcrypt';
import api_functions from '../../../../helpers/api_functions';

export default async function handle(req, res) {
    switch (req.method) {
        case 'GET':
        case 'POST':
            const username = req.body.username;
            const token = req.body.token;
            api_functions.validateUserWithToken(token, username).then((status) => {
                if (username == 'admin') {
                    db.query(`SELECT * FROM User`, (err, result) => {
                        if (err) {
                            res.status(500).json({ error: err, success: false });
                        } else {
                            res.status(200).json({ message: 'Got users.', success: true, users: result });
                        }
                    });
                } else {
                    res.status(401).json({ error: 'Not an admin', success: false });
                }
            }).catch((err) => {
                res.status(401).json({ error: err, success: false });
            });
            break;
        default:
            break;
    }
}