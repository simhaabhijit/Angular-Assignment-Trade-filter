import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class RestApiDATAService {

  constructor(private httpClient: HttpClient) { }

  getAggregatedStashes(url: string): Observable<Array<ApiResponse>> {
    return this.httpClient.get<Array<ApiResponse>>(url);
  }


}
