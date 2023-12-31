import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthenticationService, 
    private router: Router,
    private toast: HotToastService,
    private toastr: ToastrService ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if(!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    if(email && password) {
      this.authService.login(email, password).subscribe({
        next: (value) => {
          this.toastr.success('Logged in successfully');
          this.router.navigate(['']);
        },
        error: (error) => {
          this.toastr.error('Error at login!', 'Error', {
            positionClass: 'fixed-toast-position'
          });
        }
      });
    }
  }
}
