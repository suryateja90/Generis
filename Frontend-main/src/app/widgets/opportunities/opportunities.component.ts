import { Component, computed, effect, input, Pipe, PipeTransform, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ExtractSignalPipe } from 'src/app/utils/extract-signal-pipe';
import { CommonModule, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';

// stock watchlist using Angular 18 Signals: Simple, Computed and Wrtitable

class Stock {
  symbol: string;
  volume: number;
  price: WritableSignal<number>;
  open: number;
  change: Signal<number>;

  constructor(symbol: string, volume: number, price: number) {
    this.symbol = symbol;
    this.volume = volume;
    this.price = signal(price);
    this.open = price;
    this.change = computed(() => Math.floor(1000 * this.price() / this.open - 1000) / 10);
  }

}

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, ExtractSignalPipe, CommonModule, ],
  providers: [PercentPipe, DecimalPipe, DatePipe],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.scss'
})
@RegisterWidget('app-opportunities')
export class OpportunitiesComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });
  Title$ = computed(() => this.parameters$()?.Title);

  loading$ = signal<boolean>(false);
  
  cols = [ 
    { field: "symbol", header: "Symbol" },
    { field: "volume", header: "Volume" },
    { field: "price", header: "Price" },
    { field: "open", header: "Open" },
    { field: "change", header: "%" }
  ] as const ;  
  
  // Using a Map for quick lookup, insertion, and deletion
  private stockSymbols: WritableSignal<Record<string, Stock>> = signal({});

  // Computed signal to convert Map to an array for iteration in the template
  data = computed(() => Object.values(this.stockSymbols()));

  private tableRef$ = viewChild('tableRef', { read: Table });

  // ---------------------------------------------------------------------------------------------------------
  constructor() {

    this.addStock();
    this.addStock();
    this.addStock();
    
    // Start automatic price updates
    setInterval(() => this.updateRandomRecord(), 618);
  }
  
  // ---------------------------------------------------------------------------------------------------------
  // Add a new stock dynamically
  addStock() {
    
    // create a random name of four letters
    const newSymbol = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const random = Math.random();
    const newPrice = (Math.floor(random * 900000) + 100) / 100;
    const newVolume = Math.floor(random * 10000) + 1;

    this.stockSymbols.update((stocks: Record<string, Stock>) => {
      const newStocks = { ...stocks }; // Create a shallow copy of the original Recor
      newStocks[newSymbol] = new Stock(newSymbol, newVolume, newPrice);
      return newStocks;
    });
  }

  // ---------------------------------------------------------------------------------------------------------
  // Remove a stock by its symbol
  removeStock(symbol: string) {
    this.stockSymbols.update((stocks: Record<string, Stock>) => {
      const newStocks = { ...stocks }; // Create a shallow copy of the original Recor
      delete newStocks[symbol];
      return newStocks;
    });
  }

  // ---------------------------------------------------------------------------------------------------------  
  updateRandomRecord() {

    const stocks = this.stockSymbols();    
    const keys = Object.keys(stocks);
    if (keys.length) {
      const stockKeys = Array.from(keys); // Get an array of keys
      if (stockKeys.length) {
        const randomSymbol = stockKeys[Math.floor(Math.random() * stockKeys.length)];
        const stock = stocks[randomSymbol];
        if (stock) {
          const newPrice = Math.floor(100 * stock.price() + (Math.random() - 0.5) * 10) / 100;
          const newVolume = Math.floor(Math.random() * 10000) + 1;
          this.updateStock(randomSymbol, newPrice, newVolume);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------------------------------------
  // Efficiently update the price of an existing stock
  updateStock(name: string, newPrice: number = 0, newVolume: number = 0) {

    this.stockSymbols.update(stocks => {

      const stock = stocks[name];
      if (stock) {
        if (newPrice) stock.price.update(price => newPrice);
        if (newVolume) stock.volume = newVolume;
      }
      return stocks;

    });
  }

  // ---------------------------------------------------------------------------------------------------------
  clearStocks(){   
    this.stockSymbols.set({});
  }
  
  // ---------------------------------------------------------------------------------------------------------
  customSort(event: any) {    
  }  

  // ---------------------------------------------------------------------------------------------------------
  private sortTableData(event) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  // ---------------------------------------------------------------------------------------------------------
  private resetSort() {
    if (this.tableRef$()) {
      this.tableRef$().sortField = null;
      this.tableRef$().sortOrder = null;
    }
  }

  // ---------------------------------------------------------------------------------------------------------
  onPageChange(event: any) {    
  }
  

}
