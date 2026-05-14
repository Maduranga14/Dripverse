import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchWithoutAuth } from "@/lib/api";
import product1 from "@/assets/product-1.jpg";

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

const getImageUrl = (url: string | null) => {
  if (!url) return product1;
  if (url.startsWith("http")) return url;
  return `http://localhost:8080${url}`;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchWithoutAuth("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="font-display text-4xl sm:text-6xl text-foreground tracking-tight">
          SHOP BY <span className="text-gradient">CATEGORY</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id || cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
          >
            <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="absolute inset-0 z-10" />
              <img
                src={getImageUrl(cat.imageUrl)}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 border border-border/20 rounded-lg group-hover:border-primary/50 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl sm:text-2xl text-foreground tracking-wider group-hover:text-primary transition-colors duration-300">
                  {cat.name}
                </h3>
              </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
