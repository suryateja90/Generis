# Configuring Your Angular 18 App to Connect with Your NestJS REST Server

To ensure your Angular 18 application communicates correctly with your remote NestJS REST server, follow these steps:

## 1. **Set Up Environment Configuration**

Use Angular’s environment files to manage your API URLs for different environments (development, production).

### **a. Define API URLs**

Edit your environment files to include the API base URL.

```typescript
// src/environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/auth' // Replace with your NestJS dev URL
};

// src/environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api/auth' // Replace with your NestJS prod URL
};
```

## 2. **Update Auth Service to Use Environment API URL**

Modify your `AuthService` to utilize the `environment.apiUrl`.

```typescript
// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust the path as needed

interface RegisterPayload {
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Uses environment variable

  constructor(private http: HttpClient) { }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm-email?token=${token}`);
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken: token });
  }
}
```

## 3. **Ensure Environment Files are Correctly Imported**

Make sure Angular uses the correct environment files during build and development.

### **a. Verify `angular.json` Configuration**

Check that `angular.json` points to the right environment files.

```json
// angular.json
{
  ...
  "projects": {
    "your-app-name": {
      ...
      "architect": {
        "build": {
          ...
          "configurations": {
            "production": {
              "fileReplacements": [{
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }],
              ...
            }
          }
        },
        "serve": {
          ...
          "configurations": {
            "production": {
              "browserTarget": "your-app-name:build:production"
            },
            "development": {
              "browserTarget": "your-app-name:build:development"
            }
          }
        }
      }
    }
  }
}
```

### **b. Use Environment in Service**

Ensure the `AuthService` imports the environment correctly, as shown above.

## 4. **Optional: Configure Proxy for Development**

If your Angular app runs on a different domain or port than your NestJS server during development, set up a proxy to avoid CORS issues.

### **a. Create Proxy Configuration**

Create a `proxy.conf.json` in the root of your Angular project.

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### **b. Update `angular.json` to Use Proxy**

Modify the `serve` options to include the proxy configuration.

```json
// angular.json
{
  ...
  "projects": {
    "your-app-name": {
      ...
      "architect": {
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
```

### **c. Adjust Environment API URL for Development**

Set the `apiUrl` in `environment.ts` to match the proxy.

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: '/api/auth' // Proxy redirects /api to your NestJS server
};
```

## 5. **Verify HTTP Requests**

Ensure your `AuthService` methods are correctly pointing to the API endpoints.

### **Example: Login Request**

```typescript
this.authService.login({ email, password }).subscribe(response => {
  // Handle successful login
}, error => {
  // Handle login error
});
```

Use browser developer tools to inspect network requests and confirm they are reaching your NestJS server.

## 6. **Final Checklist**

- **Environment Files**: Correctly set up with appropriate `apiUrl`.
- **AuthService**: Uses `environment.apiUrl` for all HTTP requests.
- **Proxy Configuration**: Optional but useful to handle CORS during development.
- **Routing**: Ensure routes point to the correct standalone components.
- **Store Initialization**: Tokens are loaded from `localStorage` on bootstrap.
- **AuthGuard**: Properly protects routes based on authentication state.

## 7. **Best Practices Recommendation**

- **Separate Home Component**: Creating a separate `HomeComponent` is recommended for clarity and maintainability.
- **Secure Token Storage**: Consider using `HttpOnly` cookies instead of `localStorage` for storing tokens to enhance security.
- **Error Handling**: Implement comprehensive error handling in `AuthEffects` to provide user feedback.
- **Testing**: Regularly test authentication flows to ensure reliability.

## Conclusion

By correctly setting the `apiUrl` in your environment configurations and ensuring your `AuthService` uses this URL, your Angular 18 application should communicate seamlessly with your NestJS REST server. Additionally, leveraging proxy configurations during development can help avoid CORS issues and streamline your workflow.

If you continue to face issues:

1. **Check Console Errors**: Look for any runtime errors in the browser console.
2. **Verify Network Requests**: Use developer tools to ensure HTTP requests are sent to the correct endpoints.
3. **Ensure NestJS Server is Running**: Confirm your NestJS server is active and accessible at the specified `apiUrl`.

Feel free to reach out with specific error messages or issues for more targeted assistance!