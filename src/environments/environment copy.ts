const apiUrl = 'https://api.poi.vn:1118/';
const idFrontEndUrl = 'https://id.poi.vn/';
const prjFrontEndUrl = 'https://prj.poi.vn';

export const environment = {
    production: true,
    signInUrl: idFrontEndUrl + 'sign-in',
    prjFeUrl: prjFrontEndUrl,
    apiUrl: apiUrl,
    idApiUrl: apiUrl + 'id/api/',
    idApiUrlWithOutEndding: apiUrl + 'id',
    hrmApiUrl: apiUrl + 'hrm/api/',
    prjApiUrl: apiUrl + 'prj/api/',
    idFrontEndUrl: idFrontEndUrl,
};
