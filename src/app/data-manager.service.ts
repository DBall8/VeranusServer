import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { CircularBuffer } from 'src/app/data-types/CircularBuffer';

import * as io from 'socket.io-client';

const DEBUG: boolean = true;
const NUM_DATA_POINTS = 1000;

const httpHeaders: HttpHeaders = new HttpHeaders(
  {
    'Content-Type': 'application/json',
    'credentials': 'same-origin'
  }
)

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  temp: number;
  humid: number;
  light: number;
  timeMs: number;

  tempData: any[] = [];
  humidData: any[] = [];
  lightData: any[] = [];

  tempBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
  humidBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);
  lightBuffer: CircularBuffer = new CircularBuffer(NUM_DATA_POINTS);

  update: boolean;

  socket: any;

  constructor(private http: HttpClient) { 

    this.temp = 0;
    this.humid = 0;
    this.light = 0;
    this.timeMs = 0;

    var url: string = DEBUG ? "localhost:8001" : "https://veranus.site";
    this.socket = io(url, { secure: !DEBUG });

    this.socket.on("update", (msg) => {
      // Display new data
      this.temp = this.convertCToF(msg.temp);
      this.humid = msg.humid;
      this.light = msg.light;
      this.timeMs = msg.timestamp;

      // Add data to buffers for graphing
      this.tempBuffer.push({x: msg.timestamp, y: this.convertCToF(msg.temp)})
      this.humidBuffer.push({x: msg.timestamp, y: msg.humid})
      this.lightBuffer.push({ x: msg.timestamp, y: msg.light })

      // Update graphs
      this.refreshGraphs();
    })
  }

  loadData() {
    this.http.request("GET", "/data", {observe: 'response', headers: httpHeaders}).subscribe(
      (res: any) => 
      {
        // Load all data into the buffers used for graphing
        res.body.data.map((entry) => 
        {
          this.tempBuffer.push({x: entry.timestamp, y: this.convertCToF(entry.temp)})
          this.humidBuffer.push({x: entry.timestamp, y: entry.humid})
          this.lightBuffer.push({ x: entry.timestamp, y: entry.light })
        })

        // Display the most recent data
        this.temp = this.tempBuffer.getTop().y;
        this.humid = this.humidBuffer.getTop().y;
        this.light = this.lightBuffer.getTop().y;
        
        // Update graphs
        this.refreshGraphs();
      },
      (err) =>
      {
        console.error(err);
      })
  }

  convertCToF(celsius: number){
    return (celsius * 9/5) + 32;
  } 

  refreshGraphs() {
    // Copy each array again to get current data in correct order
    this.tempData.length = 0;
    this.tempData.push(...this.tempBuffer.getData());

    this.humidData.length = 0;
    this.humidData.push(...this.humidBuffer.getData());

    this.lightData.length = 0;
    this.lightData.push(...this.lightBuffer.getData());

    // Flip the update boolean to trigger the graphs to update
    // (since altering the arrays fails to trigger an update)
    this.update = !this.update;
}
}
