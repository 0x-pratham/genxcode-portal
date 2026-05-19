// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useScroll, useSpring, useTransform } from "framer-motion";

import ScrollProgressBar from "../components/shared/ScrollProgressBar";
import ScrollToTop from "../components/shared/ScrollToTop";
import SectionDivider from "../components/shared/SectionDivider";

import HomeAnimatedBackground from "../components/home/HomeAnimatedBackground";
import HeroSection from "../components/home/HeroSection";
import HeroBenefitSlider from "../components/home/HeroBenefitSlider";
import CTAStrip from "../components/home/CTAStrip";
import LeagueSection from "../components/home/LeagueSection";
import VisionSection from "../components/home/VisionSection";
import FoundersSection from "../components/home/FoundersSection";
import PresidentTeam from "../components/home/PresidentTeam";
import BenefitsSliderSection from "../components/home/BenefitsSliderSection";
import PillarsSection from "../components/home/PillarsSection";
import BrandBlock from "../components/home/BrandBlock";
import HomeFooter from "../components/home/HomeFooter";

import {
  benefits,
  visions,
  founder,
  coFounder,
  mentor,
  presidentTeam,
  pillars,
  leagues,
} from "../data/homeData";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [leagueIndex, setLeagueIndex] = useState(0);
  const [autoLeague, setAutoLeague] = useState(true);

  const { scrollYProgress } = useScroll();
  
  // Premium tailored spring physics for organic momentum behavior
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 65, damping: 26, mass: 0.5 });
  const contentTranslate = useTransform(smoothProgress, [0, 1], [0, -60]);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "";
    };
  }, []);

  useEffect(() => {
    if (!autoSlide) return;
    const id = setInterval(() => setActiveIndex((prev) => (prev + 1) % benefits.length), 8000);
    return () => clearInterval(id);
  }, [autoSlide]);

  useEffect(() => {
    if (!autoLeague) return;
    const id = setInterval(() => setLeagueIndex((prev) => (prev + 1) % leagues.length), 7000);
    return () => clearInterval(id);
  }, [autoLeague]);

  const active = benefits[activeIndex];
  const activeLeague = leagues[leagueIndex];

  const sectionScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative min-h-screen bg-brand-cosmos text-neutral-premiumText pb-32 overflow-hidden font-sans antialiased">
      <ScrollProgressBar />
      <ScrollToTop />
      
      {/* Background Orbs and Layers wrap seamlessly */}
      <HomeAnimatedBackground />

      <div className="home-layout-container space-y-24 relative z-10 mt-12">
        <HeroSection contentTranslate={contentTranslate} onSectionScroll={sectionScroll}>
          <HeroBenefitSlider
            benefits={benefits}
            activeIndex={activeIndex}
            active={active}
            onPrev={() => setActiveIndex((p) => (p - 1 + benefits.length) % benefits.length)}
            onNext={() => setActiveIndex((p) => (p + 1) % benefits.length)}
            onDotClick={setActiveIndex}
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          />
        </HeroSection>

        {/* Replaced standard neon layout split variants with unified architecture lines */}
        <SectionDivider variant="brand" />
        <CTAStrip />
        <SectionDivider variant="brand" delay={0.2} />

        <LeagueSection
          leagues={leagues}
          activeLeague={activeLeague}
          leagueIndex={leagueIndex}
          onPrev={() => setLeagueIndex((p) => (p - 1 + leagues.length) % leagues.length)}
          onNext={() => setLeagueIndex((p) => (p + 1) % leagues.length)}
          onDotClick={setLeagueIndex}
          onMouseEnter={() => setAutoLeague(false)}
          onMouseLeave={() => setAutoLeague(true)}
        />

        <SectionDivider variant="brand" delay={0.4} />
        
        <VisionSection visions={visions} />
        
        <FoundersSection founder={founder} coFounder={coFounder} mentor={mentor} />

        <div id="team-section">
          <PresidentTeam presidentTeam={presidentTeam} />
        </div>

        <BenefitsSliderSection
          benefits={benefits}
          active={active}
          activeIndex={activeIndex}
          onPrev={() => setActiveIndex((p) => (p - 1 + benefits.length) % benefits.length)}
          onNext={() => setActiveIndex((p) => (p + 1) % benefits.length)}
          onDotClick={setActiveIndex}
          onMouseEnter={() => setAutoSlide(false)}
          onMouseLeave={() => setAutoSlide(true)}
        />

        <PillarsSection pillars={pillars} />
        
        <BrandBlock />
        
        <HomeFooter />
      </div>
    </main>
  );
}