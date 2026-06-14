import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('WINDOW', {
  providedIn: 'root',
  factory: () => window,
});
