import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogService } from 'app/common/dialog.service';
import { CongViecService } from 'app/services/congviec.service';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { DuAnSettingService } from 'app/services/duanSetting.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-duyet-congviec-hoanthanh',
  standalone: true,
  imports: [CommonModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './duyet-congviec-hoanthanh.component.html',
})
export class DuyetCongviecHoanthanhComponent {
  id: string;
  duAnSetting: any;
  duAn: any;
  congViecGroupData = [];
  congViecGroup = [
  ];
  allSelected = false;

  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _duAnSettingService: DuAnSettingService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
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
    this._congviecService.getCongViecGridByTrangThai({ duAnId: this.id, trangThai: 'CHO-DUYET-HOAN-THANH' }).subscribe(res => {
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

  approve() {
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
    this._congviecService.approveTrangThai(data).subscribe(res => {
      if (res.isSucceeded === true) {
        this.openSnackBar('Duyệt gia hạn công việc thành công', 'Đóng');
        this.getTableData();
      } else {
        this.openSnackBar(res.message, 'Đóng');
      }
    });
  }

  reject() {
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
    this._congviecService.rejectTrangThai(data).subscribe(res => {
      if (res.isSucceeded === true) {
        this.openSnackBar('Duyệt gia hạn công việc thành công', 'Đóng');
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
