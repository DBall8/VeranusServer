import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-time-stamp',
  templateUrl: './time-stamp.component.html',
  styleUrls: ['./time-stamp.component.css']
})
export class TimeStampComponent implements OnInit {

  @Input() timeMs: number;

  pm: boolean;

  constructor() {
    this.pm = false;
  }

  ngOnInit() {
  }

  getMonth(timeMs: number){
    return new Date(timeMs).getMonth() + 1;
  }

  getDay(timeMs: number){
    return new Date(timeMs).getDate();
  }

  getHour(timeMs: number){
    var hours: number = new Date(timeMs).getHours();
    this.pm = (hours > 11);
    if (hours > 12) hours = hours - 12;
    if (hours == 0) hours = 12;
    return hours;
  }

  getMinute(timeMs: number){
    var minutes = new Date(timeMs).getMinutes();
    return (minutes < 10) ? ("0" + minutes) : minutes;
  }

}
