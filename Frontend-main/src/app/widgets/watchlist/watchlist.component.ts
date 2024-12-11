import { Component, computed, DestroyRef, inject, input, OnInit, viewChild } from '@angular/core';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { DataTableComponent } from 'src/app/shared/ui/data-table/data-table/data-table.component';
import { setData } from 'src/app/shared/ui/data-table/data-table/data-table.models';
import { DtCaptionComponent } from 'src/app/shared/ui/data-table/dt-caption/dt-caption.component';
import { DataTransformerService } from 'src/app/shared/ui/data-table/services/data-transformer.service';
import { ReportingDataService } from 'src/app/shared/ui/data-table/services/reporting-data.service';
import { WebsocketMessageService } from 'src/app/shared/ui/data-table/services/websocket-message.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
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
    DataTransformerService, ReportingDataService, WebsocketMessageService
  ],
})
@RegisterWidget('app-watchlist')
export class WatchlistComponent implements OnInit {
  public parameters$ = input.required<any>({ alias: 'parameters' });

  public data = setData();

  public defaultParameters: any = {
    reportTitle: 'Watchlist',
    dataKey: 'numero_instrumento',
    fixedReportKey: 1020,
    websocketMessageType: 'Trade',
  };

  public title$ = computed<string>(() => this.parameters$ ? this.parameters$()?.reportTitle : undefined);

  private dataTableRef$ = viewChild('dataTableRef', { read: DataTableComponent });

  private destroyRef = inject(DestroyRef);

  // --------------------------------------------------------------------------
  constructor(
    public transformer: DataTransformerService,
    private reportingDataService: ReportingDataService,
    private websocketMessageService: WebsocketMessageService,
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

    this.websocketMessageService.config({
      parameters: this.parameters$(),
      destroyRef: this.destroyRef,
      data: this.transformer.upsertData
    });
  }
}
