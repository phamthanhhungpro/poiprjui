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
import { CoquandonviService } from 'app/services/coquandonvi.service';
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { map, startWith } from 'rxjs';
import { UserApiService } from 'app/services/user.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-phongban',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule, MatSelectModule
  ],
  templateUrl: './create-phongban.component.html'
})
export class CreatePhongbanComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  listManager = [];
  filteredOptions: any;
  allManagers: any;

  listBoPhan: any;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _phongbanbophanService: PhongBanBoPhanService,
    private _snackBar: MatSnackBar,
    private _userService: UserApiService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.addDataForm = this._formBuilder.group({
      name: ['', Validators.required],
      address: [''],
      email: [''],
      phone: [''],
      description: [''],
      searchManager: [''],
      parentId: [null]
    });
  }

  ngOnInit(): void {
    this.getListCanBeAdmin();
    this.getListBoPhan();
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
    const listIds = this.listManager.map(manager => manager.id);
    this.addDataForm.value.managerIds = listIds;
    this._phongbanbophanService.create(this.addDataForm.value).subscribe(res => {
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

  getListCanBeAdmin() {
    this._userService.getListAdmin().subscribe(res => {
      this.allManagers = res;
      this.filteredOptions = this.addDataForm.get('searchManager')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())),
        map(managers => managers.filter(m => !this.listManager.some(i => i.userName === m.userName)))
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

  selected(event: MatAutocompleteSelectedEvent): void {
    let selectedUser = event.option.value;
    this.listManager.push(selectedUser);

    this.managerInput.nativeElement.value = '';
    this.addDataForm.get('searchManager')!.setValue(null);
  }

  getListBoPhan(): void {
    this._phongbanbophanService.getAllNoPaging().subscribe(res => {
      this.listBoPhan = res;
    });
  }
}
