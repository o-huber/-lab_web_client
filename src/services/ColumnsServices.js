import {fetchAPI} from "../ApiClient";

export const getColumns = async function getColumns(database, table) {
    return await fetchAPI(`/${database}/${table}/columns`);
}
export const renameColumn = async function renameColumn(database, table, columnName, newName) {
    const payload = {
        "newName": newName
    }
    return await fetchAPI(`/${database}/${table}/columns/${columnName}/rename`, payload, 'PATCH');
}
