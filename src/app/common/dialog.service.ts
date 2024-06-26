// dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(component: any, data?: any, config?: any, callback?: Function): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      data: data,
      ...config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'expand' && result !== 'collapse') {
        if (callback) {
          callback(result);
        }
      }

    });

    return dialogRef.afterClosed();
  }
}
