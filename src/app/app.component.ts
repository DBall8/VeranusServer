import { Component } from '@angular/core';

import { Monitor } from 'src/app/data-types/Monitor.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Veranus';

    temp: Float32Array;
    humid: Float32Array;
    light: Float32Array;

    tempMonitor: Monitor;
    humidMonitor: Monitor;
    lightMonitor: Monitor;

    constructor() {
        this.temp = 401.1;
        this.humid = 402.2
        this.light = 403.3

        this.tempMonitor = new Monitor(100, 410, 420);
        this.humidMonitor = new Monitor(100, 200, 300);
        this.lightMonitor = new Monitor(100, 380, 390);

        setInterval(() => {
            this.temp++;
            this.humid--;
        }, 1000);
    }
}
