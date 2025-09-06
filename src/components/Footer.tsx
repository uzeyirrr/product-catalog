'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteInfo, getCategories } from '@/lib/data-manager';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState(getSiteInfo());
  const [categories, setCategories] = useState(getCategories());

  useEffect(() => {
    // Site bilgilerini ve kategorileri yükle
    setSiteInfo(getSiteInfo());
    setCategories(getCategories());
  }, []);

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{siteInfo.title}</h3>
            <p className="text-gray-300 mb-4">
              {siteInfo.description}
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Telefon:</span> {siteInfo.contact.phone}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">E-Mail:</span> {siteInfo.contact.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Adresse:</span> {siteInfo.contact.address}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Schnelle Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Kategorien
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Produkte
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    // Contact form popup'ını açmak için parent component'e event gönder
                    window.dispatchEvent(new CustomEvent('openContactForm'));
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kategorien</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {siteInfo.title}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
