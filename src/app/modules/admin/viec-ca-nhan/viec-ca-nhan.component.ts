import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, Router, RouterLink } from '@angular/router';
import { ChoDuyetComponent } from '../chi-tiet-du-an/cho-duyet/cho-duyet.component';
import { CongViecComponent } from '../chi-tiet-du-an/cong-viec/cong-viec.component';
import { KanbanComponent } from '../chi-tiet-du-an/kanban/kanban.component';
import { OverviewComponent } from '../chi-tiet-du-an/overview/overview.component';
import { NhomCongViecComponent } from '../chi-tiet-du-an/thiet-lap-du-an/nhom-cong-viec/nhom-cong-viec.component';
import { ThietLapDuAnComponent } from '../chi-tiet-du-an/thiet-lap-du-an/thiet-lap-du-an.component';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { HoatDongDuAnComponent } from '../chi-tiet-du-an/hoat-dong-du-an/hoat-dong-du-an.component';

@Component({
  selector: 'app-viec-ca-nhan',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatTabsModule, NhomCongViecComponent,
    ThietLapDuAnComponent, CongViecComponent, OverviewComponent, KanbanComponent, HoatDongDuAnComponent,
    ChoDuyetComponent
],
  templateUrl: './viec-ca-nhan.component.html',
})
export class ViecCaNhanComponent {
  model: any = {};
  selectedTabIndex = 1;
  constructor(private _duAnNvChuyenMonService: DuAnNvChuyenMonService, private router: Router
  ) { }

  ngOnInit(): void {
    this._duAnNvChuyenMonService.getViecCaNhan().subscribe(res => {
      this.model = res;
      // navigate to url
      this.router.navigate(['/viec-ca-nhan', res.id]);
    });
  }
}
