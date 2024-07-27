import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CongViecService } from 'app/services/congviec.service';
import { ActivatedRoute } from '@angular/router';
import { EditCongviecComponent } from '../cong-viec/detail-congviec/edit-congviec.component';
import { DialogService } from 'app/common/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban.component.html',
})
export class KanbanComponent implements OnInit {
  congviecKanban: any = [];
  id: string;
  connectedTo: string[] = [];

  constructor(
    private _congViecService: CongViecService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getCongViecKanban();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Call API to update item status
      console.log(event.container);
      const movedItem = event.container.data[event.currentIndex];
      this.updateItemStatus(movedItem, event.container.id);
    }

    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  getCongViecKanban(): void {
    this._congViecService.getCongViecKanban({ duanId: this.id }).subscribe(res => {
      this.congviecKanban = res;
      this.connectedTo = this.congviecKanban.map((list: any) => list.id);
    });
  }

  updateItemStatus(item: any, kanbanId): void {
    // Assuming you have an API endpoint to update the item status
    this._congViecService.updateKanbanStatus({ idCongViec: item.id, idKanban: kanbanId }).subscribe(
      res => {
        if(res.isSucceeded === true) {
          this.openSnackBar(res.message, 'Đóng');
          this.getCongViecKanban();
        }
      },
      err => {
        console.error('Error updating item status', err);
      }
    );
  }

  viewDetail(task): void {
    this.dialogService.openDialog(EditCongviecComponent,
      task,
      { width: '1200px', height: 'auto' },
      this.getCongViecKanban.bind(this)
    )
      .subscribe(result => {

      });
  }

  // snackbar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
