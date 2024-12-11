import { DestroyRef, signal } from '@angular/core';

export interface AbstractParametersServiceConfigOptions {
  parameters: any;
  destroyRef: DestroyRef;
}

export abstract class AbstractParametersService {

  protected destroyRef: DestroyRef;
  protected parameters$ = signal<any>(undefined);

  // --------------------------------------------------------------------------
  constructor() { }

  // --------------------------------------------------------------------------
  public config(options: AbstractParametersServiceConfigOptions) {
    // Ensure a DestroyRef is provided to manage subscriptions
    if (!options.destroyRef) {
      throw new Error('DestroyRef is required for proper cleanup.');
    }

    // Assign the DestroyRef for later use
    this.destroyRef = options.destroyRef;

    // Unsubscribe from parameters$ when the component is destroyed
    this.destroyRef.onDestroy(() => { this.onDestroy(); });

    // Set the initial parameters
    this.parameters$.set(options.parameters);
  }

  // --------------------------------------------------------------------------
  protected onDestroy() {
    this.parameters$.set(undefined);
  }
}
