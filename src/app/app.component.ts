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
      console.log('app component init');
      }
}
