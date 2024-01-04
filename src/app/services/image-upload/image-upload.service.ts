// import { Injectable } from '@angular/core';
// import {
//   getDownloadURL,
//   ref,
//   Storage,
//   uploadBytes,
// } from '@angular/fire/storage';
// import { from, Observable, switchMap } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ImageUploadService {
//   constructor(private storage: Storage) {}

//   uploadImage(image: File, path: string): Observable<string> {
//     const storageRef = ref(this.storage, path);
//     const uploadTask = from(uploadBytes(storageRef, image));
//     return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
//   }
// }


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor() {}

  uploadImage(image: File, path: string): Observable<string> {
    return new Observable<string>((observer) => {
      const storageRef = `Your storage reference here`; // Replace with your storage reference

      // Simulating upload completion after a delay
      setTimeout(() => {
        const imageURL = `URL of the uploaded image`; // Replace with the actual URL from your storage
        observer.next(imageURL);
        observer.complete();
      }, 2000); // Simulating 2 seconds of upload time
    });
  }
}
