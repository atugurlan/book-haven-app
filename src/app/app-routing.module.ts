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
import { DeleteProductComponent } from './components/admin/delete-product/delete-product.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { PreviousOrdersComponent } from './components/previous-orders/previous-orders.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';
import { ManageOrdersComponent } from './components/admin/manage-orders/manage-orders.component';


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
  },
  {
    path: 'my_orders',
    component: PreviousOrdersComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'search/:searchTerm', 
    component: HomeComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/delete-product', 
    component: DeleteProductComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/add-product',
    component: AddProductComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/edit-product-form',
    component: EditProductComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/manage-orders',
    component: ManageOrdersComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'genre/:genre',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
