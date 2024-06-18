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
import { AddFunctionComponent } from './add-function/add-function.component';
import { EditFunctionComponent } from './edit-function/edit-function.component';
import { FunctionService } from 'app/services/function.service';
import { ChucNangService } from 'app/services/chucnang.service';

@Component({
  selector: 'app-function',
  standalone: true,
  templateUrl: './function.component.html',
  styles: [
    /* language=SCSS */
    `
        .func-grid {
            grid-template-columns: 200px auto 40px;

            @screen sm {
                grid-template-columns: 200px auto 112px;
            }

            @screen md {
                grid-template-columns: 200px auto 112px;
            }

            @screen lg {
                grid-template-columns: 48px 250px 200px auto 96px;
            }
        }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, AddFunctionComponent,
    EditFunctionComponent, MatPaginatorModule],
})
export class FunctionComponent {

  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;
  @ViewChild('paginator') paginator: MatPaginator;
  
  funcs$;
  drawerComponent: 'new-function' | 'edit-function';
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
              private _funcService: ChucNangService
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
            this._funcService.delete(func.id).subscribe(() => {
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
    this.funcs$ = this._funcService.getAll(query).pipe(
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
  }
}
