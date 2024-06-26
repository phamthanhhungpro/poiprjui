import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _TagCongViecService: TagCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTagsCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCongViec: ['', Validators.required],
      moTaCongViec: [''],
      nhomCongViecId: ['', Validators.required],
      giaoChoId: ['', Validators.required],
      ngayBatDau: [new Date(), Validators.required],
      hanHoanThanh: [''],
      searchUserName: [''],
    });
  }
  
    ngOnInit(): void {
      console.log(this.data);
      this.nhomCongViecOptions = this.data.nhomCongViec.map(item => {
        return {
          key: item.id,
          value: item.tenNhomCongViec
          }}
        );
    
        this.allManagers = this.data.thanhVienDuAn;
        this.filteredOptions = this.addDataForm.get('searchUserName')?.valueChanges.pipe(
          startWith(null),
          map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice()))
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
      this._TagCongViecService.create(this.addDataForm.value).subscribe(res => {
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
      this.dialogRef.close('expand');
      this.clearForm();    
    }

    setNhomCongViec(value)  {
      this.addDataForm.get('nhomCongViecId')!.setValue(value);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
      this.selectedUser = event.option.value;
      this.addDataForm.get('searchUserName')!.setValue(this.selectedUser.userName);
      this.addDataForm.get('giaoChoId')!.setValue(this.selectedUser.id);

      this.addDataForm.patchValue(this.selectedUser);

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
