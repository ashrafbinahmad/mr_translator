import db from '../../../lib/db';
import api_functions from '../../../helpers/api_functions';
import data_questions from '../../../helpers/data_questions.json'

export default async function handle(req, res) {
  




  
  
  switch (req.method) {
    case 'GET':
    case 'POST':
      const username = req.body.username;
      const token = req.body.token;
      let answeredQuesCount 
      
      api_functions.validateUserWithToken(token, username).then(async (val_status) => {
        if (val_status) {
          db.query(`SELECT * FROM User WHERE username='${username}'`, async (err, result) => {
            if (err) {
              answeredQuesCount = 'error'
            } else {
              answeredQuesCount = parseInt(result[0].status)
              
              
               return await res.status(200).json({ answeredQuesCount, total_questions_count: data_questions.length, questions: [data_questions[answeredQuesCount]], user: result[0] ,status: true });
              
            }
          })
        } else {
          return res.status(401).json({ message: 'Validation failed. Please login again', status: false });
        }
      }).catch((err) => {
        
      });




      break;
    default:
      break;
  }
  


}

