import { NextResponse } from 'next/server';
import siteData from '@/data/site-data.json';

export async function POST() {
  try {
    // Mevcut site-data.json'ı Blob Storage'a yükle
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    const result = await response.json();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'İlk veri başarıyla yüklendi!',
        data: {
          products: siteData.products.length,
          categories: siteData.categories.length,
          slides: siteData.slider.length
        }
      });
    } else {
      return NextResponse.json({ error: 'Veri yüklenemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('İlk veri yüklenirken hata:', error);
    return NextResponse.json({ error: 'Veri yüklenemedi' }, { status: 500 });
  }
}
