import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-time-stamp',
  templateUrl: './time-stamp.component.html',
  styleUrls: ['./time-stamp.component.css']
})
export class TimeStampComponent implements OnInit {

  @Input() timeMs: number;

  constructor() {
  }

  ngOnInit() {
  }

  getMonth(timeMs: number){
    return new Date(timeMs).getMonth() + 1;
  }

  getDay(timeMs: number){
    return new Date(timeMs).getDay();
  }

  getHour(timeMs: number){
    return new Date(timeMs).getHours();
  }

  getMinute(timeMs: number){
    return new Date(timeMs).getMinutes();
  }

}
