import { Component, Inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TagCongViecService } from 'app/services/tagcongviec.service';
import { CreateTagsCongViecComponent } from '../../thiet-lap-du-an/tags-cong-viec/create-tagscongviec/create-tagscongviec.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { MultiSelectComponent } from 'app/common/components/multi-select/multi-select.component';
import { UserSelectorComponent } from 'app/common/components/user-selector/user-selector.component';
import { CongViecService } from 'app/services/congviec.service';
import { FileService } from 'app/services/file.service';

@Component({
  selector: 'app-create-congviec-advance',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule, SearchableSelectComponent, MultiSelectComponent, UserSelectorComponent],
  templateUrl: './create-congviec-advance.component.html',
})
export class CreateCongviecAdvanceComponent {
  addDataForm: UntypedFormGroup;
  nhomCongViecOptions = [];
  loaiCongViecOptions = [];
  tagCongViecOptions = [];

  selectedTags: any = [];
  listGiaoViecOptions: any[] = [];
  selectedGiaoViec: any[] = [];

  listNguoiThucHienOptions: any[] = [];
  selectedNguoiThucHien: any[] = [];

  listNguoiPhoiHopOptions: any[] = [];
  selectedNguoiPhoiHop: any[] = [];

  selectedNhomCongViec: any;

  selectedFiles: File[] = [];
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _TagCongViecService: TagCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTagsCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _CongViec: CongViecService,
    private _FileService: FileService
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCongViec: [''],
      moTa: [''],
      nhomCongViecId: [''],
      loaiCongViecId: [''],
      nguoiDuocGiaoId: [''],
      nguoiPhoiHopIds: [null],
      nguoiThucHienIds: [null],
      tagCongViecIds: [null],
      mucDoUuTien: [''],
      ngayBatDau: [new Date(), Validators.required],
      ngayKetThuc: [''],
      thoiGianDuKien: [''],
    });
  }

  ngOnInit(): void {
    this.nhomCongViecOptions = this.data.nhomCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenNhomCongViec
      }
    });
    let defaultNhomCongViec = this.data.nhomCongViec.find(item => item.maNhomCongViec == 'CHUAXACDINH');
    this.addDataForm.get('nhomCongViecId')!.setValue(defaultNhomCongViec?.id);

    this.loaiCongViecOptions = this.data.loaiCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenLoaiCongViec
      }
    });

    let defaultLoaiongViec = this.data.loaiCongViec.find(item => item.maLoaiCongViec == 'CHUAXACDINH');
    this.addDataForm.get('loaiCongViecId')!.setValue(defaultLoaiongViec?.id);

    this.tagCongViecOptions = this.data.tagCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenTag
      }
    });

    this.listGiaoViecOptions = this.data.thanhVienDuAn;
    this.listNguoiThucHienOptions = this.data.thanhVienDuAn;
    this.listNguoiPhoiHopOptions = this.data.thanhVienDuAn;

    // get data createCongViecForm from local storage
    const createCongViecForm = localStorage.getItem('createCongViecForm');
    if (createCongViecForm) {
      const model = JSON.parse(createCongViecForm);

      this.addDataForm.patchValue(model);

      // lấy thông tin người được giao
      if (model.nguoiDuocGiaoId) {
        const nguoiDuocGiao = this.listGiaoViecOptions.find(item => item.id == model.nguoiDuocGiaoId);
        this.selectedGiaoViec.push(nguoiDuocGiao);
      }

      // lấy thông tin người thực hiện
      if (model.nguoiThucHienIds.length > 0) {
        const nguoiThucHien = this.listNguoiThucHienOptions.filter(item => model.nguoiThucHienIds.includes(item.id));
        this.selectedNguoiThucHien = nguoiThucHien;
      }

      this.setNhomCongViec(model.nhomCongViecId);
    }

  }

  // clear form when close drawer
  clearForm(): void {
    this.addDataForm.reset();
  }

  // close drawer and reset form
  cancelAdd(): void {
    this.dialogRef.close();
    this.clearForm();
  }

  // save data
  save(): void {
    // Upload file if any
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
  
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });
  
      this._FileService.uploadFile(formData).subscribe(
        res => {
          this.addDataForm.value.attachments = res.urls.join(';');
          this.saveFormData();
        },
        error => {
          this.openSnackBar(`File upload failed: ${error.message}`, 'Close');
        }
      );
    } else {
      this.saveFormData();
    }
  }
  
  private saveFormData(): void {
    this.addDataForm.value.duAnNvChuyenMonId = this.data.id;
    this.addDataForm.value.nguoiDuocGiaoId = this.selectedGiaoViec[0].id;
    this.addDataForm.value.nguoiThucHienIds = this.selectedNguoiThucHien.map(item => item.id);
    this.addDataForm.value.nguoiPhoiHopIds = this.selectedNguoiPhoiHop.map(item => item.id);
    this.addDataForm.value.tagCongViecIds = this.selectedTags.map(item => item.id);
  
    this._CongViec.create(this.addDataForm.value).subscribe(
      res => {
        if (res.isSucceeded) {
          this.openSnackBar('Thao tác thành công', 'Close');
          this.dialogRef.close();
          this.clearForm();
        } else {
          this.openSnackBar(`Thao tác thất bại: ${res.message}`, 'Close');
        }
      },
      error => {
        this.openSnackBar(`Thao tác thất bại: ${error.message}`, 'Close');
      }
    );
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  setNhomCongViec(value) {
    this.addDataForm.get('nhomCongViecId')!.setValue(value);
    this.selectedNhomCongViec = value;
  }

  setLoaiCongViec(value) {
    this.addDataForm.get('loaiCongViecId')!.setValue(value);
  }

  setTagCongViec($event) {
    this.addDataForm.get('tagCongViecIds')!.setValue($event);
  }

  selectNguoiDuocGiao(event: { action: string, items: any[] }) {
    if (event.action === 'add') {
      const selectedNguoiThucHienIds = this.selectedNguoiThucHien.map(item => item.id);
      const newNguoiThucHienId = event.items[0].id;
      if (!selectedNguoiThucHienIds.includes(newNguoiThucHienId)) {
        this.selectedNguoiThucHien.push(event.items[0]);
      }
    } else if (event.action === 'remove') {
    }
  }

  onFilesSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

}
