import { ChangeDetectionStrategy, Component } from '@angular/core';

// Dashboard cards (Total Products / Total Categories) implemented later.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Dashboard</h2><p>Coming soon.</p>`,
})
export class DashboardComponent {}
