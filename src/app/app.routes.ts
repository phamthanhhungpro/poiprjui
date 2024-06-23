import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { VaiTroComponent } from './modules/admin/settings/vai-tro/vai-tro.component';
import { ViTriCongViecComponent } from './modules/admin/settings/vi-tri-cong-viec/vi-tri-cong-viec.component';
import { LinhVucComponent } from './modules/admin/settings/linh-vuc/linh-vuc.component';
import { ToNhomComponent } from './modules/admin/settings/to-nhom/to-nhom.component';
import { PhongBanBoPhanComponent } from './modules/admin/settings/phong-ban-bo-phan/phong-ban-bo-phan.component';
import { NhiemVuChuyenMonComponent } from './modules/admin/nhiem-vu-chuyen-mon/nhiem-vu-chuyen-mon.component';
import { DuAnComponent } from './modules/admin/du-an/du-an.component';

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

            { path: 'vai-tro', component: VaiTroComponent },
            { path: 'vi-tri-cong-viec', component: ViTriCongViecComponent },

            { path: 'function', loadChildren: () => import('app/modules/admin/function/function.routes') },
            { path: 'permission', loadChildren: () => import('app/modules/admin/permission/permission.routes') },
            { path: 'nhom-chuc-nang', loadChildren: () => import('app/modules/admin/nhom-chuc-nang/nhom-chuc-nang.routes') },
            { path: 'user', loadChildren: () => import('app/modules/admin/user/user.routes') },

            { path: 'viec-ca-nhan', component: VaiTroComponent },
            { path: 'quan-ly-cong-viec', component: VaiTroComponent },
            { path: 'nhiem-vu-chuyen-mon', component: NhiemVuChuyenMonComponent },
            { path: 'du-an', component: DuAnComponent },
            { path: 'to-nhom', component: ToNhomComponent },
            { path: 'linh-vuc', component: LinhVucComponent },
            { path: 'phong-ban-bo-phan', component: PhongBanBoPhanComponent },
        ]
    }
];
