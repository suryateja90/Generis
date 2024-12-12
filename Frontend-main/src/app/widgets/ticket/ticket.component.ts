import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { selectApplicationParameters, selectParametersLoading } from 'src/app/store/parameters/parameters.selectors';
import { socketSendMessage } from 'src/app/store/websocket/websocket.actions';
import { WebsocketMessageModel, WebsocketMessageType } from 'src/shared/models/websocket-message.model';
import { TicketForm, TicketFormAction, TicketFormField } from './ticket.models';
import { toTicketFormFields } from './ticket.utils';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styles: ``,
  standalone: true,
  imports: [NgTemplateOutlet, DialogModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputNumberModule, CalendarModule, DropdownModule, ButtonModule, RippleModule, TooltipModule, NgClass],
  providers: [DatePipe,],
})
@RegisterWidget('app-ticket', PrimeIcons.BOOK)
export class TicketComponent {
  public title$ = input<string>(undefined, { alias: 'title' });

  public action$ = input<TicketFormAction>(undefined, { alias: 'action' });

  public parameters$ = input.required<any>({ alias: 'parameters' });

  public ticketForm: TicketForm = {
    action: undefined,
    form: undefined,
    fields: [],
    maxColspan: undefined,
  }

  public dialogVisible = false;

  // tailored layout layout saved on NgRX store
  public parametersLoading$ = this.store.selectSignal(selectParametersLoading);

  public name$ = computed<string>(() => this.parameters$ ? this.parameters$()?.name : undefined);
  public type$ = computed<WebsocketMessageType>(() => this.parameters$ ? this.parameters$()?.type : undefined);
  private appParams$ = this.store.selectSignal(selectApplicationParameters('ticket'));
  private savedParam$ = computed(() => this.appParams$()?.[this.name$()]);

  public formFields$ = computed<TicketFormField[]>(() => this.savedParam$() ? toTicketFormFields(JSON.parse(this.savedParam$())) : []);

  // --------------------------------------------------------------------------
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    effect(() => {
      this.ticketForm.action = this.action$();
    });

    effect(() => {
      const fields = this.formFields$();
      if (fields?.length) {
        this.ticketForm.form = this.fb.group(
          fields.reduce((ctrls, field) => ({ ...ctrls, [field.name]: this.fb.control(field.default) }), {}),
        );
        this.ticketForm.maxColspan = Math.max(...fields.map(f => f.colspan));
        this.ticketForm.fields = fields;
      }
      else {
        console.warn('Invalid fields.');
      }
    });
  }

  // ------------------------------------------------------------------------
  public showDialog(action: TicketFormAction, rowData: any) {
    rowData ??= {};

    // Set default for Add action
    if (action === 'Add') {
      this.ticketForm.fields.filter(f => f.default).forEach(field => rowData[field.name] = field.default);
    }

    // Convert the value to a Date object
    const data = this.conversionForDateRelatedFields(rowData,
      (value: string) => new Date(value));

    this.ticketForm.action = action;
    this.ticketForm.form?.reset();
    this.ticketForm.form?.patchValue(data);
    this.dialogVisible = true; // show dialog box 
  }

  // --------------------------------------------------------------------------
  public onAction() {
    if (this.ticketForm.form.valid) {
      // Convert the value to a ISO String using the datePipe with appropriate format and UTC timezone
      const newData = this.conversionForDateRelatedFields(this.ticketForm.form.value,
        (value: Date) => this.datePipe.transform(value, 'yyyy-MM-ddTHH:mm:ss.SSSZZZZZ', 'UTC'));

      console.debug(this.ticketForm.action, newData);

      const message: WebsocketMessageModel = {
        type: this.type$(),
        timestamp: Date.now(),
        payload: [newData],
      };
      this.store.dispatch(socketSendMessage({ message }));

      this.dialogVisible = false; // hide dialog box 
    } else {
      console.warn('Invalid form data.');
    }
  }

  // --------------------------------------------------------------------------
  private conversionForDateRelatedFields(rowData: any, convertFunc: Function) {
    const data = { ...rowData };

    // Function to check if the field type is a date related type
    const isDateField = (field: any) => ['date', 'time', 'datetime'].includes(field.type);

    // Get the list of date/time fields from saveFields$
    const dateFields = this.ticketForm.fields?.filter(isDateField);

    if (dateFields) {
      // Loop through each date/time field
      dateFields.forEach(field => {
        // Check if the corresponding value exists in the data object
        if (data[field.name]) {
          data[field.name] = convertFunc(data[field.name]);  // Convert the value 
        }
      });
    }

    return data;
  }

}
