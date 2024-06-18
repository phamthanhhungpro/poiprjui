import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, NgClass, NgFor, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { UserApiService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { RoleService } from 'app/services/role.service';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgForOf, NgClass, NgSwitch, NgSwitchCase, AsyncPipe,
    NgIf, MatTabsModule, ProfileInfoComponent, ChangePasswordComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  userInfo = {
    role: localStorage.getItem('role'),
    tenantId: localStorage.getItem('tenantId'),
    userId: localStorage.getItem('userId')
  };
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any;
  selectedPanel;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  currentUser: any;
  /**
   *
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _userService: UserApiService) {

  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.getCurrentUser();
    this.panels = [
      {
        id: 'account',
        icon: 'heroicons_outline:user-circle',
        name: 'Thông tin cá nhân',
        description: 'Xem và thay đổi thông tin cá nhân của bạn',
      },
      {
        id: 'security',
        icon: 'heroicons_outline:lock-closed',
        name: 'Bảo mật',
        description: 'Thay đổi mật khẩu',
      },
    ];
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        }
        else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Navigate to the panel
   *
   * @param panel
   */
  goToPanel(panel): void {
    this.selectedPanel = panel.id;
    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getCurrentUser() {
    this._userService.get(this.userInfo.userId).subscribe(res => {
      this.currentUser = res;
    })
  }
}
