import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import {
  DashboardService,
  DashboardStats,
} from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly toastr = inject(ToastrService);

  loading = signal(false);
  stats = signal<DashboardStats | null>(null);

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
