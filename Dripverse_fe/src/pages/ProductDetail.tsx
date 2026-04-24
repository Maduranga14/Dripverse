import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ChevronRight, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const allProducts = [
  {
    id: "1",
    name: "Shadow Protagonist Tee",
    price: 1499,
    tag: "NEW",
    images: [product1, product2, product3],
    description:
      "Channel your inner anime hero with this premium oversized tee featuring an exclusive hand-drawn protagonist print. Made from 220 GSM ring-spun cotton for a heavyweight, luxurious feel.",
    details: [
      "220 GSM premium ring-spun cotton",
      "Oversized relaxed fit",
      "Exclusive anime protagonist print",
      "Ribbed crew neckline",
      "Pre-shrunk fabric",
    ],
    rating: 4.8,
    reviews: 124,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Shadow Black", value: "hsl(240, 10%, 8%)" },
      { name: "Storm Grey", value: "hsl(240, 5%, 25%)" },
      { name: "Midnight Navy", value: "hsl(220, 40%, 15%)" },
    ],
  },
  {
    id: "2",
    name: "Moonlight Warrior Hoodie",
    price: 2999,
    tag: "HOT",
    images: [product2, product1, product4],
    description:
      "Step into the night with this heavyweight anime-print hoodie. Features a bold moonlit warrior illustration with glow-in-the-dark accents.",
    details: [
      "350 GSM fleece-lined cotton blend",
      "Kangaroo pocket with hidden zip",
      "Glow-in-the-dark print accents",
      "Adjustable drawstring hood",
      "Dropped shoulders for street fit",
    ],
    rating: 4.9,
    reviews: 89,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx", value: "hsl(0, 0%, 8%)" },
      { name: "Deep Purple", value: "hsl(270, 50%, 20%)" },
    ],
  },
  {
    id: "3",
    name: "Kawaii Spirit Oversized",
    price: 1299,
    tag: null,
    images: [product3, product5, product6],
    description:
      "Cute meets cool — this oversized tee features adorable kawaii spirit characters in a streetwear-ready silhouette.",
    details: [
      "200 GSM soft-touch cotton",
      "Drop-shoulder oversized cut",
      "Screen-printed kawaii graphics",
      "Double-stitched seams",
      "Unisex fit",
    ],
    rating: 4.6,
    reviews: 67,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cloud White", value: "hsl(0, 0%, 92%)" },
      { name: "Pastel Pink", value: "hsl(340, 60%, 75%)" },
      { name: "Ink Black", value: "hsl(0, 0%, 6%)" },
    ],
  },
  {
    id: "4",
    name: "Patch Bomber Jacket",
    price: 4499,
    tag: "LIMITED",
    images: [product4, product2, product1],
    description:
      "Limited edition bomber jacket loaded with embroidered anime patches. A collector's statement piece for true otaku streetwear.",
    details: [
      "Nylon shell with satin lining",
      "8 hand-stitched anime patches",
      "Ribbed cuffs and hem",
      "Two interior pockets",
      "Limited run — numbered edition",
    ],
    rating: 5.0,
    reviews: 42,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Military Green", value: "hsl(100, 30%, 20%)" },
      { name: "Jet Black", value: "hsl(0, 0%, 5%)" },
    ],
  },
  {
    id: "5",
    name: "Chibi Crew Cargo Pants",
    price: 2199,
    tag: "NEW",
    images: [product5, product3, product6],
    description:
      "Utility-first cargo pants featuring chibi character embroidery on the pockets. Relaxed tapered fit for maximum comfort and style.",
    details: [
      "100% twill cotton",
      "6-pocket cargo design",
      "Chibi character embroidery",
      "Elastic waistband with drawcord",
      "Tapered leg with elastic cuff",
    ],
    rating: 4.7,
    reviews: 56,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cargo Khaki", value: "hsl(40, 20%, 30%)" },
      { name: "Stealth Black", value: "hsl(0, 0%, 8%)" },
    ],
  },
  {
    id: "6",
    name: "Anime Print Bucket Hat",
    price: 899,
    tag: null,
    images: [product6, product5, product3],
    description:
      "Complete the look with this all-over anime print bucket hat. Reversible design — graphic on one side, solid on the other.",
    details: [
      "100% cotton twill",
      "All-over sublimation print",
      "Reversible solid interior",
      "Embroidered eyelets",
      "One size fits most",
    ],
    rating: 4.5,
    reviews: 38,
    sizes: ["One Size"],
    colors: [
      { name: "Print Black", value: "hsl(0, 0%, 8%)" },
      { name: "Print White", value: "hsl(0, 0%, 90%)" },
    ],
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === id) || allProducts[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details">("description");

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/category/new-drops" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {product.tag && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    i === selectedImage
                      ? "border-primary neon-border"
                      : "border-border/50 hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-3xl font-display text-gradient mb-6">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Color selector */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
                Color — <span className="text-foreground">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      i === selectedColor ? "border-primary scale-110 neon-border" : "border-border"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-3 text-sm font-medium border transition-all duration-300 ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground neon-border"
                        : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Quantity</p>
              <div className="flex items-center border border-border w-fit">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-foreground font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button className="flex-1 h-12 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest hover-neon flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsFav(!isFav)}
                className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
                  isFav
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Heart size={18} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex gap-6 mb-4">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`text-sm uppercase tracking-widest pb-2 border-b-2 transition-all duration-300 ${
                    activeTab === "description"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`text-sm uppercase tracking-widest pb-2 border-b-2 transition-all duration-300 ${
                    activeTab === "details"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Details
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "description" ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {product.details.map((d, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-8">
            YOU MAY ALSO <span className="text-gradient">LIKE</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card mb-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-wider">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm text-primary font-semibold mt-1">₹{p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
