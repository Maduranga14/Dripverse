import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWithoutAuth } from "@/lib/api";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";


const allProducts = [
  { id: 1, name: "Shadow Protagonist Tee", price: 1499, tag: "NEW", image: product1, category: "T-Shirts" },
  { id: 2, name: "Moonlight Warrior Hoodie", price: 2999, tag: "HOT", image: product2, category: "Hoodies" },
  { id: 3, name: "Kawaii Spirit Oversized", price: 1299, tag: null, image: product3, category: "T-Shirts" },
  { id: 4, name: "Patch Bomber Jacket", price: 4499, tag: "LIMITED", image: product4, category: "Jackets" },
  { id: 5, name: "Chibi Crew Cargo Pants", price: 2199, tag: "NEW", image: product5, category: "Accessories" },
  { id: 6, name: "Anime Print Bucket Hat", price: 899, tag: null, image: product6, category: "Accessories" },
  { id: 7, name: "Demon Slayer Graphic Tee", price: 1599, tag: "NEW", image: product1, category: "T-Shirts" },
  { id: 8, name: "Shinobi Stealth Hoodie", price: 3299, tag: null, image: product2, category: "Hoodies" },
  { id: 9, name: "Mecha Pilot Jacket", price: 5499, tag: "LIMITED", image: product4, category: "Jackets" },
  { id: 10, name: "Spirit Chain Necklace", price: 699, tag: null, image: product6, category: "Accessories" },
  { id: 11, name: "Ninja Scroll Tee", price: 1399, tag: "HOT", image: product3, category: "T-Shirts" },
  { id: 12, name: "Sakura Storm Hoodie", price: 2799, tag: null, image: product5, category: "Hoodies" },
];


const priceRanges = [
  { label: "All Prices", min: 0, max: 100000 },
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹4,000", min: 2000, max: 4000 },
  { label: "Over ₹4,000", min: 4000, max: 100000 },
];
const tags = ["All", "NEW", "HOT", "LIMITED"];

const Shop = () => {
  const [categories, setCategories ] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchWithoutAuth("/categories");
        const categoryNames = data.map((c: any) => c.name);
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);
  
  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch = product.price >= selectedPrice.min && product.price <= selectedPrice.max;
    const tagMatch = selectedTag === "All" || product.tag === selectedTag;
    return categoryMatch && priceMatch && tagMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-3xl font-display font-bold text-gradient tracking-wider">SHOP</h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium"
            >
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* Sidebar / Filters (Desktop) */}
          <div className="hidden md:block w-64 shrink-0 space-y-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient tracking-wider mb-8">SHOP</h1>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm flex items-center gap-2 transition-colors ${selectedCategory === category ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedCategory === category ? 'border-primary bg-primary/10' : 'border-border'}`}>
                        {selectedCategory === category && <Check size={12} className="text-primary" />}
                      </div>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Price Range</h3>
              <ul className="space-y-2">
                {priceRanges.map(range => (
                  <li key={range.label}>
                    <button
                      onClick={() => setSelectedPrice(range)}
                      className={`text-sm flex items-center gap-2 transition-colors ${selectedPrice.label === range.label ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${selectedPrice.label === range.label ? 'border-primary' : 'border-border'}`}>
                        {selectedPrice.label === range.label && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 border rounded-md transition-colors ${selectedTag === tag
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-display font-bold">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Mobile Categories */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Categories</h3>
                    <ul className="space-y-3">
                      {categories.map(category => (
                        <li key={`mobile-${category}`}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`text-base flex items-center gap-3 ${selectedCategory === category ? "text-primary" : "text-muted-foreground"
                              }`}
                          >
                            <div className={`w-5 h-5 border rounded flex items-center justify-center ${selectedCategory === category ? 'border-primary bg-primary/10' : 'border-border'}`}>
                              {selectedCategory === category && <Check size={14} className="text-primary" />}
                            </div>
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mobile Price */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                    <ul className="space-y-3">
                      {priceRanges.map(range => (
                        <li key={`mobile-${range.label}`}>
                          <button
                            onClick={() => setSelectedPrice(range)}
                            className={`text-base flex items-center gap-3 ${selectedPrice.label === range.label ? "text-primary" : "text-muted-foreground"
                              }`}
                          >
                            <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${selectedPrice.label === range.label ? 'border-primary' : 'border-border'}`}>
                              {selectedPrice.label === range.label && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            {range.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mobile Tags */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={`mobile-${tag}`}
                          onClick={() => setSelectedTag(tag)}
                          className={`text-sm px-4 py-2 border rounded-md ${selectedTag === tag
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border text-muted-foreground"
                            }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-md font-bold uppercase tracking-wider"
                  >
                    Apply Filters ({filteredProducts.length})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content (Products Grid) */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{filteredProducts.length} Results Found</p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.tag && (
                          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-wider">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-primary font-semibold mt-1">₹{product.price.toLocaleString()}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg">
                <Filter size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedPrice(priceRanges[0]);
                    setSelectedTag("All");
                  }}
                  className="mt-6 px-6 py-2 bg-secondary text-foreground hover:bg-secondary/80 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
