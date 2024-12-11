// src/app/core/interceptors/auth.interceptor.ts

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? next.handle(req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) })) : next.handle(req);
  }
}
