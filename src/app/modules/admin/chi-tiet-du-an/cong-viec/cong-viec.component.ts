import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogService } from 'app/common/dialog.service';
import { TagCongViecService } from 'app/services/tagcongviec.service';
import { CreateTagsCongViecComponent } from '../thiet-lap-du-an/tags-cong-viec/create-tagscongviec/create-tagscongviec.component';
import { CreateCongviecComponent } from './create-congviec/create-congviec.component';
import { DuAnSettingService } from 'app/services/duanSetting.service';
import { SettingConstants } from 'app/mock-api/common/constants';
import { CreateCongviecAdvanceComponent } from './create-congviec-advance/create-congviec-advance.component';
import { co } from '@fullcalendar/core/internal-common';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { CongViecService } from 'app/services/congviec.service';

@Component({
  selector: 'app-cong-viec',
  standalone: true,
  imports: [CommonModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './cong-viec.component.html',
})
export class CongViecComponent {
  id: string;
  duAnSetting: any;
  duAn: any;
  congViecGroupData = [];
  congViecGroup = [
    {
      name: 'NHÓM VIỆC 1',
      tasks: [
        {
          title: 'Việc 1',
          description: 'Mô tả việc 1',
          creator: 'Lê Đình Dũng',
          creatorHandle: 'dzungld',
          creationTime: '16:20:00 - 15/6/2024',
          dueDate: new Date('2024-06-20'),
          assignee: 'Lê Đình Dũng',
          status: 'Đang thực hiện'
        }
      ]
    },
    {
      name: 'NHÓM VIỆC 2',
      tasks: [
        {
          title: 'Việc 1',
          description: 'Mô tả việc 1',
          creator: 'Lê Đình Dũng',
          creatorHandle: 'dzungld',
          creationTime: '16:20:00 - 15/6/2024',
          dueDate: new Date('2024-06-20'),
          assignee: 'Lê Đình Dũng',
          status: 'Hoàn thành'
        },
        {
          title: 'Việc 2',
          description: 'Mô tả việc 2',
          creator: 'Lê Đình Dũng',
          creatorHandle: 'dzungld',
          creationTime: '16:20:00 - 15/6/2024',
          dueDate: new Date('2024-06-20'),
          assignee: 'Lê Đình Dũng',
          status: 'Đang thực hiện'
        }
      ]
    }
  ];

  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _duAnSettingService: DuAnSettingService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private _duAnService: DuAnNvChuyenMonService,
    private _congviecService: CongViecService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getThongTinDuAn();
    this.getTableData();
  }

  openCreateItemDialog(): void {
    var uiDefault = this.duAnSetting.find(x => x.key == SettingConstants.createCongViecUiDefault)?.value;

    const openDialog = (component: any, width: string) => {
      this.dialogService.openDialog(component,
        this.duAn,
        { width: width, height: 'auto' },
        this.getTableData.bind(this)
      )
        .subscribe(result => {
          if (result === 'expand') {
            this.dialogService.openDialog(CreateCongviecAdvanceComponent,
              this.duAn,
              { width: '900px', height: 'auto' },
              this.getTableData.bind(this)
            )
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
    this._congviecService.getCongViecGrid({duAnId: this.id}).subscribe(res => {
      this.congViecGroupData = res;
    });
  }

  getThongTinDuAn(): void {
    this._duAnService.get(this.id).subscribe(res => {
      this.duAn = res;
      this.duAnSetting = res.duAnSetting;
    });
  }
}
