import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { BookPageComponent } from './components/book-page/book-page.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { SuccessComponent } from './components/success/success.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'book/:bid',
    component: BookPageComponent
  },
  {
    path: 'shoppingcart',
    component: ShoppingCartComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'success',
    component: SuccessComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    ...canActivate(redirectToLogin)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
