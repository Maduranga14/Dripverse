import { Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-2xl text-primary neon-text">Dripverse</span>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              Where anime culture meets premium streetwear. Every piece tells a story.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {[
            { 
              title: "Shop", 
              links: [
                { name: "New Arrivals", path: "/shop" },
                { name: "T-Shirts", path: "/category/t-shirts" },
                { name: "Hoodies", path: "/category/hoodies" },
                { name: "Accessories", path: "/category/accessories" }
              ] 
            },
            { 
              title: "Help", 
              links: [
                { name: "Size Guide", path: "#" },
                { name: "Shipping", path: "#" },
                { name: "Returns", path: "#" },
                { name: "Contact", path: "#" }
              ] 
            },
            { 
              title: "Company", 
              links: [
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "#" },
                { name: "Careers", path: "#" },
                { name: "Press", path: "#" }
              ] 
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg text-foreground tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.path.startsWith("/") ? (
                      <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Dripverse. All rights reserved. Anime-inspired, drip-certified.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
