Here's an example of how you can implement Register, Login, and HomePage components that rely on JWT authentication in an Angular 18 app.

**auth.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: TokenResponse) => this.saveToken(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
```

**register.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password).subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
```

**register.component.html**
```html
<div class="container">
  <h1>Register</h1>
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" id="username" formControlName="username" class="form-control">
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" formControlName="email" class="form-control">
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" formControlName="password" class="form-control">
    </div>
    <button type="submit" class="btn btn-primary">Register</button>
  </form>
</div>
```

**login.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }
}
```

**login.component.html**
```html
<div class="container">
  <h1>Login</h1>
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="username">Username:</label>
      <input type="text" id="username" formControlName="username" class="form-control">
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" formControlName="password" class="form-control">
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</div>
```

**home.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe((user: any) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
```

**home.component.html**
```html
<div class="container">
  <h1>Home</h1>
  <p>Welcome, {{ user.username }}!</p>
  <p>Email: {{ user.email }}</p>
  <button (click)="logout()" class="btn btn-primary">Logout</button>
</div>
```

**app-routing.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

This code sets up