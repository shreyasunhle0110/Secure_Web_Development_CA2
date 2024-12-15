import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const csrfToken = this.getCsrfToken();
        if (csrfToken) {
            req = req.clone({
                headers: req.headers.set('X-XSRF-TOKEN', csrfToken)
            });
        }
        return next.handle(req);
    }

    private getCsrfToken(): string | null {
        // Assuming the CSRF token is stored in a cookie named 'XSRF-TOKEN'
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'XSRF-TOKEN') {
                return value;
            }
        }
        return null;
    }
}
