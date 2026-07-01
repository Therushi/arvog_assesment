import { ChangeDetectionStrategy, Component } from '@angular/core';

// Category CRUD implemented in Phase 3.
@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Categories</h2><p>Coming in Phase 3.</p>`,
})
export class CategoryListComponent {}
