import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { UserApiService } from 'app/services/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { user as userData } from 'app/mock-api/common/user/data';
import { cloneDeep } from 'lodash-es';

const authUrl = environment.idApiUrl + 'auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _userApiService = inject(UserApiService)

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    setExpireDate(expiresIn: number) {
        const currentDate = new Date();
        const expireDate = new Date(currentDate.getTime() + expiresIn * 1000); // Convert seconds to milliseconds
        localStorage.setItem('expireDate', expireDate.toISOString());
    }

    getExpireDate(): any | null {
        return localStorage.getItem('expireDate') ?? '';
    }

    /**
     * Setter & getter for refresh token
     */
    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { userName: string; password: string }): Observable<any> {
        // Throw error if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
    
        return this._httpClient.post(`${authUrl}/login`, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
    
                // Prepare the headers with the access token
                const headers = new HttpHeaders({
                    'Authorization': `Bearer ${response.accessToken}`
                });
                
                // Make a GET request to the /manage/info endpoint with the access token in the headers
                return this._httpClient.get(`${authUrl}/manage/info`, { headers: headers }).pipe(
                    switchMap((userInfo: any) => {
                        // Store the user on the user service
                        this._userService.user = userInfo;
    
                        this.accessToken = response.accessToken;
                        this.setExpireDate(response.expiresIn);
                        this.refreshToken = response.refreshToken;
                        // Set the authenticated flag to true
                        this._authenticated = true;
                        // Return a new observable with the response

                        // set tenantId and role and userId to local storage
                        localStorage.setItem('tenantId', userInfo.tenantId);
                        localStorage.setItem('role', userInfo.role);
                        localStorage.setItem('userId', userInfo.id);

                        return of(userInfo);
                    })
                );
            })
        );
    }

    /**
     * Sign in using the access token
     */
    // signInUsingToken(): Observable<any>
    // {
    //     // Sign in using the token
    //     return this._httpClient.post('api/auth/sign-in-with-token', {
    //         accessToken: this.accessToken,
    //     }).pipe(
    //         catchError(() =>

    //             // Return false
    //             of(false),
    //         ),
    //         switchMap((response: any) =>
    //         {
    //             // Replace the access token with the new one if it's available on
    //             // the response object.
    //             //
    //             // This is an added optional step for better security. Once you sign
    //             // in using the token, you should generate a new one on the server
    //             // side and attach it to the response object. Then the following
    //             // piece of code can replace the token with the refreshed one.
    //             if ( response.accessToken )
    //             {
    //                 this.accessToken = response.accessToken;
    //             }

    //             // Set the authenticated flag to true
    //             this._authenticated = true;

    //             // Store the user on the user service
    //             this._userService.user = response.user;

    //             // Return true
    //             return of(true);
    //         }),
    //     );
    // }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('userId');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        const expireDate = this.getExpireDate();
        if (expireDate) {
            const currentDate = new Date();
            const expireDateObj = new Date(expireDate);
            if (currentDate < expireDateObj) {
                return of(true);
            }
        }
        return of(false);
    }
}
