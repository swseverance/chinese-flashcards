import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GoogleAuthProvider, signInWithRedirect, User } from 'firebase/auth';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Observable } from 'rxjs';
import { FIREBASE_AUTH } from '../../tokens/firebase';
import { Page } from '../page/page';

@Component({
  selector: 'app-login',
  imports: [Page, NzButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private destroyRef = inject(DestroyRef);
  private auth = inject(FIREBASE_AUTH);

  authenticated = signal<null | boolean>(null);

  ngOnInit(): void {
    new Observable<User | null>((observer) =>
      this.auth.onAuthStateChanged((user) => observer.next(user)),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.authenticated.set(Boolean(user)));
  }

  login(): void {
    signInWithRedirect(this.auth, new GoogleAuthProvider());
  }
}
