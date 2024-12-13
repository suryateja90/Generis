import { TicketFormField } from "./ticket.models";

export const toTicketFormFields = (fields: TicketFormField[]): TicketFormField[] => {
    let ticketFormFields: TicketFormField[] = [];
    fields.forEach(field => {
        const [prefix, ...other] = field.name.split('_');
        field.label ??= toSentenceCase(other.join('_'));
        field.colspan ??= 1;
        field.visible ??= true;
        field.required ??= true;
        ticketFormFields.push(field as TicketFormField);
    });
    return ticketFormFields;
};

function toSentenceCase(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
}