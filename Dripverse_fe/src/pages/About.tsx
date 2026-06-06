import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, ShieldCheck, Flame, Users, Award, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-2.jpg";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const timelineItems = [
    {
      year: "2024",
      title: "The Genesis",
      desc: "Two anime enthusiasts and an independent graphic artist set out in a small garage with a singular goal: to create high-fashion anime apparel that stands out in the streetwear scene.",
    },
    {
      year: "2025",
      title: "First Sold Out Drop",
      desc: "Our inaugural 'Cyberpunk Oni' collection launched. Within 12 minutes, all 500 limited-edition oversized hoodies were sold out, validating our belief in quality anime apparel.",
    },
    {
      year: "2026",
      title: "Dripverse Launch",
      desc: "Today, we've launched our custom-designed web experience, serving tens of thousands of anime fashion enthusiasts globally, without compromising on premium quality and limited production scales.",
    },
  ];

  const values = [
    {
      icon: <Flame className="text-primary" size={28} />,
      title: "Uncompromising Quality",
      desc: "We use heavy-weight 240+ GSM pre-shrunk cotton, custom-knit fabrics, and high-definition screen printing designed to withstand the test of time.",
    },
    {
      icon: <Sparkles className="text-primary" size={28} />,
      title: "Artist First Designs",
      desc: "All graphics are curated and designed in-house or in collaboration with digital artists who share our passion for subculture storytelling.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={28} />,
      title: "Sustainable Drops",
      desc: "We operate on a limited-drop model to minimize fast-fashion waste, ensuring each piece you own remains highly exclusive.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Dripverse Streetwear Hero"
            className="w-full h-full object-cover object-center scale-105 filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              WHO WE ARE
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tighter text-foreground">
              WE ARE THE <span className="text-gradient">ANIME STREETWEAR</span> REVOLUTION
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Dripverse is where Otaku culture merges with high-tier streetwear aesthetic. We design apparel for those who live the culture and wear the aesthetic.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-24">
        
        {/* Our Mission */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-foreground">
              OUR <span className="text-gradient">MISSION</span>
            </h2>
            <div className="h-1 w-20 bg-primary rounded" />
            <p className="text-muted-foreground leading-relaxed">
              We grew tired of generic anime merchandise that faded after two washes and looked like standard souvenirs. We set out to change the narrative.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to engineer high-grade, fashion-forward streetwear inspired by legendary characters and anime sub-genres. From heavy box-cuts to custom dyed hoodies, every piece is made to turn heads.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={20} />
                <span className="text-sm font-medium text-foreground">50k+ Happy Collectors</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-primary" size={20} />
                <span className="text-sm font-medium text-foreground">100% Custom Cuts</span>
              </div>
            </div>
          </motion.div>

          {/* Premium Glass Stats Block */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[300px] border border-border/50"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <span className="text-primary font-display text-xs tracking-wider uppercase mb-1">Dripverse Philosophy</span>
            <blockquote className="text-lg sm:text-xl text-foreground font-light italic leading-relaxed mb-6">
              "Merchandise should not just be worn; it should tell a story, represent a culture, and feel like high fashion."
            </blockquote>
            <div className="h-px bg-border/50 my-2" />
            <p className="text-xs text-muted-foreground">
              - The Dripverse Design Collective
            </p>
          </motion.div>
        </motion.div>

        {/* Core Values */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-foreground">
              THE <span className="text-gradient">DRIP STANDARDS</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Every detail is meticulously crafted to bring out the highest value in anime apparel.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-3 gap-6"
          >
            {values.map((v, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-6 border border-border/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  {v.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Brand Timeline / Journey */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-foreground">
              OUR <span className="text-gradient">JOURNEY</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              How we grew from a small passion project into a globally recognized brand.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative border-l border-border/50 pl-6 sm:pl-10 space-y-12">
            {timelineItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative space-y-2"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-neon" />
                <span className="font-display text-xl sm:text-2xl text-primary font-bold">{item.year}</span>
                <h4 className="font-bold text-lg text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 sm:p-12 border border-border/50 text-center relative overflow-hidden"
        >
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-lg mx-auto space-y-6">
            <h3 className="font-display text-3xl sm:text-4xl text-foreground">
              JOIN THE <span className="text-gradient">DRIPVERSE</span>
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Explore our latest drop, featuring exclusive heavyweight fits, customized colorways, and bespoke embroidery details.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display tracking-widest text-sm uppercase px-8 py-3.5 rounded-lg hover-neon transition-all"
            >
              SHOP LATEST DROP <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
};

export default About;
