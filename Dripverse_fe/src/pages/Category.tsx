import { useParams,Link } from "react-router-dom";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const allProducts = [
  { id: 1, name: "Shadow Protagonist Tee", price: "₹1,499", tag: "NEW", image: product1, category: "t-shirts" },
  { id: 2, name: "Moonlight Warrior Hoodie", price: "₹2,999", tag: "HOT", image: product2, category: "hoodies" },
  { id: 3, name: "Kawaii Spirit Oversized", price: "₹1,299", tag: null, image: product3, category: "t-shirts" },
  { id: 4, name: "Patch Bomber Jacket", price: "₹4,499", tag: "LIMITED", image: product4, category: "jackets" },
  { id: 5, name: "Chibi Crew Cargo Pants", price: "₹2,199", tag: "NEW", image: product5, category: "accessories" },
  { id: 6, name: "Anime Print Bucket Hat", price: "₹899", tag: null, image: product6, category: "accessories" },
  { id: 7, name: "Demon Slayer Graphic Tee", price: "₹1,599", tag: "NEW", image: product1, category: "t-shirts" },
  { id: 8, name: "Shinobi Stealth Hoodie", price: "₹3,299", tag: null, image: product2, category: "hoodies" },
  { id: 9, name: "Mecha Pilot Jacket", price: "₹5,499", tag: "LIMITED", image: product4, category: "jackets" },
  { id: 10, name: "Spirit Chain Necklace", price: "₹699", tag: null, image: product6, category: "accessories" },
  { id: 11, name: "Ninja Scroll Tee", price: "₹1,399", tag: "HOT", image: product3, category: "t-shirts" },
  { id: 12, name: "Sakura Storm Hoodie", price: "₹2,799", tag: null, image: product5, category: "hoodies" },
];

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

  const title = categoryTitles[slug || ""] || "COLLECTION";

  const products =
    slug === "new-drops"
      ? allProducts.filter((p) => p.tag === "NEW" || p.tag === "HOT" || p.tag === "LIMITED")
      : allProducts.filter((p) => p.category === slug);

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.tag?.toUpperCase() === activeFilter.toUpperCase());

  const toggleFav = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

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
