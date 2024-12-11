import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrderListModule } from 'primeng/orderlist';

import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { selectProfile } from 'src/app/store/profile/profile.selectors';
import { ColumnSelector, OrderListColumn } from '../data-table/data-table.models';
import { DataTransformerService } from '../services/data-transformer.service';

@Component({
  selector: 'app-dt-column-selector',
  standalone: true,
  templateUrl: './dt-column-selector.component.html',
  styleUrl: './dt-column-selector.component.scss',
  imports: [DialogModule, ButtonModule, RippleModule, TooltipModule, OrderListModule, InputSwitchModule, FormsModule],
})
export class DtColumnSelectorComponent {
  public title$ = input<string>(undefined, { alias: 'title' });

  public transformer$ = input.required<DataTransformerService>({ alias: 'transformer' });

  public applyColumnSelection$ = output<boolean>({ alias: 'applyColumnSelection' });

  public profile$ = this.store.selectSignal(selectProfile);
  public columnSelectorTrackBy: Function = (index: number, item: OrderListColumn) => item.field;

  public columnSelector: ColumnSelector = {
    columns: [],
    selection: [],
    visible: false
  }

  // --------------------------------------------------------------------------
  constructor(private store: Store) { }

  // --------------------------------------------------------------------------
  public showColumnSelectorDialog() {
    this.columnSelector.columns = this.transformer$().getColumnsForSelection();
    this.columnSelector.selection = [];
    this.columnSelector.visible = true; // show dialog box
  }

  // --------------------------------------------------------------------------
  public orderReset() {
    this.columnSelector.columns.sort((a, b) => (a.defaultOrder ?? 0) - (b.defaultOrder ?? 1));
    this.columnSelector.columns = [...this.columnSelector.columns];
  }

  // --------------------------------------------------------------------------
  public applyColumnSelection(isAdmin: boolean) {
    this.transformer$().onApplyColumnSelection(this.columnSelector, isAdmin);
  }
}
