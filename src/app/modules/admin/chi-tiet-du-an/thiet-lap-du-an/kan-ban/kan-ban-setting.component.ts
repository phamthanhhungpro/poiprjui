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
import { DialogService } from 'app/common/dialog.service';
import { CreateKanbanComponent } from './create-kanban/create-kanban.component';
import { EditKanbanComponent } from './edit-kanban/edit-kanban.component';
import { KanbanService } from 'app/services/kanban.service';
import { DuAnSettingService } from 'app/services/duanSetting.service';


@Component({
  selector: 'app-kan-ban-setting',
  standalone: true,
  styles: [
    /* language=SCSS */
    `
        .vitri-grid {
            grid-template-columns: 100px 100px  96px;

            @screen sm {
                grid-template-columns:  250px 150px 96px;
            }

            @screen md {
                grid-template-columns: 250px 150px 96px;
            }

            @screen lg {
                grid-template-columns: 20px 250px 150px auto 200px 80px;
            }
        }
    `,
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, CommonModule],
  templateUrl: './kan-ban-setting.component.html'
})
export class KanbanSettingComponent {
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
    private _KanbanService: KanbanService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
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
    this.dialogService.openDialog(CreateKanbanComponent,
       { id: this.id },
       { width: '600px', height: 'auto'},
       this.getTableData.bind(this)
      )
      .subscribe(result => {

      });
  }

  openEditItemDialog(data): void {
    console.log(data);
    this.dialogService.openDialog(EditKanbanComponent,
       data,
       { width: '600px', height: 'auto'},
       this.getTableData.bind(this)
      )
      .subscribe(result => {
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
        this._KanbanService.delete(role.id).subscribe(() => {
          this.getTableData();
        });
      }
    });
  }


  // get data from api
  getTableData() {
    this.data$ = this._KanbanService.getNoPagingByDuAn({DuanId: this.id}).pipe(
      map((data: any) => {
        const items: any[] = data.map((item, index: number) => ({
          ...item,
          stt: index + 1,
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

  findValueByKey(key: string, src: any): any {
    return src.find(x => x.key === key);
  }

}
