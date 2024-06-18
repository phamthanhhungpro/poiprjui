export function objectToQueryString(obj: any): string {
    const keyValuePairs = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    return keyValuePairs.join('&');
}