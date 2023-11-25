import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UsersService } from 'src/app/services/users/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password && confirmPassword && password!=confirmPassword) {
      return {
        passwordDontMatch: true
      }
    }

    return null;
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {

  signUpForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private toast: HotToastService, 
    private usersService: UsersService) { }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get address() {
    return this.signUpForm.get('address');
  }

  get phone() {
    return this.signUpForm.get('phone');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  submit() {
    if (!this.signUpForm.valid) {
      return;
    }

    const { firstName, lastName, address, phone, email, password } = this.signUpForm.value;

    if(firstName && lastName && address && phone && email && password) {
      this.authService.signUp(email, password).pipe(
        switchMap(({user: {uid}}) => this.usersService.addUser({uid, email, firstName:firstName, lastName:lastName, address:address, phone:phone, isAdmin: false })),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing in... ',
          error: 'Error at creating account',
        })
      ).subscribe(() => {
        this.router.navigate(['']);
      })
    }
  }

}
