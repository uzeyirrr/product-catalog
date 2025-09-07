import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import siteData from '@/data/site-data.json';

export async function POST() {
  try {
    // Environment variable'lardan admin bilgilerini al
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email: process.env.ADMIN_EMAIL || 'admin@fliesenexpress24.de',
      name: process.env.ADMIN_NAME || 'Administrator'
    };

    // Site bilgilerini environment variable'lardan al
    const siteInfo = {
      title: process.env.SITE_TITLE || siteData.siteInfo.title,
      description: process.env.SITE_DESCRIPTION || siteData.siteInfo.description,
      logo: process.env.SITE_LOGO || siteData.siteInfo.logo,
      contact: {
        phone: process.env.SITE_PHONE || siteData.siteInfo.contact.phone,
        email: process.env.SITE_EMAIL || siteData.siteInfo.contact.email,
        address: process.env.SITE_ADDRESS || siteData.siteInfo.contact.address
      }
    };

    // Güncellenmiş veri yapısı
    const updatedData = {
      ...siteData,
      siteInfo,
      admin: adminData
    };

    // Doğrudan Blob Storage'a yükle
    const blob = await put(`site-data/data-${Date.now()}.json`, JSON.stringify(updatedData, null, 2), {
      access: 'public',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'İlk veri başarıyla yüklendi!',
      url: blob.url,
      data: {
        products: updatedData.products.length,
        categories: updatedData.categories.length,
        slides: updatedData.slider.length
      }
    });
  } catch (error) {
    console.error('İlk veri yüklenirken hata:', error);
    return NextResponse.json({ 
      error: 'Veri yüklenemedi', 
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
