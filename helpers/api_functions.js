import axios from 'axios';
import bcrypt from 'bcrypt';
import db from '../lib/db';



export default {
    //validate the user
    
    validateUserWithToken: async (token,username) => {

        const decrypted = bcrypt.compareSync(username, token);
        if (decrypted) {
            return true;
        } else {
            return false;
        }
        axios.get('/api/user/validate', {token,username}).then((res) => {
            return res.data.status;
        }).catch((err) => {
            return false;
        });
    }






}