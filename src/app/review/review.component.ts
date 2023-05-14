import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Review } from '../model/review';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { ReviewService } from '../services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  @Input() movie!: any;
  @Input() modalIsOpen!: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  selectedRating!: number;
  review!: Review;
  reviewExist!: Boolean;
  userData!: any;
  token!: string;
  reviewForm!: FormGroup;
  reviews!: Review[];
  reviewRating: number = 0;

  constructor(
    private movieService: MovieService,
    private reviewService: ReviewService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.token = this.cookieService.get('token');
    this.userData = jwtDecode(this.token);
    //this.getMovieDetails();

    this.getReview();

    
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required],
    });

    
  }

  getMovieDetails() {
    this.movieService.getMovieDetails(this.movie.id).subscribe((response) => {
      console.log('REVIEW-MOVIE:', response);
    });
  }

  createReview() {
    this.review.movieId = this.movie.id;
    this.review.userId = this.userData.id;
    this.review.rating = this.selectedRating;

    console.log("Review-create: ",this.review);
    this.reviewService.createReview(this.review).subscribe(() => {
      this.modalIsOpen = false;
      //this.reviewForm.reset();
      //this.router.navigate(['/profile']);
    });
  }

  getReview() {
    this.reviewService.getReviewByMovieId(this.movie.id).subscribe((response:any) => {
      if(response.reviews) {
        this.review = response.reviews;
        this.reviewRating = this.review.rating;
        this.reviewExist = true;
      } else {
        this.reviewExist = false;
        this.review = {
          rating: 0,
          comment: ''
        }
      }
      console.log("Review-Get:",this.review);
    })
  }

  onRatingSelected(rating: number) {
    this.selectedRating = rating;
    console.log('Review-Rating:', this.selectedRating);
  }

  closeReviewModal() {
    // Lógica para cerrar el modal
    this.modalIsOpen = false;
    this.closeModal.emit();
    console.log('cerrar modal');
  }
}
