// Define an interface for the parameters table
// id: number; // we can remove the user id from the model because it is not needed in the form, nor the interaction with the controller endpoints (as the id comes in the token)
export interface SeguridadParameterModel {
    application: string;
    parameter: string;
    value?: string;
}
