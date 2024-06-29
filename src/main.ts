import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';

window.addEventListener('message', (event) => {
    console.log('message', event);
  
    if (event.data.type === 'LOGOUT') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expireDate');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('userId');
    }
  });

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));
