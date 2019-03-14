// /src/services/titleService.js

import Axios from 'axios';

const apiUrl = 'http://localhost:3001/titles';

export function getTitles () {
    return Axios.get(apiUrl);
}

export function getTitle (id) {
    return Axios.get(apiUrl + '/' + id);
}

export function deleteTitle (id) {
    return Axios.delete(apiUrl + '/' + id);
}

export function saveTitle (title) {
    const body = { ...title };
    delete body.id;
    if(title.id) {
        return Axios.put(apiUrl + '/' + title.id, body);
    }
    else {
        return Axios.post(apiUrl, body)
    }
}

export default {
    getTitles,
    getTitle,
    deleteTitle,
    saveTitle
}

