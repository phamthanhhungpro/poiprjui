export function isSsaRole(role) {
    return role === 'SSA';
}

export function isOWnerRole(role) {
    return role === 'OWNER';
}

export function isAdminRole(role) {
    return role === 'ADMIN';
}

export function isAppAdminRole(role) {
    return role === 'APPADMIN';
}
export function isMemberRole(role) {
    return role === 'MEMMBER';
}

export function isAllowCRUD(role) {
    return isSsaRole(role) || isOWnerRole(role) || isAdminRole(role) || isAppAdminRole(role);
}

export function isAllowSetPermission(role) {
    return isSsaRole(role) || isOWnerRole(role) || isAppAdminRole(role);
}