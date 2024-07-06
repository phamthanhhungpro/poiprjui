import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';
import { UserApiService } from 'app/services/user.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LinhVucService } from 'app/services/linhvuc.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { map, startWith } from 'rxjs';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';

@Component({
  selector: 'app-edit-nhiemvuchuyenmon',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatAutocompleteModule, MatChipsModule, MatSelectModule
  ],
  templateUrl: './edit-nhiemvuchuyenmon.component.html',
})
export class EditNhiemvuchuyenmonComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any;

  addDataForm: UntypedFormGroup;
  listBoPhan;
  listLinhVuc;

  @ViewChild('thanhvienInput') thanhvienInput: ElementRef<HTMLInputElement>;
  listThanhVien = [];
  filteredOptionThanhVien: any;
  allThanhVien: any;

  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  listManager = [];
  filteredOptionManager: any;
  allManager: any;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _phongbanbophanService: PhongBanBoPhanService,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private _linhvucService: LinhVucService,
    private _duanNvChuyenMonService: DuAnNvChuyenMonService
  ) {
    this.addDataForm = this._formBuilder.group({
      tenDuAn: ['', Validators.required],
      moTaDuAn: [''],
      toNhomId: [null],
      phongBanBoPhanId: [null, Validators.required],
      quanLyDuAnId: [null, Validators.required],
      thoiGianBatDau: ['', Validators.required],
      thoiGianKetThuc: ['', Validators.required],
      linhVucId: [null, Validators.required],
      isNhiemVuChuyenMon: [true],
      searchThanhVien: ['', Validators.required],
      searchManager: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getListBoPhan();
    this.getListLinhVuc();
    this.addDataForm.patchValue(this.data);
    this.setPhongBanBoPhan();
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
    if(this.listManager.length > 1) {
      this.openSnackBar('Chỉ chọn 1 người quản lý', 'Đóng');
      return;
    }
    const listIds = this.listManager.map(manager => manager.id);
    this.addDataForm.value.quanLyDuAnId = listIds[0];
    this.addDataForm.value.thanhVienDuAnIds = this.listThanhVien.map(item => item.id);
    this._duanNvChuyenMonService.update(this.data.id, this.addDataForm.value).subscribe(res => {
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

  getListBoPhan(): void {
    this._phongbanbophanService.getAllNoPaging().subscribe(res => {
      this.listBoPhan = res;
    });
  }

  selectPhongBanBoPhan(event): any {
    const id = event.value;
    var phongban = this.listBoPhan.find(item => item.id === id);
    this.setMember(phongban.thanhVien);
    this.setManager(phongban.quanLy);
  }

  setPhongBanBoPhan() {
    this.setMember(this.data.phongBanBoPhan.thanhVien);
    this.setManager(this.data.phongBanBoPhan.quanLy);
    this.listManager = Array.of(this.data.quanLyDuAn);
    this.listThanhVien = this.data.thanhVienDuAn;
  }

  getListLinhVuc(): void {
    this._linhvucService.getAllNoPaging().subscribe(res => {
      this.listLinhVuc = res;
    });
  }

  setMember(data) {
    this.allThanhVien = [...data];
    this.listThanhVien = [...data];
    this.filteredOptionThanhVien = this.addDataForm.get('searchThanhVien')?.valueChanges.pipe(
      startWith(null),
      map((item: any | null) => (item ? this._filterThanhVien(item) : this.allThanhVien.slice())),
      map(tvien => tvien.filter(m => !this.listThanhVien.some(i => i.userName === m.userName)))
    );
  }

  private _filterThanhVien(value: any): any[] {
    if (typeof (value) === 'object') {
      let res = this.allThanhVien.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));

      return res;
    }

    if (value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.allThanhVien.filter(item => (item.fullName.toLowerCase().includes(filterValue)
      || item.userName.toLowerCase().includes(filterValue)));
  }

  removeThanhVien(item: any): void {
    const index = this.listThanhVien.indexOf(item);

    if (index >= 0) {
      this.listThanhVien.splice(index, 1);
      this._changeDetectorRef.markForCheck();
      this.addDataForm.get('searchThanhVien')!.setValue(null);
      
      console.log(this.listThanhVien);
    }
  }

  selectedThanhVien(event: MatAutocompleteSelectedEvent): void {
    let selectedMember = event.option.value;
    this.listThanhVien.push(selectedMember);

    this.thanhvienInput.nativeElement.value = '';
    this.addDataForm.get('searchThanhVien')!.setValue(null);
  }

  setManager(data) {
    this.allManager = [...data];
    this.listManager = [...data];
    this.filteredOptionManager = this.addDataForm.get('searchManager')?.valueChanges.pipe(
      startWith(null),
      map((item: any | null) => (item ? this._filterManager(item) : this.allManager.slice())),
      map(tvien => tvien.filter(m => !this.listManager.some(i => i.userName === m.userName)))
    );
  }

  private _filterManager(value: any): any[] {
    if (typeof (value) === 'object') {
      let res = this.allManager.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));

      return res;
    }

    if (value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.allManager.filter(item => (item.fullName.toLowerCase().includes(filterValue)
      || item.userName.toLowerCase().includes(filterValue)));
  }

  removeManager(item: any): void {
    const index = this.listManager.indexOf(item);

    if (index >= 0) {
      this.listManager.splice(index, 1);
      this._changeDetectorRef.markForCheck();
      this.addDataForm.get('searchManager')!.setValue(null);
    }
  }

  selectedManager(event: MatAutocompleteSelectedEvent): void {
    let selectedMember = event.option.value;
    this.listManager.push(selectedMember);

    this.managerInput.nativeElement.value = '';
    this.addDataForm.get('searchManager')!.setValue(null);
  }
}
