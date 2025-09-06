'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product, getProducts, addProduct, updateProduct, deleteProduct, getCategories } from '@/lib/data-manager';
import ImageUpload from '@/components/ImageUpload';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState(getCategories());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    description: '',
    features: [],
    specifications: {},
    images: [],
    inStock: true,
    rating: 0,
  });

  // Ürünleri yükle
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.category && newProduct.price) {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        image: newProduct.image || '/products/placeholder.jpg',
        images: newProduct.images || [],
        description: newProduct.description || '',
        features: newProduct.features || [],
        specifications: newProduct.specifications || {},
        inStock: newProduct.inStock ?? true,
        rating: newProduct.rating || 0,
      };
      
      const addedProduct = await addProduct(productData);
      if (addedProduct) {
        setProducts(getProducts()); // JSON'dan güncel verileri al
        setNewProduct({
          name: '',
          category: '',
          price: 0,
          description: '',
          features: [],
          images: [],
          inStock: true,
          rating: 0,
        });
        setIsAddDialogOpen(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      const updatedProduct = await updateProduct(editingProduct.id, editingProduct);
      if (updatedProduct) {
        setProducts(getProducts()); // JSON'dan güncel verileri al
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const success = await deleteProduct(id);
    if (success) {
      setProducts(getProducts()); // JSON'dan güncel verileri al
    }
  };

  const toggleStock = async (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const updatedProduct = await updateProduct(id, { inStock: !product.inStock });
      if (updatedProduct) {
        setProducts(getProducts()); // JSON'dan güncel verileri al
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produktverwaltung</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Produkte</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Neues Produkt hinzufügen</Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Produktname *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                    placeholder="Produktname eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategorie *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  >
                    <option value="">Kategorie wählen</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Preis (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ursprünglicher Preis (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={4}
                  placeholder="Produktbeschreibung eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Eigenschaften (Features)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Jede Eigenschaft in eine neue Zeile eingeben</p>
                </div>
                <textarea
                  value={(newProduct.features || []).join('\n')}
                  onChange={(e) => setNewProduct({...newProduct, features: e.target.value.split('\n').filter(f => f.trim())})}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={4}
                  placeholder="Wasserdicht&#10;Leicht zu reinigen&#10;Langlebig&#10;Antibakteriell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technische Daten (Specifications)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Format: Schlüssel: Wert (jede in eine neue Zeile)</p>
                </div>
                <textarea
                  value={Object.entries(newProduct.specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}
                  onChange={(e) => {
                    const specs: Record<string, string> = {};
                    e.target.value.split('\n').forEach(line => {
                      const [key, ...valueParts] = line.split(':');
                      if (key.trim() && valueParts.length > 0) {
                        specs[key.trim()] = valueParts.join(':').trim();
                      }
                    });
                    setNewProduct({...newProduct, specifications: specs});
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={6}
                  placeholder="Material: Keramik&#10;Größe: 30x30 cm&#10;Dicke: 8 mm&#10;Oberfläche: Glasiert&#10;Frostbeständig: Ja&#10;Rutschfest: Ja"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hauptbild</label>
                  <ImageUpload
                    type="product"
                    onUpload={(url) => setNewProduct({...newProduct, image: url})}
                    currentImage={newProduct.image}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zusätzliche Bilder</label>
                  <ImageUpload
                    type="product"
                    multiple={true}
                    onUpload={() => {}}
                    onMultipleUpload={(urls) => setNewProduct({...newProduct, images: urls})}
                    className="mb-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Manuelle URLs (Optional)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Falls Sie URLs manuell hinzufügen möchten:</p>
                </div>
                <div className="space-y-3">
                  {(newProduct.images || []).map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...(newProduct.images || [])];
                          newImages[index] = e.target.value;
                          setNewProduct({...newProduct, images: newImages});
                        }}
                        className="flex-1 px-4 py-3 border rounded-lg text-lg"
                        placeholder="/products/images/product-image-1.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = (newProduct.images || []).filter((_, i) => i !== index);
                          setNewProduct({...newProduct, images: newImages});
                        }}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                      >
                        Löschen
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct({
                        ...newProduct,
                        images: [...(newProduct.images || []), '']
                      });
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    URL hinzufügen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                      className="mr-3 w-5 h-5"
                    />
                    Auf Lager
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bewertung (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newProduct.rating || 0}
                    onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="px-8 py-3 text-lg">
                  Abbrechen
                </Button>
                <Button onClick={handleAddProduct} className="px-8 py-3 text-lg">
                  Produkt hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Produkte ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bewertung</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                        {categories.find(c => c.slug === product.category)?.name || product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">€{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          €{product.originalPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "Verfügbar" : "Nicht verfügbar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStock(product.id)}>
                          {product.inStock ? 'Aus Lager entfernen' : 'Zu Lager hinzufügen'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produkt bearbeiten</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Produktname *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategorie *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Preis (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ursprünglicher Preis (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Eigenschaften (Features)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Jede Eigenschaft in eine neue Zeile eingeben</p>
                </div>
                <textarea
                  value={(editingProduct.features || []).join('\n')}
                  onChange={(e) => setEditingProduct({...editingProduct, features: e.target.value.split('\n').filter(f => f.trim())})}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={4}
                  placeholder="Wasserdicht&#10;Leicht zu reinigen&#10;Langlebig&#10;Antibakteriell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technische Daten (Specifications)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Format: Schlüssel: Wert (jede in eine neue Zeile)</p>
                </div>
                <textarea
                  value={Object.entries(editingProduct.specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}
                  onChange={(e) => {
                    const specs: Record<string, string> = {};
                    e.target.value.split('\n').forEach(line => {
                      const [key, ...valueParts] = line.split(':');
                      if (key.trim() && valueParts.length > 0) {
                        specs[key.trim()] = valueParts.join(':').trim();
                      }
                    });
                    setEditingProduct({...editingProduct, specifications: specs});
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-lg"
                  rows={6}
                  placeholder="Material: Keramik&#10;Größe: 30x30 cm&#10;Dicke: 8 mm&#10;Oberfläche: Glasiert&#10;Frostbeständig: Ja&#10;Rutschfest: Ja"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hauptbild</label>
                  <ImageUpload
                    type="product"
                    onUpload={(url) => setEditingProduct({...editingProduct, image: url})}
                    currentImage={editingProduct.image}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zusätzliche Bilder</label>
                  <ImageUpload
                    type="product"
                    multiple={true}
                    onUpload={() => {}}
                    onMultipleUpload={(urls) => setEditingProduct({...editingProduct, images: urls})}
                    className="mb-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Manuelle URLs (Optional)</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Falls Sie URLs manuell hinzufügen möchten:</p>
                </div>
                <div className="space-y-3">
                  {(editingProduct.images || []).map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...(editingProduct.images || [])];
                          newImages[index] = e.target.value;
                          setEditingProduct({...editingProduct, images: newImages});
                        }}
                        className="flex-1 px-4 py-3 border rounded-lg text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
                          setEditingProduct({...editingProduct, images: newImages});
                        }}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                      >
                        Löschen
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        ...editingProduct,
                        images: [...(editingProduct.images || []), '']
                      });
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    URL hinzufügen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                      className="mr-3 w-5 h-5"
                    />
                    Auf Lager
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bewertung (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingProduct.rating}
                    onChange={(e) => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="px-8 py-3 text-lg">
                  Abbrechen
                </Button>
                <Button onClick={handleUpdateProduct} className="px-8 py-3 text-lg">
                  Änderungen speichern
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
