import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../Model/product';
import { User } from '../Model/user';
import { Address } from '../Model/address';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private getCsrfToken(): string | null {
    return this.getCookie('XSRF-TOKEN');
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    headers = headers.set('Authorization', `Bearer ${this.getToken()}`);
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      headers = headers.set('X-XSRF-TOKEN', csrfToken);
    }
    return headers;
  }

  register(user: User): Observable<any> {
    return this.http.post(`${environment.baseUrl}${environment.signupUrl}`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError));
  }

  login(user: User): Observable<any> {
    return this.http.post(`${environment.baseUrl}${environment.loginUrl}`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError));
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.logoutUrl}`)
      .pipe(catchError(this.handleError));
  }

  addToCart(product: Product): Observable<any> {
    const params = new HttpParams().set('productId', product.productid.toString());
    return this.http.get<any>(`${environment.baseUrl}${environment.addToCartUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  getCartItems(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.viewCartUrl}`)
      .pipe(catchError(this.handleError));
  }

  updateCartItem(prodid: number, quant: number): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}${environment.updateCartUrl}`, { id: prodid, quantity: quant })
      .pipe(catchError(this.handleError));
  }

  deleteCartItem(bufdid: number): Observable<any> {
    const params = new HttpParams().set('bufcartid', bufdid.toString());
    return this.http.delete<any>(`${environment.baseUrl}${environment.deleteCartUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  addOrUpdateAddress(adr: Address): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${environment.addAddressUrl}`, adr)
      .pipe(catchError(this.handleError));
  }

  getAddress(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.viewAddressUrl}`)
      .pipe(catchError(this.handleError));
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.productsUrl}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  addProduct(desc: string, quan: string, price: string, prodname: string, image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("productname", prodname);
    formData.append("quantity", quan);
    formData.append("file", image);
    return this.http.post<any>(`${environment.baseUrl}${environment.addProductUrl}`, formData)
      .pipe(catchError(this.handleError));
  }

  updateProduct(desc: string, quan: string, price: string, prodname: string, image: File, productid: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("productname", prodname);
    formData.append("quantity", quan);
    formData.append("file", image);
    formData.append("productId", productid);
    return this.http.put<any>(`${environment.baseUrl}${environment.updateProductUrl}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(prodid: number): Observable<any> {
    const params = new HttpParams().set('productId', prodid.toString());
    return this.http.delete<any>(`${environment.baseUrl}${environment.deleteProductUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.viewOrderUrl}`)
      .pipe(catchError(this.handleError));
  }

  placeOrder(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${environment.placeOrderUrl}`)
      .pipe(catchError(this.handleError));
  }

  updateStatusForOrder(order: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("orderId", order.orderId);
    formData.append("orderStatus", order.orderStatus);
    return this.http.post<any>(`${environment.baseUrl}${environment.updateOrderUrl}`, formData)
      .pipe(catchError(this.handleError));
  }

  // Authentication Methods 
  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }

  storeToken(token: string, auth_type: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_type', auth_type);
  }

  getAuthType(): string | null {
    return localStorage.getItem('auth_type');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_type');
    localStorage.removeItem('auth_token');
  }
}
