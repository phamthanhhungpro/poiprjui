import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SearchableSelectComponent } from 'app/common/components/select-search/searchable-select.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogService } from 'app/common/dialog.service';
import { CongViecService } from 'app/services/congviec.service';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { SettingConstants } from 'app/mock-api/common/constants';
import { CreateCongviecAdvanceComponent } from '../chi-tiet-du-an/cong-viec/create-congviec-advance/create-congviec-advance.component';
import { CreateCongviecComponent } from '../chi-tiet-du-an/cong-viec/create-congviec/create-congviec.component';
import { EditCongviecComponent } from '../chi-tiet-du-an/cong-viec/detail-congviec/edit-congviec.component';
import { EditCongviecAdvanceComponent } from '../chi-tiet-du-an/cong-viec/edit-congviec-advance/edit-congviec-advance.component';
import { GiaHanFormComponent } from '../chi-tiet-du-an/cong-viec/gia-han-form/gia-han-form.component';

@Component({
  selector: 'app-quan-ly-cong-viec',
  standalone: true,
  imports: [    CommonModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    SearchableSelectComponent,
  RouterModule],
  templateUrl: './quan-ly-cong-viec.component.html',
})
export class QuanLyCongViecComponent {
  id: string;
  duAnSetting: any;
  duAn: any;
  congViecGroupData = [];

  // filter
  filterTaskName: string = '';
  dateRange: { start: Date, end: Date } | null = null;
  dateStart = null;
  dateEnd = null;
  filterNguoiThucHien: any[] = [];
  filterTrangThai: any[] = [];

  // paging
  pageIndex: number = 0;
  pageSize: number = 50; // Number of items per page
  totalItems: number = 0;
  totalPage: number = 0;
  isLoading: boolean = false;

  trangThaiSetting: any;
  thanhVienOptions= [];
  trangThaiOptions = [];
  scrollContainer: any;

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private _duAnService: DuAnNvChuyenMonService,
    private cdk: ChangeDetectorRef,
    private _congviecService: CongViecService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getThongTinDuAn();
    this.getTableData();
  }

  ngAfterViewInit() { }

  openCreateItemDialog(): void {
    var uiDefault = this.duAnSetting.find(x => x.key == SettingConstants.createCongViecUiDefault)?.value;

    const openDialog = (component: any, width: string) => {
      this.dialogService.openDialog(component,
        this.duAn,
        { width: width, height: 'auto' },
        this.applyFilter.bind(this)
      ).subscribe(result => {
        if (result === 'expand') {
          this.dialogService.openDialog(CreateCongviecAdvanceComponent,
            this.duAn,
            { width: '900px', height: 'auto' },
            this.applyFilter.bind(this)
          ).subscribe(result => {
            localStorage.removeItem('createCongViecForm');
          });
        };
      });
    };

    if (uiDefault == SettingConstants.createCongViecUiDefaultOptions[1].value) {
      openDialog(CreateCongviecAdvanceComponent, '900px');
    } else {
      openDialog(CreateCongviecComponent, '600px');
    }
  }

  getTableData(): void {
    if (this.isLoading || (this.totalItems && this.congViecGroupData.length >= this.totalItems)) {
      return;
    }

    this.isLoading = true;

    const filterRequest = {
      TaskName: this.filterTaskName,
      StartDate: this.dateStart ? this.dateStart : null,
      EndDate: this.dateEnd ? this.dateEnd : null,
      AssignedUserIds: this.filterNguoiThucHien,
      Status: this.filterTrangThai,
      PageIndex: this.pageIndex,
      PageSize: this.pageSize
    };

    this._congviecService.getQuanLyCongViec(filterRequest).subscribe(res => {
      // this.congViecGroupData = [...this.congViecGroupData, ...res.items];
      res.items.forEach(item => {
        if (this.congViecGroupData.find(g => g.nhomCongViecId === item.nhomCongViecId)) {
          this.congViecGroupData.find(g => g.nhomCongViecId === item.nhomCongViecId).listCongViec = this.congViecGroupData.find(g => g.nhomCongViecId === item.nhomCongViecId).listCongViec.concat(item.listCongViec);
          console.log(item.listCongViec);
        } else {
          this.congViecGroupData.push(item);
        }
      });
      this.totalItems = res.count;
      this.pageIndex++;
      this.isLoading = false;
      this.totalPage = Math.ceil(this.totalItems / this.pageSize);
    }, () => {
      this.isLoading = false;
    });
  }

  getThongTinDuAn(): void {
    // this._duAnService.get(this.id).subscribe(res => {
    //   this.duAn = res;
    //   this.duAnSetting = res.duAnSetting;
    //   this.trangThaiSetting = JSON.parse(this.duAnSetting.find(x => x.key == "trangThaiSetting")?.jsonValue);
    //   this.thanhVienOptions = res.thanhVienDuAn.map(x => ({ key: x.id, value: x.fullName }));
    //   this.trangThaiOptions = this.trangThaiSetting.map(x => ({ key: x.key, value: x.value }));
    // });
  }

  viewDetail(task): void {
    this.dialogService.openDialog(EditCongviecComponent,
      task,
      { width: '1200px', height: 'auto' },
      this.applyFilter.bind(this)
    ).subscribe(result => {});
  }

  giaHan(task) {
    this.dialogService.openDialog(GiaHanFormComponent,
      task,
      { width: '500px', height: 'auto' }
    ).subscribe(result => {});
  }

  deleteTask(task): void {
    var configForm = this._formBuilder.group({
      title: 'Xóa dữ liệu',
      message: 'Xóa dữ liệu này khỏi hệ thống? <span class="font-medium">Thao tác này không thể hoàn tác!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn',
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel',
        }),
      }),
      dismissible: true,
    });

    const dialogRef = this._fuseConfirmationService.open(configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._congviecService.delete(task.id).subscribe(() => {
          this.applyFilter();
        });
      }
    });
  }

  keyToValue(key: string): string {
    if (!this.trangThaiSetting) return '';
    return this.trangThaiSetting.find(x => x.key == key)?.value;
  }

  edit(task): void {
    let data = this.duAn;
    data.task = task;
    this.dialogService.openDialog(EditCongviecAdvanceComponent,
      data,
      { width: '900px', height: 'auto' },
      this.applyFilter.bind(this)
    ).subscribe(result => {});
  }

  applyFilter() {
    this.pageIndex = 0;
    this.congViecGroupData = [];
    this.getTableData();
  }

  setFilterNguoiThucHien(value: any) {
    this.filterNguoiThucHien = value;
    this.applyFilter();
  }

  setFilterTrangThai(value: any) {
    this.filterTrangThai = value;
    this.applyFilter();
  }

  clearFilter() {
    this.filterTaskName = '';
    this.dateStart = null;
    this.dateEnd = null;
    this.filterNguoiThucHien = [];
    this.filterTrangThai = [];
    this.applyFilter();
  }

  onScroll(): void {
    if (this.scrollContainer && this.scrollContainer.nativeElement && this.pageIndex < this.totalPage) {
      const container = this.scrollContainer.nativeElement;
      const threshold = container.scrollHeight - container.offsetHeight - 100;
      if (container.scrollTop >= threshold) {
        console.log('Scroll event fired');
        this.getTableData();
      }
    }
  }
}
