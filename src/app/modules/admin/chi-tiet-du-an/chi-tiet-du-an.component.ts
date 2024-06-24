import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DuAnNvChuyenMonService } from 'app/services/duan-nvchuyenmon.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NhomCongViecComponent } from '../nhom-cong-viec/nhom-cong-viec.component';

@Component({
  selector: 'app-chi-tiet-du-an',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatTabsModule, NhomCongViecComponent],
  templateUrl: './chi-tiet-du-an.component.html',
})
export class ChiTietDuAnComponent {

  id: string;
  model: any = {};
  constructor(private route: ActivatedRoute,
              private _duAnNvChuyenMonService: DuAnNvChuyenMonService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    // Now you can use this.id to fetch the details
    this._duAnNvChuyenMonService.get(this.id).subscribe(res => {
      this.model = res;
    });
  }
}
