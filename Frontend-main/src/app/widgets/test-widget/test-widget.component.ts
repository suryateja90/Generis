import { Component, computed, input } from '@angular/core';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';

@Component({
  selector: 'app-test-widget',
  templateUrl: './test-widget.component.html',
  standalone: true,
  imports: [],
})
@RegisterWidget('app-test-widget')
export class TestWidgetComponent {
  
  parameters$ = input.required<any>({ alias: 'parameters' });

  title$ = computed(() => this.parameters$()?.title || '<<title>>');
  subTitle$ = computed(() => this.parameters$()?.subTitle || '<<sub-title>>');
  count$ = computed(() => this.parameters$()?.count || 0);  
}
