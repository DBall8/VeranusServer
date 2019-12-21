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

   @Input() value: Float32Array;
   @Input() label: string;
    @Input() unit: string;
    @Input() monitor: Monitor;

    constructor() {
    }

    ngOnInit() {
    }

    getColor(value: Float32Array) {
        if (value > this.monitor.okThreshold) {
            return okColor;
        }
        else if (value > this.monitor.warningThreshold) {
            return warningColor;
        }
        else {
            return dangerColor;
        }
    }

}
