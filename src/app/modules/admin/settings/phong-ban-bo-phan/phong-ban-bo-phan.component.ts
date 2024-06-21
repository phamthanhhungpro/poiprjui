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
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';
import { CreatePhongbanComponent } from './create-phongban/create-phongban.component';
import { EditPhongbanComponent } from './edit-phongban/edit-phongban.component';
import { environment } from 'environments/environment';
import { AddUserToPhongBanComponent } from './add-user-to-phongban/add-user-to-phongban.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-phong-ban-bo-phan',
  standalone: true,
  styles: [
    /* language=SCSS */
    `
        .donvi-grid {
            grid-template-columns: auto 112px;

            @screen sm {
                grid-template-columns:  auto 112px 96px;
            }

            @screen md {
                grid-template-columns: 48px 150px 80px auto 96px;
            }

            @screen lg {
                grid-template-columns: 20px 180px 100px 150px auto 96px;
            }
        }
    `,
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, CreatePhongbanComponent,
    EditPhongbanComponent, AddUserToPhongBanComponent, MatTooltipModule],
  templateUrl: './phong-ban-bo-phan.component.html'
})
export class PhongBanBoPhanComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;
  domain = environment.idApiUrlWithOutEndding;

  public data$;
  selectedData: any;

  drawerComponent: 'new-data' | 'edit-data' | 'add-user';
  configForm: UntypedFormGroup;

  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _phongbanbophanService: PhongBanBoPhanService
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
        this._phongbanbophanService.delete(role.id).subscribe(() => {
          this.getTableData();
        });
      }
    });
  }


  // get data from api
  getTableData() {
    this.data$ = this._phongbanbophanService.getAllNoPaging().pipe(
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

  addMember(model) {
    this.selectedData = model;
    this.drawerComponent = 'add-user';
    this.addDrawer.open();
  }
}
