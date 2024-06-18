import { Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { map } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { VaiTroService } from 'app/services/vaitro.service';
import { CreateThamSoLuongComponent } from './create-thamsoluong/create-thamsoluong.component';
import { ThamSoLuongService } from 'app/services/thamsoluong.service';
import { EditThamSoLuongComponent } from './edit-thamsoluong/edit-thamsoluong.component';


@Component({
  selector: 'app-vai-tro',
  standalone: true,
  styles: [
    /* language=SCSS */
    `
        .thamsoluong-grid {
            grid-template-columns: 100px 100px 96px;

            @screen sm {
                grid-template-columns:  150px auto 96px;
            }

            @screen md {
                grid-template-columns: 150px auto 96px;
            }

            @screen lg {
                grid-template-columns: 20px 300px 150px auto 96px;
            }
        }
    `,
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, CommonModule,
    CreateThamSoLuongComponent, EditThamSoLuongComponent],
  templateUrl: './tham-so-luong.component.html'
})
export class ThamSoLuongComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;

  public data$;
  selectedData: any;

  drawerComponent: 'new-data' | 'edit-data';
  configForm: UntypedFormGroup;

  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _thamsoluongService: ThamSoLuongService
  ) 
  {
  }

  ngOnInit(): void {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Xóa dữ liệu',
      message: 'Xóa dữ liệu này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn',
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel',
        }),
      }),
      dismissible: true,
    });

    this.getTableData();
  }

  addData() {
    this.drawerComponent = 'new-data';
    this.addDrawer.open();
  }

  closeDrawer() {
    this.addDrawer.close();
  }

  editData(role: any) {
    this.selectedData = role;
    this.drawerComponent = 'edit-data';
    this.addDrawer.open();
  }

  delData(role: any) {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._thamsoluongService.delete(role.id).subscribe(() => {
          this.getTableData();
        });
      }
    });
  }


  // get data from api
  getTableData() {
    this.data$ = this._thamsoluongService.getAllNoPaging().pipe(
      map((data: any) => {
        const items: any[] = data.map((item, index: number) => ({
          ...item,
          stt: index + 1
        }));
        return { items };
      })
    );
  }

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }
}
