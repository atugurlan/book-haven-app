import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$ = this.usersService.currentUserProfile$;

  constructor(private authService: AuthenticationService, private router: Router, private usersService: UsersService) {  }
  
  logout() {
    this.authService.logout().subscribe( () => {
      this.router.navigate(['']);
    })
  }
}
