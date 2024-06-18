import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { environment } from 'environments/environment';
import { Subject, takeUntil, map } from 'rxjs';
import { HosonhansuService } from 'app/services/hosonhansu.service';
import { GiaiTrinhChamCongService } from 'app/services/giaitrinhchamcong.service';
import { GiaiTrinhComponent } from '../giai-trinh/giai-trinh.component';

@Component({
  selector: 'app-xacnhanchamcong',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, MatPaginatorModule, GiaiTrinhComponent],
  templateUrl: './xac-nhan-cham-cong.component.html'
})
export class XacNhanChamCongComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: MatDrawer;
  @ViewChild('paginator') paginator: MatPaginator;


  public data$;
  domain = environment.idApiUrlWithOutEndding;
  drawerComponent: 'new-data' | 'edit-data';
  configForm: UntypedFormGroup;
  selectedData: any;
  pageSize = 25; // Initial page size
  pageNumber = 0; // Initial page index
  totalItems = 0; // Total items

  userInfo = {
    role: localStorage.getItem('role'),
    tenantId: localStorage.getItem('tenantId'),
    userId: localStorage.getItem('userId')
  }

  drawerMode: 'side' | 'over';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _hosonhansuService: HosonhansuService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private router: Router,
    private _giaitrinhService: GiaiTrinhChamCongService
  ) {
  }

  ngOnInit(): void {
    this.getData();

    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Xóa hồ sơ',
      message: 'Xóa hồ sơ này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
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

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'over';
        }
        else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  addData() {
    this.drawerComponent = 'new-data';
    this.addDrawer.open();
  }

  closeDrawer() {
    this.addDrawer.close();
  }


  deleteData(user: any) {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._hosonhansuService.delete(user.id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  // get data from api
  getData() {
    var query = {
      userId: this.userInfo.userId,
    };

    this.data$ = this._giaitrinhService.getDanhSachByUserId(query).pipe(
      map((data: any) => {
        const items: any[] = data.map((item, index: number) => ({
          ...item,
          stt: index + 1
        }));
        console.log(items);
        return { items };
      })
    );
  }

  onPageChange(event): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData();
  }

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  gotoThongtinchung(item) {
    this.router.navigate(['/ho-so-nhan-su/thong-tin-chung', item.id]);
  }

  convertDate(isoDate) {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate;
  }

  approve(item) {
    this.drawerComponent = 'new-data';
    this.selectedData = item;
    this.addDrawer.open();
  }

  reject(item) {
    var model = {
      giaiTrinhChamCongId: item.id,
      isXacNhan: false,
    };

    this._giaitrinhService.confirm(model).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.getData();
      } else {
        this.openSnackBar('Thao tác thất bại', 'Đóng');
      }
    });
  }
}
