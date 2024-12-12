import { FormGroup } from "@angular/forms";

export type TicketFormAction = 'Add' | 'Edit';

export type TicketFormInputType = 'text' | 'select' | 'integer' | 'double' | 'date' | 'time' | 'datetime';

export type TicketFormColspan = 1 | 2 | 3 | 4;

export interface TicketFormField {
    name: string;
    label?: string;
    type: TicketFormInputType;
    colspan?: TicketFormColspan;
    options?: { value: unknown; label: string; }[];
    default?: unknown;
    visible?: boolean;
    required?: boolean;
}

export interface TicketForm {
    action: TicketFormAction;
    form: FormGroup;
    fields: TicketFormField[];
    maxColspan: number;
}