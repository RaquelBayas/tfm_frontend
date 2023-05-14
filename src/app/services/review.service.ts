import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8080/reviews';

  constructor(private http: HttpClient) { }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}`, review);
  }

  updateReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getReviewByMovieId(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/movie/${id}`);
  }
/*
  getByItemId(itemId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/item/${itemId}`);
  }*/

}
