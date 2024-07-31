import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { ActivatedRoute } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CongViecService } from 'app/services/congviec.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {

  tongQuanDuAn: any = {};
  id: string;
  listHoatDong = {
    items: []
  };
  constructor(private _duanService: DuAnNvChuyenMonService,
    private route: ActivatedRoute,
    private congviecService: CongViecService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTongQuanDuAn();
    this.getHoatDongDuAn();
  }

  getTongQuanDuAn() {
    this._duanService.getTongQuanDuAn({DuanId: this.id}).subscribe(res => {
      this.tongQuanDuAn = res;
    });
  }

  getHoatDongDuAn() {
    this._duanService.getTopHoatDong({DuanId : this.id}).subscribe(res => {
      this.listHoatDong = res;
    });
  }


  changeTabCongviec() {
    
  }
}
