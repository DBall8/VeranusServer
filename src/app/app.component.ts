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

    tempData: any[] = [];
    humidData: any[] = [];
    lightData: any[] = [];

    tempBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
    humidBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
    lightBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);

    update: boolean;

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
        var entries = 0;

        setInterval(() =>
            {
                this.tempBuffer.push({ x: date1.setMinutes(date1.getMinutes() + 5), y: Math.random() * 100 })
                this.humidBuffer.push({ x: new Date(), y: Math.random() * 100 })
                this.lightBuffer.push({ x: new Date(), y: Math.random() * 100 })
                this.refreshCharts();
            entries++;
            console.log(entries);
            },
            100
        )

        this.socket.on("update", (msg) => {
            this.temp = this.convertCToF(msg.temp);
            this.humid = msg.humid;
            this.light = msg.light;
            this.timeMs = msg.timestamp;

            this.tempBuffer.push({x: msg.timestamp, y: this.convertCToF(msg.temp)})
            this.humidBuffer.push({x: msg.timestamp, y: msg.humid})
            this.lightBuffer.push({ x: msg.timestamp, y: msg.light })

            this.refreshCharts();
        })
    }

    convertCToF(celsius: number){
        return (celsius * 9/5) + 32;
    }

    refreshCharts() {
        this.tempData.length = 0;
        this.tempData.push(...this.tempBuffer.getData());

        this.humidData.length = 0;
        this.humidData.push(...this.humidBuffer.getData());

        this.lightData.length = 0;
        this.lightData.push(...this.lightBuffer.getData());

        this.update = !this.update;
    }
}
