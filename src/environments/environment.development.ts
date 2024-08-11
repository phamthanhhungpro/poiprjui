const apiUrl = 'https://localhost:7124/';
const idFrontEndUrl = 'http://localhost:4200/';
const prjFrontEndUrl = 'http://localhost:4202';

// const apiUrl = 'http://113.160.187.187:1118/';
// const idFrontEndUrl = 'https://poiidui.vercel.app/';


export const environment = {
    production: false,
    signInUrl: idFrontEndUrl + 'sign-in',
    prjFeUrl: prjFrontEndUrl,
    apiUrl: apiUrl,
    idApiUrl: apiUrl + 'id/api/',
    idApiUrlWithOutEndding: apiUrl + 'id/',
    hrmApiUrl: apiUrl + 'hrm/api/',
    prjApiUrl: apiUrl + 'prj/api/',
    idFrontEndUrl: idFrontEndUrl,
};
