import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DateService } from '../shared/date.service';

interface Day {
  value: Moment,
  active: boolean,
  disabled: boolean,
  selected: boolean
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendar: Week[] | undefined;
  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  generate(now: Moment) {
    const startDay = now.clone().startOf('month').startOf('week').add(1, 'day');
    const endDay = now.clone().endOf('month').endOf('week').add(1, 'day');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];
    while(date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
        .fill(0)
        .map(()=>{
          const value = date.add(1, 'day').clone();
          const active = moment().isSame(value, 'date');
          const disabled = !now.isSame(value, 'month');
          const selected = now.isSame(value, 'date');

          return {
            value, active, disabled, selected
          }
        })
      })
    }

    this.calendar = calendar;
  }

  select(day: Moment): void {
    this.dateService.changeDate(day);
  }
}
