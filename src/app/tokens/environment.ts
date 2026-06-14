import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment.development';

export const ENVIRONMENT = new InjectionToken('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment,
});
