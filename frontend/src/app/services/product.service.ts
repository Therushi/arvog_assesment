import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  categoryName: string;
  created_at: string;
}
export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
export interface ProductListParams {
  page: number;
  limit: number;
  sort?: 'asc' | 'desc';
  search?: string;
}
export interface ProductInput {
  name: string;
  price: number;
  categoryId: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  list(params: ProductListParams) {
    let httpParams: Record<string, string> = {
      page: String(params.page),
      limit: String(params.limit),
    };
    if (params.sort) httpParams['sort'] = params.sort;
    if (params.search) httpParams['search'] = params.search;
    return this.http.get(this.baseUrl, {
      params: httpParams,
    });
  }

  create(payload: ProductInput) {
    return this.http.post(this.baseUrl, payload);
  }

  update(id: string, payload: ProductInput) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
