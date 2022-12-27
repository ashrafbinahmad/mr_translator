import db from '../../../../lib/db';
import bcrypt from 'bcrypt';
import api_functions from '../../../../helpers/api_functions';

export default async function handle(req, res) {
    switch (req.method) {
        case 'GET':
        case 'POST':
            const username = req.body.username;
            const token = req.body.token;
            const { cand_username } = req.query;
            api_functions.validateUserWithToken(token, username).then((status) => {
                if (username == 'admin') {
                    db.query(`SELECT * FROM User WHERE username = '${cand_username}'`, (err, result) => {
                        if (err) {
                            res.status(500).json({ error: err, success: false });
                        } else if(result.length == 0) {
                            res.status(200).json({ message: 'Didn\'t get ' + cand_username, success: false });
                        } else {
                            res.status(200).json({ message: 'Got ' + cand_username, details: result, success: true });
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