import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogService } from 'app/common/dialog.service';
import { CongViecService } from 'app/services/congviec.service';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { DuAnSettingService } from 'app/services/duanSetting.service';

@Component({
  selector: 'app-duyet-congviec-de-xuat',
  standalone: true,
  imports: [CommonModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './duyet-congviec-de-xuat.component.html',
})
export class DuyetCongviecDeXuatComponent {
  id: string;
  duAnSetting: any;
  duAn: any;
  congViecGroupData = [];
  congViecGroup = [
  ];
  allSelected = false;

  constructor(
    private route: ActivatedRoute,
    private _duAnService: DuAnNvChuyenMonService,
    private _congviecService: CongViecService,
    private cdf: ChangeDetectorRef,
    private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getThongTinDuAn();
    this.getTableData();
  }

  openCreateItemDialog(): void {

  }

  getTableData(): void {
    this._congviecService.getCongViecGridByTrangThai({ duAnId: this.id, trangThai: 'CHO-DUYET-DE-XUAT' }).subscribe(res => {
      this.congViecGroupData = res;
    });
    this.allSelected = false;

  }

  getThongTinDuAn(): void {
    this._duAnService.get(this.id).subscribe(res => {
      this.duAn = res;
      this.duAnSetting = res.duAnSetting;
    });
  }

  viewDetail(task): void {

  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.congViecGroupData.forEach(group => {
      group.listCongViec.forEach(task => {
        task.selected = this.allSelected;
      });
    });
    this.updateSelectedTasks();
    this.cdf.detectChanges();
  }

  updateSelectedTasks() {
    this.allSelected = this.congViecGroupData.every(group => {
      return group.listCongViec.every(task => task.selected);
    });
    this.cdf.detectChanges();
  }

  duyetDeXuat() {
    const selectedIds: any[] = [];
    this.congViecGroupData.forEach(group => {
      group.listCongViec.forEach(task => {
        if (task.selected) {
          selectedIds.push(task.id);
        }
      });
    });
    if(selectedIds.length === 0) {
      this.openSnackBar('Chưa chọn công việc nào', 'Đóng');
      return;
    };
    
    let data = {
      duanId: this.id,
      congViecIds: selectedIds
    }
    this._congviecService.duyetDeXuat(data).subscribe(res => {
      if (res.isSucceeded === true) {
        this.openSnackBar('Duyệt đề xuất công việc thành công', 'Đóng');
        this.getTableData();
      } else {
        this.openSnackBar(res.message, 'Đóng');
      }
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackbar.open(message, action, { duration: 2000 });
  }
}
