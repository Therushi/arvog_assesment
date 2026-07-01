import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  ReportService,
  ReportStatusResponse,
} from '../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  private readonly reportService = inject(ReportService);
  private readonly toastr = inject(ToastrService);

  format = signal<'csv' | 'xlsx'>('csv');
  search = signal('');
  generating = signal(false);
  status = signal<ReportStatusResponse | null>(null);
  currentJobId = signal<string | null>(null);

  setFormat(format: 'csv' | 'xlsx'): void {
    this.format.set(format);
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  generate(): void {
    this.generating.set(true);
    this.status.set(null);
    const filters = this.search().trim()
      ? { search: this.search().trim() }
      : {};

    this.reportService.generate(this.format(), filters).subscribe({
      next: ({ data }) => {
        this.currentJobId.set(data.jobId);
        this.pollStatus(data.jobId);
      },
      error: () => {
        this.generating.set(false);
        this.toastr.error('Failed to queue report generation');
      },
    });
  }

  private pollStatus(jobId: string): void {
    const poll = () => {
      this.reportService.getStatus(jobId).subscribe({
        next: ({ data }) => {
          this.status.set(data);
          if (data.state === 'completed' || data.state === 'failed') {
            this.generating.set(false);
            if (data.state === 'completed') {
              this.toastr.success(
                `Report ready: ${data.result?.rowCount} rows`,
              );
            } else {
              this.toastr.error(
                data.failedReason ?? 'Report generation failed',
              );
            }
            return;
          }
          setTimeout(poll, 2000);
        },
        error: () => {
          this.generating.set(false);
          this.toastr.error('Failed to fetch report status');
        },
      });
    };
    poll();
  }

  download(): void {
    const jobId = this.currentJobId();
    const result = this.status()?.result;
    if (!jobId || !result) return;

    this.reportService.download(jobId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to download report'),
    });
  }
}
