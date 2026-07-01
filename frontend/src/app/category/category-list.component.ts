import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Category, CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: `category-list.component.html`,
})
export class CategoryListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);

  columns = ['name', 'actions'];
  categories = signal([]);
  loading = signal(false);
  saving = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
  });

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.categoryService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => this.categories.set(res.data),
        error: () => this.toastr.error('Failed to load categories', 'Error'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const name = this.form.value.name as string;
    const id = this.editingId();
    this.saving.set(true);

    const request$ = id
      ? this.categoryService.update(id, name)
      : this.categoryService.create(name);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.toastr.success(
          id ? 'Category updated' : 'Category created',
          'Success',
        );
        this.cancelEdit();
        this.fetch();
      },
      error: (err) => {
        const message = err?.error?.error ?? 'Save failed. Please try again.';
        this.toastr.error(message, 'Error');
      },
    });
  }

  startEdit(category: Category): void {
    this.editingId.set(category.id);
    this.form.setValue({ name: category.name });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '' });
  }
  onDelete(category: Category): void {
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.toastr.success('Category deleted', 'Success');
        if (this.editingId() === category.id) this.cancelEdit();
        this.fetch();
      },
      error: (err) => {
        const message = err?.error?.error ?? 'Delete failed. Please try again.';
        this.toastr.error(message, 'Error');
      },
    });
  }
}
