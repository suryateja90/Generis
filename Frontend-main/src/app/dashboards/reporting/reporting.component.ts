import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { DynamicLayoutComponent } from 'src/app/layout/dynamic-layout/dynamic-layout.component';
import { DynamicLayoutItem } from 'src/app/layout/dynamic-layout/dynamic-layout.model';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss',
  standalone: true,
  imports: [DynamicLayoutComponent,],
})
export class ReportComponent {
  
  defaultLayout: DynamicLayoutItem[] = [    
    { id: 'app-report-catalog', x: 0, y: 0, w: 3, h: 12 },
    { id: 'app-report-prompt', x: 3, y: 0, w: 9, h: 3 },
    { id: 'app-report-data', x: 3, y: 3, w: 9, h: 6 },
    { id: 'app-report-log', x: 3, y: 9, w: 9, h: 3 },
  ];
  
  constructor(private breakpointObserver: BreakpointObserver,        
  ) {}
}