import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';

// const redirectToLogin = () => redirectUnauthorizedTo(['login']);
// const redirectToLanding = () => redirectLoggedInTo(['landing']);

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
