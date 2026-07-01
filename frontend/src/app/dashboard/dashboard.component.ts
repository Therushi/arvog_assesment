import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import {
  DashboardService,
  DashboardStats,
} from '../services/dashboard.service';
import { ProductListComponent } from '../product/product-list.component';
import { UploadComponent } from '../upload/upload.component';
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    ProductListComponent,
    UploadComponent,
    ReportsComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly toastr = inject(ToastrService);

  loading = signal(false);
  stats = signal<DashboardStats | null>(null);
  selectedTabIndex = signal(0);

  avgProductsPerCategory = computed(() => {
    const s = this.stats();
    if (!s || !s.totalCategories) return '0';
    return (s.totalProducts / s.totalCategories).toFixed(1);
  });

  goToTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.dashboardService
      .getStats()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ data }) => this.stats.set(data),
        error: () => this.toastr.error('Failed to load dashboard stats'),
      });
  }
}
