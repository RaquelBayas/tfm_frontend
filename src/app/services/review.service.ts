import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../model/review';
import appConfig from 'src/app-config';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = `${appConfig.backend.backendUrl}/reviews`;

  constructor(private http: HttpClient) {}

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}`, review);
  }

  updateReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getReviewByListIdMovieId(listId: number, id: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/list/${listId}/movie/${id}`);
  }
  /*
  getByItemId(itemId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/item/${itemId}`);
  }*/
}
