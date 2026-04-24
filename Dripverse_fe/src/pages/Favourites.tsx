import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

interface FavItem {
  id: number;
  name: string;
  price: string;
  image: string;
  tag: string | null;
}

const initialFavs: FavItem[] = [
  { id: 1, name: "Shadow Protagonist Tee", price: "₹1,499", tag: "NEW", image: product1 },
  { id: 2, name: "Moonlight Warrior Hoodie", price: "₹2,999", tag: "HOT", image: product2 },
  { id: 4, name: "Patch Bomber Jacket", price: "₹4,499", tag: "LIMITED", image: product4 },
  { id: 5, name: "Chibi Crew Cargo Pants", price: "₹2,199", tag: "NEW", image: product5 },
];

const Favourites = () => {
  const [favs, setFavs] = useState<FavItem[]>(initialFavs);

  const removeFav = (id: number) => {
    setFavs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl sm:text-6xl text-foreground tracking-tight mb-10"
        >
          YOUR <span className="neon-pink-text text-accent">FAVORITES</span>
        </motion.h1>

        {favs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Heart className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground text-lg mb-6">No favourites yet</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display tracking-wider px-8 py-3 rounded-lg hover-neon transition-all"
            >
              EXPLORE DROPS
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {favs.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110">
                        <ShoppingBag size={16} />
                      </button>
                      <button
                        onClick={() => removeFav(item.id)}
                        className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary font-semibold mt-1">{item.price}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favourites;
