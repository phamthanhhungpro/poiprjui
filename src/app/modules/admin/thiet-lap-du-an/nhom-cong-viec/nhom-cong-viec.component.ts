import { Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { map } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ViTriCongViecService } from 'app/services/vitricongviec.service';
import { NhomCongViecService } from 'app/services/nhomcongviec.service';
import { CreateNhomCongViecComponent } from './create-nhomcongviec/create-nhomcongviec.component';
import { DialogService } from 'app/common/dialog.service';
import { EditNhomCongViecComponent } from './edit-nhomcongviec/edit-nhomcongviec.component';


@Component({
  selector: 'app-nhom-cong-viec',
  standalone: true,
  styles: [
    /* language=SCSS */
    `
        .vitri-grid {
            grid-template-columns: 200px 96px;

            @screen sm {
                grid-template-columns:  250px 96px;
            }

            @screen md {
                grid-template-columns: 250px 96px;
            }

            @screen lg {
                grid-template-columns: 20px 250px auto 120px;
            }
        }
    `,
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, CommonModule,
    CreateNhomCongViecComponent],
  templateUrl: './nhom-cong-viec.component.html'
})
export class NhomCongViecComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;
  id: string;
  public data$;
  selectedData: any;

  drawerComponent: 'new-data' | 'edit-data';
  configForm: UntypedFormGroup;

  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _nhomCongViecService: NhomCongViecService,
    private route: ActivatedRoute,
    private dialogService: DialogService
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
    this.id = this.route.snapshot.paramMap.get('id');

    this.getTableData();
    
  }

  openCreateItemDialog(): void {
    this.dialogService.openDialog(CreateNhomCongViecComponent,
       { id: this.id },
       { width: '600px', height: 'auto'},
       this.getTableData.bind(this)
      )
      .subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
      });
  }

  openEditItemDialog(data): void {
    this.dialogService.openDialog(EditNhomCongViecComponent,
       data,
       { width: '600px', height: 'auto'},
       this.getTableData.bind(this)
      )
      .subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
      });
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

  }

  delData(role: any) {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._nhomCongViecService.delete(role.id).subscribe(() => {
          this.getTableData();
        });
      }
    });
  }


  // get data from api
  getTableData() {
    this.data$ = this._nhomCongViecService.getNoPagingByDuAn({DuanId: this.id}).pipe(
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
