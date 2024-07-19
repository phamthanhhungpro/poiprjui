import { Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { AddNhomChucNangComponent } from '../../nhom-chuc-nang/add-nhom-chuc-nang/add-nhomchucnang.component';
import { EditNhomChucNangComponent } from '../../nhom-chuc-nang/edit-nhom-chuc-nang/edit-nhomchucnang.component';
import { AddQuanLyChucNangComponent } from '../../nhom-chuc-nang/quan-ly-chuc-nang/add-quanlychucnang.component';
import { map } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NhomChucNangService } from 'app/services/nhomchucnang.service';
import { PerFunctiontService } from 'app/services/app-permission/chucnang.service';
import { AddChucNangComponent } from './add-chuc-nang/add-chucnang.component';
import { EditChucNangComponent } from './edit-chuc-nang/edit-chucnang.component';
import { QuanLyChucNangComponent } from './quan-ly-chuc-nang/add-quanlychucnang.component';
import { QuanLyPhamViComponent } from './quan-ly-pham-vi/quan-ly-pham-vi.component';

@Component({
  selector: 'app-chuc-nang',
  standalone: true,
  styles: [
    /* language=SCSS */
    `
        .func-grid {
            grid-template-columns: 80px auto 80px;

            @screen sm {
                grid-template-columns: 200px auto 96px;
            }

            @screen md {
                grid-template-columns: 200px auto 96px;
            }

            @screen lg {
                grid-template-columns: 48px 200px auto 96px;
            }
        }
    `,
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, AddNhomChucNangComponent,
    EditNhomChucNangComponent, MatPaginatorModule, AddQuanLyChucNangComponent,
    AddChucNangComponent, EditChucNangComponent, QuanLyChucNangComponent, QuanLyPhamViComponent],
  templateUrl: './chuc-nang.component.html',
})
export class ChucNangComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;
  @ViewChild('paginator') paginator: MatPaginator;
  
  funcs$;
  drawerComponent: 'new-function' | 'edit-function' | 'quanlychucnang' | 'scope';
  configForm: UntypedFormGroup;
  selectedData: any;
  pageSize = 10; // Initial page size
  pageNumber = 0; // Initial page index
  totalItems = 0; // Total items
  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
              private _formBuilder: UntypedFormBuilder,
              private _perFunctionService: PerFunctiontService
  )
  {
  }

  ngOnInit(): void
  {
      // Build the config form
      this.configForm = this._formBuilder.group({
          title      : 'Xóa chức năng',
          message    : 'Xóa chức năng này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
          icon       : this._formBuilder.group({
              show : true,
              name : 'heroicons_outline:exclamation-triangle',
              color: 'warn',
          }),
          actions    : this._formBuilder.group({
              confirm: this._formBuilder.group({
                  show : true,
                  label: 'Remove',
                  color: 'warn',
              }),
              cancel : this._formBuilder.group({
                  show : true,
                  label: 'Cancel',
              }),
          }),
          dismissible: true,
      });

      this.getfuncs();
  }

  addfunc() {
    this.drawerComponent = 'new-function';
    this.addDrawer.open();
  }

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }

  editfunc(func: any) {
    console.log(func);
    this.drawerComponent = 'edit-function';
    this.addDrawer.open();
    this.selectedData = func;
  }

  deletefunc(func): void 
  {
      // Open the dialog and save the reference of it
      const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) =>
      {
          console.log(result);
          if(result === 'confirmed') {
            this._perFunctionService.delete(func.id).subscribe(() => {
              this.getfuncs();
            });
          }
      });
  }

  // get data from api
  getfuncs() {
    const query = {
      pageNumber: this.pageNumber + 1,
      pageSize: this.pageSize
    };
    this.funcs$ = this._perFunctionService.getAll(query).pipe(
      map((list: any) => {
          const items: any[] = list.items.map((item, index: number) => ({
              ...item,
              stt: index + 1
          }));
          this.totalItems = list.count;
          return { items };
      })
    );
  }

  onPageChange(event): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getfuncs();
  };

  addChucnang(item): void {
    this.drawerComponent = 'quanlychucnang';
    this.addDrawer.open();
    this.selectedData = item;
  }

  addScope(item): void {
    this.drawerComponent = 'scope';
    this.addDrawer.open();
    this.selectedData = item;
  }
}
