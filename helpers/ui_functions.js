export default {
    msToMin: (ms) => {
        let min = Math.floor(ms / 60000);
        let sec = Math.floor((ms - min * 60000) / 1000);
        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        // return `${min}:${sec}`;

    },
    minToMs: (min) => {
        return min * 60000;
    },
    decimalToMin: (decimal) => {
        // 1.5 => 1:30
        let min = Math.floor(decimal);
        let sec = Math.floor((decimal - min) * 60);
        return `${min}:${sec}`;

    },
    //check a string include arabic or not
    isArabic: (str) => {
        return /[\u0600-\u06FF]/.test(str);
    },

    clearLocalStorageByPrefix: (prefix) => {
        Object.keys(localStorage).forEach(function (key) {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
        console.log('cleared local storage by prefix: ' + prefix);
    },
    dateTimeTo12hTime: (datetime) => {
        let date = new Date(datetime);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },

}