import { Component, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-followers-list',
  templateUrl: './followers-list.component.html',
  styleUrls: ['./followers-list.component.css'],
})
export class FollowersListComponent {
  people: any[] = []; 
  followerUsername: string = '';
  profileImageUrl: string = '../../assets/no-image.png'; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number, type: string },
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<FollowersListComponent> 
  ) {}

  ngOnInit() {
    const userId = this.data.userId;
    const type = this.data.type;
    if(type === 'followers') {
      this.getFollowersList(userId);
    } else {
      this.getFollowingList(userId);
    }    
  }

  getFollowingList(userId: number) {
    this.userService.getFollowingList(userId).subscribe(
      (response: any[]) => {
        this.people = response;
        this.people.forEach((following) => {
          this.getUsernameById(following.id).subscribe(
            (username: string) => {
              following.username = username; 
            },
            (error) => {
              console.error('Error al obtener el nombre de usuario', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener la lista de seguidores', error);
      }
    );
  }

  getFollowersList(userId: number) {
    this.userService.getFollowersList(userId).subscribe(
      (response: any[]) => {
        this.people = response;
        this.people.forEach((follower) => {
          this.getUsernameById(follower.id).subscribe(
            (username: string) => {
              follower.username = username; 
            },
            (error) => {
              console.error('Error al obtener el nombre de usuario', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener la lista de seguidores', error);
      }
    );
  }
  
  getUsernameById(userId: number): Observable<string> {
    return this.userService.getUsernameByID(userId);
  }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
