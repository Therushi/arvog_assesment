import { ChangeDetectionStrategy, Component } from '@angular/core';

// Product list + form (search/pagination/sorting) implemented in Phase 4.
@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>Products</h2><p>Coming in Phase 4.</p>`,
})
export class ProductListComponent {}
