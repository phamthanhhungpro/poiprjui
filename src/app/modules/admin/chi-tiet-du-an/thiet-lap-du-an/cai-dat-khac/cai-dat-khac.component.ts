import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DuAnSettingService } from 'app/services/duanSetting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cai-dat-khac',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cai-dat-khac.component.html',
})
export class CaiDatKhacComponent {
  addDataForm: UntypedFormGroup;
  id;

  constructor(private _formBuilder: UntypedFormBuilder,
              private _duAnSettingService: DuAnSettingService,
              private _snackBar: MatSnackBar,
              private route: ActivatedRoute,

  ) {
    this.addDataForm = this._formBuilder.group({
      createCongViecUiDefault: ['giao-dien-rut-gon']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSetting();
  }

  getSetting(): void {
    this._duAnSettingService.getNoPagingByDuAn({duAnId : this.id}).subscribe(res => {
      for (const item of res) {
        this.addDataForm.patchValue({ [item.key]: item.value });
      }
    });
  }

  onSave(): void {
    console.log(this.id);

    let model = {
      duAnId: this.id,
      settings: this.addDataForm.value
    }

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
}
