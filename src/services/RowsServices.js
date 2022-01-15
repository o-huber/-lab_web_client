import {fetchAPI} from "../ApiClient";

export const getRows = async function getRows(database, table) {
    return await fetchAPI(`/${database}/${table}/rows`);
}
export const addRow = async function addRow(database, table, payload) {

    return await fetchAPI(`/${database}/${table}/rows/`, payload, 'POST');
}
