import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';
const authUrl = environment.idApiUrl + 'auth';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<any> = new ReplaySubject<any>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: any)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<any>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<any>
    {
        return this._httpClient.get<any>(`${authUrl}/manage/info`).pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
            catchError((error: HttpErrorResponse) => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('expireDate');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('role');
                localStorage.removeItem('tenantId');
                localStorage.removeItem('userId');
                
                this._user.next(null);
                return throwError(error);
            })
        );
    }

    // /**
    //  * Update the user
    //  *
    //  * @param user
    //  */
    // update(user: User): Observable<any>
    // {
    //     return this._httpClient.patch<User>('api/common/user', {user}).pipe(
    //         map((response) =>
    //         {
    //             this._user.next(response);
    //         }),
    //     );
    // }
}
