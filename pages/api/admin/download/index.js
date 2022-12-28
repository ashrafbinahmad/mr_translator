import db from '../../../../lib/db';
import api_functions from '../../../../helpers/api_functions';

export default async function handle(req, res) {
    switch (req.method) {
        case 'GET':
        case 'POST':
            const username = req.body.username;
            const token = req.body.token;
            api_functions.validateUserWithToken(token, username).then((status) => {
                if (username == 'admin') {
                    db.query(`SELECT * FROM Response`, (err, result) => {
                        if (err) {
                            res.status(500).json({ error: err, success: false });
                        } else {
                            api_functions.generatePdf(result).pipe(res);
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

