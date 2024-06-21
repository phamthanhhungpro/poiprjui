import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToNhomService } from 'app/services/tonhom.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map } from 'rxjs';
import { UserApiService } from 'app/services/user.service';

@Component({
  selector: 'app-create-tonhom',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule, MatSelectModule
  ],
  templateUrl: './create-tonhom.component.html'
})
export class CreateToNhomComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  listManager = [];
  filteredOptions: any;
  allManagers: any;
  selectedUser;

  @ViewChild('thanhvienInput') thanhvienInput: ElementRef<HTMLInputElement>;
  listThanhVien = [];
  filteredOptionThanhVien: any;
  allThanhVien: any;
  selectedMember;

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _tonhomService: ToNhomService,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserApiService,


  ) {
    this.addDataForm = this._formBuilder.group({
      tenToNhom: ['', Validators.required],
      description: [''],
      searchManager: [''],
      searchThanhVien: [''],
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getMember();
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
    this.addDataForm.value.lanhDaoIds = this.listManager.map(item => item.id);
    this.addDataForm.value.memberIds = this.listThanhVien.map(item => item.id);
    this._tonhomService.create(this.addDataForm.value).subscribe(res => {
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

  getUser() {
    this._userService.getUserInTenant().subscribe(res => {
      this.allManagers = res;
      this.filteredOptions = this.addDataForm.get('searchManager')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())),
        map(managers => managers.filter(m => !this.listManager.some(i => i.userName === m.userName)))
      );
    }
    );
  }
  getMember() {
    this._userService.getUserInTenant().subscribe(res => {
      this.allThanhVien = res;
      this.filteredOptionThanhVien = this.addDataForm.get('searchThanhVien')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filterThanhVien(item) : this.allThanhVien.slice())),
        map(tvien => tvien.filter(m => !this.listThanhVien.some(i => i.userName === m.userName)))
      );
    }
    );
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

  add(event: MatChipInputEvent): void {
    // do nothing
    // don't allow to add by keyboard
  }

  remove(item: any): void {
    const index = this.listManager.indexOf(item);

    if (index >= 0) {
      this.listManager.splice(index, 1);
      this._changeDetectorRef.markForCheck();
      this.addDataForm.get('searchManager')!.setValue(null);
    }
  }

  removeThanhVien(item: any): void {
    const index = this.listThanhVien.indexOf(item);

    if (index >= 0) {
      this.listThanhVien.splice(index, 1);
      this._changeDetectorRef.markForCheck();
      this.addDataForm.get('searchThanhVien')!.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let selectedUser = event.option.value;
    this.listManager.push(selectedUser);

    this.managerInput.nativeElement.value = '';
    this.addDataForm.get('searchManager')!.setValue(null);
  }

  selectedThanhVien(event: MatAutocompleteSelectedEvent): void {
    let selectedMember = event.option.value;
    this.listThanhVien.push(selectedMember);

    this.thanhvienInput.nativeElement.value = '';
    this.addDataForm.get('searchThanhVien')!.setValue(null);
  }
}
