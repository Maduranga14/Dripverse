import { useState } from "react";
import { Search, User, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "New Drops", href: "/category/new-drops" },
  { label: "T-Shirts", href: "/category/t-shirts" },
  { label: "Hoodies", href: "/category/hoodies" },
  { label: "Jackets", href: "/category/jackets" },
  { label: "Accessories", href: "/category/accessories" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl sm:text-3xl tracking-wider text-primary neon-text">
              Dripverse
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="Search..."
                  className="bg-secondary text-foreground text-sm px-3 py-1.5 rounded-md border border-border focus:border-primary focus:outline-none"
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>
            <Link to="/favourites" className="text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              <Heart size={20} />
            </Link>
            <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
              <User size={20} />
            </Link>
            <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest py-2"
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest py-2 flex items-center gap-2 sm:hidden"
              >
                <Heart size={16} /> Favorites
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
