import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserApiService } from 'app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './profile-info.component.html',
})
export class ProfileInfoComponent {
  accountForm: UntypedFormGroup;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar
  ) {
    // Create the form
    this.accountForm = this._formBuilder.group({
      surName: [''],
      name: [''],
      roleName: [''],
      tenantName: [''],
      email: ['', Validators.email],
      phone: [''],
      userName: ['']
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.accountForm.patchValue(this.data);
    this.accountForm.get('roleName').setValue(this.data.role.name);
    this.accountForm.get('tenantName').setValue(this.data.tenant.name);

  }

  save() {
    this._userService.update(this.data.id, this.accountForm.value).subscribe(
      (res) => {
        this.onClosed.emit();
        this.openSnackBar('Thao tác thành công', 'Đóng');
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
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
