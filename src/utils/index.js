import axios from 'axios';
import lang from '../utils/lang';

const translate = (text) => {
    return axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate', {
        params: {
            key: 'trnsl.1.1.20190617T152210Z.db4bfda2acb620e4.6a430b08cc256b8f17c9871a1e9a872928ee51ec',
            text: text,
            lang: getLang()
        }
    })
};

const timestampToDateTime = (timestamp) => {
    let dataConvert = new Date(timestamp);

    let minutes = "0" + dataConvert.getMinutes(),
        hours = dataConvert.getHours(),
        date = dataConvert.getDate(),
        month = dataConvert.getMonth(),
        year = dataConvert.getFullYear();

    return `${hours}:${minutes.substr(-2)} ${date}/${month}/${year}`;
};

const setLang = (lang) => {
    window.localStorage.setItem('locale', lang);
};

const getLang = () => {
    let currentLang = window.localStorage.getItem('locale');
    if (!currentLang) setLang(lang['defaultLanguage']);
    return currentLang ? currentLang : lang['defaultLanguage'];
};

export {translate, timestampToDateTime, setLang, getLang}