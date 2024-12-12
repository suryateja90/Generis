import { Component, DestroyRef, inject, input, OnInit, viewChild } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { DataTableComponent } from 'src/app/shared/ui/data-table/data-table/data-table.component';
import { setData } from 'src/app/shared/ui/data-table/data-table/data-table.models';
import { DtCaptionComponent } from 'src/app/shared/ui/data-table/dt-caption/dt-caption.component';
import { DataTransformerService } from 'src/app/shared/ui/data-table/services/data-transformer.service';
import { ReportingDataService } from 'src/app/shared/ui/data-table/services/reporting-data.service';

@Component({
  selector: 'app-report-data',
  templateUrl: './report-data.component.html',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%; // Ensure the host takes full available space.
    }
  `],
  standalone: true,
  imports: [DataTableComponent, DtCaptionComponent],
  providers: [
    DataTransformerService, ReportingDataService
  ],
})
@RegisterWidget('app-report-data', PrimeIcons.TABLE)
export class ReportDataComponent implements OnInit {

  public parameters$ = input.required<any>({ alias: 'parameters' });

  public data = setData();

  private dataTableRef$ = viewChild('dataTableRef', { read: DataTableComponent });

  private destroyRef = inject(DestroyRef);

  // --------------------------------------------------------------------------
  constructor(
    protected transformer: DataTransformerService,
    private reportingDataService: ReportingDataService,
  ) {
  }

  // --------------------------------------------------------------------------
  ngOnInit(): void {
    this.transformer.config({
      parameters: this.parameters$(),
      destroyRef: this.destroyRef,
      dataRef: this.data,
      dataTableRef: this.dataTableRef$(),
      dataLoadCompleted: this.reportingDataService.dataLoadCompleted,
      updateReportDataItem: this.reportingDataService.updateReportDataItem,
      setParameterForReport: this.reportingDataService.setParameterForReport,
    });

    this.reportingDataService.config({
      parameters: this.parameters$(),
      destroyRef: this.destroyRef,
      data: this.transformer.processData,
      dataLoadingStatus: this.transformer.processDataLoadingStatus,
      error: this.transformer.processError,
      dataOptions: this.transformer.processDataOptions,
    });
  }
}