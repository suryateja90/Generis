import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { selectReportingMessages } from '../../store/reporting/reporting.selectors';

@Component({
  selector: 'app-report-log',
  templateUrl: './report-log.component.html',
  styleUrl: './report-log.component.scss',
  standalone: true,
  imports: [DatePipe],
})
@RegisterWidget('app-report-log', PrimeIcons.DATABASE)
export class ReportConsoleComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset
  messages$ = this.store.selectSignal(selectReportingMessages);

  constructor(private store: Store) { }
}
