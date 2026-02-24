import { useState, useEffect } from "react";

const benefits = [
  {
    title: "Real Project Experience",
    description: "Build real-world projects for GitHub — not tutorial code.",
    icon: "💻",
  },
  {
    title: "Competitive Leagues",
    description: "Earn points, climb ranks, and compete with peers.",
    icon: "🏆",
  },
  {
    title: "Career Growth",
    description: "Mentorship, portfolio reviews & interview preparation.",
    icon: "📈",
  },
  {
    title: "Community Support",
    description: "Learn and grow with a high‑energy developer community.",
    icon: "🤝",
  },
];

const BenefitsSlideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % benefits.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-neon rounded-2xl border border-primary/30 p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-neon-cyan mb-8">
        Why Join GenXCode?
      </h2>

      <div className="relative h-52 md:h-48 overflow-hidden">
        {benefits.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">{b.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-neon-purple">
                {b.title}
              </h3>
              <p className="text-sm md:text-base text-foreground/80 max-w-xl mx-auto">
                {b.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {benefits.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitsSlideshow;
