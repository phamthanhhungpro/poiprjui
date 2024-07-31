import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { items } from 'app/mock-api/apps/file-manager/data';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'app/common/dialog.service';
import { EditCongviecComponent } from '../cong-viec/detail-congviec/edit-congviec.component';
import { CongViecService } from 'app/services/congviec.service';

@Component({
  selector: 'app-hoat-dong-du-an',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoat-dong-du-an.component.html',
})
export class HoatDongDuAnComponent {
  listHoatDong = {
    items: []
  };

  id: string;
  duAn: any;
  constructor(private _duanService: DuAnNvChuyenMonService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private congviecService: CongViecService
  ) { }

  ngOnInit() {
    // this.getCongViecById();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getThongTinDuAn();
    this.getHoatDongDuAn();
  }

  getThongTinDuAn(): void {
    this._duanService.get(this.id).subscribe(res => {
      this.duAn = res;
    });
  }

  getHoatDongDuAn() {
    this._duanService.getHoatDongDuan({DuanId : this.id}).subscribe(res => {
      this.listHoatDong = res;
    });
  }

  
  convertUserNameToFullName(userName) {
    let user = this.duAn.thanhVienDuAn.find(x => x.userName == userName);
    return user?.fullName;
  };

  highlightUsernames(noiDung: string): string {
    const usernameRegex = /@(\S+)/g;
    return noiDung.replace(usernameRegex, (match, username) => {
      const fullName = this.convertUserNameToFullName(username);
      return `<span class="text-blue-500 break-all" title="${fullName}">${match}</span>`;
    });
  }

  openChiTietCongViec(item) {
    this.congviecService.get(item.idCongViec).subscribe(res => {
      this.dialogService.openDialog(EditCongviecComponent,
        res,
        { width: '1200px', height: 'auto' },
        this.getHoatDongDuAn.bind(this)
      ).subscribe(result => {});
    });

  }

}
