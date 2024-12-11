// src/app/core/guards/auth.guard.ts
// This guard checks if the user is authenticated before allowing access to certain routes.

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.pipe(
      select(selectIsAuthenticated),
      take(1),
      map(authenticated => authenticated || this.router.createUrlTree(['/auth/login']))
    );
  }
}
