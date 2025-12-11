import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartResponse, CartItem, Cart } from '@app/shared/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    // TODO: Implement cart service
    this.loading = true;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      // TODO: Update cart item
      item.quantity = quantity;
    }
  }

  removeItem(item: CartItem): void {
    // TODO: Remove item from cart
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  get subtotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) => sum + item.total, 0);
  }

  get total(): number {
    if (!this.cart) return 0;
    return this.subtotal;
  }
}
