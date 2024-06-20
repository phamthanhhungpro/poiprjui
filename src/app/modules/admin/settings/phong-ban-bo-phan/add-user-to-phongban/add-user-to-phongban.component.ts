import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user.service';
import { map, startWith } from 'rxjs';
import { AppService } from 'app/services/app.service';
import { Constants } from 'app/mock-api/common/constants';
import { PhongBanBoPhanService } from 'app/services/phongbanbophan.service';

@Component({
  selector: 'app-add-user-to-phongban',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatAutocompleteModule,
    MatChipsModule],
  templateUrl: './add-user-to-phongban.component.html',
})
export class AddUserToPhongBanComponent {
  @Input() drawer: MatDrawer;
  editAppUserForm: UntypedFormGroup;
  @Input() data: any = {};
  @Output() onClosed = new EventEmitter<any>();

  @ViewChild('managerInput') managerInput: ElementRef<HTMLInputElement>;

  addManagerForm: UntypedFormGroup;
  listManager = [];
  filteredOptions: any;
  allManagers: any;

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar,
    private _phongbanService: PhongBanBoPhanService,
    private _changeDetectorRef: ChangeDetectorRef,) {
    this.addManagerForm = this._formBuilder.group({
      name: [''],
      searchManager: ['']
    });
  }
  ngOnInit() {
    this.getListCanBeManager();
    this.listManager = this.data.thanhVien;
    this.addManagerForm.patchValue(this.data);
  }


  save() {
      // get list id from listManager
      const listIds = this.listManager.map(manager => manager.id);

      let model = {
        userIds: listIds,
        userType: ''
      };

      this._phongbanService.updatePhongBanUser(this.data.id, model).subscribe(
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
    this._userService.getUserInTenant().subscribe(res => {
      this.allManagers = res;
      this.filteredOptions = this.addManagerForm.get('searchManager')?.valueChanges.pipe(
        startWith(null),
        map((item: any | null) => (item ? this._filter(item) : this.allManagers.slice())),
        map(managers => managers.filter(m => !this.listManager.some(i => i.userName === m.userName)))
      );
    });
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
    if (typeof (value) === 'object') {
      let res = this.allManagers.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));

      console.log(res);
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
