import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getImageUrl } from "@/lib/api";
import fallbackImage from "@/assets/product-1.jpg";
import { useCart } from "@/contexts/CartContext";


const Cart = () => {
  const { items,updateQty, removeFromCart, cartTotal, totalItems, loading } = useCart();
  const token = localStorage.getItem("token");

  const subtotal = cartTotal;
  const shipping = subtotal === 0 ? 0 : subtotal > 2000 ? 0 : 149;
  const total = subtotal + shipping;

  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={64} />
          <h2 className="font-display text-3xl mb-4">PLEASE LOGIN</h2>
          <p className="text-muted-foreground mb-8 text-center">You need to be logged in to view your cart.</p>
          <Link to="/login" className="bg-primary text-primary-foreground font-display tracking-wider px-8 py-3 rounded-lg hover-neon transition-all">
            GO TO LOGIN
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex justify-center min-h-[60vh] items-center">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    )
  }

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
                      src={getImageUrl(item.product?.imageUrl) || fallbackImage}
                      alt={item.product?.name}
                      className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-foreground font-medium text-sm sm:text-base">{item.product?.name}</h3>
                        <p className="text-muted-foreground text-xs mt-1">Size: {item.size} {item.color && item.color !== 'Default' ? `| Color: ${item.color}` : ''}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-foreground font-medium w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground hover:border-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-primary font-semibold text-sm sm:text-base">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
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
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
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
