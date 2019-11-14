import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AccountService {

  constructor(private readonly http: HttpClient) { }

  checkLogin(login: string): Observable<boolean> {

    return this.http.head<boolean>(`http://localhost:8080/ExempleEcommerce/ws/v1/logins/${login}`,
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test'
        })
      }).pipe(
        map(_ => true),
        catchError((error: HttpErrorResponse) => {

          if (error.status === 404) {
            return of(false);
          }

          return throwError(error);
        })
      );
  }
}
