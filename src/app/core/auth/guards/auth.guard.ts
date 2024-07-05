import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) => {
            // If the user is not authenticated...
            if (!authenticated) {
                if (state.url.includes('?accessToken')) {
                    // Extract access token,tenantId, role, userId, expireDate from the URL
                    const params = state.url.split('?')[1];
                    const urlParams = new URLSearchParams(params);
                    const accessToken = urlParams.get('accessToken');
                    const tenantId = urlParams.get('tenantId');
                    const role = urlParams.get('role');
                    const userId = urlParams.get('userId');
                    const expireDate = urlParams.get('expireDate');

                    // store data to local storage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('tenantId', tenantId);
                    localStorage.setItem('role', role);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('expireDate', expireDate);

                    // clear the URL
                    router.navigateByUrl(state.url.split('?')[0]);
                    return of(true);
                } else {
                    // Redirect to the sign-in page in another domain with a redirectUrl param
                    const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${environment.prjFeUrl}${state.url}`;
                    const signinURL = environment.signInUrl;
                    const url = `${signinURL}?${redirectURL}`;
                    window.location.href = url;
                }
            }
            else {
                // Allow the access
                return of(true);
            }
        }),
    );
};
