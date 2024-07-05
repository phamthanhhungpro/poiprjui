import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
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
import { DuAnSettingService } from 'app/services/duanSetting.service';

@Component({
  selector: 'app-create-kanban',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, SearchableSelectComponent,
    MatSlideToggleModule
  ],
  templateUrl: './create-kanban.component.html'
})
export class CreateKanbanComponent {
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;
  trangThaiList;

  trangThaiOptions;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _KanbanService: KanbanService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateKanbanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _duAnSettingService: DuAnSettingService,
    private _cdf: ChangeDetectorRef
  ) {
    this.addDataForm = this._formBuilder.group({
      tenCot: ['', Validators.required],
      moTa: [''],
      trangThaiCongViec: ['', Validators.required],
      thuTu: ['', Validators.required],
      yeuCauXacNhan: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addDataForm.get('yeuCauXacNhan')?.disable();
    this.getSetting();
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
    this.addDataForm.value.yeuCauXacNhan = this.addDataForm.get('yeuCauXacNhan').value;

    this._KanbanService.create(this.addDataForm.value).subscribe(res => {
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

    let trangthai = this.trangThaiList.find(x => x.key === value);
    if (trangthai) {
      this.addDataForm.get('yeuCauXacNhan').setValue(trangthai.yeuCauXacNhan);
    }
  }

  getSetting(): void {
    this._duAnSettingService.getNoPagingByDuAn({ duAnId: this.data.id }).subscribe(res => {
      let trangthaiSetting = [];
      if (res && res.length > 0) {
        const trangThaiSettingItem = res.find(x => x.key === 'trangThaiSetting');
        if (trangThaiSettingItem) {
          trangthaiSetting = JSON.parse(trangThaiSettingItem.jsonValue);
          this.trangThaiList = trangthaiSetting;
        }
      }

      this.trangThaiOptions = trangthaiSetting.map(item => {
        return {
          key: item.key,
          value: item.value
        };
      });
    });
  }
}
