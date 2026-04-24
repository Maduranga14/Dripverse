import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, name: "Shadow Protagonist Tee", price: "Rs 1,499", tag: "NEW", image: product1 },
  { id: 2, name: "Moonlight Warrior Hoodie", price: "Rs 2,999", tag: "HOT", image: product2 },
  { id: 3, name: "Kawaii Spirit Oversized", price: "Rs 1,299", tag: null, image: product3 },
  { id: 4, name: "Patch Bomber Jacket", price: "Rs 4,499", tag: "LIMITED", image: product4 },
  { id: 5, name: "Chibi Crew Cargo Pants", price: "Rs 2,199", tag: "NEW", image: product5 },
  { id: 6, name: "Anime Print Bucket Hat", price: "Rs 899", tag: null, image: product6 },
];

const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

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
              <p className="text-sm text-primary font-semibold mt-1">{product.price}</p>
            </Link> 
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
