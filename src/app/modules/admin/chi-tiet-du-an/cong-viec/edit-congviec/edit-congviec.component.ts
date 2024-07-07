import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaiCongViecService } from 'app/services/loaicongviec.service';
import { EditLoaiCongViecComponent } from '../../thiet-lap-du-an/loai-cong-viec/edit-loaicongviec/edit-loaicongviec.component';
import { co } from '@fullcalendar/core/internal-common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CongViecService } from 'app/services/congviec.service';
import { UserSelectorComponent } from 'app/common/components/user-selector/user-selector.component';

@Component({
  selector: 'app-edit-congviec',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatIconModule, MatButtonModule, ReactiveFormsModule, UserSelectorComponent],
  templateUrl: './edit-congviec.component.html',
})
export class EditCongviecComponent {
  @Output() onClosed = new EventEmitter<any>();

  taskForm: UntypedFormGroup;
  assignedTo = 'Lê Đình Dũng';
  executedBy = 'Lê Đình Dũng';
  exchanges = [
    { time: '08:42 01/06/2024', user: '@Lê Đình Dũng', content: 'Nội dung trao đổi 1', tag: '#Tag1' },
    { time: '08:42 01/06/2024', user: '@Phạm Thanh Hùng', content: 'Nội dung trao đổi 2', tag: '#Tag2' },
    { time: '08:42 01/06/2024', user: '', content: 'Tiến hành công việc ngay', tag: '#Chỉ đạo' }
  ];

  congviec:any = {};
  listGiaoViecOptions: any[] = [];
  selectedGiaoViec: any[] = [];

  listNguoiThucHienOptions: any[] = [];
  selectedNguoiThucHien: any[] = [];

  listNguoiPhoiHopOptions: any[] = [];
  selectedNguoiPhoiHop: any[] = [];

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _LoaiCongViecService: LoaiCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditLoaiCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private congViecService: CongViecService
  ) {
    this.taskForm = this._formBuilder.group({
      project: [{ value: 'Dự án/Nhiệm vụ', disabled: true }],
      createdBy: [{ value: 'Lê Đình Dũng', disabled: true }],
      description: [''],
      group: [{ value: 'Nhóm công việc', disabled: true }],
      type: [{ value: 'Loại công việc', disabled: true }],
      status: [{ value: 'Đang thực hiện', disabled: true }],
      priority: [{ value: 'Không ưu tiên', disabled: true }],
      completionTime: [{ value: 'Đơn giản', disabled: true }],
      assignedTo: [{ value: 'Lê Đình Dũng', disabled: true }],
      executedBy: [{ value: 'Lê Đình Dũng', disabled: true }],
      collaborators: ['Nguyễn Văn Đạt, Phạm Thanh Hùng'],
      startTime: [{ value: '20/6/2024', disabled: true }],
      endTime: [{ value: '30/6/2024', disabled: true }],
      quality: [{ value: 'Chưa đảm bảo', disabled: true }],
      progress: [{ value: 'Chậm', disabled: true }],
      compliance: [{ value: 'Không chấp hành', disabled: true }]
    });
  }

  ngOnInit() {
    this.getCongViecById(this.data.id);
    console.log(this.congviec);
  }

  getCongViecById(id: string) {
    this.congViecService.get(id).subscribe(res => {
      this.congviec = res;

      this.listGiaoViecOptions = res.duAnNvChuyenMon.thanhVienDuAn;
      this.selectedGiaoViec.push(res.nguoiDuocGiao);

      this.listNguoiThucHienOptions = res.duAnNvChuyenMon.thanhVienDuAn;
      this.selectedNguoiThucHien = res.nguoiThucHien;

      this.listNguoiPhoiHopOptions = res.duAnNvChuyenMon.thanhVienDuAn;
      this.selectedNguoiPhoiHop = res.nguoiPhoiHop;
    });
  }
  // close drawer and reset form
  cancelAdd(): void {
    this.dialogRef.close();
    this.clearForm();
  }

  // clear form
  clearForm(): void {
    this.taskForm.reset();
  }

  // save data
  save(): void {

  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
