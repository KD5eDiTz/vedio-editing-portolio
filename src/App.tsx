import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'motion/react';
import Lenis from '@studio-freight/lenis';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mail,
  Instagram,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowLeft,
  Keyboard,
} from 'lucide-react';

/* =========================================================
   PROFILE
========================================================= */
const PROFILE = {
  studio: 'Studio — KD',
  role: 'Video Editor',
  heroLines: ['Hello,', "I'm KD."],
  bio:
    "I'm KD, a video editor working mostly in short-form: pacing, sound design, and color that make people stop scrolling. I spend most of my time studying retention — why a cut works, why a hook doesn't, and how a fraction of a second changes both.",
  email: 'kdeditzauthentic@gmail.com',
  instagram: 'https://instagram.com',
};

/* =========================================================
   WORK 
========================================================= */
interface VideoProject {
  id: string;
  title: string;
  category: string;
  year: string;
  views: string;
  duration: string;
  aspectRatio: string;
  fps: number;
  description: string;
  videoUrl: string;
  techniques: string[];
}

const WORKS: VideoProject[] = [
  {
    id: 'retention-hook-promo',
    title: 'High-Retention Hook',
    category: 'Short Form',
    year: '2026',
    views: '1.2M',
    duration: '00:13',
    aspectRatio: '9:16',
    fps: 60,
    description:
      'Dynamic product promo engineered with kinetic subtitles, zero dead air, and hyper-pacing. Every cut is timed against the voiceover so there is no moment for the viewer to disengage.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_1_ilryuy.mp4',
    techniques: ['Kinetic Typography', 'Pattern Interrupts', 'Speed Ramping'],
  },
  {
    id: 'creator-efficiency-breakdown',
    title: 'Software Workflow Breakdown',
    category: 'Short Form',
    year: '2026',
    views: '840K',
    duration: '00:19',
    aspectRatio: '9:16',
    fps: 60,
    description:
      'Fast-paced timeline breakdown utilizing custom graphic callouts and hard sound-hit syncing, built to hold attention through what would normally be a dry explainer.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997098/FILE_2_mc78dn.mp4',
    techniques: ['Graphic Callouts', 'SFX Syncing', 'Defocus Transitions'],
  },
  {
    id: 'lifestyle-brand-story',
    title: 'Aesthetic Brand Storytelling',
    category: 'Short Form',
    year: '2026',
    views: '2.1M',
    duration: '00:16',
    aspectRatio: '9:16',
    fps: 23.976,
    description:
      'Cinematic brand integration balancing premium color pacing with modern digital grit overlays — built to feel aspirational without losing the feed-native texture that keeps people watching.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997100/FILE_3_nhlwkf.mp4',
    techniques: ['Glitch Textures', 'Atmospheric Pacing', 'Color Matching'],
  },
  {
    id: 'micro-hook-retrospective',
    title: 'Viral Retention Architecture',
    category: 'Short Form',
    year: '2026',
    views: '3.4M',
    duration: '00:09',
    aspectRatio: '9:16',
    fps: 60,
    description:
      'A micro-retention structure built on immediate visual hooks and loop engineering, designed so the end of the video feeds directly back into the beginning.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_4_rfbxd1.mp4',
    techniques: ['Loop Engineering', 'Visual Hook Pacing', 'Micro-Zooming'],
  },
  {
    id: 'motion-design-showcase',
    title: 'Visual Effects & Motion Layout',
    category: 'Motion Design',
    year: '2026',
    views: '450K',
    duration: '00:05',
    aspectRatio: '16:9',
    fps: 24,
    description:
      'A high-velocity visual edit driven entirely by custom motion design graphics and keyframed layout composition rather than filmed footage.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997072/FILE_5_li2r3u.mov',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding'],
  },
  {
    id: 'premium-commercial-edit',
    title: 'Dynamic Narrative Flow',
    category: 'Short Form',
    year: '2026',
    views: '920K',
    duration: '00:12',
    aspectRatio: '9:16',
    fps: 60,
    description:
      'A high-impact short-form edit leveraging synchronized velocity curves, complex mask layering, and custom impact sound design to carry the narrative without dialogue.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    techniques: ['Velocity Curves', 'Mask Layering', 'Impact SFX'],
  },
];

/* =========================================================
   Routing
========================================================= */
type Route = { page: 'home' } | { page: 'project'; id: string };

function routeFromHash(): Route {
  const raw = window.location.hash.replace('#/', '');
  if (raw.startsWith('work/')) {
    const id = raw.slice(5);
    if (WORKS.some((w) => w.id === id)) return { page: 'project', id };
  }
  return { page: 'home' };
}

/* =========================================================
   Shared motion variants
========================================================= */
const wordVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const listContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const listItem = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* =========================================================
   Small shared bits
========================================================= */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono uppercase tracking-[0.2em] text-[11px]" style={{ color: 'var(--text-muted)' }}>
      {children}
    </span>
  );
}

function formatTimecode(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useMagnetic(strength = 16) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 12, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
}

/* Custom cursor */
function CustomCursor() {
  const RING = 30;
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.5 });
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - RING / 2);
      y.set(e.clientY - RING / 2);
      if (!isVisible) setIsVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHover(!!target.closest('[data-hover]'));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [isVisible]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[999] hidden md:block rounded-full mix-blend-difference bg-white"
      style={{ x: springX, y: springY, width: RING, height: RING }}
      animate={{ scale: isHover ? 1.7 : 1, opacity: isVisible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{ scaleX: scrollYProgress, background: 'var(--text-primary)' }}
    />
  );
}

/* =========================================================
   Header 
========================================================= */
function ShortcutsHint() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden lg:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        data-hover
        className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-52 rounded-md border p-3 font-mono text-[11px] space-y-1.5 z-50"
            style={{ background: 'var(--surface)', borderColor: 'var(--hairline)', color: 'var(--text-secondary)' }}
          >
            <div className="flex justify-between"><span>Scroll to top</span><span style={{ color: 'var(--text-primary)' }}>T</span></div>
            <div className="flex justify-between"><span>Scroll to bottom</span><span style={{ color: 'var(--text-primary)' }}>B</span></div>
            <div className="flex justify-between"><span>Toggle sound</span><span style={{ color: 'var(--text-primary)' }}>S</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({
  isDark,
  onToggleTheme,
  onNavigateHome,
  onScrollTo,
  isAudioPlaying,
  onToggleAudio,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onScrollTo: (id: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? '';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{ borderColor: 'var(--hairline)', background: 'color-mix(in srgb, var(--canvas) 80%, transparent)' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <button
          data-hover
          onClick={onNavigateHome}
          className="font-mono text-xs tracking-[0.15em] uppercase font-medium cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          {PROFILE.studio}
        </button>

        <div className="hidden sm:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.15em]">
          <button data-hover onClick={() => onScrollTo('work')} className="cursor-pointer hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Work
          </button>
          <button data-hover onClick={() => onScrollTo('about')} className="cursor-pointer hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            About
          </button>
          <button data-hover onClick={() => onScrollTo('contact')} className="cursor-pointer hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden md:inline font-mono text-xs tabular tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>
            {time} {zone}
          </span>
          <ShortcutsHint />
          <button
            data-hover
            onClick={onToggleAudio}
            aria-label="Toggle background audio"
            className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            data-hover
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* =========================================================
   Hero — 2D Paper Animation & Scroll Linked Physics
========================================================= */
function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  
  // Tie these exact properties to the scroll position[cite: 3]
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const helloScale = useTransform(scrollYProgress, [0, 1], [1, 0.42]);
  const helloY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const helloRotate = useTransform(scrollYProgress, [0, 1], [0, -16]);
  const helloOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  return (
    <section
      ref={heroRef}
      className="relative max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24 md:pb-32 min-h-[92vh] flex flex-col justify-center overflow-hidden"
    >
      {/* 2D PAPER ANIMATION SVG - Traces in on load, shrinks/rotates on scroll */}
      <motion.div
        style={{ scale: helloScale, y: helloY, rotate: helloRotate, opacity: helloOpacity }}
        className="pointer-events-none select-none absolute right-[0%] top-[5%] w-[70vw] max-w-[800px] z-0"
      >
        <svg viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
           <motion.path 
              d="M 50 100 C 50 60 70 40 90 40 C 110 40 100 80 100 120 C 100 140 115 140 125 120 C 140 80 145 40 145 40 M 145 40 C 145 80 140 120 160 120 C 180 120 185 80 185 80 C 185 60 165 60 160 80 C 155 100 165 120 185 120 C 205 120 215 80 215 40 C 215 20 215 20 215 20 M 215 20 C 215 60 210 120 230 120 C 250 120 255 80 255 40 C 255 20 255 20 255 20 M 255 20 C 255 60 250 120 270 120 C 290 120 305 80 305 60 C 305 40 285 40 275 60 C 265 80 275 120 300 120 C 320 120 340 80 340 80"
              stroke="var(--text-primary)" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
           />
        </svg>
      </motion.div>

      <div className="relative z-10">
        <Eyebrow>{PROFILE.role}</Eyebrow>

        <h1
          className="mt-6 font-semibold uppercase leading-[0.9] tracking-tight mix-blend-difference"
          style={{ color: 'var(--text-primary)', fontSize: 'clamp(3.2rem, 11vw, 8.5rem)' }}
        >
          {PROFILE.heroLines.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: li * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 max-w-xl text-[15px] md:text-base leading-relaxed mix-blend-difference"
          style={{ color: 'var(--text-secondary)' }}
        >
          {PROFILE.bio}
        </motion.p>
      </div>
    </section>
  );
}

/* =========================================================
   Selected Works — Flush track[cite: 3]
========================================================= */
function WorkTrack({ onOpen }: { onOpen: (id: string) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.4;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section id="work" className="relative py-24 md:py-32 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-baseline justify-between mb-10">
        <h2 className="font-semibold uppercase tracking-tight" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          Selected Works
        </h2>
        <span className="font-mono text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
          Scroll horizontally →
        </span>
      </div>

      <div ref={trackRef} className="track-scroll flex gap-5 overflow-x-auto px-6 md:px-10 pb-4 snap-x snap-mandatory">
        {WORKS.map((w) => (
          <motion.button
            key={w.id}
            data-hover
            onClick={() => onOpen(w.id)}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative shrink-0 snap-start overflow-hidden rounded-md text-left cursor-pointer"
            style={{ width: '20rem', height: '22rem', background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}
          >
            <motion.div layoutId={`media-${w.id}`} className="absolute inset-0">
              <video
                src={w.videoUrl}
                muted
                loop
                playsInline
                autoPlay
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.currentTime >= 4) v.currentTime = 0;
                }}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                {w.category} · {w.year}
              </span>
              <h3 className="mt-1 text-lg font-medium text-white tracking-tight">{w.title}</h3>
            </div>
            <span className="absolute top-4 right-4 font-mono text-[10px] text-white/70 tabular">{w.duration}</span>
            <ArrowUpRight className="absolute top-4 left-4 w-4 h-4 text-white/0 group-hover:text-white/80 transition-colors" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Profile / About — Portrait Image + Glowing Signature Overlay
========================================================= */
function SignatureAbout() {
  return (
    <section id="about" className="relative max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-center">
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="lg:col-span-3 order-2 lg:order-1"
        >
          <Eyebrow>Profile</Eyebrow>
          <p className="mt-6 font-medium tracking-tight leading-snug" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)' }}>
            {PROFILE.bio}
          </p>
        </motion.div>

        {/* Cinematic Portrait Container */}
        <div className="lg:col-span-2 relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--surface-2)' }}>
             {/* Replace this src with your actual professional photo */}
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
               alt="KD Profile" 
               className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
             />
          </div>

          {/* Overlapping Signature tracing animation */}
          <div className="absolute -bottom-8 -right-4 lg:-right-10 w-[240px] md:w-[320px] z-10 pointer-events-none drop-shadow-2xl">
            <svg viewBox="0 0 420 140" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="sigGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M10,95 C22,42 44,18 62,58 C76,90 54,112 38,90 C27,74 44,52 72,47 C104,41 126,68 114,96 C104,118 134,102 145,70 C154,42 176,32 190,58 C199,76 182,93 167,87 C156,83 162,64 179,59 C206,51 238,60 243,86 C247,103 260,92 265,71 C271,49 291,40 312,54 C328,64 322,82 305,81 C294,80 294,64 311,59 C338,50 370,57 380,80 C387,97 405,88 412,64"
                stroke="#34d399" /* Emerald neon glow color */
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#sigGlow)"
                initial={{ pathLength: 0, opacity: 0.3 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   Project Player & View[cite: 3]
========================================================= */
function ProjectPlayer({ work }: { work: VideoProject }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (isPlaying) v.play().catch(() => setIsPlaying(false));
    else v.pause();
  }, [isPlaying, isMuted]);

  const isWidescreen = work.aspectRatio === '16:9';

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }}>
      <motion.div
        layoutId={`media-${work.id}`}
        className={`relative flex items-center justify-center bg-black mx-auto ${isWidescreen ? 'aspect-video w-full' : 'aspect-[9/16] max-w-[380px] w-full'}`}
      >
        <video
          ref={videoRef}
          src={work.videoUrl}
          className="w-full h-full object-contain"
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onClick={() => setIsPlaying((p) => !p)}
        />
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              data-hover
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsPlaying(true)}
              className="absolute p-4 rounded-full bg-white text-black cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="px-4 py-3 flex items-center gap-4" style={{ borderTop: '1px solid var(--hairline)' }}>
        <button data-hover onClick={() => setIsPlaying((p) => !p)} className="cursor-pointer" style={{ color: 'var(--text-primary)' }}>
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button data-hover onClick={() => setIsMuted((m) => !m)} className="cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--hairline)' }}>
          <div className="h-full" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%', background: 'var(--text-primary)' }} />
        </div>

        <span className="font-mono text-xs tabular" style={{ color: 'var(--text-muted)' }}>
          {formatTimecode(currentTime)} / {duration ? formatTimecode(duration) : work.duration}
        </span>
      </div>
    </div>
  );
}

function ProjectView({ work, onBack, onOpen }: { work: VideoProject; onBack: () => void; onOpen: (id: string) => void }) {
  const idx = WORKS.findIndex((w) => w.id === work.id);
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [work.id]);

  return (
    <motion.section
      key={work.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16"
    >
      <button
        data-hover
        onClick={onBack}
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] mb-10 cursor-pointer hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All Work
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        <div className="lg:col-span-3">
          <ProjectPlayer work={work} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-2">
          <Eyebrow>{work.category} · {work.year}</Eyebrow>
          <h1 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {work.title}
          </h1>
          <p className="mt-5 text-sm md:text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {work.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {work.techniques.map((t) => (
              <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {t}
              </span>
            ))}
          </div>

          <dl className="mt-10 pt-6 grid grid-cols-2 gap-y-4 gap-x-4 font-mono text-xs" style={{ borderTop: '1px solid var(--hairline)' }}>
            {[
              ['Duration', work.duration],
              ['Aspect Ratio', work.aspectRatio],
              ['Frame Rate', `${work.fps} fps`],
              ['Views', work.views],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ color: 'var(--text-muted)' }}>{k}</dt>
                <dd className="mt-1" style={{ color: 'var(--text-primary)' }}>{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      <div className="mt-16 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--hairline)' }}>
        <button data-hover onClick={() => onOpen(prev.id)} className="text-left cursor-pointer group">
          <Eyebrow>Previous</Eyebrow>
          <div className="text-sm mt-1 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            {prev.title}
          </div>
        </button>
        <button data-hover onClick={() => onOpen(next.id)} className="text-right cursor-pointer group">
          <Eyebrow>Next</Eyebrow>
          <div className="text-sm mt-1 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            {next.title}
          </div>
        </button>
      </div>
    </motion.section>
  );
}

/* =========================================================
   Collaboration steps
========================================================= */
function Collaborate() {
  const steps = [
    { n: '01', title: 'Brief', desc: 'Send over your raw footage, references, and what the edit needs to do.' },
    { n: '02', title: 'Edit', desc: "I cut for pacing first — hooks, sound design, and color come once the structure holds." },
    { n: '03', title: 'Deliver', desc: "You get a review draft, then export-ready files for wherever it's going." },
  ];

  return (
    <motion.section
      variants={listContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24 border-t"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <motion.div variants={listItem}>
        <Eyebrow>How we'd work together</Eyebrow>
      </motion.div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {steps.map((s) => (
          <motion.div key={s.n} variants={listItem}>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{s.n}</span>
            <h3 className="mt-2 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* =========================================================
   Contact outro
========================================================= */
function MagneticLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnetic(14);
  return (
    <motion.a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-hover
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, color: 'var(--text-primary)', borderColor: 'var(--border-strong)' }}
      className="inline-flex items-center gap-2 text-sm border-b pb-0.5"
    >
      {children}
    </motion.a>
  );
}

function ContactOutro() {
  const phrase = "Let's make something worth watching.";
  const words = phrase.split(' ');

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.05 }}
        className="font-semibold tracking-tight max-w-3xl leading-[1.05]"
        style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.2rem, 6vw, 4.4rem)' }}
      >
        {words.map((w, i) => (
          <motion.span key={i} className="kinetic-word mr-3" variants={wordVariant}>
            {w}
          </motion.span>
        ))}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
      >
        <MagneticLink href={`mailto:${PROFILE.email}`}>
          <Mail className="w-4 h-4" /> {PROFILE.email}
        </MagneticLink>
        <MagneticLink href={PROFILE.instagram} external>
          <Instagram className="w-4 h-4" /> Instagram
        </MagneticLink>
      </motion.div>
    </section>
  );
}

/* =========================================================
   Footer
========================================================= */
function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{PROFILE.studio}</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/* =========================================================
   App — Lenis smooth scroll, keyboard shortcuts, ambient audio
========================================================= */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [route, setRoute] = useState<Route>(() => routeFromHash());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 't') {
        e.preventDefault();
        lenisRef.current?.scrollTo(0, { duration: 1.2 });
      } else if (key === 'b') {
        e.preventDefault();
        lenisRef.current?.scrollTo(document.documentElement.scrollHeight, { duration: 1.4 });
      } else if (key === 's') {
        e.preventDefault();
        toggleAudio();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAudioPlaying]);

  const navigateHome = () => {
    window.location.hash = '#/';
  };
  const openProject = (id: string) => {
    window.location.hash = `#/work/${id}`;
  };
  const scrollTo = (id: string) => {
    const go = () => {
      const el = document.getElementById(id);
      if (el) lenisRef.current?.scrollTo(el, { offset: -80, duration: 1.1 });
    };
    if (route.page !== 'home') {
      window.location.hash = '#/';
      requestAnimationFrame(() => setTimeout(go, 80));
    } else {
      go();
    }
  };

  const activeWork = route.page === 'project' ? WORKS.find((w) => w.id === route.id) : undefined;

  return (
    <div className={isDark ? '' : 'light'}>
      <div className="min-h-screen antialiased relative" style={{ background: 'var(--canvas)', color: 'var(--text-primary)' }}>
        <div className="grid-overlay" />
        <audio ref={audioRef} src="/audio/ambient-loop.mp3" loop preload="none" />

        <CustomCursor />
        <ScrollProgress />

        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onNavigateHome={navigateHome}
          onScrollTo={scrollTo}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />

        <AnimatePresence mode="wait">
          {route.page === 'project' && activeWork ? (
            <ProjectView key="project" work={activeWork} onBack={navigateHome} onOpen={openProject} />
          ) : (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
              <Hero />
              <WorkTrack onOpen={openProject} />
              <SignatureAbout />
              <Collaborate />
              <ContactOutro />
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}