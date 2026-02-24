// src/pages/Home.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useToast } from "../context/ToastContext";
// keep static analyzer happy when `motion` is only used in JSX
void motion;

const benefits = [
  {
    id: 1,
    title: "Real‑World Project Experience",
    highlight: "Portfolio building with industry-style projects",
    desc: "Web apps, mobile apps, cybersecurity tools, AI/ML mini‑projects and hackathon prototypes that you can proudly showcase on GitHub and in your resume.",
    chip: "Projects",
  },
  {
    id: 2,
    title: "Free Skill Development Workshops",
    highlight: "Hands‑on learning, zero extra fees",
    desc: "Regular sessions on Web dev, App dev, Ethical Hacking, Python & ML, Cloud basics, Git & GitHub – everything beyond the textbook.",
    chip: "Workshops",
  },
  {
    id: 3,
    title: "Internship & Micro‑Internships",
    highlight: "Real experience, real certificates",
    desc: "Short‑term and project‑based internships that give you industry‑style exposure and stronger placement profiles.",
    chip: "Internships",
  },
  {
    id: 4,
    title: "Certification Programs",
    highlight: "Add weight to your resume",
    desc: "Certificates for workshops, trainings, internships and hackathons – perfectly aligned for campus placements.",
    chip: "Certification",
  },
  {
    id: 5,
    title: "Career Support & Placement Prep",
    highlight: "From resume to mock interviews",
    desc: "Resume polishing, interview prep, DSA guidance and company‑specific sessions to help you crack internships and jobs.",
    chip: "Career",
  },
  {
    id: 6,
    title: "Hackathon Training & Participation",
    highlight: "From college events to national stages",
    desc: "Structured guidance for SIH, Kavach, inter‑college as well as global online hackathons – with team formation and mentoring.",
    chip: "Hackathons",
  },
  {
    id: 7,
    title: "Soft Skills & Leadership",
    highlight: "Not just coders, but leaders",
    desc: "Public speaking, presentation skills, teamwork and project management to make you truly industry‑ready.",
    chip: "Soft Skills",
  },
  {
    id: 8,
    title: "Student Startup Support",
    highlight: "Turn ideas into real products",
    desc: "Startup fundamentals, product thinking, mentorship and pitch‑deck help for students who want to build something of their own.",
    chip: "Startups",
  },
  {
    id: 9,
    title: "Mentorship Program",
    highlight: "Seniors teaching juniors",
    desc: "A structured mentor–mentee model with branch ambassadors and peer learning so nobody has to learn alone.",
    chip: "Mentorship",
  },
  {
    id: 10,
    title: "Strong Technical Community",
    highlight: "You grow faster in a tribe",
    desc: "Developer networks, alumni connects, collab teams and research groups – a network that keeps opening doors.",
    chip: "Community",
  },
  {
    id: 11,
    title: "Open‑Source Contribution Training",
    highlight: "Stand out with real GitHub impact",
    desc: "Guided pathways to contribute to open‑source projects, community tools and documentation.",
    chip: "Open Source",
  },
  {
    id: 12,
    title: "Portfolio & Personal Branding",
    highlight: "Make your work visible",
    desc: "Personal GitHub, LinkedIn, portfolio sites and project documentation that recruiters actually notice.",
    chip: "Branding",
  },
  {
    id: 13,
    title: "Tech Talks & Expert Sessions",
    highlight: "Direct exposure to industry",
    desc: "Talks on AI/ML, Cybersecurity, Cloud DevOps, Startups and UI/UX from engineers and founders.",
    chip: "Expert Talks",
  },
  {
    id: 14,
    title: "Research Collaboration",
    highlight: "From idea to paper",
    desc: "Help with topics, implementation and paper writing for conferences and academic projects.",
    chip: "Research",
  },
  {
    id: 15,
    title: "Beginner‑Friendly On‑Ramp",
    highlight: "Even zero‑coding students are welcome",
    desc: "Dedicated beginner and first‑year groups with slow‑paced, supportive learning tracks.",
    chip: "Beginners",
  },
  {
    id: 16,
    title: "Tech Events & Fun Competitions",
    highlight: "Learning that doesn’t feel boring",
    desc: "Coding quizzes, bug hunts, debugging battles, portfolio days and even tech meme contests.",
    chip: "Events",
  },
  {
    id: 17,
    title: "Summer & Winter Bootcamps",
    highlight: "Productive vacations",
    desc: "10–15 day intensive camps with hands‑on projects and certificates to show for your time.",
    chip: "Bootcamps",
  },
  {
    id: 18,
    title: "Teaching & Volunteering Roles",
    highlight: "Grow as a mentor and leader",
    desc: "High performers get chances to mentor, train, organise events and lead teams.",
    chip: "Leadership",
  },
  {
    id: 19,
    title: "Student Achievement Recognition",
    highlight: "Your wins, showcased properly",
    desc: "Hall‑of‑fame style recognition, leaderboards, top projects and appreciation certificates.",
    chip: "Recognition",
  },
  {
    id: 20,
    title: "Competitive Exam Guidance",
    highlight: "Plan beyond college",
    desc: "Support for GATE, security certifications, cloud certs and more – so you know what to aim for next.",
    chip: "Exams",
  },
];

const visions = [
  "Make your college the most active tech campus in the region.",
  "Help every motivated student ship at least 3 real projects before graduation.",
  "Bridge the gap between syllabus and industry with practical experience.",
  "Create a culture where juniors and seniors grow together, not alone.",
];

// 🔹 Team data – replace with real names & roles when ready
const founder = {
  name: "Prathamesh Bhil",
  role: "Founder, GenXCode",
  quote:
    "GenXCode was started with one simple idea: every motivated student deserves a serious, structured place to build and grow — not just attend random events.",
  focusPoints: [
    "Turning college energy into real products and initiatives.",
    "Making collaboration, shipping and learning a normal habit.",
    "Building a university‑level ecosystem, starting from one campus.",
  ],
};

const coFounder = {
  name: "Akash Lad",
  role: "Co‑Founder, GenXCode",
  quote:
    "We didn’t want GenXCode to be ‘just another club’. We wanted it to feel like a small startup inside campus, where everyone can contribute and learn.",
  focusPoints: [
    "Keeping tracks beginner‑friendly but still ambitious.",
    "Helping members move from tutorials to real‑world code.",
    "Creating a pipeline from projects → internships → opportunities.",
  ],
};

const mentor = {
  name: "Prof. Ravina Malshikare",
  role: "Mentor, GenXCode",
  quote:
    "GenXCode is not just about learning tech — it’s about building discipline, consistency and real execution mindset among students.",
  focusPoints: [
    "Providing strategic guidance and direction.",
    "Ensuring quality and long-term sustainability.",
    "Supporting leadership and growth alignment.",
  ],
};

const presidentTeam = [
  {
    name: "Srushti Ghule",
    role: "President",
    focus: "Overall leadership, strategic direction and execution oversight.",
    yearBranch: "",
  },
  {
    name: "Samruddhi Kadam",
    role: "Vice President",
    focus: "Operational support, coordination and internal management.",
    yearBranch: "",
  },
  {
    name: "Narendra Gond",
    role: "Project Director",
    focus: "Project pipelines, implementation quality and delivery standards.",
    yearBranch: "",
  },
  {
    name: "Vaishnavi Patil",
    role: "Technical Coordinator",
    focus: "Technical tracks, code reviews and development standards.",
    yearBranch: "",
  },
  {
    name: "Prajwal Talole",
    role: "Core Team Lead",
    focus: "Core team supervision and performance alignment.",
    yearBranch: "",
  },
  {
    name: "Shirin Ekatpure",
    role: "Core Team Manager",
    focus: "Member engagement, structure and coordination.",
    yearBranch: "",
  },
  {
    name: "Shraddha Hiray",
    role: "Auditor",
    focus: "Process transparency, documentation and system accountability.",
    yearBranch: "",
  },
];

const coreTeam = [
  {
    name: "Shraddha Hiray",
    tag: "Code Crafters",
    focus: "Frontend, backend and full‑stack guidance.",
  },
  {
    name: "Srushti Ghule",
    tag: "Innovatex",
    focus: "CTFs, basic pentesting and security awareness.",
  },
  {
    name: "Samruddhi Kadam",
    tag: "Cyber Wizards",
    focus: "ML mini‑projects, notebooks and model experiments.",
  },
  {
    name: "Vaishnavi Patil",
    tag: "Byte Breakers",
    focus: "Cloud basics, deployment and tooling.",
  },
  {
    name: "Himanshu Deshmukh",
    tag: "Quantam Ninjas",
    focus: "Guides, docs, write‑ups and learning paths.",
  },
  {
    name: "Aditya Dhanawade",
    tag: "Code Realm",
    focus: "Workshops, bootcamps and hackathon logistics.",
  },
  {
    name: "Anup Ingle",
    tag: "Infinite Loops",
    focus: "Visual identity, UI/UX and social presence.",
  },
];

const pillars = [
  {
    tag: "01 · Build",
    title: "Project‑first learning",
    text: "Learn by shipping real products – not just watching tutorials. Every track ends in something you can demo.",
  },
  {
    tag: "02 · Grow",
    title: "Mentorship & feedback",
    text: "Get code reviews, guidance and career direction from seniors and mentors who have already walked the path.",
  },
  {
    tag: "03 · Shine",
    title: "Visibility & recognition",
    text: "Leagues, leaderboards, shoutouts and portfolio help to make sure your work actually gets noticed.",
  },
];

// 🟣 League visualisation data (uses your 8 leagues & PNGs)
const leagues = [
  {
    id: 1,
    key: "Bronze",
    name: "Bronze League",
    emoji: "🥉",
    pointsLabel: "0+ pts",
    image: "https://i.ibb.co/tM2cYgH7/Bronze-Gen-X.png",
    gradient: "from-amber-500/60 via-amber-400/0 to-transparent",
    glow: "from-amber-400/50 via-amber-500/10 to-transparent",
    tagline: "You’ve started your GenXCode journey.",
    desc: "New members exploring challenges, getting comfortable with GitHub and attending their first sessions.",
  },
  {
    id: 2,
    key: "Silver",
    name: "Silver League",
    emoji: "🥈",
    pointsLabel: "1000+ pts",
    image: "https://i.ibb.co/678CCT6r/Silver-Gen-X.png",
    gradient: "from-slate-200/60 via-slate-400/0 to-transparent",
    glow: "from-slate-300/60 via-slate-400/10 to-transparent",
    tagline: "You’re consistent and present.",
    desc: "Regular sessions, a few approved submissions and a growing GitHub graph – you’re clearly on track.",
  },
  {
    id: 3,
    key: "Gold",
    name: "Gold League",
    emoji: "🥇",
    pointsLabel: "2000+ pts",
    image: "https://i.ibb.co/Mxzh052j/Gold.png",
    gradient: "from-yellow-400/70 via-yellow-500/0 to-transparent",
    glow: "from-yellow-300/70 via-yellow-500/10 to-transparent",
    tagline: "Your work is shining now.",
    desc: "Multiple solid projects, strong participation and visible ownership in tracks or events.",
  },
  {
    id: 4,
    key: "Crystal",
    name: "Crystal League",
    emoji: "💎",
    pointsLabel: "3000+ pts",
    image: "https://i.ibb.co/zVN7CCXd/Crystal.png",
    gradient: "from-cyan-300/70 via-cyan-400/0 to-transparent",
    glow: "from-cyan-300/70 via-cyan-400/10 to-transparent",
    tagline: "You’re a reliable builder.",
    desc: "You ship clean implementations, help peers and show up as a strong contributor in the community.",
  },
  {
    id: 5,
    key: "Master",
    name: "Master League",
    emoji: "🧠",
    pointsLabel: "4500+ pts",
    image: "https://i.ibb.co/SD6X0rXp/Master.png",
    gradient: "from-indigo-300/70 via-indigo-500/0 to-transparent",
    glow: "from-indigo-400/70 via-indigo-500/10 to-transparent",
    tagline: "You’re moving like a mentor.",
    desc: "People ask you doubts. You lead mini‑projects, help reviews and guide juniors with patience.",
  },
  {
    id: 6,
    key: "Champion",
    name: "Champion League",
    emoji: "🏆",
    pointsLabel: "6000+ pts",
    image: "https://i.ibb.co/WWP1vgjD/Champion.png",
    gradient: "from-fuchsia-300/80 via-fuchsia-500/0 to-transparent",
    glow: "from-fuchsia-400/80 via-fuchsia-500/10 to-transparent",
    tagline: "You define the standard.",
    desc: "Strong projects, consistent leadership and visible impact across events, tracks and hackathons.",
  },
  {
    id: 7,
    key: "Titan",
    name: "Titan League",
    emoji: "⚡",
    pointsLabel: "7000+ pts",
    image: "https://i.ibb.co/5WtJTR9X/titan.png",
    gradient: "from-emerald-300/80 via-emerald-500/0 to-transparent",
    glow: "from-emerald-400/80 via-emerald-500/10 to-transparent",
    tagline: "You’re a force on campus.",
    desc: "You drive initiatives, unlock collaborations and push the culture of building across the college.",
  },
  {
    id: 8,
    key: "Legend",
    name: "Legend League",
    emoji: "👑",
    pointsLabel: "8000+ pts",
    image: "https://i.ibb.co/5hF3VvPt/legend.png",
    gradient: "from-fuchsia-400/90 via-amber-400/40 to-transparent",
    glow: "from-fuchsia-400/90 via-amber-300/40 to-transparent",
    tagline: "You’re part of GenXCode history.",
    desc: "Founders, long‑term leaders and iconic contributors whose work shaped the community itself.",
  },
];

const benefitSlideVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98, rotateY: -15 },
  center: { opacity: 1, x: 0, scale: 1, rotateY: 0 },
  exit: { opacity: 0, x: -40, scale: 0.98, rotateY: 15 },
};

const leagueSlideVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97, rotateX: -10 },
  center: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
  exit: { opacity: 0, y: -24, scale: 0.97, rotateX: 10 },
};

// Text reveal animation variants
const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Stagger container for lists
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Item variants for stagger
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Card hover variants (adjusted for more depth & tactile feel)
const cardHoverVariants = {
  rest: { scale: 1, y: 0, rotateY: 0, boxShadow: "0 6px 16px rgba(2,6,23,0.6)" },
  hover: { 
    scale: 1.04, 
    y: -10, 
    rotateY: 6,
    transition: { duration: 0.28, ease: "easeOut" }
  }
};

export default function Home() {
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  const [leagueIndex, setLeagueIndex] = useState(0);
  const [autoLeague, setAutoLeague] = useState(true);

  const currentYear = new Date().getFullYear();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });

  // Parallax transforms for background elements (pixel values for GPU compositing)
  
  const contentTranslate = useTransform(smoothProgress, [0, 1], [0, -90]); // px

  // Enable native smooth scrolling for anchor navigation (clean and subtle)
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "";
    };
  }, []);
useEffect(() => {
  const checkScreen = () => {
    setIsLargeScreen(window.innerWidth > 768);
  };

  checkScreen(); // run once on load
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);
  // Respect user's reduced motion preference
  const shouldReduce = useReducedMotion();
  
  // Ref for hero section
  const heroRef = useRef(null);
  

  // Generate particle data with deterministic pattern
  const particles = useMemo(() => {
    const patterns = [
      { width: 3, height: 3, left: 15, top: 20, xOffset: 8, duration: 4, delay: 0 },
      { width: 2.5, height: 2.5, left: 75, top: 30, xOffset: -6, duration: 3.5, delay: 0.5 },
      { width: 4, height: 4, left: 45, top: 60, xOffset: 5, duration: 4.5, delay: 1 },
      { width: 2, height: 2, left: 85, top: 70, xOffset: -8, duration: 3, delay: 1.5 },
      { width: 3.5, height: 3.5, left: 25, top: 80, xOffset: 7, duration: 4.2, delay: 0.8 },
      { width: 2.8, height: 2.8, left: 60, top: 10, xOffset: -5, duration: 3.8, delay: 1.2 },
    ];
    return patterns.map((pattern, i) => ({
      id: i,
      ...pattern,
      color: i % 2 === 0 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(168, 85, 247, 0.4)',
    }));
  }, []);

  // small twinkling stars for extra premium sparkle
  const stars = useMemo(() => {
    return [
      { left: 8, top: 10, size: 2, delay: 0 },
      { left: 25, top: 22, size: 1.8, delay: 0.6 },
      { left: 55, top: 8, size: 1.5, delay: 1.2 },
      { left: 72, top: 40, size: 2.2, delay: 0.4 },
      { left: 40, top: 75, size: 1.6, delay: 1.0 },
      { left: 85, top: 20, size: 1.9, delay: 0.2 },
      { left: 12, top: 68, size: 1.3, delay: 1.5 },
      { left: 62, top: 55, size: 1.7, delay: 0.8 },
    ];
  }, []);

  // Auto‑slide ALL benefits (hero + big slider share the same activeIndex)
  useEffect(() => {
    if (!autoSlide) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % benefits.length);
    }, 8000);

    return () => clearInterval(id);
  }, [autoSlide]);

  // Auto slide leagues
  useEffect(() => {
    if (!autoLeague) return;

    const id = setInterval(() => {
      setLeagueIndex((prev) => (prev + 1) % leagues.length);
    }, 7000);

    return () => clearInterval(id);
  }, [autoLeague]);

  const active = benefits[activeIndex];
  const activeLeague = leagues[leagueIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % benefits.length);
  };

  const handleDotClick = (idx) => {
    setActiveIndex(idx);
  };

  const handleLeaguePrev = () => {
    setLeagueIndex((prev) => (prev - 1 + leagues.length) % leagues.length);
  };

  const handleLeagueNext = () => {
    setLeagueIndex((prev) => (prev + 1) % leagues.length);
  };

  const handleLeagueDotClick = (idx) => {
    setLeagueIndex(idx);
  };

  const sectionScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll progress indicator
  const scrollProgressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 pb-24 overflow-hidden">
      {/* Premium Scroll progress bar with glow */}
      <motion.div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 z-50 origin-left shadow-lg shadow-cyan-500/50"
        style={{ 
          width: scrollProgressWidth,
          transformOrigin: "left"
        }}
      />
      
      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 shadow-2xl shadow-cyan-500/50 flex items-center justify-center text-slate-950 font-bold backdrop-blur-sm border border-cyan-400/30"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↑
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
      {/* ⭐ Enhanced animated background orbs with parallax */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden will-change-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ willChange: "transform" }}
        
      >
        {/* cyan blob with enhanced animation */}
        <motion.div
          className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl will-change-transform"
          animate={!shouldReduce ? {
            x: [0, 30, -10, 0],
            y: [0, -10, 20, 0],
            scale: [1, 1.06, 0.97, 1]
          } : {}}
          transition={!shouldReduce ? { duration: 22, repeat: Infinity, ease: "easeInOut" } : {}}
          style={{ willChange: "transform, opacity" }}
        />
        {/* purple blob */}
        <motion.div
          className="absolute top-64 -right-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl will-change-transform"
          animate={!shouldReduce ? {
            x: [0, -25, 10, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.97, 1.03, 1]
          } : {}}
          transition={!shouldReduce ? { duration: 26, repeat: Infinity, ease: "easeInOut" } : {}}
          style={{ willChange: "transform, opacity" }}
        />
        {/* emerald blob */}
        <motion.div
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl will-change-transform"
          animate={!shouldReduce ? {
            x: [0, 15, -20, 0],
            y: [0, 10, -10, 0],
            scale: [1, 1.03, 0.97, 1]
          } : {}}
          transition={!shouldReduce ? { duration: 30, repeat: Infinity, ease: "easeInOut" } : {}}
          style={{ willChange: "transform, opacity" }}
        />
        {/* Additional floating particles */}
        {!shouldReduce && isLargeScreen &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: particle.color,
            }}
            animate={!shouldReduce ? {
              y: [0, -28, 0],
              x: [0, particle.xOffset * 0.8, 0],
              opacity: [0.28, 0.7, 0.28],
            } : { opacity: 0.5 }}
            transition={!shouldReduce ? {
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            } : {}}
          />
        ))}

        {stars.map((s, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%`, opacity: 0.85 }}
            animate={!shouldReduce && isLargeScreen ? { opacity: [0.18, 0.95, 0.18], scale: [0.9, 1.12, 0.9] } : { opacity: 0.75 }}
            transition={!shouldReduce && isLargeScreen ? { duration: 2.5 + i * 0.2, repeat: Infinity, delay: s.delay } : {}}
          />
        ))}
        {/* Animated gradient mesh overlay */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.72),_transparent_60%)]"
          animate={!shouldReduce ? {
            background: [
              "radial-gradient(circle at top, rgba(15,23,42,0.72), transparent 60%)",
              "radial-gradient(circle at 30% 20%, rgba(15,23,42,0.72), transparent 60%)",
              "radial-gradient(circle at bottom, rgba(15,23,42,0.72), transparent 60%)",
              "radial-gradient(circle at top, rgba(15,23,42,0.72), transparent 60%)",
            ]
          } : {}}
          transition={!shouldReduce ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
        />

        {/* Shimmer sweep — diagonal glossy sweep for premium feel */}
        {!shouldReduce && isLargeScreen && (
          <motion.div
            className="absolute -left-1/2 top-0 h-full w-1/3 pointer-events-none"
            initial={{ x: '-120%', rotate: -12 }}
            animate={{ x: ['-120%', '120%'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
        )}

        {/* subtle SVG noise overlay for premium texture (low opacity) */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-6"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 600 400"
        >
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.06" fill="#000" />
        </motion.svg>
      </motion.div>

      {/* All page content sits ABOVE the animated BG */}
      <div className="container-page relative z-10 pt-12 md:pt-16 space-y-16 md:space-y-20">
        {/* Stats removed for a cleaner hero — compact announcement below */}
        <motion.div
          className="mx-auto max-w-4xl rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-center text-sm text-slate-300 backdrop-blur-sm shadow-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-medium text-slate-200">Welcome to GenXCode</span>
          <span className="ml-2 text-slate-400">— Build projects, join tracks and climb the leagues.</span>
          <div className="mt-3">
</div>
        </motion.div>

        {/* ===== HERO ===== */}
        <motion.section
          ref={heroRef}
          className="grid gap-12 items-start lg:items-center lg:grid-cols-[1.2fr,1fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ y: contentTranslate }}
        >
          {/* Left column */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Badge row with enhanced animation */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/15 backdrop-blur"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <motion.span 
                className="inline-flex h-2 w-2 rounded-full bg-emerald-400"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium tracking-wide">
                GenXCode · Student Developer Community
              </span>
            </motion.div>

            {/* Heading with text reveal */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight md:leading-[1.05]"
                variants={textRevealVariants}
              >
                Turn your{" "}
                <motion.span 
                  className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent inline-block"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  ideas into ship‑ready projects
                </motion.span>{" "}
                before you graduate.
              </motion.h1>
              <motion.p 
                className="text-sm md:text-base text-slate-400 max-w-xl"
                variants={textRevealVariants}
              >
                Build real products, ship to GitHub, collaborate with a serious
                tech community and earn points, leagues & recognition as you
                grow.
              </motion.p>
            </motion.div>

            {/* CTA buttons with enhanced animations */}
            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap gap-4 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/apply">
                  <motion.button 
                    className="relative overflow-hidden group btn-primary px-7 py-3 text-sm font-medium shadow-xl shadow-cyan-500/40 transition"
                    whileHover={{ boxShadow: "0 20px 40px rgba(34, 211, 238, 0.4)" }}
                  >
                    <motion.span 
                      className="relative z-[1]"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Start Building with GenXCode
                    </motion.span>
                    <motion.span 
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-sky-500/30 to-indigo-500/40"
                      initial={{ opacity: 0, x: "-100%" }}
                      whileHover={{ opacity: 1, x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/challenges">
                  <motion.button 
                    className="btn-outline px-7 py-3 text-sm font-medium transition"
                    whileHover={{ 
                      y: -2,
                      borderColor: "rgb(34, 211, 238)",
                      boxShadow: "0 10px 30px rgba(34, 211, 238, 0.2)"
                    }}
                  >
                    Explore challenges
                  </motion.button>
                </Link>
              </motion.div>

              <motion.button
                type="button"
                variants={itemVariants}
                whileHover={{ x: 4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs md:text-sm text-slate-400 hover:text-cyan-300 transition"
                onClick={() => sectionScroll("team-section")}
              >
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  Meet the team ↓
                </motion.span>
              </motion.button>
            </motion.div>

            {/* tiny scroll hint */}
            
          </motion.div>

          {/* Right column – Featured benefit slider (ALL benefits) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          >
            {/* Outer animated glow frame with enhanced effects */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative card bg-slate-950/90 border border-slate-700/80 rounded-3xl px-4 py-5 sm:px-6 md:px-7 md:py-7 shadow-2xl shadow-slate-950/80 backdrop-blur"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}

              whileHover={{ 
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 mb-3">
                Member benefit spotlight
              </p>

              <AnimatePresence mode="wait">
              <div aria-live="polite">
             <motion.div
             key={active.id}
                  className="space-y-3"
                  variants={benefitSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] border border-slate-700/80">
                    <span className="text-xs font-mono text-slate-400">
                      #{active.id.toString().padStart(2, "0")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">{active.chip}</span>
                  </div>

                  <h2 className="text-lg md:text-xl font-semibold">
                    {active.title}
                  </h2>

                  <p className="text-xs md:text-sm text-cyan-200/90">
                    {active.highlight}
                  </p>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {active.desc}
                  </p>
                </motion.div>
                </div>
              </AnimatePresence>

              {/* slide controls */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {benefits.slice(0, 6).map((b, idx) => (
                      <button
                        key={b.id}
                        onClick={() => handleDotClick(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          activeIndex === idx
                            ? "w-6 bg-cyan-400"
                            : "w-2 bg-slate-600/80 hover:bg-slate-300"
                        }`}
                        type="button"
                        aria-label={`Go to benefit ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-[10px] text-slate-500">
                    +{benefits.length - 6} more benefits
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={handlePrev}
                    className="rounded-full border border-slate-700 px-2 py-1 hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                    aria-label="Previous benefit"
                  >
                    ◀
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-full border border-slate-700 px-2 py-1 hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                    aria-label="Next benefit"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                <p>
                  Benefit {active.id} of {benefits.length}
                </p>
                <p>Auto‑sliding every 8 seconds · Pauses on hover</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ===== PREMIUM SECTION DIVIDER ===== */}
        <motion.div
          className="relative py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="px-4">
              <motion.div
                className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
        </motion.div>

        {/* ===== CTA STRIP ===== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                Choose how you want to{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  start
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Challenges · Leaderboard · Personal dashboard
              </p>
            </div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] text-slate-400"
              whileHover={{ scale: 1.05, borderColor: "rgb(34, 211, 238)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Quick access</span>
            </motion.div>
          </div>

          <motion.div 
            className="grid gap-4 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Link to="/challenges">
                <motion.div
                  className="card group cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-slate-800 px-5 py-5 hover:border-cyan-400/80 transition-all relative overflow-hidden"
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-cyan-500/0 transition-all duration-500"
                  />
                  <div className="relative z-10">
                    <motion.p 
                      className="text-xs text-cyan-300 mb-1"
                      whileHover={{ x: 4 }}
                    >
                      1 · Start building
                    </motion.p>
                    <h3 className="text-sm font-semibold mb-1">
                      Join a coding challenge
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Pick a challenge, ship your solution on GitHub and earn points,
                      feedback and league promotions.
                    </p>
                    <motion.span 
                      className="text-[11px] text-cyan-300 inline-flex items-center gap-1"
                      whileHover={{ x: 4 }}
                    >
                      Explore now <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/leaderboard">
                <motion.div
                  className="card group cursor-pointer bg-slate-900 border-slate-800 px-5 py-5 hover:border-amber-400/80 transition-all relative overflow-hidden"
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-amber-500/0 transition-all duration-500"
                  />
                  <div className="relative z-10">
                    <motion.p 
                      className="text-xs text-amber-300 mb-1"
                      whileHover={{ x: 4 }}
                    >
                      2 · Compete
                    </motion.p>
                    <h3 className="text-sm font-semibold mb-1">
                      Climb the leaderboard
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Track your rank, unlock higher leagues like Silver, Gold,
                      Platinum and more as your points grow.
                    </p>
                    <motion.span 
                      className="text-[11px] text-amber-300 inline-flex items-center gap-1"
                      whileHover={{ x: 4 }}
                    >
                      View top performers <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/dashboard">
                <motion.div
                  className="card group cursor-pointer bg-slate-900 border-slate-800 px-5 py-5 hover:border-emerald-400/80 transition-all relative overflow-hidden"
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-emerald-500/0 transition-all duration-500"
                  />
                  <div className="relative z-10">
                    <motion.p 
                      className="text-xs text-emerald-300 mb-1"
                      whileHover={{ x: 4 }}
                    >
                      3 · Grow
                    </motion.p>
                    <h3 className="text-sm font-semibold mb-1">
                      Own your member dashboard
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-2">
                      See your submissions, points, league, attendance streak and
                      profile snapshot in one clean view.
                    </p>
                    <motion.span 
                      className="text-[11px] text-emerald-300 inline-flex items-center gap-1"
                      whileHover={{ x: 4 }}
                    >
                      Go to dashboard <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ===== PREMIUM SECTION DIVIDER ===== */}
        <motion.div
          className="relative py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="px-4">
              <motion.div
                className="h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
        </motion.div>

        {/* ===== LEAGUE VISUALISATION SECTION (NOW ABOVE VISION) ===== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-2xl">🏆</span>
                <h2 className="text-xl md:text-2xl font-semibold">
                  GenXCode <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">League System</span>
                </h2>
              </motion.div>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
                Every submission, event and contribution pushes you up this rank
                ladder – from Bronze GenX all the way to Legend.
              </p>
            </div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[11px] text-slate-400"
              whileHover={{ scale: 1.05, borderColor: "rgb(251, 191, 36)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>8 Leagues · 0 → 8000+ points</span>
            </motion.div>
          </div>

          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setAutoLeague(false)}
            onMouseLeave={() => setAutoLeague(true)}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-2xl"
              animate={{ opacity: [0.3, 0.85, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative rounded-3xl bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 border border-slate-800/80 px-5 py-6 md:px-8 md:py-7 shadow-2xl shadow-slate-950/80 overflow-hidden backdrop-blur-xl">
              {/* Premium animated top accent */}
              <motion.div 
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-fuchsia-400"
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  boxShadow: [
                    "0 0 20px rgba(34, 211, 238, 0.3)",
                    "0 0 40px rgba(251, 191, 36, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Subtle inner glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/80">
                  <span className="text-[11px] font-mono text-slate-500">
                    #{activeLeague.id.toString().padStart(2, "0")}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[11px] text-slate-200">League</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {activeLeague.pointsLabel} ·{" "}
                  <span className="text-cyan-300 font-medium">
                    {activeLeague.name}
                  </span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLeague.key}
                  variants={leagueSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45 }}
                  className="grid gap-6 lg:grid-cols-[1.1fr,1.2fr] items-center"
                >
                  {/* Badge + glow – centered in the cube */}
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="relative">
                      {/* colored aura behind badge */}
                      <div
                        className={`pointer-events-none absolute -inset-8 translate-y-4 blur-3xl bg-gradient-to-b ${activeLeague.glow}`}
                      />
                      <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/70 flex items-center justify-center shadow-[0_0_40px_rgba(15,23,42,1)] overflow-hidden">
                        <img
                          src={activeLeague.image}
                          alt={`${activeLeague.name} badge`}
                          className="h-20 w-20 md:h-24 md:w-24 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute -inset-[3px] rounded-[1.75rem] border border-cyan-300/50 blur-[2px] opacity-80" />
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Badge preview used on{" "}
                      <span className="text-cyan-300">Dashboard</span> &{" "}
                      <span className="text-cyan-300">Leaderboard</span>.
                    </p>
                  </div>

                  {/* Text + mini ladder */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        {activeLeague.emoji} {activeLeague.pointsLabel}
                      </p>
                      <h3 className="text-lg md:text-xl font-semibold">
                        {activeLeague.name}
                      </h3>
                      <p className="text-xs md:text-sm text-cyan-200/90 mt-1">
                        {activeLeague.tagline}
                      </p>
                      <p className="text-sm md:text-base text-slate-300 mt-2">
                        {activeLeague.desc}
                      </p>
                    </div>

                    {/* mini progress ladder line */}
                    <div className="mt-2 space-y-2">
                      <p className="text-[11px] text-slate-400">
                        League path preview
                      </p>
                      <div className="flex items-center gap-1.5">
                        {leagues.map((lg, idx) => {
                          const isActive = lg.key === activeLeague.key;
                          const isPast = idx < leagueIndex;
                          return (
                            <div
                              key={lg.key}
                              className={`flex-1 h-1.5 rounded-full transition-all ${
                                isActive
                                  ? "bg-cyan-400"
                                  : isPast
                                  ? "bg-emerald-400/70"
                                  : "bg-slate-700/80"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Bronze</span>
                        <span>Legend</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLeaguePrev}
                    className="rounded-full border border-slate-700/80 px-3 py-1.5 text-[11px] hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                  >
                    Previous league
                  </button>
                  <button
                    onClick={handleLeagueNext}
                    className="rounded-full border border-slate-700/80 px-3 py-1.5 text-[11px] hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                  >
                    Next league
                  </button>
                </div>

                <div className="flex items-center gap-1.5 justify-end">
                  {leagues.map((lg, idx) => (
                    <button
                      key={lg.key}
                      onClick={() => handleLeagueDotClick(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        leagueIndex === idx
                          ? "w-6 bg-cyan-400"
                          : "w-2 bg-slate-600/80 hover:bg-slate-300"
                      }`}
                      type="button"
                      aria-label={`Go to ${lg.name}`}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                This is a visual preview. Actual league depends on your points from
                challenges, events and verified contributions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ===== PREMIUM SECTION DIVIDER ===== */}
        <motion.div
          className="relative py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="px-4">
              <motion.div
                className="h-2 w-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-500"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
        </motion.div>

        {/* ===== VISION SECTION (original) ===== */}
        <motion.section
          id="vision-section"
          className="space-y-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] items-start">
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-2xl">✨</span>
                <h2 className="text-xl md:text-2xl font-semibold">
                  The vision behind{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                    GenXCode
                  </span>
                </h2>
              </motion.div>
              <p className="text-sm md:text-base text-slate-400 max-w-xl">
                GenXCode exists so that no motivated student gets limited by the
                syllabus. We want your college to feel like a mini tech hub – with
                teams, projects, events and mentorship running all year.
              </p>

              <motion.ul 
                className="mt-3 space-y-2.5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {visions.map((line, idx) => (
                  <motion.li
                    key={line}
                    className="flex items-start gap-2 text-sm md:text-base text-slate-200"
                    variants={itemVariants}
                    whileHover={{ x: 4, scale: 1.02 }}
                  >
                    <motion.span 
                      className="mt-[3px] h-4 w-4 rounded-full bg-cyan-500/20 border border-cyan-400/70 flex items-center justify-center text-[9px]"
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: idx * 0.2
                      }}
                    >
                      ✦
                    </motion.span>
                    <span>{line}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              className="relative overflow-hidden card bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-slate-800/80 px-5 py-5 rounded-2xl shadow-xl shadow-slate-950/60 backdrop-blur-xl"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <motion.span
                    className="text-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💫
                  </motion.span>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
                    How it feels inside
                  </p>
                </div>
                <ul className="space-y-2.5 text-[11px] md:text-xs text-slate-300">
                  {[
                    "Weekly or bi‑weekly sessions instead of random events.",
                    "Dedicated tracks for beginners, intermediate and advanced.",
                    "Spaces to experiment, fail fast and learn with others.",
                    "Clear growth: challenges → points → leagues → recognition.",
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.p 
                  className="mt-4 text-[11px] md:text-xs bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  You bring the consistency. We bring the structure, projects and
                  community.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== FOUNDER & CO‑FOUNDER VISION ===== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Founders&apos; vision for{" "}
                <span className="text-cyan-300">GenXCode</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
                The leadership mindset that guides how the community runs every
                single week.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Founder */}
            <motion.article
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-500 opacity-80" />
              <p className="text-[11px] text-cyan-300 mb-1 uppercase tracking-[0.2em]">
                Founder&apos;s Vision
              </p>
              <h3 className="text-sm md:text-base font-semibold mb-1">
                {founder.name}
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">{founder.role}</p>
              <p className="text-sm md:text-base text-slate-200 mb-3">
                “{founder.quote}”
              </p>
              <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300">
                {founder.focusPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            {/* Co‑Founder */}
            <motion.article
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-indigo-500 opacity-80" />
              <p className="text-[11px] text-fuchsia-300 mb-1 uppercase tracking-[0.2em]">
                Co‑Founder&apos;s Vision
              </p>
              <h3 className="text-sm md:text-base font-semibold mb-1">
                {coFounder.name}
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                {coFounder.role}
              </p>
              <p className="text-sm md:text-base text-slate-200">
                “{coFounder.quote}”
              </p>
              <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300">
                {coFounder.focusPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-fuchsia-400/80" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
            {/* Mentor */}
<motion.article
  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ duration: 0.25 }}
>
  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-80" />
  <p className="text-[11px] text-emerald-300 mb-1 uppercase tracking-[0.2em]">
    Mentor
  </p>
  <h3 className="text-sm md:text-base font-semibold mb-1">
    {mentor.name}
  </h3>
  <p className="text-[11px] text-slate-400 mb-3">{mentor.role}</p>
  <p className="text-sm md:text-base text-slate-200">
    “{mentor.quote}”
  </p>
  <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300">
    {mentor.focusPoints.map((point) => (
      <li key={point} className="flex gap-2">
        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
        <span>{point}</span>
      </li>
    ))}
  </ul>
</motion.article>
          </div>
        </motion.section>

        {/* ===== PRESIDENT & CORE TEAM WRAPPER (for scroll target) ===== */}
        <div id="team-section" className="space-y-14">
          {/* ===== PRESIDENT TEAM ===== */}
          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  Meet our <span className="text-cyan-300">President Team</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
                  Four presidents jointly shaping strategy, execution and member
                  experience across the whole community.
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                4 Presidents · Operations · Tech · Community · Growth
              </p>
            </div>

            <motion.div 
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {presidentTeam.map((p) => (
                <motion.div
                  key={p.name}
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 shadow-lg shadow-slate-950/40"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.03,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(34, 211, 238, 0.2)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-500 opacity-80"
                    whileHover={{ 
                      height: "2px",
                      opacity: 1
                    }}
                  />
                  <motion.p 
                    className="text-[11px] text-cyan-300 mb-1"
                    whileHover={{ x: 2 }}
                  >
                    {p.role}
                  </motion.p>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="text-[11px] text-slate-400 mb-1.5">{p.role}</p>
                  <p className="text-[11px] text-slate-300 mb-1.5">{p.focus}</p>
                  <p className="text-[10px] text-slate-500">{p.yearBranch}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>

        {/* ===== BIG MEMBER BENEFITS SLIDER (ONE BY ONE) ===== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Member benefits,{" "}
                <span className="text-cyan-300">one by one</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
                Slide through everything you unlock as a GenXCode member – with a
                focus on real growth, not just certificates.
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              {benefits.length}+ structured benefits · Smooth auto‑slide · Manual
              controls
            </p>
          </div>

          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          >
            {/* Glow frame */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/35 via-slate-900 to-purple-500/35 opacity-70 blur-2xl"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800 px-5 py-6 md:px-8 md:py-7 shadow-2xl shadow-slate-950/70 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  variants={benefitSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45 }}
                  className="space-y-3 md:space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/80">
                      <span className="text-[11px] font-mono text-slate-500">
                        #{active.id.toString().padStart(2, "0")}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span className="text-[11px] text-slate-200">
                        {active.chip}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Benefit {active.id} / {benefits.length}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-2xl font-semibold">
                    {active.title}
                  </h3>
                  <p className="text-xs md:text-sm text-cyan-200/90">
                    {active.highlight}
                  </p>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {active.desc}
                  </p>

                  <div className="grid gap-3 md:grid-cols-2 text-[11px] md:text-xs text-slate-400">
                    <p>
                      • Designed to make your{" "}
                      <span className="text-cyan-300">portfolio stronger</span>, not
                      just your attendance sheet.
                    </p>
                    <p>
                      • Tied into{" "}
                      <span className="text-emerald-300">points, leagues</span> and
                      visibility on the leaderboard and dashboard.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs hover:border-cyan-400 hover:bg-slate-900/90 transition"
                    type="button"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {benefits.map((b, idx) => (
                    <button
                      key={b.id}
                      onClick={() => handleDotClick(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeIndex === idx
                          ? "w-6 bg-cyan-400"
                          : "w-2 bg-slate-600/80 hover:bg-slate-300"
                      }`}
                      type="button"
                      aria-label={`Go to benefit ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== PILLARS / HOW IT WORKS ===== */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              How GenXCode works for you
            </h2>
            <p className="text-[11px] md:text-xs text-slate-500">
              Build · Learn · Get noticed
            </p>
          </div>

          <motion.div 
            className="grid gap-4 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {pillars.map((p) => (
              <motion.div
                key={p.title}
                className="card bg-slate-950/80 border border-slate-800 px-5 py-5 rounded-2xl transition-all relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  borderColor: "rgba(34, 211, 238, 0.6)",
                  boxShadow: "0 20px 40px rgba(34, 211, 238, 0.25)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 hover:opacity-10 transition-opacity duration-500"
                />
                <div className="relative z-10">
                  <motion.p 
                    className="text-[11px] text-cyan-300 mb-1"
                    whileHover={{ x: 4 }}
                  >
                    {p.tag}
                  </motion.p>
                  <h3 className="text-sm font-semibold mb-1.5">{p.title}</h3>
                  <p className="text-[11px] md:text-xs text-slate-300">
                    {p.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ===== BRAND SHINY BLOCK ===== */}
        <motion.section
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-slate-950/90 px-5 py-4 md:px-7 md:py-5 shadow-[0_0_40px_rgba(34,211,238,0.35)]"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* glow background */}
            <motion.div
              className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-emerald-400/20 blur-2xl opacity-70"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* subtle shine sweep */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
              initial={{ x: "-120%", rotate: -15 }}
              animate={{ x: ["-120%", "140%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
                mixBlendMode: "screen",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Crafted with care
                </p>
                <h2 className="text-lg md:text-xl font-semibold">
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                    GenXCode
                  </span>{" "}
                  <span className="text-slate-200">· A product by</span>{" "}
                  <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    Cosmolix Pvt Ltd
                  </span>
                </h2>
                <p className="text-[11px] md:text-xs text-slate-400 max-w-xl">
                  Built like a real SaaS platform for student communities – with
                  dashboards, leagues, challenges and admin tools designed by
                  the Cosmolix product team.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] md:text-xs text-slate-300">
                <div className="flex flex-col items-start">
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Powered by Cosmolix</span>
                  </span>
                  <span className="mt-1 text-slate-500">
                    Enterprise-level thinking, tuned for campus scale.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ===== PREMIUM FOOTER ===== */}
        <motion.footer 
  className="mt-16 pt-8 border-t border-slate-800/60"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="space-y-1">
      <p className="text-[11px] text-slate-400">
        © {currentYear} GenXCode. All rights reserved.
      </p>
      <p className="text-[10px] text-slate-500">
        Engineered by <span className="text-red-400">Cosmolix Pvt. Ltd.</span> for <span className="text-blue-400">GenXCode</span> students community.
      </p>
    </div>

    <div className="flex items-center gap-4 text-[10px]">
      
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to="/privacy"
          className="text-slate-500 hover:text-cyan-300 transition"
        >
          Privacy
        </Link>
      </motion.div>

      <span className="h-1 w-1 rounded-full bg-slate-600" />

      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to="/terms"
          className="text-slate-500 hover:text-cyan-300 transition"
        >
          Terms
        </Link>
      </motion.div>

      <span className="h-1 w-1 rounded-full bg-slate-600" />

      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to="/contact"
          className="text-slate-500 hover:text-cyan-300 transition"
        >
          Contact
        </Link>
      </motion.div>

    </div>
  </div>
</motion.footer>
      </div>
    </main>
  );
}

