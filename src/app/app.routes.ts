import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { ProfileComponent } from './modules/admin/profile/profile.component';
import { DantocComponent } from './modules/admin/categories/dantoc/dantoc.component';
import { HosonhansuComponent } from './modules/admin/hosonhansu/hosonhansu.component';
import { ThongtinchungComponent } from './modules/admin/hosonhansu/thongtinchung/thongtinchung.component';
import { VaiTroComponent } from './modules/admin/settings/vai-tro/vai-tro.component';
import { ViTriCongViecComponent } from './modules/admin/settings/vi-tri-cong-viec/vi-tri-cong-viec.component';
import { ThamSoLuongComponent } from './modules/admin/settings/tham-so-luong/tham-so-luong.component';
import { CongThucLuongComponent } from './modules/admin/settings/cong-thuc-luong/cong-thuc-luong.component';
import { ThietLapChamCongComponent } from './modules/admin/settings/thiet-lap-cham-cong/thiet-lap-cham-cong.component';
import { ChamCongDiemDanhComponent } from './modules/admin/chamcong-diemdanh/chamcong-diemdanh.component';
import { XacNhanChamCongComponent } from './modules/admin/chamcong-diemdanh/xac-nhan-cham-cong/xac-nhan-cham-cong.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'admin' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'admin' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'admin', loadChildren: () => import('app/modules/admin/example/example.routes') },
            { path: 'ho-so-nhan-su', component: HosonhansuComponent },
            { path: 'ho-so-nhan-su/thong-tin-chung/:id', component: ThongtinchungComponent },
            { path: 'vai-tro', component: VaiTroComponent },
            { path: 'vi-tri-cong-viec', component: ViTriCongViecComponent },
            { path: 'tham-so-luong', component: ThamSoLuongComponent },
            { path: 'cong-thuc-luong', component: CongThucLuongComponent },
            { path: 'thiet-lap-cham-cong', component: ThietLapChamCongComponent },
            { path: 'cham-cong-diem-danh', component: ChamCongDiemDanhComponent },
            { path: 'xac-nhan-cham-cong', component: XacNhanChamCongComponent },
            { path: 'function', loadChildren: () => import('app/modules/admin/function/function.routes') },
            { path: 'permission', loadChildren: () => import('app/modules/admin/permission/permission.routes') },
            { path: 'nhom-chuc-nang', loadChildren: () => import('app/modules/admin/nhom-chuc-nang/nhom-chuc-nang.routes') },
            { path: 'user', loadChildren: () => import('app/modules/admin/user/user.routes') },
            { path: 'viec-ca-nhan', component: VaiTroComponent },
            { path: 'quan-ly-cong-viec', component: VaiTroComponent },
            { path: 'nhiem-vu-chuyen-mon', component: VaiTroComponent },
            { path: 'du-an', component: VaiTroComponent },
            { path: 'to-nhom', component: VaiTroComponent },

        ]
    }
];
