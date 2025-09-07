'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Category, getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/data-manager';
import ImageUpload from '@/components/ImageUpload';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    loadCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.description) {
      const categoryData = {
        name: newCategory.name,
        slug: newCategory.slug || generateSlug(newCategory.name),
        image: newCategory.image || '/categories/placeholder.jpg',
        description: newCategory.description,
      };
      
      const addedCategory = await addCategory(categoryData);
      if (addedCategory) {
        setCategories(getCategories()); // JSON'dan güncel verileri al
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          image: '',
        });
        setIsAddDialogOpen(false);
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      const updatedCategory = await updateCategory(editingCategory.id, editingCategory);
      if (updatedCategory) {
        setCategories(getCategories()); // JSON'dan güncel verileri al
        setIsEditDialogOpen(false);
        setEditingCategory(null);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const success = await deleteCategory(id);
    if (success) {
      setCategories(getCategories()); // JSON'dan güncel verileri al
    }
  };

  const getProductCount = (categorySlug: string) => {
    // Bu fonksiyon artık gerekli değil çünkü ürün sayısını JSON'dan alıyoruz
    return 0; // Geçici olarak 0 döndürüyoruz
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategorieverwaltung</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Produktkategorien</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Neue Kategorie hinzufügen</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategoriename *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory({
                      ...newCategory, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Kategoriename eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="kategorie-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Wird automatisch aus dem Namen generiert
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung *</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Kategoriebeschreibung eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bild</label>
                <ImageUpload
                  type="category"
                  onUpload={(url) => setNewCategory({...newCategory, image: url})}
                  currentImage={newCategory.image}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAddCategory}>
                  Kategorie hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Kategorien ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategorie</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Produkte</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {category.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {category.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {getProductCount(category.slug)} Produkte
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCategory(category.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kategorie bearbeiten</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategoriename *</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung *</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bild</label>
                <ImageUpload
                  type="category"
                  onUpload={(url) => setEditingCategory({...editingCategory, image: url})}
                  currentImage={editingCategory.image}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleUpdateCategory}>
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
