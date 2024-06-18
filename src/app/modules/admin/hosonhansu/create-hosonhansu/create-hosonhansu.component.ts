import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user.service';
import { startWith, map } from 'rxjs';
import { HosonhansuService } from 'app/services/hosonhansu.service';
import {MatStepperModule} from '@angular/material/stepper';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { VaiTroService } from 'app/services/vaitro.service';
import { ChiNhanhService } from 'app/services/chinhanh.service';
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';
import { ViTriCongViecService } from 'app/services/vitricongviec.service';

@Component({
  selector: 'app-create-hosonhansu',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatAutocompleteModule,
    MatChipsModule, MatStepperModule, SearchableSelectComponent],
  templateUrl: './create-hosonhansu.component.html'
})
export class CreateHosonhansuComponent {
  @Input() drawer: MatDrawer;
  editAppUserForm: UntypedFormGroup;
  @Output() onClosed = new EventEmitter<any>();

  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;

  addDataForm: UntypedFormGroup;
  selectedUser: any = {};
  filteredOptions: any;
  allManagers: any;
  thongtinchungForm: UntypedFormGroup;
  phongbanForm: UntypedFormGroup;
  options;
  vanPhongOptions;
  phongBanOptions;
  viTriCongViecOptions;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar,
    private _hosonhansu: HosonhansuService,
    private _vaitroService: VaiTroService,
    private _vanphongService: ChiNhanhService,
    private _phongbanService: PhongBanBoPhanService,
    private _vitricongviecService: ViTriCongViecService) {
    this.addDataForm = this._formBuilder.group({
      fullName: [''],
      searchUserName: [''],
      phone: [''],
      email: ['']
    });

    this.thongtinchungForm = this._formBuilder.group({
      tenKhac: [''],
      ngaySinh: [''],
      noiSinh: [''],
      queQuan: [''],
      danToc: [''],
      tonGiao: [''],
      thuongTru: [''],
      noiO: [''],
    });

    this.phongbanForm = this._formBuilder.group({
      vaiTroId: [''],
      chiNhanhVanPhongId: [''],
      phongBanBoPhanId: [''],
      viTriCongViecId: [''],
    });
  }
  ngOnInit() {
    this.getListCanBeManager();
    this.getListVaiTro();
    this.getVanPhong();
    this.getPhongBan();
    this.getViTriCongViec();
  }

  save() {
    this.addDataForm.value.userId = this.selectedUser.id;

    const addData = this.addDataForm.value;
    const thongtinchungData = this.thongtinchungForm.value;
    const phongbanData = this.phongbanForm.value;
  
    const data = {
      ...addData,
      ...thongtinchungData,
      ...phongbanData
    };
  
    // Now you can send mergedData to your server or handle it as needed
    console.log(data);

    this._hosonhansu.create(data).subscribe(
      (res) => {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
        this.drawer.close();
      },
      (error) => {
        console.error('Error:', error);
        this.openSnackBar('Có lỗi xảy ra khi thực hiện thao tác', 'Đóng');
      }
    );

  }

  // close drawer and reset form
  cancelEdit(): void {
    this.drawer.close();
  }

  getListCanBeManager() {
    this._userService.getUserToCreateHoSoNhanSu().subscribe(res => {
      this.allManagers = res;
      this.filteredOptions = this.addDataForm.get('searchUserName')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice()))
      );
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUser = event.option.value;
    console.log(this.selectedUser);
    this.addDataForm.get('searchUserName')!.setValue(this.selectedUser.userName);
    this.addDataForm.patchValue(this.selectedUser);
  }

  private _filter(value: any): any[] {
    if (typeof (value) === 'object') {
      let res = this.allManagers.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));
      return res;
    }

    if (value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.allManagers.filter(item => (item.fullName.toLowerCase().includes(filterValue)
      || item.userName.toLowerCase().includes(filterValue)));
  }

  getListVaiTro() {
    this._vaitroService.getAllNoPaging().pipe(
      map(data => data.map(item => ({ key: item.id, value: item.tenVaiTro })))
    ).subscribe(data => {
      this.options = data;
    });
  }

  getVanPhong() {
    this._vanphongService.getAllNoPaging().pipe(
      map(data => data.map(item => ({ key: item.id, value: item.name })))
    ).subscribe(data => {
      this.vanPhongOptions = data;
    });
  }

  getPhongBan() {
    this._phongbanService.getAllNoPaging().pipe(
      map(data => data.map(item => ({ key: item.id, value: item.name })))
    ).subscribe(data => {
      this.phongBanOptions = data;
    });
  }

  getViTriCongViec() {
    this._vitricongviecService.getAllNoPaging().pipe(
      map(data => data.map(item => ({ key: item.id, value: item.tenViTri })))
    ).subscribe(data => {
      this.viTriCongViecOptions = data;
    });
  }

  setVaiTro(value)  {
    this.phongbanForm.get('vaiTroId')!.setValue(value);
  }

  setVanPhong(value)  {
    this.phongbanForm.get('chiNhanhVanPhongId')!.setValue(value);
  }

  setPhongBan(value)  {
    this.phongbanForm.get('phongBanBoPhanId')!.setValue(value);
  }

  setViTriCongViec(value)  {
    this.phongbanForm.get('viTriCongViecId')!.setValue(value);
  }
}
