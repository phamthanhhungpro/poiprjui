import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CongThucLuongService } from 'app/services/congthucluong.service';
import { ThamSoLuongService } from 'app/services/thamsoluong.service';
import { TrangThaiChamCongService } from 'app/services/trangthaichamcong.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-create-thietlapchamcong',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSlideToggleModule
  ],
  templateUrl: './create-thietlapchamcong.component.html'
})
export class CreateThietLapChamCongComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;
  tableData;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _trangthaichamcongService: TrangThaiChamCongService,
    private _snackBar: MatSnackBar,
    private _thamsoluongService: ThamSoLuongService
  ) {
    this.addDataForm = this._formBuilder.group({
      tenTrangThai: ['', Validators.required],
      maTrangThai: [''],
      yeuCauGiaiTrinh: [false],
      trangThai: [true],
      mauSac: [''],
    });
  }

  ngOnInit(): void {
    this.getThamSoLuong();
  }

  // clear form when close drawer
  clearForm(): void {
    this.addDataForm.reset();
  }

  // close drawer and reset form
  cancelAdd(): void {
    this.drawer.close();
    this.clearForm();
  }

  // save data
  save(): void {
    this._trangthaichamcongService.create(this.addDataForm.value).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
        this.drawer.close();
        this.clearForm();
      } else {
        this.openSnackBar('Thao tác thất bại', 'Đóng');
      }
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  // get table data
  getThamSoLuong() {
    this._thamsoluongService.getAllNoPaging().subscribe(res => {
      this.tableData = res;
    });
  }
}
