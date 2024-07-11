import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { CaiDatKhacComponent } from '../thiet-lap-du-an/cai-dat-khac/cai-dat-khac.component';
import { KanbanSettingComponent } from '../thiet-lap-du-an/kan-ban/kan-ban-setting.component';
import { LoaiCongViecComponent } from '../thiet-lap-du-an/loai-cong-viec/loai-cong-viec.component';
import { NhomCongViecComponent } from '../thiet-lap-du-an/nhom-cong-viec/nhom-cong-viec.component';
import { TagsCommentComponent } from '../thiet-lap-du-an/tags-comment/tags-comment.component';
import { TagsCongViecComponent } from '../thiet-lap-du-an/tags-cong-viec/tags-cong-viec.component';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { DuyetCongviecDeXuatComponent } from './duyet-congviec-de-xuat/duyet-congviec-de-xuat.component';
import { DuyetCongviecHoanthanhComponent } from './duyet-congviec-hoanthanh/duyet-congviec-hoanthanh.component';
import { DuyetGiaHanComponent } from './duyet-gia-han/duyet-gia-han.component';

@Component({
  selector: 'app-cho-duyet',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgForOf, NgClass, NgSwitch, NgSwitchCase, AsyncPipe,
    NgIf, NhomCongViecComponent, MatTabsModule,DuyetCongviecDeXuatComponent, DuyetCongviecHoanthanhComponent, DuyetGiaHanComponent],
  templateUrl: './cho-duyet.component.html',
  styleUrl: './cho-duyet.component.scss'
})
export class ChoDuyetComponent {
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
          title: 'Công việc đề xuất',
          code: 'cong-viec-de-xuat'
        },
        {
          id: '2',
          title: 'Việc chờ hoàn thành',
          code: 'viec-cho-hoan-thanh'
        },
        {
          id: '3',
          title: 'Duyệt gia hạn',
          code: 'duyet-gia-han'
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
