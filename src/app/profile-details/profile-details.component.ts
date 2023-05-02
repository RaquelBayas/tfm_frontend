import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  email: string | undefined;
  username: string = "";
  user!: User;
  
  constructor(private userService: UserService,private authService: AuthService) {
    this.userService.getUserEmail();
    //this.userService.getUser().subscribe((data)=> {console.log("profile: ",data)});
  }

  ngOnInit() {
    /*this.userService.getUser().subscribe(
      response => {this.username = response.username; console.log("response:",response)},
      error => console.error('Error getting user:', error)
    );
    this.userService.getUsername();
   */
    //console.log('sub: ',this.sub);
    
   
    //this.user = this.authService.getUser();
    //console.log(this.user);
    this.email = this.authService.getSub();
    let username = this.userService.getUser(this.email);
    console.log("details-2",username);
    /*his.userService.getUsername(this.email).subscribe((response) => {
      this.userService.getUser(response);
      console.log("profiledetails: ",response);
      return response;
    })*/
  }
  
}
