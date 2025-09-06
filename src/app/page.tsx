import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import CategoryGrid from '@/components/CategoryGrid';
import ProductShowcase from '@/components/ProductShowcase';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <CategoryGrid />
        <ProductShowcase />
      </main>
      <Footer />
    </div>
  );
}
