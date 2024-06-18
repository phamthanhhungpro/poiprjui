import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const snackbar = inject(MatSnackBar);
    const router = inject(Router);


    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken)
                .set('TenantId', localStorage.getItem('tenantId'))
                .set('UserId', localStorage.getItem('userId'))
                .set('role', localStorage.getItem('role')),
        });
    }

    if (authService.accessToken && AuthUtils.isTokenExpired(authService.accessToken)) {
        authService.signOut();

        const currentRoute = router.url;
        if (!currentRoute.includes('sign-in')) {
            // Reload the app
            location.reload();
        }

        return;
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                authService.signOut();

                const currentRoute = router.url;
                if (!currentRoute.includes('sign-in')) {
                    // Reload the app
                    location.reload();
                }
            }

            // Catch "403" responses
            if (error instanceof HttpErrorResponse && error.status === 403) {
                // Sign out
                snackbar.open("Bạn không có quyền thực hiện hành động này!", "Đóng", { duration: 2000 });
            }

            return throwError(error);
        }),
    );

};

// openSnackBar(message: string, action: string) {
//     this._snackBar.open(message, action, {duration: 2000});
//   }