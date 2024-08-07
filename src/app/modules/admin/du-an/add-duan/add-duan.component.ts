import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';
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
import {MatRadioModule} from '@angular/material/radio';
import { ToNhomService } from 'app/services/tonhom.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';

@Component({
  selector: 'app-add-duan',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatAutocompleteModule, MatChipsModule, MatSelectModule, MatRadioModule, MatSlideToggleModule, SearchableSelectComponent
  ],
  templateUrl: './add-duan.component.html',
})
export class AddDuanComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;
  listBoPhan;
  listLinhVuc;
  listToNhom;

  @ViewChild('thanhvienInput') thanhvienInput: ElementRef<HTMLInputElement>;
  listThanhVien = [];
  filteredOptionThanhVien: any;
  allThanhVien: any;

  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  listManager = [];
  filteredOptionManager: any;
  allManager: any;

  listDuAnCanCopy = [];
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _phongbanbophanService: PhongBanBoPhanService,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private _linhvucService: LinhVucService,
    private _duanNvChuyenMonService: DuAnNvChuyenMonService,
    private _toNhomService: ToNhomService,
  ) {
    this.addDataForm = this._formBuilder.group({
      tenDuAn: ['', Validators.required],
      moTaDuAn: [''],
      toNhomId: [null],
      phongBanBoPhanId: [null],
      quanLyDuAnId: [null, Validators.required],
      thoiGianBatDau: [new Date(), Validators.required],
      thoiGianKetThuc: [new Date(), Validators.required],
      linhVucId: [null, Validators.required],
      isNhiemVuChuyenMon: [false],
      searchThanhVien: [''],
      searchManager: [''],
      option: ['1'],
      isSaoChepThietLap: [false],
      duAnCanSaoChepId: [null]
    });

    this.addDataForm.get('option')?.valueChanges.subscribe(value => {
      if(value === '2') {
        console.log(value);

        // clear phongBanBoPhanId
        this.addDataForm.get('phongBanBoPhanId')!.setValue(null);
      } else {
        // clear toNhomId
        this.addDataForm.get('toNhomId')!.setValue(null);
      }
      this.listThanhVien = [];
      this.listManager = [];
      this.addDataForm.get('searchThanhVien')!.setValue(null);
      this.addDataForm.get('searchManager')!.setValue(null);
    });
  }

  ngOnInit(): void {
    this.getListBoPhan();
    this.getListLinhVuc();
    this.getListToNhom();
    this.getListDuAnCanCopy();
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
    this._duanNvChuyenMonService.create(this.addDataForm.value).subscribe(res => {
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

  getListToNhom(): void {
    this._toNhomService.getAllNoPaging().subscribe(res => {
      this.listToNhom = res;
    });
  }

  selectPhongBanBoPhan(event): any {
    const id = event.value;
    var phongban = this.listBoPhan.find(item => item.id === id);
    this.setMember(phongban.thanhVien);
    this.setManager(phongban.quanLy);
  }

  selectToNhom(event): any {
    const id = event.value;
    var tonhom = this.listToNhom.find(item => item.id === id);
    this.setMember(tonhom.thanhVien);
    this.setManager(tonhom.lanhDao);
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

  setDuAnCanCopy(event) {
    this.addDataForm.get('duAnCanSaoChepId')!.setValue(event);
  }

  getListDuAnCanCopy() {
    this._duanNvChuyenMonService.getAllDuAn().subscribe(res => {
      this.listDuAnCanCopy = res.map(item => ({ key: item.id, value: item.tenDuAn }));
    });
  }
}
