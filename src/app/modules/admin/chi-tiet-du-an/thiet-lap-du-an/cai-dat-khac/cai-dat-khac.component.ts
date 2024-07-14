import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormArray, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DuAnSettingService } from 'app/services/duanSetting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { generateCodeFromName } from 'app/common/helper';

@Component({
  selector: 'app-cai-dat-khac',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './cai-dat-khac.component.html',
})
export class CaiDatKhacComponent {
  addDataForm: UntypedFormGroup;
  id;
  trangThaiDataSource;
  constructor(private _formBuilder: UntypedFormBuilder,
    private _duAnSettingService: DuAnSettingService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,

  ) {
    this.addDataForm = this._formBuilder.group({
      createCongViecUiDefault: ['giao-dien-rut-gon'],
      trangThaiSettings: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSetting();
  }

  getSetting(): void {
    this._duAnSettingService.getNoPagingByDuAn({ duAnId: this.id }).subscribe(res => {
      for (const item of res) {
        this.addDataForm.patchValue({ [item.key]: item.value });
      };

      let trangthaiSetting = JSON.parse(res.filter(x => x.key == 'trangThaiSetting')[0].jsonValue);

      trangthaiSetting.forEach(item => {
        const trangThaiFormGroup = this._formBuilder.group({
          key: [item.key],
          value: [item.value],
          yeuCauXacNhan: [item.yeuCauXacNhan]
        });
        this.trangThaiSettings.push(trangThaiFormGroup);
      });
    });
  }

  onSave(): void {

    const formValue = this.addDataForm.value;
    // Ensure all keys are non-empty strings
    const jsonSettings = formValue.trangThaiSettings.map((item: any) => ({
      key: item.key.trim(),
      value: item.value,
      yeuCauXacNhan: item.yeuCauXacNhan
    })).filter((item: any) => item.key !== '');

    let model = {
      duAnId: this.id,
      settings: {
        createCongViecUiDefault: formValue.createCongViecUiDefault
      },
      jsonSettings: {
        trangThaiSetting: jsonSettings
      }
    };
    console.log(jsonSettings);

    this._duAnSettingService.updateAllSetting(model).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
      } else {
        this.openSnackBar(`Thao tác thất bại: ${res.message}`, 'Đóng');
      }
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  get trangThaiSettings(): FormArray {
    return this.addDataForm.get('trangThaiSettings') as FormArray;
  }

  addTrangThai(): void {
    const trangThaiFormGroup = this._formBuilder.group({
      key: [''],
      value: [''],
      yeuCauXacNhan: [false]
    });

    // Subscribe to valueChanges of 'value' form control
    trangThaiFormGroup.get('value')?.valueChanges.subscribe(val => {
      const generatedKey = generateCodeFromName(val);
      trangThaiFormGroup.get('key')?.setValue(generatedKey);
    });
    this.trangThaiSettings.push(trangThaiFormGroup);
  }

  removeTrangThai(index: number): void {
    this.trangThaiSettings.removeAt(index);
  }

  checkTrangThai(item: any): boolean {
    if (item.value.key === 'chua-xac-dinh') {
      return true;
    }

    return false;
  }
}
