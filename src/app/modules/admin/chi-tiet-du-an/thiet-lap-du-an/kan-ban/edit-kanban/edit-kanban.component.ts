import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { KanbanService } from 'app/services/kanban.service';

@Component({
  selector: 'app-edit-kanban',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, SearchableSelectComponent,
    MatSlideToggleModule
  ],
  templateUrl: './edit-kanban.component.html'
})
export class EditKanbanComponent {
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;

  trangThaiList = [
    { id: 0, tenTrangThai: 'Chưa bắt đầu' },
    { id: 1, tenTrangThai: 'Đang thực hiện' },
    { id: 2, tenTrangThai: 'Hoàn thành' },
    { id: 3, tenTrangThai: 'Đã xác nhận' }
  ];

  trangThaiOptions;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _KanbanService: KanbanService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditKanbanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCot: ['', Validators.required],
      moTa: [''],
      trangThaiCongViec: ['', Validators.required],
      thuTu: ['', Validators.required],
      yeuCauXacNhan: [false],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.trangThaiOptions = this.trangThaiList.map(item => {
      return {
        key: item.id,
        value: item.tenTrangThai
      };
    });

    this.addDataForm.patchValue(this.data);
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
    this.addDataForm.value.duAnNvChuyenMonId = this.data.duAnNvChuyenMonId;
    this._KanbanService.update(this.data.id, this.addDataForm.value).subscribe(res => {
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

  setTrangThai(value: any): void {
    this.addDataForm.get('trangThaiCongViec').setValue(value);
  }
}
