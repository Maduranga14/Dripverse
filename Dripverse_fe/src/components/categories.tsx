import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const categories = [
  { name: "T-Shirts", slug: "t-shirts", image: product1 },
  { name: "Hoodies", slug: "hoodies", image: product2 },
  { name: "Jackets", slug: "jackets", image: product4 },
  { name: "Bottoms", slug: "bottoms", image: product5 },
  { name: "Accessories", slug: "accessories", image: product6 },
];

const Categories = () => {
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
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
          >
            <Link to={`/category/${cat.slug}`} className="absolute inset-0 z-10" />
              <img
                src={cat.image}
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
