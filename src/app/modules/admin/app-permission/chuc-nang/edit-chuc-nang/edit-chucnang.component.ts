import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { PerFunctiontService } from 'app/services/app-permission/chucnang.service';
import { PerGroupFunctionService } from 'app/services/app-permission/nhomchucnang.service';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-edit-chucnang',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule, SearchableSelectComponent, MatSlideToggleModule
  ],
  templateUrl: './edit-chucnang.component.html'
})
export class EditChucNangComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any;
  addFunctionForm: UntypedFormGroup;
  listNhomChucNang;
  selectedNhomChucNang;
  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _perFunctionService: PerFunctiontService,
    private _perGroupFunctionService: PerGroupFunctionService,
    private _snackBar: MatSnackBar,
  ) {
    this.addFunctionForm = this._formBuilder.group({
      name: ['', Validators.required],
      groupFunctionId: [null],
      isPublic: [false]
    });
  }

  ngOnInit(): void {
    this.getNhomChucNang();

    this.addFunctionForm.patchValue(this.data);
    this.selectedNhomChucNang = this.data.groupFunctionId;
  }

  // clear form when close drawer
  clearForm(): void {
    this.addFunctionForm.reset();
  }

  // close drawer and reset form
  cancelAdd(): void {
    this.drawer.close();
    this.clearForm();
  }

  // save data
  save(): void {
    this._perFunctionService.update(this.data.id, this.addFunctionForm.value).subscribe(res => {
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

  setNhomChucNang(nhomChucNangId: number): void {
    this.addFunctionForm.patchValue({ groupFunctionId: nhomChucNangId });
  }

  getNhomChucNang(): void {
    this._perGroupFunctionService.getAllNoPaging().subscribe(res => {
      this.listNhomChucNang = res.map(item => ({ key: item.id, value: item.name }));
    });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
