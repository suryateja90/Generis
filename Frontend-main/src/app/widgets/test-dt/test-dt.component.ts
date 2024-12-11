import { Component, effect, input, viewChild } from '@angular/core';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { DataTableComponent } from 'src/app/shared/ui/data-table/data-table/data-table.component';
import { setColumn, setData } from 'src/app/shared/ui/data-table/data-table/data-table.models';

@Component({
  selector: 'app-test-dt',
  standalone: true,
  templateUrl: './test-dt.component.html',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%; // Ensure the host takes full available space.
    }
  `],
  imports: [DataTableComponent],
})
@RegisterWidget('app-test-dt')
export class TestDtComponent {
  public parameters$ = input.required<any>({ alias: 'parameters' });

  public data = setData({ pageSize: 5 });

  private dataTableRef$ = viewChild('dataTableRef', { read: DataTableComponent });

  // --------------------------------------------------------------------------
  constructor() {
    effect(() => {
      const dataTableRef = this.dataTableRef$();
      if (dataTableRef) {
        dataTableRef.setColumns([
          setColumn({ field: 'col1', header: 'Name' }),
          setColumn({ field: 'col2', header: 'Age' }),
        ]);

        dataTableRef.setRows([
          { col1: 'Ioni Bowcher', col2: 45 },
          { col1: 'Elwin Sharvill', col2: 26 },
          { col1: 'Kati Rulapaugh', col2: 31 },
          { col1: 'Bernardo Dominic', col2: 29 },
          { col1: 'Ivan Magalhaes', col2: 38 },
          { col1: 'Josephine Darakjy', col2: 60 },
          { col1: 'Alisha Slusarski', col2: 42 },
          { col1: 'Will Smith', col2: 45 },
        ]);
      }
    });
  }
}
