import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet],
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    ngOnInit() {
        window.addEventListener('storage', (event) => {
          if (event.key === 'logout-event') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expireDate');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('tenantId');
            localStorage.removeItem('userId');
          }
        }, false);
      }
}
