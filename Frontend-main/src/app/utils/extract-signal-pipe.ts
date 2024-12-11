import { DecimalPipe } from '@angular/common';
import { isSignal, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractSignal',
  standalone: true, // Marks the pipe as standalone
  pure: false // Make the pipe impure to react to signal changes
})
export class ExtractSignalPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe,) { }

  transform(input: any): { value: any, class: string } {
    const value = isSignal(input) ? input() : input;
    if (typeof value === 'number') {
      return { value: this.decimalPipe.transform(value, '1.0-2', 'en'), class: "text-right justify-content-end" }
    }
    else {
      return { value, class: "" };
    }
  }
}
