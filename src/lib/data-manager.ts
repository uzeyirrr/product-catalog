import siteData from '@/data/site-data.json';

// Client-side için basit veri yönetimi
let localData = { ...siteData };

// Veri tipleri
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string | undefined>;
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface SiteInfo {
  title: string;
  description: string;
  logo: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

// API'ye veri kaydet
export const saveToAPI = async (data: typeof siteData) => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      localData = data;
      // Local storage'a da kaydet (offline için)
      if (typeof window !== 'undefined') {
        localStorage.setItem('siteData', JSON.stringify(data));
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('API kaydedilirken hata:', error);
    // Offline durumda local storage'a kaydet
    return saveToLocalStorage(data);
  }
};

// API'den veri yükle
export const loadFromAPI = async () => {
  try {
    const response = await fetch('/api/data');
    if (response.ok) {
      const data = await response.json();
      localData = data;
      // Local storage'a da kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('siteData', JSON.stringify(data));
      }
      return data;
    }
    throw new Error('API yanıtı başarısız');
  } catch (error) {
    console.error('API yüklenirken hata:', error);
    // Offline durumda local storage'dan yükle
    return loadFromLocalStorage();
  }
};

// Local storage'a kaydet (offline için)
export const saveToLocalStorage = (data: typeof siteData) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteData', JSON.stringify(data));
    }
    localData = data;
    return true;
  } catch (error) {
    console.error('Local storage kaydedilirken hata:', error);
    return false;
  }
};

// Local storage'dan yükle (offline için)
export const loadFromLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('siteData');
      if (stored) {
        localData = JSON.parse(stored);
        return localData;
      }
    }
    return siteData;
  } catch (error) {
    console.error('Local storage yüklenirken hata:', error);
    return siteData;
  }
};

// Ürün yönetimi
export const getProducts = async (): Promise<Product[]> => {
  const data = await loadFromAPI();
  return data.products as Product[];
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const data = await loadFromAPI();
  return (data.products as Product[]).find(p => p.id === id) || null;
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const data = await loadFromAPI();
  const products = data.products as Product[];
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const now = new Date().toISOString();
  
  const newProduct: Product = {
    ...product,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };
  
  const updatedData = {
    ...data,
    products: [...products, newProduct]
  };
  
  const success = await saveToAPI(updatedData);
  return success ? newProduct : null;
};

export const updateProduct = async (id: number, updates: Partial<Product>) => {
  const data = await loadFromAPI();
  const products = data.products as Product[];
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) return null;
  
  const updatedProduct = {
    ...products[productIndex],
    ...updates,
    id, // ID'yi değiştirmeyi engelle
    updatedAt: new Date().toISOString(),
  };
  
  products[productIndex] = updatedProduct;
  
  const updatedData = {
    ...data,
    products
  };
  
  const success = await saveToAPI(updatedData);
  return success ? updatedProduct : null;
};

export const deleteProduct = async (id: number) => {
  const data = await loadFromAPI();
  const filteredProducts = (data.products as Product[]).filter(p => p.id !== id);
  
  const updatedData = {
    ...data,
    products: filteredProducts
  };
  
  const success = await saveToAPI(updatedData);
  return success;
};

// Kategori yönetimi
export const getCategories = async (): Promise<Category[]> => {
  const data = await loadFromAPI();
  return data.categories;
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
  const data = await loadFromAPI();
  const categories = data.categories;
  const newId = Math.max(...categories.map((c: Category) => c.id), 0) + 1;
  
  const newCategory: Category = {
    ...category,
    id: newId,
  };
  
  const updatedData = {
    ...data,
    categories: [...categories, newCategory]
  };
  
  const success = await saveToAPI(updatedData);
  return success ? newCategory : null;
};

export const updateCategory = async (id: number, updates: Partial<Category>) => {
  const data = await loadFromAPI();
  const categories = data.categories;
  const categoryIndex = categories.findIndex((c: Category) => c.id === id);
  
  if (categoryIndex === -1) return null;
  
  const updatedCategory = {
    ...categories[categoryIndex],
    ...updates,
    id, // ID'yi değiştirmeyi engelle
  };
  
  categories[categoryIndex] = updatedCategory;
  
  const updatedData = {
    ...data,
    categories
  };
  
  const success = await saveToAPI(updatedData);
  return success ? updatedCategory : null;
};

export const deleteCategory = async (id: number) => {
  const data = await loadFromAPI();
  const filteredCategories = data.categories.filter((c: Category) => c.id !== id);
  
  const updatedData = {
    ...data,
    categories: filteredCategories
  };
  
  const success = await saveToAPI(updatedData);
  return success;
};

// Slider yönetimi
export const getSlides = async (): Promise<Slide[]> => {
  const data = await loadFromAPI();
  return data.slider;
};

export const addSlide = async (slide: Omit<Slide, 'id'>) => {
  const data = await loadFromAPI();
  const slides = data.slider;
  const newId = Math.max(...slides.map((s: Slide) => s.id), 0) + 1;
  
  const newSlide: Slide = {
    ...slide,
    id: newId,
  };
  
  const updatedData = {
    ...data,
    slider: [...slides, newSlide]
  };
  
  const success = await saveToAPI(updatedData);
  return success ? newSlide : null;
};

export const updateSlide = async (id: number, updates: Partial<Slide>) => {
  const data = await loadFromAPI();
  const slides = data.slider;
  const slideIndex = slides.findIndex((s: Slide) => s.id === id);
  
  if (slideIndex === -1) return null;
  
  const updatedSlide = {
    ...slides[slideIndex],
    ...updates,
    id, // ID'yi değiştirmeyi engelle
  };
  
  slides[slideIndex] = updatedSlide;
  
  const updatedData = {
    ...data,
    slider: slides
  };
  
  const success = await saveToAPI(updatedData);
  return success ? updatedSlide : null;
};

export const deleteSlide = async (id: number) => {
  const data = await loadFromAPI();
  const filteredSlides = data.slider.filter((s: Slide) => s.id !== id);
  
  const updatedData = {
    ...data,
    slider: filteredSlides
  };
  
  const success = await saveToAPI(updatedData);
  return success;
};

// Site ayarları yönetimi
export const getSiteInfo = async (): Promise<SiteInfo> => {
  const data = await loadFromAPI();
  return data.siteInfo;
};

export const updateSiteInfo = async (updates: Partial<SiteInfo>) => {
  const data = await loadFromAPI();
  const updatedSiteInfo = {
    ...data.siteInfo,
    ...updates,
  };
  
  const updatedData = {
    ...data,
    siteInfo: updatedSiteInfo
  };
  
  const success = await saveToAPI(updatedData);
  return success ? updatedSiteInfo : null;
};

// Görsel yönetimi - API route kullanılacak
export const uploadImage = async (file: File, type: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result.success ? result.url : null;
  } catch (error) {
    console.error('Görsel yüklenirken hata:', error);
    return null;
  }
};

export const deleteImage = async (imagePath: string): Promise<boolean> => {
  try {
    // Client-side'da dosya silme işlemi yapılamaz
    // Bu işlem server-side'da yapılmalı
    console.log('Görsel silme işlemi:', imagePath);
    return true;
  } catch (error) {
    console.error('Görsel silinirken hata:', error);
    return false;
  }
};
