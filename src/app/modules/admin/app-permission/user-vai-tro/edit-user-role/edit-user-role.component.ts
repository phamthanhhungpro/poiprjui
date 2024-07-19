import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService } from 'app/services/role.service';
import { MatSelectModule } from '@angular/material/select';
import { UserApiService } from 'app/services/user.service';
import { Task } from 'app/model/checkbox.model';
import { AppService } from 'app/services/app.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantService } from 'app/services/tenant.service';
import { isSsaRole } from 'app/mock-api/common/user/roleHelper';
import { Constants } from 'app/mock-api/common/constants';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerRoleService } from 'app/services/app-permission/role.service';

@Component({
  selector: 'app-edit-user-role',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatCheckboxModule, MatSelectModule, CdkScrollable, MatSlideToggleModule
  ],
  templateUrl: './edit-user-role.component.html'
})
export class EditUserRoleComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};

  editUserForm: UntypedFormGroup;
  roles: any = [];
  tenants: any = [];

  appCheckbox: Task = {
    name: 'Chọn tất cả',
    completed: false,
    color: 'primary',
    subtasks: [
    ],
  };

  userInfo = {
    role: localStorage.getItem('role'),
    tenantId: localStorage.getItem('tenantId'),
    userId: localStorage.getItem('userId')
  };

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private perRoleService: PerRoleService,
    private _userService: UserApiService,
    private _appService: AppService,
    private _snackBar: MatSnackBar,
    private _tenantService: TenantService
  ) {
    this.editUserForm = this._formBuilder.group({
      perRoleId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoles();

    this.editUserForm.patchValue(this.data);
  };


  // clear form when close drawer
  clearForm(): void {
    this.editUserForm.reset();
  }

  // close drawer and reset form
  cancelEdit(): void {
    this.drawer.close();
    this.clearForm();
  }

  // get list role to populate dropdown
  getRoles(): void {
    this.perRoleService.getAllNoPaging().subscribe(res => {
      this.roles = res;
    })
  }

  // save data to db
  save() {
    this.editUserForm.value.userId = this.data.id;
    this.perRoleService.assignRoleToUser(this.editUserForm.value).subscribe(res => {
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

  // get user by id 
  getUserById() {
    this._userService.get(this.data.id).subscribe(res => {
      this.editUserForm.patchValue(res);

      // patch value for dropdown
    })
  }

  isSsaRole() {
    return isSsaRole(this.data.roleCode);
  }
}
