'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts, getCategories, getSlides, Product, Category } from '@/lib/data-manager';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSlides: 0,
    outOfStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (loggedIn !== 'true') {
        router.push('/admin/login');
      }
    };

    checkAuth();
    
    // Verileri yükle
    loadDashboardData();
  }, [router]);

  const loadDashboardData = () => {
    const products = getProducts();
    const categoriesData = getCategories();
    const slides = getSlides();
    
    setStats({
      totalProducts: products.length,
      totalCategories: categoriesData.length,
      totalSlides: slides.length,
      outOfStock: products.filter(p => !p.inStock).length,
    });
    
    setRecentProducts(products.slice(0, 3));
    setCategories(categoriesData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Übersicht über Ihre FliesenExpress24 Verwaltung</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Produkte</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">
              {stats.outOfStock} nicht verfügbar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategorien</CardTitle>
            <span className="text-2xl">📁</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-gray-500">
              Aktive Kategorien
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slider Bilder</CardTitle>
            <span className="text-2xl">🖼️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSlides}</div>
            <p className="text-xs text-gray-500">
              Aktive Slides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Status</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-gray-500">
              Alle Systeme funktionieren
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Neueste Produkte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">€{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "Verfügbar" : "Nicht verfügbar"}
                    </Badge>
                    <span className="text-sm text-gray-500">★ {product.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategorien Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => {
                const products = getProducts();
                const productCount = products.filter(p => p.category === category.slug).length;
                return (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <Badge variant="outline">
                      {productCount} Produkte
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h4 className="font-medium">Neues Produkt</h4>
                <p className="text-sm text-gray-500">Produkt hinzufügen</p>
              </div>
            </a>
            
            <a
              href="/admin/categories"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📁</span>
              <div>
                <h4 className="font-medium">Neue Kategorie</h4>
                <p className="text-sm text-gray-500">Kategorie hinzufügen</p>
              </div>
            </a>
            
            <a
              href="/admin/slider"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🖼️</span>
              <div>
                <h4 className="font-medium">Slider bearbeiten</h4>
                <p className="text-sm text-gray-500">Slider verwalten</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}