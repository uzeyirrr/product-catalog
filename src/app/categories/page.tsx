'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const allCategories = getCategories();
    const allProducts = getProducts();
    setCategories(allCategories);
    setProducts(allProducts);

    // Her kategorideki ürün sayısını hesapla
    const stats: Record<string, number> = {};
    allCategories.forEach(category => {
      stats[category.slug] = allProducts.filter(product => product.category === category.slug).length;
    });
    setCategoryStats(stats);
  }, []);

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
            <li className="text-gray-900">Kategorien</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produktkategorien</h1>
          <p className="text-gray-600">
            Entdecken Sie unsere vielfältigen Kategorien hochwertiger Fliesen und Keramikprodukte
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/categories/${category.slug}`)}
            >
              <CardContent className="p-0">
                {/* Category Image */}
                <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden relative">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏠</div>
                        <span className="text-gray-400 text-sm">Kein Bild</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                    {categoryStats[category.slug] || 0} Produkte
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {categoryStats[category.slug] || 0} Produkt{categoryStats[category.slug] !== 1 ? 'e' : ''}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                    >
                      Ansehen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Products Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Beliebte Produkte
            </h2>
            <p className="text-gray-600">
              Entdecken Sie unsere meistverkauften Produkte aus allen Kategorien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(product => product.inStock)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((product) => (
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

                      <Button 
                        className="w-full" 
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          Details ansehen
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Benötigen Sie Hilfe bei der Auswahl?
          </h2>
          <p className="text-gray-600 mb-6">
            Unsere Experten helfen Ihnen gerne bei der Auswahl der perfekten Fliesen für Ihr Projekt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Alle Produkte ansehen
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                // Contact form açma işlemi burada yapılabilir
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Beratung anfordern
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
