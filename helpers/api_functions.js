import bcrypt from 'bcrypt';
import db from '../lib/db';
import ui_functions from './ui_functions';
import data_questions from './data_questions.json';



export default {


    validateUserWithToken: async (token, username) => {

        const decrypted = bcrypt.compare(username, token);
        if (decrypted) {
            return true;
        } else {
            return false;
        }

    },

    getUserStatus: async (username, token) => {


        db.query(`SELECT * FROM User WHERE username='${username}'`, (err, result) => {
            if (err) {
                return err;
            } else {
                return result[0].status;
            }
        });

    },
    generatePdf: (result, show_questions) => {

        const questions = data_questions;

        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument;
        doc.pipe(fs.createWriteStream('output.pdf'));

        doc.font('public/fonts/Amiri Regular.ttf');

        let currentUser = '';
        result.map((answer, index) => {
            if (currentUser != answer.username) {
                index != 0 && doc.addPage();
                doc.fontSize(20).text(answer.username,
                    {
                        align: 'center',
                        underline: true,
                        lineGap: 10,
                        bold: true
                    }
                );
            }
            currentUser = answer.username;
            doc.fontSize(10);
            const currentQuest = questions.find(q => q.id == answer.questId).question;
            const isQuestArabic = ui_functions.isArabic(currentQuest);
            doc.text(`QUESTION ${answer.questId}`)
            if (show_questions) {
                doc.text(`${answer.questId} ${currentQuest}`,
                    {
                        features: [isQuestArabic ? 'rtla' : 'ltra'],
                        align: isQuestArabic ? 'right' : 'left'
                    }
                )
            }
            doc.fontSize(14);
            const isArabic = ui_functions.isArabic(answer.answer);



            doc.text(answer.answer,
                {
                    features: [isArabic ? 'rtla' : 'ltra'],
                    align: isArabic ? 'right' : 'left'
                }
            );

            doc.lineWidth(1);
            doc.lineTo(doc.x, doc.page.width)
            doc.stroke();


            doc.moveDown(1);
            doc.moveDown(1);
            doc.moveDown(1);

        });
        doc.end();
        return doc;
    }






}