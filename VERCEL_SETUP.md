# Vercel Deployment Kurulumu

## Environment Variables

Vercel dashboard'da aşağıdaki environment variable'ları ekleyin:

### Zorunlu:
```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

### Admin Bilgileri (Opsiyonel):
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=admin@fliesenexpress24.de
ADMIN_NAME=Administrator
```

### Site Bilgileri (Opsiyonel):
```
SITE_TITLE=FliesenExpress24
SITE_DESCRIPTION=Hochwertige Fliesen und Keramikprodukte
SITE_LOGO=/logo.png
SITE_PHONE=+49 30 555 0123
SITE_EMAIL=info@fliesenexpress24.de
SITE_ADDRESS=Berlin, Deutschland
```

## Vercel Blob Storage Token Alma

1. Vercel dashboard'a gidin
2. Settings > Storage > Create Database
3. "Blob" seçin
4. Database adını girin (örn: "fliesenexpress-data")
5. "Create" butonuna tıklayın
6. Oluşturulan database'in "Settings" sekmesine gidin
7. "Environment Variables" bölümünden token'ı kopyalayın
8. Bu token'ı `BLOB_READ_WRITE_TOKEN` olarak ekleyin

## Deploy

1. GitHub repository'nizi Vercel'e bağlayın
2. Environment variable'ı ekleyin
3. Deploy edin

## Yapılan Değişiklikler

- ✅ Vercel Blob Storage entegrasyonu eklendi
- ✅ API route oluşturuldu (`/api/data`)
- ✅ Data manager güncellendi (API kullanacak şekilde)
- ✅ Tüm admin sayfaları async fonksiyonları kullanacak şekilde güncellendi
- ✅ Offline desteği korundu (localStorage fallback)

## Artık Çalışan Özellikler

- 🔄 Veriler tüm cihazlarda senkronize
- 💾 Offline çalışma desteği
- 🚀 Hızlı veri yükleme
- 🔒 Güvenli veri saklama
- 📱 Mobil uyumlu

Artık admin panelinden yaptığınız değişiklikler Vercel'de deploy edildiğinde kaybolmayacak!

## İlk Veri Yükleme

Deploy sonrası admin paneline gidin:
1. `/admin` sayfasına gidin
2. "İlk Veri Yükleme" bölümünde "Verileri Yükle" butonuna tıklayın
3. Mock veriler Blob Storage'a yüklenecek

Bu işlem sadece bir kez yapılır. Sonrasında normal admin işlemleri ile veri ekleyebilirsiniz.
