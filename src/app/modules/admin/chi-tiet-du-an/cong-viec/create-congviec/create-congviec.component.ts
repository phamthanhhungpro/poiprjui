import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
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
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { co } from '@fullcalendar/core/internal-common';
import { CongViecService } from 'app/services/congviec.service';
import { generateCodeFromName } from 'app/common/helper';

@Component({
  selector: 'app-create-congviec',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule, AsyncPipe,
    MatDatepickerModule, SearchableSelectComponent, MatAutocompleteModule,
    MatChipsModule, MatNativeDateModule, MatDividerModule],
  templateUrl: './create-congviec.component.html',
})
export class CreateCongviecComponent {
  addDataForm: UntypedFormGroup;
  nhomCongViecOptions = [];

  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;

  selectedUser: any = {};
  filteredOptions: any = [];
  allManagers: any = [];
  listGiaoViec = []; // list người thực hiện công việc max = 1
  checkGiaoCho = false;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _CongViec: CongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTagsCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCongViec: ['', Validators.required],
      moTa: [''],
      nhomCongViecId: [null],
      nguoiDuocGiaoId: ['', Validators.required],
      ngayBatDau: [new Date(), Validators.required],
      ngayKetThuc: [''],
      searchUserName: [''],
    });
  }

  ngOnInit(): void {
    this.nhomCongViecOptions = this.data.nhomCongViec.map(item => {
      return {
        key: item.id,
        value: item.tenNhomCongViec
      }
    }
    );

    let defaultNhomCongViec = this.data.nhomCongViec.find(item => item.maNhomCongViec == 'CHUAXACDINH');
    this.addDataForm.get('nhomCongViecId')!.setValue(defaultNhomCongViec?.id);
    this.allManagers = this.data.thanhVienDuAn;
    this.filteredOptions = this.addDataForm.get('searchUserName')?.valueChanges.pipe(
      startWith(null),
      map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())),
      map(tvien => tvien.filter(m => !this.listGiaoViec.some(i => i.userName === m.userName)))

    );
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
    this.addDataForm.value.nguoiDuocGiaoId = this.listGiaoViec[0].id;
    this.addDataForm.value.nguoiThucHienIds = this.listGiaoViec.map(item => item.id);

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

  onExpand(): void {
    this.addDataForm.value.duAnNvChuyenMonId = this.data.id;
    this.addDataForm.value.nguoiDuocGiaoId = this.listGiaoViec[0]?.id;
    this.addDataForm.value.nguoiThucHienIds = this.listGiaoViec.map(item => item.id);
    // save data form to local storage 
    localStorage.setItem('createCongViecForm', JSON.stringify(this.addDataForm.value));
    
    this.dialogRef.close('expand');

    this.clearForm();
  }

  setNhomCongViec(value) {
    this.addDataForm.get('nhomCongViecId')!.setValue(value);
  }

  removeGiaoViec(item: any): void {
    const index = this.listGiaoViec.indexOf(item);

    if (index >= 0) {
      this.listGiaoViec.splice(index, 1);
      this._changeDetectorRef.markForCheck();
      this.addDataForm.get('searchUserName')!.setValue(null);
    }
  }

  selectedGiaoViec(event: MatAutocompleteSelectedEvent): void {
    if (this.listGiaoViec.length > 0) {
      this.openSnackBar('Vui lòng chỉ chọn 1 người được giao', 'Đóng');
      this.managerInput.nativeElement.value = '';
      this.addDataForm.get('searchUserName')!.setValue(null);
      return;
    };
    let selectedMember = event.option.value;
    this.listGiaoViec.push(selectedMember);
    this.addDataForm.get('nguoiDuocGiaoId')!.setValue(selectedMember.id);

    this.managerInput.nativeElement.value = '';
    this.addDataForm.get('searchUserName')!.setValue(null);
  }

  private _filter(value: any): any[] {

    if (typeof (value) === 'object') {
      let res = this.allManagers.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));
      return res;
    }

    if (value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.allManagers.filter(item => (item.fullName.toLowerCase().includes(filterValue)
      || item.userName.toLowerCase().includes(filterValue)));
  }
}
