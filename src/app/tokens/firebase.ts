import { inject, InjectionToken } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { ENVIRONMENT } from './environment';
import { WINDOW } from './window';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
  }
}

export const FIREBASE_APP = new InjectionToken('firebase_app', {
  providedIn: 'root',
  factory: () => {
    const { firebaseConfig, name, recaptcha } = inject(ENVIRONMENT);

    const app = initializeApp(firebaseConfig);

    if (name === 'local') {
      inject(WINDOW).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptcha),
      isTokenAutoRefreshEnabled: true,
    });

    return app;
  },
});

export const FIREBASE_AUTH = new InjectionToken('FIREBASE_AUTH', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth(inject(FIREBASE_APP));

    if (inject(ENVIRONMENT).name === 'local') {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    }

    return auth;
  },
});

export const FIREBASE_FUNCTIONS = new InjectionToken('FIREBASE_FUNCTIONS', {
  providedIn: 'root',
  factory: () => {
    const functions = getFunctions(inject(FIREBASE_APP));

    if (inject(ENVIRONMENT).name === 'local') {
      connectFunctionsEmulator(functions, 'localhost', 5002);
    }

    return functions;
  },
});
