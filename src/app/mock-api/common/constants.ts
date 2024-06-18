// this file is store all the constants in class base
// you can access the constant using class name
export class Constants {

    static readonly ROLE_SSA = 'SSA';
    static readonly ROLE_OWNER = 'OWNER';
    static readonly ROLE_APPADMIN = 'APPADMIN';
    static readonly ROLE_ADMIN = 'ADMIN';
    static readonly ROLE_MEMBER = 'MEMBER';
}

export enum TrangThai {
    XacNhan = 1,
    ChoGiaiTrinh = 2,
    ChoXacNhan = 3
}

export const TrangThaiLabel = {
    [TrangThai.XacNhan]: 'Xác nhận',
    [TrangThai.ChoGiaiTrinh]: 'Chờ giải trình',
    [TrangThai.ChoXacNhan]: 'Chờ xác nhận'
};

