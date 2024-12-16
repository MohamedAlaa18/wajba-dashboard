import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-chart-lines',
  standalone: true,
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './chart-lines.component.html',
  styleUrls: ['./chart-lines.component.scss']
})
export class ChartLinesComponent implements OnChanges {
  @Input() color: string = '#F45859';

  public lineChartData = {
    labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Sales',
        data: [
          65, 59, 80, 81, 56, 55, 40, 72, 50, 62, 85, 47, 77, 55, 68,
          59, 61, 70, 52, 63, 49, 82, 65, 70, 57, 78, 60, 50, 68, 75, 58
        ],
        fill: true,
        borderColor: '#CCCCCC',
        backgroundColor: this.color,
        tension: 0.4,
        borderWidth: 1,
      },
    ]
  };

  public lineChartOptions = {
    responsive: true
  };

  public lineChartLegend = true;

  // Detect changes to @Input() color and update the chart data accordingly
  ngOnChanges(changes: SimpleChanges) {
    if (changes['color']) {
      this.updateChartColor(this.color);
    }
  }

  // Update the chart's background color dynamically
  updateChartColor(newColor: string) {
    this.lineChartData.datasets[0].backgroundColor = newColor;
  }
}
