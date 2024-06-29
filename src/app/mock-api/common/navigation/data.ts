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
                id: 'function',
                title: 'Chức năng',
                type: 'basic',
                icon: 'mat_solid:functions',
                link: '/function',
                hidden(item) {
                    // always hide this item if role is not SSA, OWNER
                    if (localStorage.getItem('role') !== Constants.ROLE_SSA && localStorage.getItem('role') !== Constants.ROLE_OWNER) {
                        return true;
                    }
                    return false;
                },
            },
            {
                id: 'function',
                title: 'Nhóm chức năng',
                type: 'basic',
                icon: 'mat_solid:functions',
                link: '/nhom-chuc-nang',
                hidden(item) {
                    // always hide this item if role is not SSA OWNER
                    if (localStorage.getItem('role') !== Constants.ROLE_SSA && localStorage.getItem('role') !== Constants.ROLE_OWNER) {
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
        link: 'https://poihrmui.vercel.app/',
        externalLink: true,
        target: "_blank"
    },
    {
        id: 'prj',
        title: 'Hệ thống thông tin công việc',
        type: 'basic',
        icon: 'mat_outline:task',
        link: 'https://poiprjui.vercel.app/',
        externalLink: true,
        target: "_blank"
    },
    {
        id: 'checkin',
        title: 'Hệ thống thông tin điểm danh',
        type: 'basic',
        icon: 'mat_outline:emoji_people',
        link: 'https://poicheckinui.vercel.app/',
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
