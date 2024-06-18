import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-event',
  standalone: true,
  imports: [CommonModule, FullCalendarModule ],
  templateUrl: './calendar-event.component.html',
  styleUrl: './calendar-event.component.scss'
})
export class CalendarEventComponent {
  calendarOptions: CalendarOptions;

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: [
        { title: 'Holiday', start: '2024-06-01' },
        { title: 'Forgot to check in', start: '2024-06-02' },
        { title: 'Waiting for explanation', start: '2024-06-02' },
        { title: 'Holiday', start: '2024-06-06' },
        { title: 'Confirmed', start: '2024-06-06' },
        { title: 'Late', start: '2024-06-09' },
        { title: 'Meeting', start: '2024-06-20' },
        { title: 'Working', start: '2024-06-20' },
        { title: 'Forgot to check out', start: '2024-06-21' },
        { title: 'Waiting for explanation', start: '2024-06-21' }
      ],
      dateClick: this.handleDateClick.bind(this)
    };
  }

  handleDateClick(arg) {
    alert('Date clicked: ' + arg.dateStr);
  }
}
