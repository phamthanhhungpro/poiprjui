import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { HosonhansuService } from 'app/services/hosonhansu.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-hosonhansu',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, FuseDrawerComponent,
    MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatDividerModule,
    RouterLink, CommonModule, MatCheckboxModule, CdkAccordionModule],
  templateUrl: './edit-hosonhansu.component.html',
})
export class EditHosonhansuComponent {
  employeeForm: UntypedFormGroup;
  @Input() drawer: MatDrawer;
  @Input() data; // Id hosonhansu
  @Output() onClosed = new EventEmitter<any>();

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  constructor(private fb: FormBuilder,
    private _hosonhansuService: HosonhansuService,
    private _snackBar: MatSnackBar,
  ) {
    this.employeeForm = this.fb.group({
      ngheNghiepKhiTuyenDung: [''],
      ngayTuyenDung: [''],
      coQuanTuyenDung: [''],
      chucVuHienTai: [''],
      ngayBoNhiem: [''],
      congViecChinh: [''],
      ngachCongChuc: [''],
      ngayBoNhiemNgach: [''],
      maNgach: [''],
      bacLuong: [''],
      heSoLuong: [''],
      ngayHuong: [''],
      phuCapChucVu: [''],
      phuCapKhac: [''],
      trinhDoPhoThong: [''],
      trinhDoChuyenMon: [''],
      lyLuanChinhTri: [''],
      quanLyNhaNuoc: [''],
      ngoaiNgu: [''],
      tinHoc: [''],
      ngayVaoDang: [''],
      ngayChinhThuc: [''],
      ngayThamGiaToChucChinhTriXaHoi: [''],
      ngayNhapNgu: [''],
      ngayXuatNgu: [''],
      quanHamCaoNhat: [''],
      danhHieuCaoNhat: [''],
      soTruongCongTac: [''],
      khenThuong: [''],
      kyLuat: [''],
      tinhTrangSucKhoe: [''],
      chieuCao: [''],
      canNang: [''],
      nhomMau: [''],
      laThuongBinhHang: [''],
      laConGiaDinhChinhSach: [''],
      soChungMinhNhanDan: [''],
      ngayCap: [''],
      soSoBHXH: [''],
      dacDiemLichSuBanThan: [''],
      thamGiaToChucNuocNgoai: [''],
      thanNhanOngNuocNgoai: [''],
      daoTaoBoDuongs: this.fb.array([]), // Array for multiple entries
      quaTrinhCongTacs: this.fb.array([]), // Array for multiple entries
      quanHeGiaDinhs: this.fb.array([]), // Array for multiple entries
      luongCongChucs: this.fb.array([]) // Array for multiple entries
    });
  }
  ngOnInit(): void {
    console.log(this.data);
    // Create the arrays before patching values
    const daoTaoBoDuongs = this.employeeForm.get('daoTaoBoDuongs') as FormArray;
    const quaTrinhCongTacs = this.employeeForm.get('quaTrinhCongTacs') as FormArray;
    const quanHeGiaDinhs = this.employeeForm.get('quanHeGiaDinhs') as FormArray;
    const luongCongChucs = this.employeeForm.get('luongCongChucs') as FormArray;

    // Loop through the data and push new form groups to the arrays
    this.data.thongTinThem.daoTaoBoDuongs.forEach((item) => {
      daoTaoBoDuongs.push(this.createDaoTaoGroup());
    });

    this.data.thongTinThem.quaTrinhCongTacs.forEach((item) => {
      quaTrinhCongTacs.push(this.createQuaTrinhCongTacGroup());
    });

    this.data.thongTinThem.quanHeGiaDinhs.forEach((item) => {
      quanHeGiaDinhs.push(this.createQuanHeGiaDinhGroup());
    });

    this.data.thongTinThem.luongCongChucs.forEach((item) => {
      luongCongChucs.push(this.createDienBienLuongGroup());
    });

    // Patch the values to the form
    this.employeeForm.patchValue(this.data.thongTinThem);
  }

  createDaoTaoGroup(): UntypedFormGroup {
    return this.fb.group({
      tenTruong: [''],
      chuyenNganh: [''],
      tuNgay: [''],
      denNgay: [''],
      hinhThucDaoTao: [''],
      vanBang: ['']
    });
  }

  createQuaTrinhCongTacGroup(): UntypedFormGroup {
    return this.fb.group({
      tuThangNam: [''],
      denThangNam: [''],
      chucDanhChucVu: ['']
    });
  }

  createQuanHeGiaDinhGroup(): UntypedFormGroup {
    return this.fb.group({
      moiQuanHe: [''],
      hoTen: [''],
      namSinh: [''],
      queQuan: [''],
      ngheNghiep: ['']
    });
  }

  createDienBienLuongGroup(): UntypedFormGroup {
    return this.fb.group({
      thangNam: [''],
      maNgachBac: [''],
      heSoLuong: [''],
      laHeSoHienTai: [false]
    });
  }

  get daoTaoBoDuongs(): FormArray {
    return this.employeeForm.get('daoTaoBoDuongs') as FormArray;
  }

  get quaTrinhCongTacs(): FormArray {
    return this.employeeForm.get('quaTrinhCongTacs') as FormArray;
  }

  get quanHeGiaDinhs(): FormArray {
    return this.employeeForm.get('quanHeGiaDinhs') as FormArray;
  }

  get luongCongChucs(): FormArray {
    return this.employeeForm.get('luongCongChucs') as FormArray;
  }

  addDaoTao(): void {
    this.daoTaoBoDuongs.push(this.createDaoTaoGroup());
  }

  addQuaTrinhCongTac(): void {
    this.quaTrinhCongTacs.push(this.createQuaTrinhCongTacGroup());
  }

  addQuanHeGiaDinh(): void {
    this.quanHeGiaDinhs.push(this.createQuanHeGiaDinhGroup());
  }

  addDienBienLuong(): void {
    this.luongCongChucs.push(this.createDienBienLuongGroup());
  }
  cancelEdit(): void {
    this.drawer.close();
  }

  save() {
    console.log(this.employeeForm.value);

    var data = {
      userId: this.data.userId,
      thongTinThem: this.employeeForm.value
    };

    this._hosonhansuService.update(this.data.id, data)
      .subscribe(
        response => {
          this.openSnackBar('Thao tác thành công', 'Đóng');
          this.onClosed.emit();
          this.drawer.close();
        },
        error => {
          // Handle error response
          this.openSnackBar('Có lỗi xảy ra', 'Đóng');
        }
      );
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
