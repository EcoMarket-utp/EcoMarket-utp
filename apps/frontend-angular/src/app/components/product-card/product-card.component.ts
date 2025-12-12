import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  private readonly placeholders: { [key: string]: string } = {
    'Muebles Ecológicos': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    'Accesorios Sostenibles': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    'Hogar Eco-Friendly': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&h=300&fit=crop'
  };

  constructor(private cartService: CartService) {}

  getImageUrl(): string {
    // Prefer explicit imageUrl (may point to assets or backend). Fall back to placeholder.
    if (this.product?.imageUrl) return this.product.imageUrl;
    return this.placeholders[this.product.categoryName] || this.placeholders['default'];
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const candidates = this.product?.imageCandidates || [];
    const tryIndex = Number(imgElement.dataset['candidateIndex'] || '0');
    const nextIndex = tryIndex + 1;
    if (nextIndex < candidates.length) {
      imgElement.dataset['candidateIndex'] = String(nextIndex);
      imgElement.src = candidates[nextIndex];
    } else {
      imgElement.src = this.placeholders[this.product.categoryName] || this.placeholders['default'];
    }
  }
}
