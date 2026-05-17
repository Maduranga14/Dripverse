import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchWithoutAuth, getImageUrl } from "@/lib/api";
import fallbackImage from "@/assets/product-1.jpg";


const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchWithoutAuth("/products");
        setProducts(data.slice(0,6));
      } catch (error) {
        console.error("failed to fetch featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  const toggleFav = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-10"
      >
        <h2 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
          FEATURED <span className="text-gradient">DROPS</span>
        </h2>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest hidden sm:block"
        >
          View All →
        </a>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                <img
                  src={getImageUrl(product.imageUrl) || fallbackImage}
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
              <p className="text-sm text-primary font-semibold mt-1">{product.price.toLocaleString()}</p>
            </Link> 
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
