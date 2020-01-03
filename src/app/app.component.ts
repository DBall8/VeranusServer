import { Component } from '@angular/core';

import { Monitor } from 'src/app/data-types/Monitor.js';
import { CircularBuffer } from 'src/app/data-types/CircularBuffer';

import * as io from 'socket.io-client';

const NUM_DATA_POINTS = 1000;

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

    tempBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
    humidBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
    lightBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);

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

        // Debug
        var date1 = new Date();
        var val = 0;

        setInterval(() =>
            {
                this.tempBuffer.push({x: new Date(), y:3})
            },
            1000
        )

        this.socket.on("update", (msg) => {
            this.temp = this.convertCToF(msg.temp);
            this.humid = msg.humid;
            this.light = msg.light;
            this.timeMs = msg.timestamp;

            this.tempBuffer.push({x: msg.timestamp, y: this.convertCToF(msg.temp)})
            this.humidBuffer.push({x: msg.timestamp, y: msg.humid})
            this.lightBuffer.push({x: msg.timestamp, y: msg.light})
        })
    }

    convertCToF(celsius: number){
        return (celsius * 9/5) + 32;
    }
}
