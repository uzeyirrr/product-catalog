'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    // Footer'dan gelen contact form event'ini dinle
    const handleOpenContactForm = () => {
      setIsContactFormOpen(true);
    };

    window.addEventListener('openContactForm', handleOpenContactForm);

    return () => {
      window.removeEventListener('openContactForm', handleOpenContactForm);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-extrabold text-gray-900 tracking-tight hover:text-gray-700 transition-colors">
              <span className="text-orange-500">Fliesen</span>
              <span className="text-gray-900">Express</span>
              <span className="text-orange-500">24</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Startseite
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kategorien
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Produkte
            </Link>
            <button 
              onClick={() => setIsContactFormOpen(true)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Kontakt
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button onClick={() => setIsContactFormOpen(true)}>
              Angebot anfordern
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Startseite
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Kategorien
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Produkte
              </Link>
              <button 
                onClick={() => {
                  setIsContactFormOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Kontakt
              </button>
              <div className="px-3 py-2">
                <Button 
                  onClick={() => {
                    setIsContactFormOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Angebot anfordern
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Contact Form Popup */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onOpenChange={setIsContactFormOpen} 
      />
    </header>
  );
}
