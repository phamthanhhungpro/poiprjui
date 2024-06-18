import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from 'app/services/user.service';
import { passwordMatchValidator } from 'app/common/custom-validator';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
  selector: 'app-reset-pwd',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatAutocompleteModule, FuseAlertComponent ],
  templateUrl: './reset-pwd.component.html'
})
export class ResetPwdComponent {

  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};

  changePwdForm: UntypedFormGroup;
  
  userInfo = {
    role: localStorage.getItem('role'),
    tenantId: localStorage.getItem('tenantId'),
    userId: localStorage.getItem('userId')
  }
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar,) {
      this.changePwdForm = this._formBuilder.group({
        fullName: [''],
        newPwd: ['', Validators.required],
        reNewPwd: ['', Validators.required]
      },
      {
        validator: passwordMatchValidator('newPwd', 'reNewPwd')
      });
    
  }
  ngOnInit() {
    console.log(this.data);

    this.changePwdForm.patchValue(this.data);
  }

  get f() {
    return this.changePwdForm.controls;
  }

  save() {
    var data = {
      email: this.data.email,
      newPassword: this.changePwdForm.value.newPwd,
      resetCode: 'xjkeuy'
    };

    this._userService.resetPwd(data).subscribe(
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

  // close drawer and reset form
  cancelEdit(): void {
    this.drawer.close();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
