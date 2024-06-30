const apiUrl = 'http://113.160.187.187:1118/';
const idFrontEndUrl = 'https://poiidui.vercel.app/';
const prjFrontEndUrl = 'https://poiprjui.vercel.app';

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
