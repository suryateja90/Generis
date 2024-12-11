// src/app/core/services/config.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = {
    apiUrls: environment.apiUrls,
    socketServerUrls: environment.socketServerUrls,
    index: environment.index
  };

  constructor() {
    // remember the working index
    this.config.index = Number.parseInt(localStorage.getItem("ConfigIndex") || '0');
  }

  // Get the current API URL
  getApiUrl(): string {
    return this.config.apiUrls[this.config.index];
  }

  // Get the current WebSocket URL
  getSocketServerUrl(): string {
    return this.config.socketServerUrls[this.config.index];
  }

  // Switch servers
  incrementServerIndex(): void {
    this.config.index++;
    this.config.index %= environment.apiUrls.length;
    localStorage.setItem("ConfigIndex", this.config.index.toString());
  }
}
