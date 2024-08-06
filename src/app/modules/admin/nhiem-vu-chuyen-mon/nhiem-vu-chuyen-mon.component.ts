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
import { CreateLinhVucComponent } from '../settings/linh-vuc/create-linhvuc/create-linhvuc.component';
import { EditLinhVucComponent } from '../settings/linh-vuc/edit-linhvuc/edit-linhvuc.component';
import { map } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { AddNhiemvuchuyenmonComponent } from './add-nhiemvuchuyenmon/add-nhiemvuchuyenmon.component';
import { EditNhiemvuchuyenmonComponent } from './edit-nhiemvuchuyenmon/edit-nhiemvuchuyenmon.component';

@Component({
  selector: 'app-nhiem-vu-chuyen-mon',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, AddNhiemvuchuyenmonComponent,
    EditNhiemvuchuyenmonComponent, CommonModule],
  templateUrl: './nhiem-vu-chuyen-mon.component.html',
})
export class NhiemVuChuyenMonComponent {
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
    private _duAnNvChuyenMonService: DuAnNvChuyenMonService
  ) {
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
        this._duAnNvChuyenMonService.delete(role.id).subscribe(() => {
          this.getTableData();
        });
      }
    });
  }


  // get data from api
  getTableData() {
    console.log('getTableData');
    this.data$ = this._duAnNvChuyenMonService.getAllNvChuyenMon().pipe(
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

  openDuan(item) {
    let data = {
      duAnId: item.id,
      isClosed: false
    }

    this._duAnNvChuyenMonService.openCloseDuAn(data).subscribe(() => {
      this.getTableData();
    });
  }

  closeDuan(item) {
    let data = {
      duAnId: item.id,
      isClosed: true
    }

    this._duAnNvChuyenMonService.openCloseDuAn(data).subscribe(() => {
      this.getTableData();
    });
  }
}
