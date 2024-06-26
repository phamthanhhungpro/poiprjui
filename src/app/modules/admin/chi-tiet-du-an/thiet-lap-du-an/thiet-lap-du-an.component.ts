import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { VaiTroService } from 'app/services/vaitro.service';
import { Subject, takeUntil } from 'rxjs';
import { AssignPermissionComponent } from '../../permission/assign-permission/assign-permission.component';
import { NhomCongViecComponent } from './nhom-cong-viec/nhom-cong-viec.component';
import { LoaiCongViecComponent } from './loai-cong-viec/loai-cong-viec.component';
import { TagsCongViecComponent } from './tags-cong-viec/tags-cong-viec.component';
import { TagsCommentComponent } from './tags-comment/tags-comment.component';
import { CaiDatKhacComponent } from './cai-dat-khac/cai-dat-khac.component';

@Component({
  selector: 'app-thiet-lap-du-an',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgForOf, NgClass, NgSwitch, NgSwitchCase, AsyncPipe,
    NgIf, NhomCongViecComponent, MatTabsModule, LoaiCongViecComponent, TagsCongViecComponent, TagsCommentComponent,
    CaiDatKhacComponent],
  templateUrl: './thiet-lap-du-an.component.html',
})
export class ThietLapDuAnComponent {
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any;
  selectedPanel;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  selectedRole: any;
  code: string;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) {
  }

  ngOnInit(): void {
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
      this.panels = [
        {
          id: '1',
          title: 'Nhóm công việc',
          code: 'nhom-cong-viec'
        },
        {
          id: '2',
          title: 'Loại công việc',
          code: 'loai-cong-viec'
        },
        {
          id: '3',
          title: 'Tags công việc',
          code: 'tags-cong-viec'
        },
        {
          id: '4',
          title: 'Tags trao đổi',
          code: 'tags-trao-doi'
        },
        {
          id: '5',
          title: 'Kanban',
          code: 'kanban'
        },
        {
          id: '6',
          title: 'Cài đặt khác',
          code: 'cai-dat-khac'
        }
      ];

      this.code = this.panels[0].code;
      this.selectedPanel = this.panels[0].id;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  goToPanel(panel): void {
    this.selectedPanel = panel.id;
    this.code = panel.code;
    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
      this.drawer.close();
    }
  }

  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
