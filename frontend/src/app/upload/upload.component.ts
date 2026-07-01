import { ChangeDetectionStrategy, Component } from '@angular/core';

// CSV bulk upload UI implemented in Phase 5.
@Component({
  selector: 'app-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Bulk Upload</h2><p>Coming in Phase 5.</p>`,
})
export class UploadComponent {}
