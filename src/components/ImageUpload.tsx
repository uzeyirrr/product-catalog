'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onMultipleUpload?: (urls: string[]) => void;
  type: 'product' | 'category' | 'slider' | 'contact' | 'logo';
  currentImage?: string;
  className?: string;
  multiple?: boolean;
}

export default function ImageUpload({ onUpload, onMultipleUpload, type, currentImage, className = '', multiple = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [multiplePreviews, setMultiplePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('Files selected:', files); // Debug için
    console.log('Multiple mode:', multiple); // Debug için
    if (!files || files.length === 0) return;

    // Çoklu dosya yükleme (multiple=true ise)
    if (multiple) {
      console.log('Using multiple file upload'); // Debug için
      await handleMultipleFileUpload(files);
      return;
    }

    // Tek dosya yükleme
    console.log('Using single file upload'); // Debug için
    const file = files[0];
    await handleSingleFileUpload(file);
  };

  const handleSingleFileUpload = async (file: File) => {
    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine Bilddatei aus.');
      return;
    }

    // Dosya boyutunu kontrol et (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Die Datei ist zu groß. Maximale Größe: 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.url);
        onUpload(result.url);
      } else {
        alert('Fehler beim Hochladen: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Datei');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    console.log('Starting multiple file upload with', files.length, 'files'); // Debug için
    const validFiles: File[] = [];
    
    // Dosyaları kontrol et
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('Checking file:', file.name, file.type, file.size); // Debug için
      if (!file.type.startsWith('image/')) {
        alert(`Datei ${file.name} ist kein Bild.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`Datei ${file.name} ist zu groß. Maximale Größe: 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    console.log('Valid files:', validFiles.length); // Debug için
    if (validFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          uploadedUrls.push(result.url);
        } else {
          alert(`Fehler beim Hochladen von ${file.name}: ${result.error}`);
        }
      }

      if (uploadedUrls.length > 0) {
        console.log('Upload successful, URLs:', uploadedUrls); // Debug için
        setMultiplePreviews(uploadedUrls);
        if (onMultipleUpload) {
          console.log('Calling onMultipleUpload with:', uploadedUrls); // Debug için
          onMultipleUpload(uploadedUrls);
        }
      } else {
        console.log('No files uploaded successfully'); // Debug için
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen der Dateien');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {multiple && multiplePreviews.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {multiplePreviews.map((url, index) => (
              <div key={index} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPreviews = multiplePreviews.filter((_, i) => i !== index);
                    setMultiplePreviews(newPreviews);
                    if (onMultipleUpload) {
                      onMultipleUpload(newPreviews);
                    }
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Wird hochgeladen...' : 'Weitere Bilder hinzufügen'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setMultiplePreviews([]);
                if (onMultipleUpload) {
                  onMultipleUpload([]);
                }
              }}
              disabled={isUploading}
            >
              Alle entfernen
            </Button>
          </div>
        </div>
      ) : preview ? (
        <div className="space-y-2">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Wird hochgeladen...' : 'Bild ändern'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Entfernen
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-2">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <p>Klicken Sie hier, um {multiple ? 'Bilder' : 'ein Bild'} hochzuladen</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF bis 5MB{multiple ? ' (mehrere Dateien möglich)' : ''}</p>
            </div>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={isUploading}
              variant="outline"
            >
              {isUploading ? 'Wird hochgeladen...' : multiple ? 'Bilder auswählen' : 'Bild auswählen'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
