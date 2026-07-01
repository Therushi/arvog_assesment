import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/dashboard`;

  getStats() {
    return this.http.get<{ success: boolean; data: DashboardStats; message: string }>(
      `${this.baseUrl}/stats`,
    );
  }
}
