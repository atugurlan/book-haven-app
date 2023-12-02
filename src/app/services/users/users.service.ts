import { Injectable } from '@angular/core';
import { DocumentData, Firestore, doc } from '@angular/fire/firestore';
import { ProfileUser } from '../../models/user-profile';
import { Observable, catchError, from, map, of, switchMap, tap } from 'rxjs';
import { setDoc, updateDoc } from '@firebase/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore, private authService: AuthenticationService) { }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if(!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    )
  }

  addUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, {...user}));
  }
}
