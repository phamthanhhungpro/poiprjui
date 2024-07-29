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
import { PerRoleService } from 'app/services/app-permission/role.service';
import { PerFunctiontService } from 'app/services/app-permission/chucnang.service';

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
  role: any;

  listItem = [];
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _perFunctionService: PerFunctiontService,
    private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _perRoleService: PerRoleService
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
    this._perRoleService.getFunctionScopeByRole({ roleId: this.data.id }).subscribe(
      res => {
        this.role = res;

        this._perFunctionService.getAllGrouping().subscribe(res => {
          this.listItem = res;
          console.log(this.listItem);
          this.listItem.forEach(group => {
            group.listFunction.forEach(func => {
              if (this.role.some(role => role.perFunctionId === func.id)) {
                func.isSelected = true;
                func.selectedScope = func.scopes.find(sc => sc.id === this.role.find(role => role.perFunctionId === func.id).perScopeId);
              }
            });
          });
          this.changeDetector.detectChanges();
        });
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
    const selectedPermissions = this.listItem.map(group => ({
      groupName: group.groupName,
      functions: group.listFunction
        .filter(func => func.isSelected)
        .map(func => ({
          id: func.id,
          selectedScope: func.selectedScope
        }))
    }));

    let functionScopes = [];
    selectedPermissions.forEach(group => {
      group.functions.forEach(func => {
        functionScopes.push({
          functionId: func.id,
          scopeId: func.selectedScope?.id
        });
      });
    });

    let data = {
      roleId: this.data.id,
      functionScopes: functionScopes
    }
    this._perRoleService.assignFuncToRole(data).subscribe(res => {
      if (res.isSucceeded) {
        this.openSnackBar('Thao tác thành công', 'Đóng');
        this.onClosed.emit();
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
