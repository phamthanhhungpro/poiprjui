import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
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
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TagUserInputComponent } from 'app/common/components/tag-user-input/tag-user-input.component';
import { CommentService } from 'app/services/comment.service';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-edit-congviec',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatIconModule, MatButtonModule, ReactiveFormsModule, UserSelectorComponent, SearchableSelectComponent,
    MatSelectModule, MatTabsModule, TagUserInputComponent, MatExpansionModule
  ],
  templateUrl: './edit-congviec.component.html',
})
export class EditCongviecComponent {
  @ViewChild(TagUserInputComponent) tagUserInputComponent!: TagUserInputComponent;
  @Output() onClosed = new EventEmitter<any>();

  taskForm: UntypedFormGroup;
  congviec: any = {};
  listGiaoViecOptions: any[] = [];
  selectedGiaoViec: any[] = [];

  listNguoiThucHienOptions: any[] = [];
  selectedNguoiThucHien: any[] = [];

  listNguoiPhoiHopOptions: any[] = [];
  selectedNguoiPhoiHop: any[] = [];

  trangThaiOptions: any[] = [];
  selectedTrangThai: any;

  tags = [];
  persons = [];
  commentValue: string = '';
  listComment = [];
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _LoaiCongViecService: LoaiCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditLoaiCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private congViecService: CongViecService,
    private commentService: CommentService
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
      compliance: [{ value: 'Không chấp hành', disabled: true }],
      trangThai: [''],
      chatLuongHieuQua: [''],
      tienDo: [''],
      chapHanhCheDo: [''],
      chapHanhLamThem: [''],
      traoDoi: [''],
    });
  }

  ngOnInit() {
    this.getCongViecById(this.data.id);
    console.log(this.data);
  }

  onInputValueChange(value: string): void {
    this.commentValue = value;
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

      let trangThaiSeting = res.duAnNvChuyenMon?.duAnSetting.find(x => x.key == 'trangThaiSetting');
      this.trangThaiOptions = JSON.parse(trangThaiSeting.jsonValue);
      this.selectedTrangThai = res.trangThai;

      this.tags = res.duAnNvChuyenMon?.tagComment?.map(x => ({ key: x.maTag, value: x.maTag }));
      this.persons = res.duAnNvChuyenMon?.thanhVienDuAn?.map(x => ({ key: x.userName, value: x.userName }));

      // get comment by id conviec
      this.commentService.getNoPagingByCongViecId({ congViecId: this.congviec.id }).subscribe(res => {
        this.listComment = res;
      });
    });
  }

  setTrangThai(value) {
    this.taskForm.get('trangThai')!.setValue(value);
    this.selectedTrangThai = value;
  }

  sendComment() {
    let data = {
      noiDung: this.commentValue,
      congViecId: this.congviec.id,
      duAnId: this.congviec.duAnNvChuyenMonId,
    }
    this.commentService.create(data).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Gửi trao đổi thành công', 'Đóng');
        this.commentService.getNoPagingByCongViecId({ congViecId: this.congviec.id }).subscribe(res => {
          this.listComment = res;
        });
      }
    });
    // clear input box
    this.tagUserInputComponent.clearInputValue();

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
    let data = {
      ngayKetThuc: this.congviec.ngayKetThuc,
      trangThai: this.selectedTrangThai,
      nguoiDuocGiaoId: this.selectedGiaoViec[0].id,
      nguoiPhoiHopIds: this.selectedNguoiPhoiHop.map(x => x.id),
      nguoiThucHienIds: this.selectedNguoiThucHien.map(x => x.id),
    };

    this.congViecService.update(this.congviec.id, data).subscribe(res =>
    {
      if(res.isSucceeded) {
        this.openSnackBar("Thao tác thành công !", "Đóng");
        this.dialogRef.close();
        this.clearForm();
      }
    }
    )
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
