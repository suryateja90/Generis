import { Component, computed, DestroyRef, inject, input, OnInit, viewChild } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { DataTableComponent } from 'src/app/shared/ui/data-table/data-table/data-table.component';
import { setData } from 'src/app/shared/ui/data-table/data-table/data-table.models';
import { sortFn } from 'src/app/shared/ui/data-table/data-table/data-table.utils';
import { DtCaptionComponent } from 'src/app/shared/ui/data-table/dt-caption/dt-caption.component';
import { DataTransformerService } from 'src/app/shared/ui/data-table/services/data-transformer.service';
import { ReportingDataService } from 'src/app/shared/ui/data-table/services/reporting-data.service';
import { WebsocketMessageService } from 'src/app/shared/ui/data-table/services/websocket-message.service';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
  selector: 'app-blotter',
  templateUrl: './blotter.component.html',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%; // Ensure the host takes full available space.
    }
  `],
  standalone: true,
  imports: [DataTableComponent, DtCaptionComponent, ButtonModule, RippleModule, TooltipModule, TicketComponent],
  providers: [
    DataTransformerService, ReportingDataService, WebsocketMessageService
  ],
})
@RegisterWidget('app-blotter', PrimeIcons.SORT)
export class BlotterComponent implements OnInit {
  public parameters$ = input.required<any>({ alias: 'parameters' });

  public data = setData();

  public defaultParameters: any = {
    reportTitle: 'Orders Blotter',
    dataKey: 'f11_clordid',
    groupByField: 'master',
    groupingFunction: (row: unknown) => row['f11_clordid']?.split('.')?.[0],
    groupingSortField: 'f11_clordid',
    fixedReportKey: 1010,
    websocketMessageType: 'Reply',
  };

  public blotterTicketParameters: any = {
    name: 'blotter',
    type: 'Request',
  };

  public title$ = computed<string>(() => this.parameters$ ? this.parameters$()?.reportTitle : undefined);

  private groupByField$ = computed<string>(() => this.parameters$()?.groupByField);
  private groupingFunction$ = computed<(row: unknown) => {}>(() => this.parameters$()?.groupingFunction);
  private groupingSortField$ = computed<string>(() => this.parameters$()?.groupingSortField);

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
    this.data.group.field = this.groupByField$();

    let beforeProcessingItem = undefined;
    let beforeProcessingItems = undefined;
    if (this.groupingFunction$() && this.data.group.field) {
      beforeProcessingItem = (item: unknown) => {
        item[this.data.group.field] = this.groupingFunction$()(item);
        this.data.group.expandedRowKeys[item[this.data.group.field]] = true; // set default value for expanded
        return item;
      }

      beforeProcessingItems = (items: unknown[]) => {
        // If a grouping sort field is specified, sort the data based on that field
        const sortField = this.groupingSortField$();
        if (sortField) {
          items.sort((data1, data2) => sortFn(data1, data2, sortField, 1));
        }
      }
    }

    this.transformer.config({
      parameters: this.parameters$(),
      destroyRef: this.destroyRef,
      dataRef: this.data,
      dataTableRef: this.dataTableRef$(),
      beforeProcessingItem,
      beforeProcessingItems,
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
