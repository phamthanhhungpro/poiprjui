import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NhomCongViecComponent } from './thiet-lap-du-an/nhom-cong-viec/nhom-cong-viec.component';
import { ThietLapDuAnComponent } from './thiet-lap-du-an/thiet-lap-du-an.component';
import { CongViecComponent } from './cong-viec/cong-viec.component';
import { OverviewComponent } from './overview/overview.component';
import { KanbanComponent } from './kanban/kanban.component';
import { ChoDuyetComponent } from './cho-duyet/cho-duyet.component';
import { HoatDongDuAnComponent } from './hoat-dong-du-an/hoat-dong-du-an.component';

@Component({
  selector: 'app-chi-tiet-du-an',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatTabsModule, NhomCongViecComponent,
            ThietLapDuAnComponent, CongViecComponent, OverviewComponent, KanbanComponent,
            ChoDuyetComponent, HoatDongDuAnComponent
  ],
  templateUrl: './chi-tiet-du-an.component.html',
})
export class ChiTietDuAnComponent {

  id: string;
  model: any = {};
  selectedTabIndex = 1;
  constructor(private route: ActivatedRoute,
              private _duAnNvChuyenMonService: DuAnNvChuyenMonService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    // Now you can use this.id to fetch the details
    this._duAnNvChuyenMonService.get(this.id).subscribe(res => {
      this.model = res;
    });
  }
}
