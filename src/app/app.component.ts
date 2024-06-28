import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from 'environments/environment';

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
      window.addEventListener('message', (event) => {
        if (event.origin !== environment.idFrontEndUrl) {
          return;
        }
      
        if (event.data.type === 'LOGOUT') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('expireDate');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('role');
          localStorage.removeItem('tenantId');
          localStorage.removeItem('userId');
        }
      });
      }
}
