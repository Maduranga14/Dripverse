const items = [
  "★ FREE SHIPPING OVER ₹1999",
  "★ ANIME DRIP COLLECTION",
  "★ PREMIUM QUALITY",
  "★ LIMITED DROPS",
  "★ GEEK APPROVED",
  "★ OTAKU STYLE",
];

const MarqueeBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
