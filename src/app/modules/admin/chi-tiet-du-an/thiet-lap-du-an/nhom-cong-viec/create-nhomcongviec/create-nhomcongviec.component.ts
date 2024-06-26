import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VaiTroService } from 'app/services/vaitro.service';
import { ViTriCongViecService } from 'app/services/vitricongviec.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NhomCongViecService } from 'app/services/nhomcongviec.service';
import { generateCodeFromName } from 'app/common/helper';

@Component({
  selector: 'app-create-nhomcongviec',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
  ],
  templateUrl: './create-nhomcongviec.component.html'
})
export class CreateNhomCongViecComponent {
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _nhomCongViecService: NhomCongViecService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateNhomCongViecComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addDataForm = this._formBuilder.group({
      tenNhomCongViec: ['', Validators.required],
      maNhomCongViec: ['', Validators.required],
      moTa: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addDataForm.get('tenNhomCongViec').valueChanges.subscribe(value => {
      this.addDataForm.get('maNhomCongViec').setValue(generateCodeFromName(value));
    }
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
    this._nhomCongViecService.create(this.addDataForm.value).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
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
}
