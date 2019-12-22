import { Component, OnInit, Input } from '@angular/core';

import { Monitor } from 'src/app/data-types/Monitor.js';

const okColor: string = "#07ad00";
const warningColor: string = "#f6d628";
const dangerColor: string = "#ec0202";

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit {

    @Input() value: number;
    @Input() label: string;
    @Input() unit: string;
    @Input() monitor: Monitor;

    constructor() {
    }

    ngOnInit() {
    }

    getColor(value: number) {
        switch (this.monitor.getStatus(value))
        {
            case Monitor.OK:
                return okColor;
            case Monitor.WARNING:
                return warningColor
            case Monitor.DANGER:
                return dangerColor;
        }
    }

}
