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

@Component({
  selector: 'app-create-congviec-advance',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './create-congviec-advance.component.html',
})
export class CreateCongviecAdvanceComponent {
  addDataForm: UntypedFormGroup;

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
      tenCongViec: [''],
      moTaCongViec: [''],
      nhomCongViec: [''],
      loaiCongViec: [''],
      giaoCho: [''],
      nguoiPhoiHop: [''],
      tags: [''],
      mucDoUuTien: [''],
      ngayBatDau: [''],
      hanHoanThanh: ['']
    });
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
}
