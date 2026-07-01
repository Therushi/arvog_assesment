import { ChangeDetectionStrategy, Component } from '@angular/core';

// Report generation + download implemented in Phase 6.
@Component({
  selector: 'app-reports',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Reports</h2><p>Coming in Phase 6.</p>`,
})
export class ReportsComponent {}
