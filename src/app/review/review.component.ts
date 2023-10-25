import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Review } from '../model/review';
import { ReviewService } from '../services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SeriesService } from '../services/series.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  @Input() content!: any;
  @Input() modalIsOpen!: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Input() viewerUserId!: number;
  @Input() listId!: number;
  selectedRating!: number;
  review!: Review;
  reviewId!: number;
  reviewExist!: Boolean;
  userData!: any;
  userId!: number;
  token!: string;
  reviewForm!: FormGroup;
  comment!: string;
  reviewRating: number = 0;
  disabledRating: boolean = true;
  contentDescription!: string;
  newListId!: number;

  editingReview: boolean = false;
  editedComment!: string;

  constructor(
    private movieService: MovieService,
    private serieService: SeriesService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.userData = this.authService.getUserDataFromToken();
    this.getMovieDetails();
    this.getReview();

    this.reviewForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('listId' in changes) {
      this.newListId = changes['listId'].currentValue;
    }
  }

  enterEditMode() {
    this.editingReview = true;
    this.editedComment = this.review.comment;
  }

  getMovieDetails() {
    if (this.content.media_type === 'movie') {
      this.movieService
        .getMovieDetails(this.content.id)
        .subscribe((response: any) => {
          this.contentDescription = response.overview.slice(0, 160);
          if (response.overview.length > 160) {
            this.contentDescription += '...';
          }
        });
    } else if (this.content.media_type === 'tv') {
      this.serieService
        .getSeriesDetails(this.content.id)
        .subscribe((response: any) => {
          this.contentDescription = response.overview.slice(0, 160);
          if (response.overview.length > 160) {
            this.contentDescription += '...';
          }
        });
    }
  }

  getContentType(content: any): string {
    return content.media_type === 'movie' ? '/content/movies/' + content.id : '/content/series/' + content.id;
  }
  
  createReview() {
    this.review.movieId = this.content.id;
    this.review.userId = this.userData.id;
    this.review.listId = this.newListId;
    this.review.rating = this.selectedRating;
    this.review.comment = this.comment;

    this.reviewService.createReview(this.review).subscribe(() => {
      this.modalIsOpen = false;
      this.reviewForm.reset();
      this.closeReviewModal();
    });
  }

  editReview() {
    this.review.movieId = this.content.id;
    this.review.userId = this.userData.id;
    this.review.listId = this.listId;
    this.review.rating = this.selectedRating;
    this.review.comment = this.comment;

    this.reviewService
      .updateReview(this.reviewId, this.review)
      .subscribe((response: any) => {
        console.log('updateRevieW::', response);
      });
    this.editingReview = false;
  }

  getReview() {
    this.reviewService
      .getReviewByListIdMovieId(this.listId, this.content.id)
      .subscribe((response: any) => {
        if (response.reviews) {
          this.review = response.reviews;
          this.reviewId = response.reviews.id;
          this.reviewRating = this.review.rating;
          this.reviewExist = true;
        } else {
          this.reviewExist = false;
          this.review = {
            rating: 0,
            comment: '',
          };
        }
      });
  }

  onRatingSelected(rating: number) {
    this.selectedRating = rating;
  }

  closeReviewModal() {
    this.modalIsOpen = false;
    this.closeModal.emit();
  }
}
