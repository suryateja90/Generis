import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-desktrade',
  standalone: true,
  imports: [TableModule, ChartModule,],
  templateUrl: './desktrade.component.html',  
})
export class DesktradeComponent implements OnInit {

  private documentStyle = getComputedStyle(document.documentElement);

  // create an array of products to match the view
  // in index.html
  public buyOpportunities = [
    {
      symbol: 'GM01',
      price: 123.45,
      volume: 65,
    },
    {
      symbol: 'GM02',
      price: 123.46,
      volume: 66,
    }
  ];

  public lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: this.documentStyle.getPropertyValue('--primary-500'),
        borderColor: this.documentStyle.getPropertyValue('--primary-500'),
        tension: .4
      },
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: this.documentStyle.getPropertyValue('--primary-200'),
        borderColor: this.documentStyle.getPropertyValue('--primary-200'),
        tension: .4
      }
    ]
  };

  private textColor = this.documentStyle.getPropertyValue('--text-color');
  private textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  private surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  public lineOptions = {
    plugins: {
      legend: {
        labels: {
          fontColor: this.textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder,
          drawBorder: false
        }
      },
    }
  };

  public sellOpportunities = this.buyOpportunities;
  public blotter = this.buyOpportunities;
  public balance = this.buyOpportunities;
  public summary = this.buyOpportunities;

  ngOnInit(): void {
  }

}
