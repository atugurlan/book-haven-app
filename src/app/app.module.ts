import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environments';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './services/authentication/authentication.service';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { ToastrModule } from 'ngx-toastr';

import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { HomeComponent } from './components/home/home.component';
import { BookPageComponent } from './components/book-page/book-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { SuccessComponent } from './components/success/success.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SearchComponent } from './components/search/search.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { TagsComponent } from './components/tags/tags.component';
import { PreviousOrdersComponent } from './components/previous-orders/previous-orders.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    BookPageComponent,
    NavbarComponent,
    ShoppingCartComponent,
    SuccessComponent,
    WishlistComponent,
    SearchComponent,
    AddProductComponent,
    TagsComponent,
    PreviousOrdersComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    HotToastModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width',
      toastClass: 'toast-custom-style'
      // positionClass: 'toast-top-full-width', // Configures the position of the toast
      // preventDuplicates: true, // Prevents duplicate toasts from being shown
      // closeButton: true // Show close button on toast notifications
    }),
    FormsModule
  ],
  providers: [
    AuthenticationService, 
    provideHotToastConfig(), 
    HotToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
