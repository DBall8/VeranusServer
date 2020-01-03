import { Component, OnInit, ViewChild, Input} from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input() title: string;
  @Input() data: any[];
  @Input() color: string = 'black';

  @Input() update: boolean;

  @ViewChild('graph', {static: true}) private graphElement;
  chart: any;

  constructor() {
  }

  ngOnInit() {
    this.chart = new Chart(this.graphElement.nativeElement, 
      {
        type: 'line',
        data: {
          datasets:
          [
            {
              label: this.title,
              backgroundColor: this.color,
              borderColor: this.color,
              data: this.data,
            }
          ]
        },
        options: {
          legend: { display: false },
          scales: {
              xAxes: [{
                  ticks: {
                      fontColor: "black",
                      fontSize: 12,
                  },
                  type: 'time',
                  time:
                  {
                      unit: "hour",
                      unitStepSize: 12,
                      displayFormats:
                      {
                          hour: "MMM D hA",
                      },
                  },
                  position: 'bottom'
              }],
              yAxes: [{
                  ticks: {
                      fontColor: "black",
                      fontSize: 18,
                  },
              }]
          }
      }
      }
    )
  }

  ngOnChanges()
  {
      if (this.chart) this.chart.update();
  }
}
