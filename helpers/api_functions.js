import axios from 'axios';
import bcrypt from 'bcrypt';
import db from '../lib/db';



export default {
    //validate the user

    validateUserWithToken: async (token, username) => {

        const decrypted = bcrypt.compareSync(username, token);
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

    }






}