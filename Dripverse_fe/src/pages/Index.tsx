import Categories from "@/components/categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import MarqueeBanner from "@/components/MarqueeBanner";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
        <Navbar />
        
        <HeroCarousel />
        <MarqueeBanner />
        <Categories />
        
        <FeaturedProducts />
        <Footer />
        
    </div>
  );
};

export default Index;