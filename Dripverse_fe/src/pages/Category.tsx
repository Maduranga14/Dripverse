import { useParams,Link } from "react-router-dom";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWithoutAuth, getImageUrl } from "@/lib/api";
import fallbackImage from "@/assets/product-1.jpg";

const categoryTitles: Record<string, string> = {
  "new-drops": "NEW DROPS",
  "t-shirts": "T-SHIRTS",
  hoodies: "HOODIES",
  jackets: "JACKETS",
  accessories: "ACCESSORIES",
};

const filters = ["All", "New", "Hot", "Limited"];

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allProductsData, setAllProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchWithoutAuth("/products");
        setAllProductsData(data);
      } catch (error) {
        console.error("failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);
  
  const title = categoryTitles[slug || ""] || slug?.toUpperCase() || "COLLECTION";

  const products =
    slug === "new-drops"
      ? allProductsData.slice(0, 8) 
      : allProductsData.filter((p) => p.category?.name.toLowerCase() === slug?.toLowerCase());

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.tag?.toUpperCase() === activeFilter.toUpperCase());

  const toggleFav = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
              {(() => {
                const [firstWord, ...rest] =title.split(" ")
                return (
                    <>
                        <span className="text-gradient">{firstWord}</span>
                        {rest.length > 0 && " " + rest.join(" ")}
                    </>
                )
              })()}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">{filtered.length} products</p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                  <img
                    src={getImageUrl(product.imageUrl) || product.image || fallbackImage}
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

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found with this filter</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Category;
