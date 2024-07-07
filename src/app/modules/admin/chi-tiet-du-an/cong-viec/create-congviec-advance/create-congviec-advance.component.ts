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

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _TagCongViecService: TagCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTagsCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _CongViec: CongViecService,
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCongViec: [''],
      moTa: [''],
      nhomCongViecId: [''],
      loaiCongViecId: [''],
      nguoiDuocGiaoId: [''],
      nguoiPhoiHopIds: [''],
      nguoiThucHienIds: [''],
      tagCongViecIds: [''],
      mucDoUuTien: [''],
      ngayBatDau: [new Date(), Validators.required],
      ngayKetThuc: [''],
      thoiGianHoanThanhDuKien: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.nhomCongViecOptions = this.data.nhomCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenNhomCongViec
      }
    });

    this.loaiCongViecOptions = this.data.loaiCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenLoaiCongViec
      }
    });

    this.tagCongViecOptions = this.data.tagCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenTag
      }
    });

    this.listGiaoViecOptions = this.data.thanhVienDuAn;
    this.listNguoiThucHienOptions = this.data.thanhVienDuAn;
    this.listNguoiPhoiHopOptions = this.data.thanhVienDuAn;
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
    this.addDataForm.value.duAnNvChuyenMonId = this.data.id;
    this.addDataForm.value.nguoiDuocGiaoId = this.selectedGiaoViec[0].id;
    this.addDataForm.value.nguoiThucHienIds = this.selectedNguoiThucHien.map(item => item.id);
    this.addDataForm.value.nguoiPhoiHopIds = this.selectedNguoiPhoiHop.map(item => item.id);
    // this.addDataForm.value.tagCongViecIds = this.selectedTags.map(item => item.id);

    this._CongViec.create(this.addDataForm.value).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.dialogRef.close();
        this.clearForm();
      } else {
        this.openSnackBar(`Thao tác thất bại: ${res.message}`, 'Đóng');
      }
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log(file);
    }
  }

  setNhomCongViec(value) {
    this.addDataForm.get('nhomCongViecId')!.setValue(value);
  }

  setLoaiCongViec(value) {
    this.addDataForm.get('loaiCongViecId')!.setValue(value);
  }

  setTagCongViec($event) {
    this.addDataForm.get('tagCongViecIds')!.setValue($event);
  }

  onSelectionChange(event: { action: string, items: any[] }) {
    if (event.action === 'add') {
      console.log('Item Added:', event.items);
    } else if (event.action === 'remove') {
      console.log('Item Removed:', event.items);
    }
  }

}
