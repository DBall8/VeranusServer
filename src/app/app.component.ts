import { Component } from '@angular/core';

import { Monitor } from 'src/app/data-types/Monitor.js';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Veranus';

    temp: number;
    humid: number;
    light: number;
    timeMs: number;

    tempMonitor: Monitor;
    humidMonitor: Monitor;
    lightMonitor: Monitor;

    socket: any;

    constructor() {
        this.temp = 0;
        this.humid = 0;
        this.light = 0;
        this.timeMs = 0;

        this.tempMonitor = new Monitor(74, 70, false);
        this.humidMonitor = new Monitor(30, 50, true);
        this.lightMonitor = new Monitor(50, 10, false);

        this.socket = io("https://veranus.site", { secure: true });

        this.socket.on("update", (msg) => {
            this.temp = this.convertCToF(msg.temp);;
            this.humid = msg.humid;
            this.light = msg.light;
            this.timeMs = msg.timestamp;
        })
    }

    convertCToF(celsius: number){
        return (celsius * 9/5) + 32;
    }
}
