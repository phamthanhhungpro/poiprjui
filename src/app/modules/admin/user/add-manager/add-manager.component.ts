import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { UserService } from 'app/core/user/user.service';
import { UserApiService } from 'app/services/user.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-manager',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatAutocompleteModule,
    MatChipsModule],
  templateUrl: './add-manager.component.html',
})
export class AddManagerComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};
  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;

  addManagerForm: UntypedFormGroup;
  listManager = [];
  filteredOptions: any;
  allManagers: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.addManagerForm = this._formBuilder.group({
      fullName: [''],
      searchManager: ['']
    });
  }

  ngOnInit() {
    this.getListCanBeManager();
    this.getUserById();
    this.addManagerForm.patchValue(this.data);
  }

  // get user by id 
  getUserById() {
    this._userService.get(this.data.id).subscribe(res => {
      this.listManager = res.managers;
      this.addManagerForm.get('searchManager')!.setValue(null);
    })
  }
  save() {
    if(this.listManager.length <= 10) {
    // get list id from listManager
    const listIds = this.listManager.map(manager => manager.id);

    let model = {
      managerIds: listIds,
      isActive: this.data.isActive
    }
    this._userService.update(this.data.id, model).subscribe(
      (res) => {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
        this.drawer.close();
      },
      (error) => {
        // Handle error if observable emits an error
        console.error('Error:', error);
        // You can also display an error message to the user if needed
        this.openSnackBar('Có lỗi xảy ra khi thực hiện thao tác', 'Đóng');
      }
    );
    }

  }

  // close drawer and reset form
  cancelEdit(): void {
    this.drawer.close();
  }

  getListCanBeManager() {
    var query = {
      userId: this.data.id,
      userTenantId: this.data.tenantId
    }
    this._userService.getListCanbeManager(query).subscribe(res =>
      {
        this.allManagers = res;
        this.filteredOptions = this.addManagerForm.get('searchManager')?.valueChanges.pipe(
          startWith(null),
          map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())),
          map(managers => managers.filter(m => !this.listManager.some(i => i.userName === m.userName)))
        );
      }
    );
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
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
      this.addManagerForm.get('searchManager')!.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let selectedUser = event.option.value;
    this.listManager.push(selectedUser);

    this.managerInput.nativeElement.value = '';
    this.addManagerForm.get('searchManager')!.setValue(null);
  }

  private _filter(value: any): any[] {
    console.log('filter', value);

    if(typeof(value) === 'object') {
      let res = this.allManagers.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
      || item.userName.toLowerCase().includes(value.userName.toLowerCase())));

      console.log(res);
      return res;
    }

    if(value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.allManagers.filter(item => (item.fullName.toLowerCase().includes(filterValue)
                                || item.userName.toLowerCase().includes(filterValue)));
  }
}
