import { I18nPluralPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
    selector     : 'auth-sign-out',
    templateUrl  : './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [NgIf, RouterLink, I18nPluralPipe],
})
export class AuthSignOutComponent implements OnInit, OnDestroy
{
    countdown: number = 5;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds',
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    signInHrl = environment.idFrontEndUrl + 'sign-out';
    signInUrlWithRedirect = `${this.signInHrl}?redirectURL=${environment.prjFeUrl}`;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Sign out
        this._authService.signOut();
        window.location.href = environment.idFrontEndUrl + 'sign-out';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
