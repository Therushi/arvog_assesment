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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Product, ProductService } from '../services/product.service';
import { Category, CategoryService } from '../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: 'product-list.component.html',
})
export class ProductListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);

  columns = ['name', 'categoryName', 'price', 'actions'];

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  sort = signal<'asc' | 'desc' | undefined>(undefined);
  search = signal('');
  loading = signal(false);
  saving = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: ['', [Validators.required]],
  });
  searchControl = this.fb.control('');

  constructor() {
    this.categoryService.list().subscribe({
      next: (res: any) => this.categories.set(res.data),
      error: () => this.toastr.error('Failed to load categories', 'Error'),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.search.set((value ?? '').trim());
        this.page.set(1);
        this.fetch();
      });

    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.productService
      .list({
        page: this.page(),
        limit: this.limit(),
        sort: this.sort(),
        search: this.search() || undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.products.set(res.data.items);
          this.total.set(res.data.total);
        },
        error: () => this.toastr.error('Failed to load products', 'Error'),
      });
  }

  onPage(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.fetch();
  }

  toggleSort(): void {
    this.sort.set(this.sort() === 'asc' ? 'desc' : 'asc');
    this.fetch();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, price, categoryId } = this.form.value;
    const payload = {
      name: name as string,
      price: price as number,
      categoryId: categoryId as string,
    };

    const id = this.editingId();
    this.saving.set(true);

    const request$ = id
      ? this.productService.update(id, payload)
      : this.productService.create(payload);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.toastr.success(
          id ? 'Product updated' : 'Product created',
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

  startEdit(product: Product): void {
    this.editingId.set(product.id);
    this.form.setValue({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', price: 0, categoryId: '' });
  }

  onDelete(product: Product): void {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.toastr.success('Product deleted', 'Success');
        if (this.editingId() === product.id) this.cancelEdit();
        this.fetch();
      },
      error: (err) => {
        const message = err?.error?.error ?? 'Delete failed. Please try again.';
        this.toastr.error(message, 'Error');
      },
    });
  }
}
