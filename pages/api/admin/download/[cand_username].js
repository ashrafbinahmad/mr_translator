import db from '../../../../lib/db';
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
                    db.query(`SELECT * FROM Response WHERE username = '${cand_username}'`, (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: err, success: false });
                        } else {
                            api_functions.generatePdf(result).pipe(res);
                        }
                    });
                } else {
                    return res.status(401).json({ error: 'Not an admin', success: false });
                }
            }).catch((err) => {
                return res.status(401).json({ error: err, success: false });
            });
            break;
        default:
            break;
    }
}
