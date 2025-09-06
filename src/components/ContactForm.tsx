'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getSiteInfo } from '@/lib/data-manager';
import ImageUpload from '@/components/ImageUpload';

interface ContactFormProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ContactForm({ isOpen, onOpenChange }: ContactFormProps = {}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // External control için
  const isDialogOpen = isOpen !== undefined ? isOpen : isPopupOpen;
  const setDialogOpen = onOpenChange || setIsPopupOpen;
  const [contactInfo, setContactInfo] = useState({
    title: 'Kostenloses Angebot anfordern',
    subtitle: 'Lassen Sie uns Ihr Traumprojekt verwirklichen'
  });

  useEffect(() => {
    // Site bilgilerini yükle
    const siteInfo = getSiteInfo();
    setContactInfo({
      title: 'Kostenloses Angebot anfordern',
      subtitle: 'Lassen Sie uns Ihr Traumprojekt verwirklichen'
    });
    
    // Captcha oluştur
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (urls: string[]) => {
    console.log('Images uploaded:', urls); // Debug için
    setFormData({
      ...formData,
      images: urls
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captcha kontrolü
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      alert('Captcha ist falsch. Bitte versuchen Sie es erneut.');
      generateCaptcha();
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Form verilerini admin paneline kaydet
      const submission = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        images: formData.images,
        status: 'new' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Form submission data:', submission); // Debug için
      console.log('Images in submission:', submission.images); // Debug için

      // LocalStorage'a kaydet
      const existingSubmissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
      existingSubmissions.push(submission);
      localStorage.setItem('contactFormSubmissions', JSON.stringify(existingSubmissions));
      
      console.log('Saved to localStorage:', existingSubmissions); // Debug için

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setDialogOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          images: []
        });
        generateCaptcha();
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-blue-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ihr Angebot wurde angefordert!</h3>
              <p className="text-gray-600">Wir werden uns schnellstmöglich mit einem detaillierten Angebot bei Ihnen melden.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Popup Form */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {contactInfo.title}
            </DialogTitle>
            <p className="text-gray-600">
              {contactInfo.subtitle}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Vor- und Nachname *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Görsel Yükleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projekt Bilder (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Laden Sie Bilder Ihres Projekts hoch
              </p>
              <ImageUpload
                type="contact"
                multiple={true}
                onUpload={() => {}}
                onMultipleUpload={handleImageUpload}
                currentImage=""
              />
            </div>

            {/* Nachricht */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Nachricht *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Beschreiben Sie Ihr Projekt..."
              />
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sicherheitscode *
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                      {captcha}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Code eingeben"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCaptcha}
                  className="px-3"
                >
                  🔄
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bitte geben Sie den angezeigten Code ein
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Angebot anfordern'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Message Popup */}
      <Dialog open={isSubmitted} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ihr Angebot wurde angefordert!</h3>
            <p className="text-gray-600">Wir werden uns schnellstmöglich mit einem detaillierten Angebot bei Ihnen melden.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
