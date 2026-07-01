import { ChangeDetectionStrategy, Component } from '@angular/core';

// Login form implemented in Phase 2.
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Login</h2><p>Coming in Phase 2.</p>`,
})
export class LoginComponent {}
