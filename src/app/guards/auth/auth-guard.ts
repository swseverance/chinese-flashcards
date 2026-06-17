import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, map, take } from 'rxjs';
import { FIREBASE_AUTH } from '../../tokens/firebase';

export const authGuard: CanActivateFn = () => {
  const auth = inject(FIREBASE_AUTH);
  const router = inject(Router);

  return new Observable<User | null>((observer) =>
    auth.onAuthStateChanged((user) => observer.next(user)),
  ).pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login']))),
  );
};
