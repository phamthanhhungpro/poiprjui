/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Constants } from '../constants';
import { isAllowSetPermission } from '../user/roleHelper';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'poi-project',
        title: 'Hệ thống thông tin công việc',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
            {
                id: 'viec-ca-nhan',
                title: 'Việc cá nhân',
                type: 'basic',
                icon: 'mat_outline:manage_accounts',
                link: '/viec-ca-nhan'
            },
            {
                id: 'quan-ly-cong-viec',
                title: 'Quản lý công việc',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/quan-ly-cong-viec'
            },
            {
                id: 'nhiem-vu-chuyen-mon',
                title: 'Nhiệm vụ chuyên môn',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/nhiem-vu-chuyen-mon'
            },
            {
                id: 'du-an',
                title: 'Dự án',
                type: 'basic',
                icon: 'mat_outline:task',
                link: '/du-an'
            }
        ]
    },

    {
        id: 'id',
        title: 'Thành viên',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
            {
                id: 'user',
                title: 'Thành viên',
                type: 'basic',
                icon: 'mat_outline:manage_accounts',
                link: '/user'
            },
        ]
    },
    {
        id: 'permission',
        title: 'Phân quyền người dùng',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
            {
                id: 'function1',
                title: 'API endpoints',
                type: 'basic',
                icon: '',
                link: '/endpoints',
                hidden(item) {
                    // always hide this item if role is not SSA
                    if (localStorage.getItem('role') !== Constants.ROLE_SSA) {
                        return true;
                    }
                    return false;
                },
            },
            {
                id: 'function2',
                title: 'Chức năng',
                type: 'basic',
                icon: '',
                link: '/functions',
                hidden(item) {
                    // always hide this item if role is not SSA
                    if (localStorage.getItem('role') !== Constants.ROLE_SSA) {
                        return true;
                    }
                    return false;
                },
            },
            // {
            //     id: 'function3',
            //     title: 'Nhóm chức năng',
            //     type: 'basic',
            //     icon: '',
            //     link: '/group-functions',
            //     hidden(item) {
            //         // always hide this item if role is not SSA
            //         if (localStorage.getItem('role') !== Constants.ROLE_SSA) {
            //             return true;
            //         }
            //         return false;
            //     },
            // },
            // {
            //     id: 'function4',
            //     title: 'Phạm vi chức năng',
            //     type: 'basic',
            //     icon: '',
            //     link: '/scopes',
            //     hidden(item) {
            //         // always hide this item if role is not SSA
            //         if (localStorage.getItem('role') !== Constants.ROLE_SSA) {
            //             return true;
            //         }
            //         return false;
            //     },
            // },
            {
                id: 'system-role',
                title: 'Vai trò hệ thống',
                type: 'basic',
                icon: 'mat_solid:verified_user',
                link: '/system-role',
                hidden(item) {
                    if (!isAllowSetPermission(localStorage.getItem('role'))) {
                        return true;
                    }
                    return false;
                },
            },
            {
                id: 'assign-permission',
                title: 'Phân quyền chức năng',
                type: 'basic',
                icon: 'mat_solid:verified_user',
                link: '/permission',
                hidden(item) {
                    if (!isAllowSetPermission(localStorage.getItem('role'))) {
                        return true;
                    }
                    return false;
                },
            },
            {
                id: 'user-role',
                title: 'Gán vai trò cho người dùng',
                type: 'basic',
                icon: 'mat_solid:verified_user',
                link: '/user-role',
                hidden(item) {
                    if (!isAllowSetPermission(localStorage.getItem('role'))) {
                        return true;
                    }
                    return false;
                },
            },

        ]
    },
    {
        id: 'cai-dat',
        title: 'Cài đặt',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
            {
                id: 'don-vi',
                title: 'Thông tin Cơ quan - Đơn vị',
                type: 'basic',
                link: '/don-vi',
                icon: 'mat_outline:arrow_forward',
                hidden(item) {
                    return false;
                },
            },
            {
                id: 'chi-nhanh',
                title: 'Chi nhánh/Văn phòng',
                type: 'basic',
                link: '/chi-nhanh',
                icon: 'mat_outline:arrow_forward',
                hidden(item) {
                    return false;
                },
            },
            {
                id: 'phong-ban-bo-phan',
                title: 'Phòng/Ban/Bộ phận',
                type: 'basic',
                icon: 'mat_outline:arrow_forward',
                link: '/phong-ban-bo-phan'
            },
            {
                id: 'to-nhom',
                title: 'Tổ/Nhóm',
                type: 'basic',
                icon: 'mat_outline:arrow_forward',
                link: '/to-nhom'
            },
            {
                id: 'linh-vuc',
                title: 'Lĩnh vực',
                type: 'basic',
                icon: 'mat_outline:arrow_forward',
                link: '/linh-vuc'
            },
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'poi-project',
        title: 'Hệ thống thông tin công việc',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
        ]
    },
    {
        id: 'id',
        title: 'Thành viên',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [
        ]
    },
    {
        id: 'permission',
        title: 'Phân quyền người dùng',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [

        ]
    },
    {
        id: 'cai-dat',
        title: 'Cài đặt',
        type: 'group',
        icon: 'mat_outline:arrow_drop_down',
        children: [

        ]
    }
];

export const firstNavigation: FuseNavigationItem[] = [
    {
        id: 'hrm',
        title: 'Hệ thống thông tin nhân sự',
        type: 'basic',
        icon: 'mat_outline:psychology',
        link: 'http://poi.vn:1124/',
        externalLink: true,
        target: "_blank"
    },
    {
        id: 'prj',
        title: 'Hệ thống thông tin công việc',
        type: 'basic',
        icon: 'mat_outline:task',
        link: 'http://poi.vn:1123/',
        externalLink: true,
        target: "_blank"
    },
    {
        id: 'checkin',
        title: 'Hệ thống thông tin điểm danh',
        type: 'basic',
        icon: 'mat_outline:emoji_people',
        link: 'https://io.poi.vn/',
        externalLink: true,
        target: "_blank"
    }
];

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];