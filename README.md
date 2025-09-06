# FliesenExpress24 - Ceramic & Tile Catalog

A modern e-commerce catalog application. A responsive Next.js application that showcases ceramic and tile products with an admin panel for management.

## 🚀 Features

### 📱 Frontend (Customer Side)
- **Responsive Landing Page** - Modern and user-friendly design
- **Product Catalog** - Product listing with grid and list views
- **Category Pages** - Category-based product filtering
- **Product Detail Pages** - Detailed product information and image gallery
- **Hero Slider** - Dynamic slider for homepage
- **Contact Form** - Quote request form (popup)
- **Search & Filtering** - Category and price-based filtering
- **Sorting** - Sort by name, price, and rating

### 🔧 Admin Panel
- **Product Management** - CRUD operations (Create, Read, Update, Delete)
- **Category Management** - Add and edit categories
- **Slider Management** - Homepage slider content management
- **Site Settings** - Logo and general site settings
- **Contact Forms** - View and manage incoming forms
- **Image Upload** - Upload system for product, category, and slider images
- **Security** - Admin login system

### 🛠️ Technical Features
- **Next.js 15** - Modern React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn UI** - Modern UI components
- **JSON Data Management** - JSON-based data storage without backend
- **LocalStorage** - Client-side data persistence
- **Responsive Design** - Mobile-friendly design
- **SEO Optimized** - Search engine optimization

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   │   ├── categories/    # Category management
│   │   ├── contact-forms/ # Contact forms
│   │   ├── login/         # Admin login
│   │   ├── products/      # Product management
│   │   ├── settings/      # Site settings
│   │   └── slider/        # Slider management
│   ├── categories/        # Category pages
│   ├── products/          # Product pages
│   └── api/              # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── CategoryGrid.tsx  # Category grid component
│   ├── ContactForm.tsx   # Contact form
│   ├── Footer.tsx        # Footer component
│   ├── Header.tsx        # Header component
│   ├── HeroSlider.tsx    # Homepage slider
│   ├── ImageUpload.tsx   # Image upload component
│   └── ProductShowcase.tsx # Product showcase component
├── data/                 # Data files
│   └── site-data.json    # Main data file
└── lib/                  # Helper functions
    ├── data-manager.ts   # Data management functions
    └── utils.ts          # General helper functions
```

## 🚀 Installation

### Requirements
- Node.js 18+ 
- npm, yarn, pnpm or bun

### Steps

1. **Clone the project**
```bash
git clone <repository-url>
cd commerce
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🔐 Admin Panel

### Login Credentials
To access admin panel:
- **URL**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### Admin Panel Features
- **Dashboard** - General statistics
- **Product Management** - Add, edit, delete products
- **Category Management** - Category operations
- **Slider Management** - Homepage slider management
- **Site Settings** - Logo and general settings
- **Contact Forms** - View incoming forms

## 📊 Data Management

### JSON Data Structure
All data is stored in `src/data/site-data.json` file:

```json
{
  "siteInfo": {
    "name": "FliesenExpress24",
    "description": "Ceramic & Tile Catalog",
    "logo": "/logo/logo.png"
  },
  "admin": {
    "username": "admin",
    "password": "admin123"
  },
  "slider": [...],
  "categories": [...],
  "products": [...],
  "contactForm": [...]
}
```

### Data Persistence
- **Client-side**: Stored in browser using LocalStorage
- **Image Files**: Organized in `public/` folder
- **API Routes**: `/api/upload` endpoint for file uploads

## 🎨 Customization

### Theme and Colors
- Easy customization with Tailwind CSS
- Global styles in `src/app/globals.css`
- Consistent design with Shadcn UI components

### Language Support
- German (DE) language support
- All texts prepared in German
- Structure ready for easy language switching

## 📱 Responsive Design

- **Mobile First** - Mobile-first design approach
- **Breakpoints**: sm, md, lg, xl
- **Grid System** - CSS Grid and Flexbox
- **Touch Friendly** - Optimized for touch devices

## 🔧 Development

### Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

### Code Structure
- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Component-based** - Modular structure

## 📈 Performance

- **Next.js Optimizations** - Automatic optimizations
- **Image Optimization** - Image optimization
- **Code Splitting** - Automatic code splitting
- **Static Generation** - Static page generation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
- **Netlify** - Static site hosting
- **AWS S3** - Static website hosting
- **Docker** - Container deployment

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact Information

### Company Details
- **Company Name**: FliesenExpress24 GmbH
- **Industry**: Ceramic & Tile Distribution
- **Founded**: 2024
- **Location**: Germany

### Contact Methods
- **Website**: [https://fliesenexpress24.de](https://fliesenexpress24.de)
- **Email**: info@fliesenexpress24.de
- **Phone**: +49 (0) 123 456 789
- **Fax**: +49 (0) 123 456 790

### Business Hours
- **Monday - Friday**: 8:00 AM - 6:00 PM
- **Saturday**: 9:00 AM - 2:00 PM
- **Sunday**: Closed

### Address
```
FliesenExpress24 GmbH
Musterstraße 123
12345 Musterstadt
Germany
```

### Social Media
- **LinkedIn**: [FliesenExpress24](https://linkedin.com/company/fliesenexpress24)
- **Facebook**: [FliesenExpress24](https://facebook.com/fliesenexpress24)
- **Instagram**: [@fliesenexpress24](https://instagram.com/fliesenexpress24)

### Support
- **Technical Support**: tech@fliesenexpress24.de
- **Sales Inquiries**: sales@fliesenexpress24.de
- **Customer Service**: service@fliesenexpress24.de

### Emergency Contact
- **24/7 Hotline**: +49 (0) 123 456 999
- **Emergency Email**: emergency@fliesenexpress24.de

---

**FliesenExpress24** - Modern Ceramic & Tile Catalog Application 🏠✨