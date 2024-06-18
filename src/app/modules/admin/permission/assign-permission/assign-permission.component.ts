import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FunctionService } from 'app/services/function.service';
import { Observable, catchError, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from 'app/services/role.service';
import { VaiTroService } from 'app/services/vaitro.service';
import { NhomChucNangService } from 'app/services/nhomchucnang.service';

@Component({
  selector: 'app-assign-permission',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSlideToggleModule, MatButtonModule,
    NgIf, NgFor, AsyncPipe
  ],
  templateUrl: './assign-permission.component.html',
})
export class AssignPermissionComponent {
  @Output() onClosed = new EventEmitter<any>();
  @Input() data: any = {};

  notificationsForm: UntypedFormGroup;
  items: Observable<any[]>;
  listFunctions: any;
  checkedItems: any[] = [];
  role:any;
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _nhomchucnangService: NhomChucNangService,
    private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _vaitroService: VaiTroService
  ) {
  }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    this.getFunctions();
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getFunctions() {
    this.checkedItems = [];
    this._vaitroService.get(this.data.id).subscribe(
      res => {
        let currentPermission = res.hrmNhomChucNang;
  
        this.items = this._nhomchucnangService.getAllNoPaging().pipe(
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

  save() {
    let data = {
      vaiTroId: this.data.id,
      nhomChucNangIds: this.checkedItems
    };

    this._nhomchucnangService.assignPermission(data).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
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
