import { Component } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  users!: any[]; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getRegisteredUsers();
  }

  getRegisteredUsers(): void {
    this.userService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  deleteUser(userId: number): void {}
}
