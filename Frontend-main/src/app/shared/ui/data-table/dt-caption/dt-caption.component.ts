import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

import { DtColumnSelectorComponent } from "../dt-column-selector/dt-column-selector.component";
import { DataTransformerService } from '../services/data-transformer.service';

@Component({
  selector: 'app-dt-caption',
  templateUrl: './dt-caption.component.html',
  styles: [`
    :host ::ng-deep .p-splitbutton.p-button-rounded > .p-button.p-button-icon-only {
        height: 2.75rem;
    }
  `],
  standalone: true,
  imports: [NgTemplateOutlet, SplitButtonModule, ButtonModule, RippleModule, TooltipModule, DtColumnSelectorComponent],
})
export class DtCaptionComponent {
  public title$ = input<string>(undefined, { alias: 'title' });

  public transformer$ = input.required<DataTransformerService>({ alias: 'transformer' });

  public additionalActionsTemplate$ = contentChild('additionalActionsTemplate', { read: TemplateRef });

  public refreshBtnItems: MenuItem[] = [
    { label: 'Reset Hidden Columns', command: () => { this.transformer$().resetHiddenColumns(); } },
    { label: 'Reset Column Widths', command: () => { this.transformer$().resetColumnWidths(); } },
    { label: 'Reset Column Order', command: () => { this.transformer$().resetColumnOrder(); } },
  ];

  // --------------------------------------------------------------------------
  constructor() { }
}
