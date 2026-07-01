import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/categories`;

  list() {
    return this.http.get(this.baseUrl);
  }
  create(name: string) {
    return this.http.post(this.baseUrl, { name });
  }

  update(id: string, name: string) {
    return this.http.put(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
