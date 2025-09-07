import { NextRequest, NextResponse } from 'next/server';
import { put, del, list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'site-data/',
    });

    // En son yüklenen dosyayı bul
    const latestBlob = blobs
      .filter(blob => blob.pathname.endsWith('.json'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

    if (!latestBlob) {
      // Varsayılan veri döndür
      const defaultData = {
        siteInfo: {
          title: "FliesenExpress24",
          description: "Hochwertige Fliesen und Keramikprodukte",
          logo: "/logo.png",
          contact: {
            phone: "+49 30 555 0123",
            email: "info@fliesenexpress24.de",
            address: "Berlin, Deutschland"
          }
        },
        admin: {
          username: "admin",
          password: "admin123",
          email: "admin@fliesenexpress24.de",
          name: "Administrator"
        },
        slider: [],
        categories: [],
        products: [],
        contactForm: {
          title: "Kontakt aufnehmen",
          subtitle: "Kontaktieren Sie uns für Ihre Fragen",
          fields: [
            { name: "name", label: "Vor- und Nachname", type: "text", required: true },
            { name: "email", label: "E-Mail", type: "email", required: true },
            { name: "phone", label: "Telefon", type: "tel", required: false },
            { name: "subject", label: "Betreff", type: "text", required: true },
            { name: "message", label: "Nachricht", type: "textarea", required: true }
          ]
        }
      };
      return NextResponse.json(defaultData);
    }

    // Blob'dan veriyi oku
    const response = await fetch(latestBlob.url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Veri yüklenirken hata:', error);
    return NextResponse.json({ error: 'Veri yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Yeni blob oluştur
    const blob = await put(`site-data/data-${Date.now()}.json`, JSON.stringify(data, null, 2), {
      access: 'public',
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      message: 'Veri başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Veri kaydedilirken hata:', error);
    return NextResponse.json({ error: 'Veri kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { blobs } = await list({
      prefix: 'site-data/',
    });

    // Tüm eski dosyaları sil (en son hariç)
    const sortedBlobs = blobs
      .filter(blob => blob.pathname.endsWith('.json'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    // En son dosya hariç diğerlerini sil
    const blobsToDelete = sortedBlobs.slice(1);
    
    for (const blob of blobsToDelete) {
      await del(blob.url);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${blobsToDelete.length} eski dosya silindi` 
    });
  } catch (error) {
    console.error('Eski dosyalar silinirken hata:', error);
    return NextResponse.json({ error: 'Dosyalar silinemedi' }, { status: 500 });
  }
}
