import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UserApiService } from 'app/services/user.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { isAllowCRUD, isOWnerRole, isSsaRole } from 'app/mock-api/common/user/roleHelper'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditUserRoleComponent } from './edit-user-role/edit-user-role.component';
import { Constants } from 'app/mock-api/common/constants';

@Component({
  selector: 'app-user-vai-tro',
  standalone: true,
  templateUrl: './user-vai-tro.component.html',
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, MatPaginatorModule, MatTooltipModule,
    EditUserRoleComponent],
})
export class UserVaiTroComponent {

  @ViewChild('addDrawer', { static: false }) addDrawer: MatDrawer;
  @ViewChild('paginator') paginator: MatPaginator;


  public users$;
  domain = environment.idApiUrlWithOutEndding;
  drawerComponent: 'new-user' | 'edit-user' | 'add-manager' | 'reset-pwd';
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
    private _userService: UserApiService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,

  ) {
  }

  ngOnInit(): void {
    this.getUsers();

    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Xóa thành viên',
      message: 'Xóa thành viên này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
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

  addUser() {
    this.drawerComponent = 'new-user';
    this.addDrawer.open();
  }

  closeDrawer() {
    this.addDrawer.close();
  }

  editUser(user: any) {
    this.drawerComponent = 'edit-user';
    this.selectedData = user;

    this.addDrawer.open();
  }

  deleteUser(user: any) {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._userService.delete(user.id).subscribe(() => {
          this.getUsers();
        });
      }
    });
  }

  inActive(user) {
    var isActive = !user.isActive;
    this._userService.update(user.id, { isActive: isActive }).subscribe(
      (res) => {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.getUsers();
      },
      (error) => {
        // Handle error if observable emits an error
        console.error('Error:', error);
        // You can also display an error message to the user if needed
        this.openSnackBar('Có lỗi xảy ra khi thực hiện thao tác', 'Đóng');
      }
    );
  }

  addManager(user) {
    this.drawerComponent = 'add-manager';
    this.selectedData = user;

    this.addDrawer.open();
  }
  // get data from api
  getUsers() {
    const query = {
      pageNumber: this.pageNumber + 1,
      pageSize: this.pageSize
    };
    this.users$ = this._userService.getListUser(query).pipe(
      map((data: any) => {
        const users: any[] = data.items.map((user, index: number) => ({
          ...user,
          stt: index + 1,
          perRole: user.perRoles?.find(role => role.appCode === Constants.APP_CODE)?.name,
          perRoleId: user.perRoles?.find(role => role.appCode === Constants.APP_CODE)?.id,
        }));
        this.totalItems = data.count;
        return { users };
      })
    );
  }

  onPageChange(event): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    console.log(isOpened);
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }

  isAllowCRUD() {
    return isAllowCRUD(this.userInfo.role);
  }

  isAllowSetRole() {
    return isOWnerRole(this.userInfo.role) || isSsaRole(this.userInfo.role);
  }
  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  goToPoiId() {
    window.open(environment.idFrontEndUrl + 'user', '_blank');
  }

  changeRole(user) {
    this.drawerComponent = 'edit-user';
    this.selectedData = user;

    this.addDrawer.open();
  }
}
