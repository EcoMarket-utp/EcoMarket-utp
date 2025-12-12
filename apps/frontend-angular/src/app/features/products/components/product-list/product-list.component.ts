import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductsService } from '@app/services/products.service';
import { Product } from '@app/models/product.model';
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
  // Price filters
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    // Subscribe to the shared ProductsService so this list shows the same items as Featured on Home
    this.productsService.products$.subscribe((items: any[]) => {
      this.products = items || [];
      this.totalItems = this.products.length;
    });
    // Also load initial server-side paginated products for fallback
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService
      .getProducts(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          // Handle wrapped response or plain array
          const data = response.data || response;
          if (Array.isArray(data)) {
            // convert server responses to frontend Product model using ProductsService
            this.products = (data as any[]).map((r) => this.productsService.mapToProduct(r));
            this.totalItems = this.products.length;
          } else {
            const items = data.items || data.products || [];
            this.products = (items as any[]).map((r) => this.productsService.mapToProduct(r));
            this.totalItems = data.total || this.products.length;
          }
          // apply client-side filters (search, price) if any
          this.applyLocalFilters();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    // Use server search when query present, otherwise reload
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (response: any) => {
          const data = Array.isArray(response) ? response : response.data || response;
          this.products = data || [];
          this.applyLocalFilters();
        },
        error: () => {
          this.error = 'Search failed. Please try again.';
        },
      });
    } else {
      this.loadProducts();
    }
  }

  // Apply local filters like price range
  public applyLocalFilters(): void {
    let filtered = [...this.products];

    if (this.minPrice != null) {
      filtered = filtered.filter(p => this.getNumericPrice(p) >= this.minPrice!);
    }
    if (this.maxPrice != null) {
      filtered = filtered.filter(p => this.getNumericPrice(p) <= this.maxPrice!);
    }

    // client may want to show filtered results in place of products
    this.products = filtered;
  }

  // Normalize price from different backend formats to number
  private getNumericPrice(p: any): number {
    if (!p) return 0;
    if (typeof p.price === 'number') return p.price;
    // Handle prisma-like decimal structure: { d: [intPart, fractional] }
    if (p.price && p.price.d && Array.isArray(p.price.d)) {
      const intPart = Number(p.price.d[0] || 0);
      const frac = Number(p.price.d[1] || 0) / 1000000; // heuristic
      return +(intPart + frac).toFixed(2);
    }
    // Fallback: try to parse
    const parsed = Number(p.price);
    return isNaN(parsed) ? 0 : parsed;
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

  // Handle image error in grid view: rotate through imageCandidates like ProductCard
  public onImageError(event: Event, product: any): void {
    const imgElement = event.target as HTMLImageElement;
    const candidates: string[] = product?.imageCandidates || [];
    const tryIndex = Number(imgElement.dataset['candidateIndex'] || '0');
    const nextIndex = tryIndex + 1;
    if (nextIndex < candidates.length) {
      imgElement.dataset['candidateIndex'] = String(nextIndex);
      imgElement.src = candidates[nextIndex];
    } else {
      imgElement.src = 'assets/placeholder.png';
    }
  }
}
