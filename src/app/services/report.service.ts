import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import appConfig from 'src/app-config';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  reportComment(report: any): Observable<any> {
    const url = `${appConfig.backend.backendUrl}comments/${report.commentId}/report`;
    return this.http.post(url, report);
  }
}
