import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Cart, CartItem, AddToCartRequest } from '../../../shared/models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    id: 0n,
    user_id: 0n,
    items: [],
    total_amount: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });

  cart$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    // Load from localStorage or API
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Convert string IDs back to bigint if needed
      parsedCart.id = BigInt(parsedCart.id);
      parsedCart.user_id = BigInt(parsedCart.user_id);
      this.cartSubject.next(parsedCart);
    }
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  addToCart(request: AddToCartRequest): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(
      (item) => item.product_id === request.product_id,
    );

    if (existingItem) {
      existingItem.quantity += request.quantity;
    } else {
      currentCart.items.push({
        id: 0n,
        cart_id: currentCart.id,
        product_id: request.product_id,
        quantity: request.quantity,
        price: 0,
        total: 0,
      });
    }

    this.updateCart(currentCart);
  }

  removeFromCart(itemId: bigint): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter((item) => item.id !== itemId);
    this.updateCart(currentCart);
  }

  updateItemQuantity(itemId: bigint, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.updateCart(currentCart);
      }
    }
  }

  clearCart(): void {
    this.cartSubject.next({
      id: 0n,
      user_id: 0n,
      items: [],
      total_amount: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
  }

  private updateCart(cart: Cart): void {
    this.cartSubject.next(cart);
    // Convert bigints to strings for localStorage
    if (isPlatformBrowser(this.platformId)) {
      const cartStr = JSON.stringify(cart, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      );
      localStorage.setItem('cart', cartStr);
    }
  }

  getTotalItems(): Observable<number> {
    return new Observable((observer) => {
      this.cart$.subscribe((cart) => {
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(total);
      });
    });
  }

  getTotalPrice(): Observable<number> {
    return new Observable((observer) => {
      this.cart$.subscribe((cart) => {
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        observer.next(total);
      });
    });
  }
}
