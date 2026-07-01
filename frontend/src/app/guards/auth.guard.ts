import { CanActivateFn } from '@angular/router';

// Route protection wired to JWT presence in Phase 2. Allows all for now.
export const authGuard: CanActivateFn = () => true;
