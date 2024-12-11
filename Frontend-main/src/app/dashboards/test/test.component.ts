// strc/app/dashboards/test/test.component.ts
import { Component } from '@angular/core';
import { DynamicLayoutComponent } from 'src/app/layout/dynamic-layout/dynamic-layout.component';
import { DynamicLayoutItem } from 'src/app/layout/dynamic-layout/dynamic-layout.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [DynamicLayoutComponent],
})
export class TestComponent {
  
  public defaultLayout: DynamicLayoutItem[] = [
    { id: 'app-test-widget', x: 0, y: 0, w: 6, h: 6, parameters: { title: 'Title 1', subTitle: 'Subtitle 1', count: 1 }, },
    { id: 'app-echo', x: 6, y: 0, w: 6, h: 6, },
    { id: 'app-parameters-set', x: 0, y: 6, w: 6, h: 6, },
    { id: 'app-parameters-view', x: 6, y: 6, w: 6, h: 6, },
    { id: 'app-test-widget', x: 0, y: 12, w: 6, h: 6, parameters: { title: 'Title 2', subTitle: 'Subtitle 2', count: 2 }, },
  ];   

}
