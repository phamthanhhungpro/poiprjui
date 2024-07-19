import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { VaiTroService } from 'app/services/vaitro.service';
import { PerRoleService } from 'app/services/app-permission/role.service';

@Component({
  selector: 'app-create-vaitro-hethong',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
  ],
  templateUrl: './create-vaitro-hethong.component.html'
})
export class CreateVaitroHeThongComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();

  addDataForm: UntypedFormGroup;

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _perRoleService: PerRoleService,
    private _snackBar: MatSnackBar,
  ) {
    this.addDataForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
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
    this._perRoleService.create(this.addDataForm.value).subscribe(res => {
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
}
