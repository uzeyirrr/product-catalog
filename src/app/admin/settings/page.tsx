'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteInfo, updateSiteInfo, getProducts, getCategories, getSlides } from '@/lib/data-manager';
import ImageUpload from '@/components/ImageUpload';

export default function SettingsPage() {
  const [settings, setSettings] = useState(getSiteInfo());
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    slides: 0
  });

  // İstatistikleri yükle
  useEffect(() => {
    setStats({
      products: getProducts().length,
      categories: getCategories().length,
      slides: getSlides().length
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    const success = await updateSiteInfo(settings);
    if (success) {
      alert('Einstellungen wurden gespeichert!');
    } else {
      alert('Fehler beim Speichern der Einstellungen!');
    }
    
    setIsSaving(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SiteSettings],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website Einstellungen</h1>
        <p className="text-gray-600">Verwalten Sie Ihre Website-Einstellungen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Einstellungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website Titel *</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Website Titel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website Beschreibung *</label>
              <textarea
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Website Beschreibung"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <p className="text-sm text-gray-600 mb-3">Laden Sie Ihr Logo hoch</p>
              <ImageUpload
                type="logo"
                currentImage={settings.logo}
                onUpload={(url) => handleInputChange('logo', url)}
                className="w-full"
              />
              {settings.logo && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Aktuelles Logo:</p>
                  <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="h-12 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Kontakt Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Telefon *</label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="+49 30 555 0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">E-Mail *</label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="info@fliesenexpress24.de"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Adresse *</label>
              <textarea
                value={settings.contact.address}
                onChange={(e) => handleInputChange('contact.address', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Berlin, Deutschland"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Einstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meta Titel</label>
              <input
                type="text"
                value={`${settings.title} - Premium Fliesen und Keramik`}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Wird automatisch aus dem Website-Titel generiert
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Beschreibung</label>
              <textarea
                value={`${settings.description}. Premium-Kollektionen für moderne Badezimmer-, Küchen- und Wohnzimmer-Designs.`}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                rows={2}
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Wird automatisch aus der Website-Beschreibung generiert
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Informationen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.products}
              </div>
              <div className="text-sm text-gray-500">Produkte</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.categories}
              </div>
              <div className="text-sm text-gray-500">Kategorien</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.slides}
              </div>
              <div className="text-sm text-gray-500">Slider</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Speichern...' : 'Einstellungen speichern'}
        </Button>
      </div>
    </div>
  );
}
