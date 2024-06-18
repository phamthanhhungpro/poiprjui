import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ChamCongDiemDanhService } from 'app/services/chamcongdiemdanh.service';
import { TrangThai, TrangThaiLabel } from 'app/mock-api/common/constants';
import { GiaiTrinhComponent } from './giai-trinh/giai-trinh.component';

@Component({
  selector: 'app-chamcong-diemdanh',
  standalone: true,
  styles: [
  ],
  imports: [MatIconModule, RouterLink, MatButtonModule, CdkScrollable, NgIf,
    AsyncPipe, NgForOf, CurrencyPipe, MatButtonModule, MatMenuModule,
    FuseDrawerComponent, MatDividerModule, MatSidenavModule, CommonModule, FullCalendarModule, GiaiTrinhComponent],
  templateUrl: './chamcong-diemdanh.component.html'
})
export class ChamCongDiemDanhComponent {
  @ViewChild('addDrawer', { static: false }) addDrawer: FuseDrawerComponent;

  public data$;
  selectedData: any;

  drawerComponent: 'new-data' | 'edit-data';
  configForm: UntypedFormGroup;
  calendarOptions;
  userInfo = {
    role: localStorage.getItem('role'),
    tenantId: localStorage.getItem('tenantId'),
    userId: localStorage.getItem('userId')
  }
  @ViewChild('fullCalendar') calendarComponent: FullCalendarComponent;
  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _chamcongdiemdanhService: ChamCongDiemDanhService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.initCalendar();
  }

  ngAfterViewInit() {

  }

  addData() {
    this.drawerComponent = 'new-data';
    this.addDrawer.open();
  }

  closeDrawer() {
    this.addDrawer.close();
  }

  editData(role: any) {
    this.selectedData = role;
    this.drawerComponent = 'edit-data';
    this.addDrawer.open();
  }

  // we need this function to distroy the child component when drawer is closed
  drawerOpenedChanged(isOpened) {
    if (!isOpened) {
      this.drawerComponent = null;
    }
  }

  handleDateClick(arg) {
    //alert('Date clicked: ' + arg.dateStr);
  }

  handleEventClick(arg) {
    if (arg.event._def.extendedProps.trangthai === TrangThaiLabel[TrangThai.ChoGiaiTrinh]) {
      this.selectedData = arg.event;
      this.addData();
    }
  }

  initCalendar() {
    console.log('initCalendar');
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventOrder: 'start',
      events: [
      ],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      height: 'auto',
      locales: allLocales,
      locale: 'vi',
      eventContent: this.customEventContent.bind(this),
      datesSet: this.onDatesSet.bind(this) // Add datesSet callback
    };

    setTimeout(() => {
      this.calendarComponent.getApi().updateSize();
    }, 100);
  }

  onDatesSet(dateInfo) {
    const start = dateInfo.startStr;
    const end = dateInfo.endStr;
    this._chamcongdiemdanhService.getDataByUserId(this.userInfo.userId, { start, end }).subscribe((data) => {
      const calendarApi = this.calendarComponent.getApi();
      this.calendarComponent.getApi().removeAllEvents();
      data.map((item) => {
        const date = new Date(item.thoiGian).toISOString().split('T')[0];
        calendarApi.addEvent({
          id: item.id,
          title: item.hrmTrangThaiChamCong.tenTrangThai,
          start: date,
          trangthai: TrangThaiLabel[item.trangThai],
          congkhaibao: item.hrmCongKhaiBao?.tenCongKhaiBao,
          color: item.hrmTrangThaiChamCong.mauSac,
          isValid: item.trangThai === 1
        });
      });

      calendarApi.addEvent({
        daysOfWeek: [0, 6], //Sundays and saturdays
        display: 'background'
      });

      this.cdr.detectChanges();
    });
  }

  customEventContent(info) {
    let descriptionElement = document.createElement('div');
    if (info.event.extendedProps.congkhaibao) {
      descriptionElement.innerHTML = `<div class="">${info.event.extendedProps.congkhaibao}</div>`;
      descriptionElement.style.color = "#fff";
    }
    let iconElement = document.createElement('span');

    if (info.event.extendedProps.isValid) {
      iconElement.innerHTML = '✔';
      iconElement.style.color = info.event.backgroundColor;
      iconElement.style.marginLeft = '5px';
    }

    if (info.event.extendedProps.trangthai) {
      let trangthaiElement = document.createElement('span');
      trangthaiElement.innerHTML = info.event.extendedProps.trangthai;

      descriptionElement.appendChild(trangthaiElement);
    }

    let titleElement = document.createElement('div');
    titleElement.style.display = 'flex';
    titleElement.style.alignItems = 'center';
    // title wrap text
    titleElement.style.whiteSpace = 'normal';
    titleElement.innerHTML = `${info.event.title}`;
    titleElement.appendChild(iconElement);
    let arrayOfDomNodes = [titleElement, descriptionElement];

    return { domNodes: arrayOfDomNodes };
  }

  reloadData() {
    const calendarApi = this.calendarComponent.getApi();
    const view = calendarApi.view;

    // Function to format date to "YYYY-MM-DDTHH:MM:SS+07:00"
    function formatDateToUTC7(date: Date) {
      const utcDate = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // Adjust to UTC+07:00
      const isoString = utcDate.toISOString();
      return isoString.replace('Z', '+07:00'); // Replace 'Z' with '+07:00' for time zone
    }

    const start = formatDateToUTC7(view.activeStart);
    const end = formatDateToUTC7(view.activeEnd);

    this.onDatesSet({ startStr: start, endStr: end });
  }
}
