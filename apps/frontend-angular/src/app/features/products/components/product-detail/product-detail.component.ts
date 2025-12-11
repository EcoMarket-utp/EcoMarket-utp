import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponse, Product } from '@app/shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  quantity = 1;
  selectedImageIndex = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        // ProductResponse wraps Product in data field
        this.product = response instanceof Object && 'data' in response ? (response as any).data : response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Product not found or failed to load.';
        this.loading = false;
      },
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    // TODO: Implement cart service
    console.log(`Added ${this.quantity} of product ${this.product.id} to cart`);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
