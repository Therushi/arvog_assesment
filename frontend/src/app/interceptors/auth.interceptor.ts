import { HttpInterceptorFn } from '@angular/common/http';

// Attaches the JWT Bearer token to outgoing requests — wired in Phase 2.
export const authInterceptor: HttpInterceptorFn = (req, next) => next(req);
