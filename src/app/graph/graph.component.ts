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

  @ViewChild('graph', {static: true}) private graphElement;
  chart: any;

  constructor() {
    setInterval(() => {this.chart.update();}, 1500);
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
              backgroundColor: 'rgb(0, 0, 0)',
              borderColor: 'rgb(0, 0, 0)',
              data: this.data,
            }
          ]
        },
        options: {
          scales: {
              xAxes: [{
                  type: 'time',
                  time: { unit: "day" },
                  distribution: "linear",
                  displayFormat: 
                  {
                    day: "MMM d",
                  },
                  position: 'bottom'
              }]
          }
      }
      }
    )
  }

  onChanges()
  {
    console.log("CHANGES");
  }
}
