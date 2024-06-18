import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { map } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NhomChucNangService } from 'app/services/nhomchucnang.service';
import { AddNhomChucNangComponent } from './add-nhom-chuc-nang/add-nhomchucnang.component';
import { EditNhomChucNangComponent } from './edit-nhom-chuc-nang/edit-nhomchucnang.component';
import { AddQuanLyChucNangComponent } from './quan-ly-chuc-nang/add-quanlychucnang.component';

@Component({
  selector: 'app-nhomchucnang',
  standalone: true,
  templateUrl: './nhom-chuc-nang.component.html',
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
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, AddNhomChucNangComponent,
    EditNhomChucNangComponent, MatPaginatorModule, AddQuanLyChucNangComponent],
})
export class NhomChucNangComponent {

  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;
  @ViewChild('paginator') paginator: MatPaginator;
  
  funcs$;
  drawerComponent: 'new-function' | 'edit-function' | 'quanlychucnang';
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
              private _nhomchucnangService: NhomChucNangService
  )
  {
  }

  ngOnInit(): void
  {
      // Build the config form
      this.configForm = this._formBuilder.group({
          title      : 'Xóa nhóm chức năng',
          message    : 'Xóa nhóm chức năng này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
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
            this._nhomchucnangService.delete(func.id).subscribe(() => {
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
    this.funcs$ = this._nhomchucnangService.getAll(query).pipe(
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
}
