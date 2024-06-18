import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HosonhansuService } from 'app/services/hosonhansu.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserApiService } from 'app/services/user.service';
import { EditHosonhansuComponent } from '../edit-hosonhansu/edit-hosonhansu.component';

@Component({
  selector: 'app-thongtinchung',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, FuseDrawerComponent,
    MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule,
    RouterLink, CommonModule, EditHosonhansuComponent],
  templateUrl: './thongtinchung.component.html'
})
export class ThongtinchungComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: MatDrawer;
  id;
  accountForm: UntypedFormGroup;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};
  drawerComponent: 'new-data' | 'edit-data';
  hosoModel;
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserApiService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _hosonhansuService: HosonhansuService
  ) {
    // Create the form
    this.accountForm = this._formBuilder.group({
      userName: [''],
      maHoSo: [''],
      fullName: [''],
      tenKhac: [''],
      vanphong: [''],
      phongban: [''],
      email: [''],
      phone: [''],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    console.log(this.data);
    this.getInfo();

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

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }

  editData() {
    this.drawerComponent = 'edit-data';
    this.addDrawer.open();
  }

  getInfo() {
    this.id = this.route.snapshot.paramMap.get('id');
    this._hosonhansuService.get(this.id).subscribe(res =>
      {
        this.accountForm.get('userName').setValue(res.user.userName);
        this.accountForm.get('maHoSo').setValue(res.maHoSo);

        this.accountForm.get('fullName').setValue(res.user.fullName);
        this.accountForm.get('tenKhac').setValue(res.tenKhac);
        this.accountForm.get('vanphong').setValue(res.chiNhanhVanPhong?.name);
        this.accountForm.get('phongban').setValue(res.phongBanBoPhan?.name);
        this.accountForm.get('email').setValue(res.user.email);
        this.accountForm.get('phone').setValue(res.user.phone);

        this.hosoModel = res;
      }
    )
    console.log('ID:', this.id);
  }
}
