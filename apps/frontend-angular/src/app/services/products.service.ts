import { Injectable } from '@angular/core';
import { Product } from '../components/product-card/product-card.component';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private featured: Product[] = [
  { id: '1', title: 'Mesa de Madera Reciclada', price: 299.99, image: '/assets/sample/wood-table.svg', tag: 'Madera reciclada' },
  { id: '2', title: 'Bolsa Sostenible', price: 45.0, image: '/assets/sample/bag.svg', tag: 'Tela reciclada' },
  { id: '3', title: 'Lámpara de Vidrio Reciclado', price: 89.5, image: '/assets/sample/glass-lamp.svg', tag: 'Vidrio reciclado' },
    { id: '4', title: 'Escultura de Plástico', price: 125.0, image: '/assets/sample/plastic-sculpture.svg', tag: 'Plástico reciclado' }
  ];

  getFeatured(): Product[] {
    return this.featured;
  }
}
