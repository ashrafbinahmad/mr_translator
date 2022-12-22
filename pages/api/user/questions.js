import db from '../../../lib/db';
import api_functions from '../../../helpers/api_functions';

export default async function handle(req, res) {
  db.connect();
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const token = req.body.token;
      let answeredQuesCount //= await api_functions.getUserStatus(username, token);
      db.query(`SELECT * FROM User WHERE username='${username}'`, async (err, result) => {
        if (err) {
          answeredQuesCount = 'error'
        } else {
          answeredQuesCount = parseInt(result[0].status)
        }
      })

      api_functions.validateUserWithToken(token, username).then(async (val_status) => {
        if (val_status) {
          db.query("SELECT  * FROM Question", (err, result) => {
            if (err) {
              res.status(500).json({ answeredQuesCount: answeredQuesCount, error: err, status: false });
            }
            else {
              res.status(200).json({ answeredQuesCount: answeredQuesCount, total_questions_count: result.length, questions: result.filter((res) => res.id <= answeredQuesCount + 1), status: true });
            }
          });

        } else {
          res.status(401).json({ message: 'Validation failed. Please login again', status: false });
        }
      }).catch((err) => {
        res.status(401).json({ message: 'Validation error', error: err, status: false });
      });




      break;
    default:
      break;
  }
  db.end();


}

