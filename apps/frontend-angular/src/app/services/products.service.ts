import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, map, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  imageFilename: string | null;
  isOrganic: boolean;
  certifications: string | null;
  originCountry: string | null;
  carbonFootprint: number | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = `${environment.apiUrl.replace(/\/+$/, '')}/products`;
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Only load products automatically when running in the browser.
    // This prevents SSR/build-time attempts to contact localhost (which fail on Vercel).
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    this.http.get<ProductResponse[]>(this.API_URL).pipe(
      catchError((error) => {
        console.error('Error loading products:', error);
        // When backend is unavailable (dev), return local mock products so UI can render.
        return of(this.generateMockResponses());
      }),
      map((response: ProductResponse[]) => response.map(this.mapToProduct.bind(this)))
    ).subscribe((products: Product[]) => {
      this.products = products;
      this.productsSubject.next([...this.products]);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse[]>(this.API_URL).pipe(
      catchError((error) => {
        console.error('Error getting products:', error);
        return of(this.generateMockResponses());
      }),
      map((response: ProductResponse[]) => response.map(this.mapToProduct.bind(this))),
      tap((products: Product[]) => {
        // Update internal cache and notify subscribers so UI updates reactively
        this.products = products;
        this.productsSubject.next([...this.products]);
      })
    );
  }

  // Local mock data produced when backend is not reachable during local development
  private generateMockResponses(): ProductResponse[] {
    const list: ProductResponse[] = [
      {
        id: 1,
        name: 'Mochila Ecologica',
        description: 'Mochila hecha de materiales reciclables',
        price: 49.99,
        stockQuantity: 10,
        categoryId: 2,
        categoryName: 'Accesorios Sostenibles',
        imageFilename: null,
        isOrganic: false,
        certifications: null,
        originCountry: 'Perú',
        carbonFootprint: null,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 2,
        name: 'Bolsa Reutilizable',
        description: 'Bolsa para compras reutilizable',
        price: 9.99,
        stockQuantity: 50,
        categoryId: 3,
        categoryName: 'Hogar Eco-Friendly',
        imageFilename: null,
        isOrganic: false,
        certifications: null,
        originCountry: 'Perú',
        carbonFootprint: null,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 3,
        name: 'Estante Madera Reciclada',
        description: 'Estante hecho de madera reciclada',
        price: 129.99,
        stockQuantity: 5,
        categoryId: 1,
        categoryName: 'Muebles Ecológicos',
        imageFilename: null,
        isOrganic: false,
        certifications: null,
        originCountry: 'Perú',
        carbonFootprint: null,
        isActive: true,
        isFeatured: false,
      },
      {
        id: 4,
        name: 'Mesa Material Reciclado',
        description: 'Mesa fabricada con materiales reciclados',
        price: 199.99,
        stockQuantity: 2,
        categoryId: 1,
        categoryName: 'Muebles Ecológicos',
        imageFilename: null,
        isOrganic: false,
        certifications: null,
        originCountry: 'Perú',
        carbonFootprint: null,
        isActive: true,
        isFeatured: false,
      }
    ];
    return list;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<ProductResponse>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error getting product by id:', error);
        return of(undefined);
      }),
      map((response: ProductResponse | undefined) => response ? this.mapToProduct(response) : undefined)
    );
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<ProductResponse[]>(this.API_URL, {
      params: new HttpParams().set('category', categoryName)
    }).pipe(
      catchError((error) => {
        console.error('Error getting products by category:', error);
        return of([]);
      }),
      map((response: ProductResponse[]) => response.map(this.mapToProduct.bind(this)))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<ProductResponse[]>(`${this.API_URL}/search`, {
      params: new HttpParams().set('keyword', query)
    }).pipe(
      catchError((error) => {
        console.error('Error searching products:', error);
        return of([]);
      }),
      map((response: ProductResponse[]) => response.map(this.mapToProduct.bind(this)))
    );
  }

  getFeatured(): Product[] {
    return this.products.slice(0, 3);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.categoryName))];
  }

  public mapToProduct(response: ProductResponse): Product {
    // URL placeholder basado en la categoría del producto
    const placeholders: { [key: string]: string } = {
      'Muebles Ecológicos': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      'Accesorios Sostenibles': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'Hogar Eco-Friendly': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
      'default': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&h=300&fit=crop'
    };

    // Determine image URL:
    // - if backend provided `imageFilename`, prefer backend image endpoint (or allow absolute/assets paths)
    // - otherwise try to derive a filename from the product name located under /assets/products
    const buildBackendUrl = (filename: string) => `${environment.apiUrl.replace(/\/+$/, '')}/images/${filename}`;

    const isAbsoluteOrAsset = (s: string) => /^https?:\/\//i.test(s) || s.startsWith('/assets');

    let imageUrl: string;
    let imageCandidates: string[] = [];
    const exts = ['jpeg', 'jpg', 'png', 'webp'];

    if (response.imageFilename) {
      const backendUrl = isAbsoluteOrAsset(response.imageFilename)
        ? response.imageFilename
        : buildBackendUrl(response.imageFilename);
      // Prefer backend image first, then try assets variants
      imageCandidates.push(backendUrl);
      // also try asset variants using the filename base (without extension)
      const baseName = response.imageFilename.replace(/\.[^.]+$/, '');
      exts.forEach(ext => imageCandidates.push(`/assets/products/${baseName}.${ext}`));
      imageUrl = imageCandidates[0];
    } else {
      // sanitize product name and build multiple candidate filenames
      const sanitized = response.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^a-zA-Z0-9]/g, ''); // remove spaces and punctuation

      const variants = [
        sanitized, // original case from name
        sanitized.charAt(0).toUpperCase() + sanitized.slice(1), // TitleCase
        sanitized.toLowerCase() // lowercase
      ];

      variants.forEach(v => exts.forEach(ext => imageCandidates.push(`/assets/products/${v}.${ext}`)));

      // fall back to placeholders if none match at runtime
      imageCandidates.push(placeholders[response.categoryName] || placeholders['default']);
      imageUrl = imageCandidates[0];
    }

    return {
      id: response.id,
      name: response.name,
      description: response.description,
      price: this.normalizePrice(response.price),
      stock: response.stockQuantity,
      categoryId: response.categoryId,
      categoryName: response.categoryName,
      imageFilename: response.imageFilename,
      imageUrl: imageUrl,
      imageCandidates: imageCandidates,
      isOrganic: response.isOrganic,
      certifications: response.certifications,
      originCountry: response.originCountry,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Normalize price coming from different backends (number or prisma decimal-like structure)
  private normalizePrice(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    // prisma-like: { d: [intPart, fractional] }
    if (value && value.d && Array.isArray(value.d)) {
      const intPart = Number(value.d[0] || 0);
      const fracRaw = Number(value.d[1] || 0);
      // fractional may be in micros; try to scale to decimal
      const frac = fracRaw / 1000000;
      return +(intPart + frac).toFixed(2);
    }
    // try parse float
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
  }

  // --- Minimal create/update/delete implementations used by admin components ---
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product as Product,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      // ensure aliases
      category: (product as any).category || product.categoryName,
      inStock: (product as any).inStock ?? (product.stock > 0),
    };
    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
    return of(newProduct);
  }

  updateProduct(id: number, updates: Partial<Product>): Observable<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return of(null);
    const updated = { ...this.products[index], ...updates, updatedAt: new Date() } as Product;
    this.products[index] = updated;
    this.productsSubject.next([...this.products]);
    return of(updated);
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return of(false);
    this.products.splice(index, 1);
    this.productsSubject.next([...this.products]);
    return of(true);
  }

  private mapToProductResponse(product: Product): ProductResponse {
    const toIsoString = (value: string | Date) => new Date(value).toISOString();
    // Minimal mapping for fallback/mock usage
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stock,
      categoryId: product.categoryId ?? 0,
      categoryName: product.categoryName ?? product.category ?? '',
      imageFilename: product.imageFilename ?? null,
      isOrganic: product.isOrganic ?? false,
      certifications: product.certifications ?? null,
      originCountry: product.originCountry ?? null,
      carbonFootprint: product.carbonFootprint ?? null,
      isActive: true,
      isFeatured: false,
      createdAt: toIsoString(product.createdAt),
      updatedAt: toIsoString(product.updatedAt),
    };
  }
}

