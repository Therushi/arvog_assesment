import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import {
  UploadService,
  UploadStatusResponse,
} from '../services/upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upload.component.html',
})
export class UploadComponent {
  private readonly uploadService = inject(UploadService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  status = signal<UploadStatusResponse | null>(null);

  triggerFileInput(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
    this.status.set(null);
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadService.uploadCsv(file).subscribe({
      next: (res: any) => this.pollStatus(res.data.jobId),
      error: () => {
        this.uploading.set(false);
        this.toastr.error('Failed to queue upload');
      },
    });
  }

  private pollStatus(jobId: string): void {
    const poll = () => {
      this.uploadService.getStatus(jobId).subscribe({
        next: (res: any) => {
          const data = res.data;
          this.status.set(data);
          if (data.state === 'completed' || data.state === 'failed') {
            this.uploading.set(false);
            if (data.state === 'completed') {
              this.toastr.success(
                `Inserted ${data.result?.inserted} of ${data.result?.total} rows`,
              );
            } else {
              this.toastr.error(data.failedReason ?? 'Upload failed');
            }
            return;
          }
          setTimeout(poll, 2000);
        },
        error: () => {
          this.uploading.set(false);
          this.toastr.error('Failed to fetch upload status');
        },
      });
    };
    poll();
  }
}
