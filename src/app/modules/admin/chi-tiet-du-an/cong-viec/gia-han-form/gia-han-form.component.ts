import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CongViecService } from 'app/services/congviec.service';
import { CreateTagsCongViecComponent } from '../../thiet-lap-du-an/tags-cong-viec/create-tagscongviec/create-tagscongviec.component';

@Component({
  selector: 'app-gia-han-form',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule, AsyncPipe,
    MatDatepickerModule],
  templateUrl: './gia-han-form.component.html',
})
export class GiaHanFormComponent {
  addDataForm: UntypedFormGroup;
  constructor(private _formBuilder: UntypedFormBuilder,
    private _CongViec: CongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTagsCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.addDataForm = this._formBuilder.group({
      ngayKetThuc: [this.data.ngayKetThuc, Validators.required],
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
    console.log(this.addDataForm.value);
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
