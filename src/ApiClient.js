import API_BASE_URL from "./constants/api";

export async function fetchAPI(url, payload, method = 'GET', isJSON = true, isBlob = false) {

    const headers = isJSON ? {
        'Content-Type': 'application/json',
    } : {};

    let init = method === 'GET' ?
        {method: method, headers: headers} :
        {method: method, headers: headers, body: isJSON ? JSON.stringify(payload) : payload};

    let response = await fetch(API_BASE_URL + url, init);

    return !isBlob ? await response?.json() : await response?.blob();
}
