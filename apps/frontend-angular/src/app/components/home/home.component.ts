import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  currentSlide = 0;
  totalSlides = 3;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // Subscribe to products stream and compute featured dynamically
    this.productsService.products$.subscribe((all: Product[]) => {
      this.products = all.slice(0, 3);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }
}
