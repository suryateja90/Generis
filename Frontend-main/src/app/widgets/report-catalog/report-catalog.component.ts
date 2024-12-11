import { Component, computed, effect, input, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { selectApplicationParameter } from 'src/app/store/parameters/parameters.selectors';
import { loadReportData, loadReportDetail, loadReports, setSelectedReportId } from 'src/app/store/reporting/reporting.actions';
import { selectReports, selectReportsLoading } from 'src/app/store/reporting/reporting.selectors';
import { ReportingReportModel } from 'src/shared/models/reporting-report.model';

@Component({
  selector: 'app-report-catalog',
  templateUrl: './report-catalog.component.html',
  styleUrl: './report-catalog.component.scss',
  standalone: true,
  imports: [TreeModule,],
})
@RegisterWidget('app-report-catalog')
export class ReportCatalogComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  private reportsData$ = this.store.selectSignal(selectReports);
  private selectedReportKeyParam$ = this.store.selectSignal(selectApplicationParameter('REPORTING', 'selectedReportKey'));
  private selectedReportKey = computed(() => Number(this.selectedReportKeyParam$()));
  public loading$ = this.store.selectSignal(selectReportsLoading);

  public reportNodes$: Signal<Record<string, TreeNode<ReportingReportModel>>> = computed(() => this.reportsData$()?.list?.reduce((acc, item) => ({
    ...acc, [item.id]: { data: item, key: `${item.id}`, label: item.name, children: [], leaf: true }
  }), {}) ?? {});

  public selectedReportNode: TreeNode<ReportingReportModel> | null;

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

    // initial report selection persistence
    effect(() => {
      const selectedReportKey = this.selectedReportKey();

      if (this.selectedReportNode && selectedReportKey > 0) return; // only if not already set

      const reportNodes = this.reportNodes$();
      if (!reportNodes) return;

      this.selectedReportNode = selectedReportKey ? reportNodes[selectedReportKey] : null;
    });

    this.store.dispatch(loadReports());

  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  onSelectionChange(event: TreeNode<ReportingReportModel> | TreeNode<ReportingReportModel>[]) {

    // store the selected report on NgRX as a way to inform the depending widgets/components about it
    if (Array.isArray(event)) {
      this.onSelectionChange(event[0]);
    } else if (event.key != null) {
      const newId = Number(event.key);
      const selectedReportKey = this.selectedReportKey();
      if (newId === selectedReportKey) // just reload in case of same report selected again
      {
        this.store.dispatch(loadReportDetail({ reportId: selectedReportKey }));
        this.store.dispatch(loadReportData({ reportId: selectedReportKey }));
      }
      else {
        this.store.dispatch(setSelectedReportId({ reportId: newId }));
      }
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  get reportNodeValues(): TreeNode<ReportingReportModel>[] {
    return Object.values(this.reportNodes$());
  }
}
