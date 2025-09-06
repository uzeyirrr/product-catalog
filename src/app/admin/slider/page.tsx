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
import { Slide, getSlides, addSlide, updateSlide, deleteSlide } from '@/lib/data-manager';
import ImageUpload from '@/components/ImageUpload';

export default function SliderPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
  });

  // Slider'ları yükle
  useEffect(() => {
    setSlides(getSlides());
  }, []);

  const handleAddSlide = async () => {
    if (newSlide.title && newSlide.subtitle && newSlide.buttonText && newSlide.buttonLink) {
      const slideData = {
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        image: newSlide.image || '/slider/placeholder.jpg',
        buttonText: newSlide.buttonText,
        buttonLink: newSlide.buttonLink,
      };
      
      const addedSlide = await addSlide(slideData);
      if (addedSlide) {
        setSlides(getSlides()); // JSON'dan güncel verileri al
        setNewSlide({
          title: '',
          subtitle: '',
          image: '',
          buttonText: '',
          buttonLink: '',
        });
        setIsAddDialogOpen(false);
      }
    }
  };

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide(slide);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSlide = async () => {
    if (editingSlide) {
      const updatedSlide = await updateSlide(editingSlide.id, editingSlide);
      if (updatedSlide) {
        setSlides(getSlides()); // JSON'dan güncel verileri al
        setIsEditDialogOpen(false);
        setEditingSlide(null);
      }
    }
  };

  const handleDeleteSlide = async (id: number) => {
    const success = await deleteSlide(id);
    if (success) {
      setSlides(getSlides()); // JSON'dan güncel verileri al
    }
  };

  const moveSlide = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < slides.length - 1)
    ) {
      const newSlides = [...slides];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newSlides[currentIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentIndex]];
      
      // JSON'u güncelle - bu işlem için data-manager'a yeni bir fonksiyon eklemek gerekebilir
      // Şimdilik basit bir yaklaşım kullanıyoruz
      setSlides(newSlides);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slider Verwaltung</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Homepage-Slider</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Neuen Slide hinzufügen</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Neuen Slide hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titel *</label>
                <input
                  type="text"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({...newSlide, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Slide-Titel eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Untertitel *</label>
                <input
                  type="text"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({...newSlide, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Slide-Untertitel eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bild</label>
                <ImageUpload
                  type="slider"
                  onUpload={(url) => setNewSlide({...newSlide, image: url})}
                  currentImage={newSlide.image}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text *</label>
                  <input
                    type="text"
                    value={newSlide.buttonText}
                    onChange={(e) => setNewSlide({...newSlide, buttonText: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Button-Text eingeben"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link *</label>
                  <input
                    type="text"
                    value={newSlide.buttonLink}
                    onChange={(e) => setNewSlide({...newSlide, buttonLink: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="/ziel-seite"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAddSlide}>
                  Slide hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Slider Vorschau</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Slide {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSlide(slide.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSlide(slide.id, 'down')}
                      disabled={index === slides.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                <div className="aspect-video rounded overflow-hidden mb-3">
                  {slide.image ? (
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">Bild: {slide.title}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">{slide.title}</h4>
                  <p className="text-gray-600">{slide.subtitle}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Button: "{slide.buttonText}"</span>
                    <span>Link: {slide.buttonLink}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alle Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Slide</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Button</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map((slide, index) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-10 rounded overflow-hidden">
                      {slide.image ? (
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Bild</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{slide.title}</div>
                      <div className="text-sm text-gray-500">{slide.subtitle}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{slide.buttonText}</div>
                      <div className="text-gray-500">{slide.buttonLink}</div>
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
                        <DropdownMenuItem onClick={() => handleEditSlide(slide)}>
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSlide(slide.id)}
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
            <DialogTitle>Slide bearbeiten</DialogTitle>
          </DialogHeader>
          {editingSlide && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titel *</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({...editingSlide, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Untertitel *</label>
                <input
                  type="text"
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({...editingSlide, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bild</label>
                <ImageUpload
                  type="slider"
                  onUpload={(url) => setEditingSlide({...editingSlide, image: url})}
                  currentImage={editingSlide.image}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text *</label>
                  <input
                    type="text"
                    value={editingSlide.buttonText}
                    onChange={(e) => setEditingSlide({...editingSlide, buttonText: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link *</label>
                  <input
                    type="text"
                    value={editingSlide.buttonLink}
                    onChange={(e) => setEditingSlide({...editingSlide, buttonLink: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleUpdateSlide}>
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
