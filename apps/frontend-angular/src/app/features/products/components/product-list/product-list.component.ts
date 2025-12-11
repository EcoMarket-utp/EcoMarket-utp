import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '@app/shared/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;

  searchQuery = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService
      .getProducts(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          // Handle wrapped response
          const data = response.data || response;
          this.products = data.items || data.products || [];
          this.totalItems = data.total || 0;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (response: any) => {
          const data = Array.isArray(response) ? response : response.data || response;
          this.products = data || [];
        },
        error: () => {
          this.error = 'Search failed. Please try again.';
        },
      });
    } else {
      this.loadProducts();
    }
  }

  onProductClick(id: any): void {
    this.router.navigate(['/products', id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
