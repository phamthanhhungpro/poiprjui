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
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map } from 'rxjs';
import { UserApiService } from 'app/services/user.service';

@Component({
  selector: 'app-edit-tonhom',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule, MatSelectModule
  ],
  templateUrl: './edit-tonhom.component.html'
})
export class EditToNhomComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};
  editDataForm: UntypedFormGroup;
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;
  listManager = [];
  filteredOptions: any;
  allManagers: any;
  selectedUser;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _tonhomService: ToNhomService,
    private _snackBar: MatSnackBar,
    private _userService: UserApiService,
    private _changeDetectorRef: ChangeDetectorRef,

  ) {
    this.editDataForm = this._formBuilder.group({
      tenToNhom: ['', Validators.required],
      description: [''],
      searchManager: [''],
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.editDataForm.patchValue(this.data);
    if(this.data.truongNhom) {
      this.selectedUser = this.data.truongNhom;
      this.editDataForm.get('searchManager')!.setValue(this.selectedUser.userName);
      this.editDataForm.get('searchManager')!.updateValueAndValidity({ emitEvent: true });    
    }
  }

  // clear form when close drawer
  clearForm(): void {
    this.editDataForm.reset();
  }

  // close drawer and reset form
  cancelAdd(): void {
    this.drawer.close();
    this.clearForm();
  }

  // save data
  save(): void {
    this.editDataForm.value.truongNhomId = this.selectedUser.id;
    this._tonhomService.update(this.data.id, this.editDataForm.value).subscribe(res => {
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
      this.filteredOptions = this.editDataForm.get('searchManager')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())));
    }
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUser = event.option.value;
    this.editDataForm.get('searchManager')!.setValue(this.selectedUser.userName);
    this.editDataForm.patchValue(this.selectedUser);
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
}
