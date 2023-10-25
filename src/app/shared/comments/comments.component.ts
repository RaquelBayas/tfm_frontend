import { Component, Input, OnInit } from '@angular/core';
import { SeriesService } from 'src/app/services/series.service';
import { Comment } from '../../model/comment';
import { Report } from '../../model/report';
import { MovieService } from 'src/app/services/movie.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() serieId!: string;
  @Input() movieId!: string;
  @Input() username!: string;
  comments: Comment[] = [];
  comment: Comment = {
    content: '',
    contentId: 0,
    username: '',
  };
  newComment: string = '';
  serie: any;
  userData!: any;
  userId!: any;
  commentUserId!: number;
  profileImageUrl!: string;
  isLoggedIn: boolean = false;
  showReportModal = false;
  showError: boolean = false; //Componente
  selectedComment: any;
  selectedReportReason = '';
  reportReasons = [
    'Spam o contenido no deseado',
    'Incitación al odio',
    'Acoso',
    'Violencia infantil',
    'Contenido sexual',
    'Información falsa',
  ];

  constructor(
    private seriesService: SeriesService,
    private movieService: MovieService,
    private userService: UserService,
    private authService: AuthService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userData = this.authService.getUserDataFromToken();
      this.userId = this.userData.id;
      //this.getProfileImage(this.userId);
    }
    this.getComments();
  }

  cancelComment() {
    this.newComment = '';
  }

  addComment() {
    if (this.newComment.trim() !== '') {
      if (this.serieId) {
        const comment = {
          content: this.newComment,
          contentId: this.serieId,
          username: this.username,
        };
        this.seriesService.addCommentSeries(comment).subscribe(() => {
          this.newComment = '';
          this.getComments();
        });
      } else {
        const comment = {
          content: this.newComment,
          contentId: this.movieId,
          username: this.username,
        };
        this.movieService.addCommentMovie(comment).subscribe(() => {
          this.newComment = '';
          this.getComments();
        });
      }
    }
  }

  getComments() {
    if (this.serieId) {
      this.seriesService.getCommentsSeries(this.serieId).subscribe(
        (response: any) => {
          try {
            const promises = response.map(async (comment: any) => {
              try {
               const user: any = await this.userService.getUserByUsername(comment.username).toPromise();
               comment.userId = user.id;
               await this.getProfileImage(user.id, comment);
              } catch (error) {
                console.log('No hay comentarios disponibles');
              }
            });
            Promise.all(promises).then(() => {
              this.comments = response.reverse();
            });
          } catch (error) {
            console.log('No hay comentarios disponibles', error);
          }
        },
        (error) => {
          console.error(
            'Se ha producido un error al obtener los comentarios:',
            error
          );
        }
      );
    } else {
      this.movieService.getCommentsMovie(this.movieId).subscribe(
        (response: any) => {
          try {
            const promises = response.map(async (comment: any) => {
              try {
                const user: any = await this.userService
                  .getUserByUsername(comment.username)
                  .toPromise();
                comment.userId = user.id;  
                await this.getProfileImage(user.id, comment); 
              } catch (error) {
                console.log('Error al obtener el usuario:', error);
              }
            });

            Promise.all(promises).then(() => {
              this.comments = response.reverse(); 
            });
          } catch (error) {
            console.log('No hay comentarios disponibles', error);
          }
        },
        (error) => {
          console.error(
            'Se ha producido un error al obtener los comentarios:',
            error
          );
        }
      );
    }
  }

  getProfileImage(userId: number, comment: any) {
    return new Promise<void>((resolve, reject) => {
      this.userService.getProfileImage(userId).subscribe(
        (response: Blob) => {
          if (response) {
            comment.profileImageUrl = URL.createObjectURL(response); // Asignar la URL de la imagen de perfil al comentario
          } else {
            comment.profileImageUrl = '../../assets/no-image.png';
          }
          resolve();
        },
        (error) => {
          console.error('Error al obtener la imagen de perfil:', error);
          reject();
        }
      );
    });
  }

  toggleMenu(comment: any) {
    comment.showMenu = !comment.showMenu;
  }

  reportComment(comment: any) {
    this.selectedReportReason = '';
    this.showReportModal = true;
    this.reportService.reportComment(comment).subscribe(
      (response: any) => {
        console.log('Comentario reportado:', comment); 
      },
      (error) => {
        console.error('Error al reportar el comentario:', error);
      }
    );
  }

  openReportModal(comment: any) {
    this.selectedComment = comment;
    this.selectedReportReason = '';
    this.showReportModal = true;
  }

  submitReport(reason: string) {
    if (!reason) {
      this.showReportModal = false;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 1000);
    } else {
      const report: Report = {
        userId: this.userId,
        commentId: this.selectedComment.id,
        reason: reason,
      };
      this.reportService.reportComment(report).subscribe(
        (response: any) => {
          console.log('Comentario reportado:', report);
          this.showReportModal = false;
        },
        (error) => {
          console.error('Error al reportar el comentario:', error);
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 1000);
        }
      );
    }
  }

  closeModal() {
    this.showReportModal = false;
  }
}
