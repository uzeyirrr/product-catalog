'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategories, getProducts } from '@/lib/data-manager';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  image: string;
  images: string[];
  features: string[];
  specifications: Record<string, string | undefined>;
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) {
      router.push('/categories');
      return;
    }

    const allCategories = getCategories();
    const allProducts = getProducts();
    
    const foundCategory = allCategories.find(cat => cat.slug === slug);
    if (!foundCategory) {
      router.push('/categories');
      return;
    }

    setCategory(foundCategory);
    setProducts(allProducts);
    setIsLoading(false);
  }, [params.slug, router]);

  useEffect(() => {
    if (!category) return;

    let filtered = products.filter(product => product.category === category.slug);

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sıralama
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }, [category, products, sortBy, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Laden...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategorie nicht gefunden</h1>
            <Button onClick={() => router.push('/categories')}>
              Zurück zu Kategorien
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => router.push('/')}
                className="hover:text-blue-600"
              >
                Startseite
              </button>
            </li>
            <li>/</li>
            <li>
              <button 
                onClick={() => router.push('/categories')}
                className="hover:text-blue-600"
              >
                Kategorien
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Category Image */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏠</div>
                      <span className="text-gray-400">Kein Bild</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {category.description}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {filteredProducts.length} Produkt{filteredProducts.length !== 1 ? 'e' : ''}
                </Badge>
                <span className="text-gray-500">
                  Hochwertige Qualität für Ihr Projekt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`In ${category.name} suchen...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex justify-end">
            <div className="w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Preis: Niedrig zu Hoch</option>
                <option value="price-high">Preis: Hoch zu Niedrig</option>
                <option value="rating">Bewertung</option>
                <option value="newest">Neueste zuerst</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} Produkt{filteredProducts.length !== 1 ? 'e' : ''} in {category.name} gefunden
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-600 mb-4">
              Versuchen Sie andere Suchbegriffe oder schauen Sie sich andere Kategorien an
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setSearchTerm('')}>
                Suche zurücksetzen
              </Button>
              <Button variant="outline" onClick={() => router.push('/categories')}>
                Alle Kategorien ansehen
              </Button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              viewMode === 'grid' ? (
                // Grid View
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">Kein Bild</span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                          Nicht verfügbar
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          Rabatt
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            €{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              €{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        disabled={!product.inStock}
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          {product.inStock ? 'Details ansehen' : 'Nicht verfügbar'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-48 h-48 bg-gray-200 rounded-l-lg overflow-hidden relative flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">Kein Bild</span>
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Nicht verfügbar
                          </div>
                        )}
                        {product.originalPrice && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                            Rabatt
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              €{product.price.toFixed(2)}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                €{product.originalPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {product.features.map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            {product.inStock ? (
                              <span className="text-green-600 font-medium">Auf Lager</span>
                            ) : (
                              <span className="text-red-600 font-medium">Nicht verfügbar</span>
                            )}
                          </div>
                          <Button 
                            disabled={!product.inStock}
                            asChild
                          >
                            <Link href={`/products/${product.id}`}>
                              {product.inStock ? 'Details ansehen' : 'Nicht verfügbar'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
