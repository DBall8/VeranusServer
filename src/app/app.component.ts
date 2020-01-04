import { Component } from '@angular/core';

import { Monitor } from 'src/app/data-types/Monitor.js';
import { DataManagerService } from 'src/app/data-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Veranus';

    tempMonitor: Monitor;
    humidMonitor: Monitor;
    lightMonitor: Monitor;

    constructor(private dataManager: DataManagerService) {
        this.tempMonitor = new Monitor(74, 70, false);
        this.humidMonitor = new Monitor(30, 50, true);
        this.lightMonitor = new Monitor(50, 10, false);

        this.dataManager.loadData();
    }
}
