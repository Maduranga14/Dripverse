import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  image: string;
  qty: number;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Shadow Protagonist Tee", price: 1499, size: "L", image: product1, qty: 1 },
  { id: 2, name: "Moonlight Warrior Hoodie", price: 2999, size: "M", image: product2, qty: 2 },
  { id: 3, name: "Kawaii Spirit Oversized", price: 1299, size: "XL", image: product3, qty: 1 },
];

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 2000 ? 0 : 149;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl sm:text-6xl text-foreground tracking-tight mb-10"
        >
          YOUR <span className="text-gradient">CART</span>
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display tracking-wider px-8 py-3 rounded-lg hover-neon transition-all"
            >
              CONTINUE SHOPPING <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="glass rounded-xl p-4 flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-foreground font-medium text-sm sm:text-base">{item.name}</h3>
                        <p className="text-muted-foreground text-xs mt-1">Size: {item.size}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-foreground font-medium w-8 text-center text-sm">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-primary font-semibold text-sm sm:text-base">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors self-start"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 h-fit sticky top-24"
            >
              <h2 className="font-display text-2xl text-foreground tracking-wider mb-6">ORDER SUMMARY</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders above ₹2,000
                  </p>
                )}
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-foreground font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary font-medium hover:underline">
                    APPLY
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-primary-foreground font-display text-lg tracking-wider py-3 rounded-lg hover-neon transition-all flex items-center justify-center gap-2"
                >
                  CHECKOUT <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
