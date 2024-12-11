
import { Component } from '@angular/core';

import { DynamicLayoutComponent } from 'src/app/layout/dynamic-layout/dynamic-layout.component';
import { DynamicLayoutItem } from 'src/app/layout/dynamic-layout/dynamic-layout.model';

@Component({
  selector: 'app-arbitrade',
  standalone: true,
  imports: [DynamicLayoutComponent],
  templateUrl: './arbitrade.component.html',
})
export class ArbitradeComponent {

  defaultLayout: DynamicLayoutItem[] = [
    { id: 'app-opportunities', x: 0, y: 0, w: 12, h: 1, parameters: { Title: 'Control Panel' } },
    { id: 'app-opportunities', x: 0, y: 2, w: 6, h: 6, parameters: { Title: 'Buy opportunities' } },
    { id: 'app-opportunities', x: 6, y: 2, w: 6, h: 6, parameters: { Title: 'Sell opportunities' } },
    { id: 'app-report-data', x: 0, y: 6, w: 12, h: 6, parameters: { fixedReportKey: 1010, reportTitle: 'Orders Blotter' } },
  ];

}
