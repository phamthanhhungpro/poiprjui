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
import { Constants } from 'app/mock-api/common/constants';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatFormFieldModule, MatCheckboxModule, MatSelectModule,CdkScrollable, MatSlideToggleModule
  ],
  templateUrl: './new-user.component.html'
})
export class NewUserComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addUserForm: UntypedFormGroup;
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
  }

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _roleService: RoleService,
    private _userService: UserApiService,
    private _appService: AppService,
    private _snackBar: MatSnackBar,
    private _tenantService: TenantService
  ) {
    this.addUserForm = this._formBuilder.group({
      surName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passWord: ['', Validators.required],
      phone: [''],
      tenantId: ['', Validators.required],
      roleId: ['', Validators.required],
      avatar: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getApps();
    this.getTenant();
  }

  selectedFile: File | null = null;
  selectedFileURL: string | ArrayBuffer | null = null;
  avatarUrl: any = "";

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // Display the selected image preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedFileURL = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
    this.uploadImage();
  }

  uploadImage() {
    if (this.selectedFile) {
      this._userService.uploadAvatar(this.selectedFile)
        .subscribe(res => {
          // Handle response, e.g., update user profile with new avatar URL
          this.avatarUrl = res.avatarUrl;
        }, error => {
          console.error("Failed to upload avatar:", error);
        });
    }
  }

  // clear form when close drawer
  clearForm(): void {
    this.addUserForm.reset();
  }

  // close drawer and reset form
  cancelAdd(): void {
    this.drawer.close();
    this.clearForm();
  }

  // get list role to populate dropdown
  getRoles(): void {
    this._roleService.getAllNoPaging().subscribe(res => {

      this.roles = res;
      if (this.userInfo.role === Constants.ROLE_ADMIN) {
        this.roles = res.filter((role: any) => role.code === Constants.ROLE_MEMBER);
      }

      if (this.userInfo.role === Constants.ROLE_APPADMIN) {
        this.roles = res.filter((role: any) => role.code === Constants.ROLE_MEMBER || role.code === Constants.ROLE_ADMIN);
      }
    });
  }
  
  // get list tenant to populate dropdown
  getTenant(): void {
    this._tenantService.getAllNoPaging().subscribe(res => {
      this.tenants = res;
      if(this.tenants.length === 1) {
        this.addUserForm.get('tenantId')!.setValue(this.tenants[0].id);
      }
    });
  }

  // checkbox handle
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.appCheckbox.subtasks != null && this.appCheckbox.subtasks.length !== 0 && this.appCheckbox.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.appCheckbox.subtasks == null || this.appCheckbox.subtasks.length === 0) {
      return false;
    }

    if (this.appCheckbox.subtasks.filter(t => t.completed).length === this.appCheckbox.subtasks.length) {
      this.allComplete = true;
    }
    return this.appCheckbox.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }


  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.appCheckbox.subtasks == null || this.appCheckbox.subtasks.length === 0) {
      return;
    }
    this.appCheckbox.subtasks.forEach(t => (t.completed = completed));
  }

  uncheckAll() {
    this.allComplete = false;
    this.appCheckbox.completed = false;
    this.appCheckbox.subtasks.forEach(t => (t.completed = false));
  }

  // get list app to populate checkbox
  getApps(): void {
    this._appService.getByUser().subscribe(res => {
      this.appCheckbox.subtasks = res.map(item => {
        return { name: item.name, completed: false, color: 'primary', value: item.id };
      });
    });
  }

  // save data to db
  save() {
    var selectedApps = this.appCheckbox.subtasks.filter(t => t.completed).map(t => t.value);
    this.addUserForm.value.appIds = selectedApps;
    this.addUserForm.value.avatar = this.avatarUrl;

    this._userService.createUser(this.addUserForm.value).subscribe(
      (res) => {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
        this.drawer.close();
        this.clearForm();
      },
      (error) => {
        // Handle error if observable emits an error
        console.error('Error:', error);
        // You can also display an error message to the user if needed
        this.openSnackBar('Có lỗi xảy ra khi thực hiện thao tác', 'Đóng');
      }
    );
  }

    // snackbar
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {duration: 2000});
    }

}
