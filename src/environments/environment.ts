const apiUrl = 'http://poi.vn:1118/';
const idFrontEndUrl = 'http://poi.vn:1122/';
const prjFrontEndUrl = 'http://poi.vn:1123';

export const environment = {
    production: true,
    signInUrl: idFrontEndUrl + 'sign-in',
    prjFeUrl: prjFrontEndUrl,
    apiUrl: apiUrl,
    idApiUrl: apiUrl + 'id/api/',
    idApiUrlWithOutEndding: apiUrl + 'id/',
    hrmApiUrl: apiUrl + 'hrm/api/',
    prjApiUrl: apiUrl + 'prj/api/',
    idFrontEndUrl: idFrontEndUrl,
};
