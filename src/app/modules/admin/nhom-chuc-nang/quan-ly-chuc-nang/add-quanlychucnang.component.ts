import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { NhomChucNangService } from 'app/services/nhomchucnang.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable, catchError, map, of } from 'rxjs';
import { ChucNangService } from 'app/services/chucnang.service';

@Component({
  selector: 'app-add-quanlychucnang',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, NgFor, MatDividerModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule, MatSlideToggleModule, AsyncPipe
  ],
  templateUrl: './add-quanlychucnang.component.html'
})
export class AddQuanLyChucNangComponent {
  @Input() drawer: MatDrawer;
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any;

  addFunctionForm: UntypedFormGroup;
  items: Observable<any[]>;
  checkedItems: any[] = [];

  /**
   *
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    private _nhomchucnangService: NhomChucNangService,
    private _snackBar: MatSnackBar,
    private _chucnangService: ChucNangService,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getFunctions();
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
    let data = {
      nhomChucNangId: this.data.id,
      chucNangIds: this.checkedItems
    };

    this._nhomchucnangService.assignChucNang(data).subscribe(res => {
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

  getFunctions() {
    this.checkedItems = [];
    this._nhomchucnangService.get(this.data.id).subscribe(
      res => {
        let currentPermission = res.hrmChucNang;
  
        this.items = this._chucnangService.getAllNoPaging().pipe(
          map(items => items.map(item => {
            
            const checked = currentPermission?.some(permission => permission.id === item.id);
            if(checked) {
              this.checkedItems.push(item.id);
            }
            return { ...item, checked };
          })),
          catchError(error => {
            console.error('Error in getAllNoPaging:', error);
            return of([]);
          })
        );
  
        // Manually trigger change detection
        this.changeDetector.detectChanges();
      },
      error => {
        console.error('Error in get:', error);
      }
    );
  }

  toggleChecked(item): void {
    item.checked = !item.checked;
    if (item.checked) {
      this.checkedItems.push(item.id);
    } else {
      const index = this.checkedItems.findIndex(i => i === item.id);
      if (index !== -1) {
        this.checkedItems.splice(index, 1);
      }
    }
  }
}
