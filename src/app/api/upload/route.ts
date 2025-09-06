import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type: string | null = data.get('type') as string; // 'product', 'category', 'slider'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    if (!type) {
      return NextResponse.json({ success: false, error: 'No type specified' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya uzantısını al
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Klasör yolu belirle
    let uploadPath: string;
    switch (type) {
      case 'product':
        uploadPath = join(process.cwd(), 'public', 'products', 'images');
        break;
      case 'category':
        uploadPath = join(process.cwd(), 'public', 'categories');
        break;
      case 'slider':
        uploadPath = join(process.cwd(), 'public', 'slider');
        break;
      case 'contact':
        uploadPath = join(process.cwd(), 'public', 'contact', 'images');
        break;
      case 'logo':
        uploadPath = join(process.cwd(), 'public', 'logo');
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' });
    }

    // Klasörü oluştur (yoksa)
    try {
      await mkdir(uploadPath, { recursive: true });
    } catch (error) {
      // Klasör zaten varsa hata vermez
    }

    // Dosyayı kaydet
    const filePath = join(uploadPath, fileName);
    await writeFile(filePath, buffer);

    // Public URL'i oluştur
    let publicUrl: string;
    switch (type) {
      case 'product':
        publicUrl = `/products/images/${fileName}`;
        break;
      case 'category':
        publicUrl = `/categories/${fileName}`;
        break;
      case 'slider':
        publicUrl = `/slider/${fileName}`;
        break;
      case 'contact':
        publicUrl = `/contact/images/${fileName}`;
        break;
      case 'logo':
        publicUrl = `/logo/${fileName}`;
        break;
      default:
        publicUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed' 
    });
  }
}
