import { Component, computed, DestroyRef, effect, inject, input, Pipe, PipeTransform, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ExtractSignalPipe } from 'src/app/utils/extract-signal-pipe';
import { CommonModule, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { setData } from 'src/app/shared/ui/data-table/data-table/data-table.models';
import { DataTableComponent } from 'src/app/shared/ui/data-table/data-table/data-table.component';
import { sortFn } from 'src/app/shared/ui/data-table/data-table/data-table.utils';
import { DataTransformerService } from 'src/app/shared/ui/data-table/services/data-transformer.service';
import { ReportingDataService } from 'src/app/shared/ui/data-table/services/reporting-data.service';
import { WebsocketMessageService } from 'src/app/shared/ui/data-table/services/websocket-message.service';
import { RippleModule } from 'primeng/ripple';
import { DtCaptionComponent } from 'src/app/shared/ui/data-table/dt-caption/dt-caption.component';

// stock watchlist using Angular 18 Signals: Simple, Computed and Wrtitable

class Stock {
  symbol: string;
  volume: number;
  price: WritableSignal<number>;
  open: number;
  change: Signal<number>;

  constructor(symbol: string, volume: number, price: number) {
    this.symbol = symbol;
    this.volume = volume;
    this.price = signal(price);
    this.open = price;
    this.change = computed(() => Math.floor(1000 * this.price() / this.open - 1000) / 10);
  }

}

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [DataTableComponent, DtCaptionComponent, ButtonModule, RippleModule, TooltipModule],
  providers: [
    DataTransformerService, ReportingDataService, WebsocketMessageService
  ],
  templateUrl: './opportunities.component.html',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%; // Ensure the host takes full available space.
    }
  `]
})
@RegisterWidget('app-opportunities')
export class OpportunitiesComponent {

  public parameters$ = input.required<any>({ alias: 'parameters' });

  public data = setData();

  public defaultParameters: any = {
    reportTitle: 'Oppurtunity Report',
    dataKey: 'f11_clordid',
    // groupByField: 'master',
    // groupingFunction: (row: unknown) => row['f11_clordid']?.split('.')?.[0],
    // groupingSortField: 'f11_clordid',
    fixedReportKey: 1010,
    websocketMessageType: 'Oppurtunity',
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

    console.debug('Parameters:', this.parameters$());
    console.debug('Transformer Data:', this.transformer.processData);

    this.websocketMessageService.config({
      parameters: this.parameters$(),
      destroyRef: this.destroyRef,
      data: this.transformer.upsertData
    });

    console.debug('Parameters2:', this.parameters$());
    console.debug('Transformer Data2:', this.transformer.upsertData);
  }

  // --------------------------------------------------------------------------
  showDialog(action: string) {
    console.debug(action);
  }
}
