import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
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
  Keyboard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';

/* =========================================================
   PROFILE DATA
========================================================= */
const PROFILE = {
  studio: 'Vedio D Editor',
  role: 'Video Editor & Motion Designer',
  bio: "I'm Vedio D Editor, a video editor working mostly in short-form: pacing, sound design, and color that make people stop scrolling. I spend most of my time studying retention — why a cut works, why a hook doesn't, and how a fraction of a second changes both.",
  email: 'kdeditzauthentic@gmail.com',
  instagram: 'https://instagram.com',
};

/* =========================================================
   WORK DATA
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
    description: 'Dynamic product promo engineered with kinetic subtitles, zero dead air, and hyper-pacing. Every cut is timed against the voiceover so there is no moment for the viewer to disengage.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_1_ilryuy.mp4',
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
    description: 'Fast-paced timeline breakdown utilizing custom graphic callouts and hard sound-hit syncing, built to hold attention through what would normally be a dry explainer.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997098/FILE_2_mc78dn.mp4',
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
    description: 'Cinematic brand integration balancing premium color pacing with modern digital grit overlays — built to feel aspirational without losing the feed-native texture that keeps people watching.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997100/FILE_3_nhlwkf.mp4',
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
    description: 'A micro-retention structure built on immediate visual hooks and loop engineering, designed so the end of the video feeds directly back into the beginning.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_4_rfbxd1.mp4',
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
    description: 'A high-velocity visual edit driven entirely by custom motion design graphics and keyframed layout composition rather than filmed footage.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding'],
  },
];

/* =========================================================
   BOUNCY SPRING MOTION VARIANTS
========================================================= */
const wordVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 20, stiffness: 80 } 
  },
};

const listContainer = { 
  hidden: {}, 
  visible: { 
    transition: { staggerChildren: 0.05, delayChildren: 0.05 } 
  } 
};

const listItem = {
  hidden: { opacity: 0, y: 20, scale: 1 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: 'spring', damping: 20, stiffness: 80 } 
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 1 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: 'spring', damping: 20, stiffness: 80 } 
  },
};

/* =========================================================
   UTILITY COMPONENTS
========================================================= */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-600/10 border border-orange-600/30 font-mono uppercase tracking-[0.25em] text-[11px] font-bold text-orange-500 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
      <span>{children}</span>
    </div>
  );
}



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
      className="pointer-events-none fixed top-0 left-0 z-[999] hidden md:block rounded-full mix-blend-difference"
      style={{ 
        x: springX, 
        y: springY, 
        width: RING, 
        height: RING,
      }}
      animate={{ 
        scale: isHover ? 1.2 : 0.3, // 0.3 makes it a small 9px dot normally
        backgroundColor: isHover ? 'transparent' : 'white',
        border: isHover ? '1.5px solid white' : '0px solid transparent',
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-orange-500 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

/* =========================================================
   RETRO GLITCH SHAPES
========================================================= */
function RetroGlitchShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
      <div className="absolute top-[18%] left-[8%] text-orange-500 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#f97316]">▲</div>
      <div className="absolute top-[35%] right-[10%] text-rose-500 font-mono text-4xl font-bold glitch-symbol drop-shadow-[0_0_10px_#f43f5e]">○</div>
      <div className="absolute bottom-[28%] left-[12%] text-cyan-400 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#38bdf8]">✕</div>
      <div className="absolute bottom-[18%] right-[15%] text-red-500 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#ef4444]">□</div>
    </div>
  );
}

/* =========================================================
   HEADER & SHORTCUTS
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
            className="absolute right-0 mt-2 w-52 rounded-xl border p-3 font-mono text-[11px] space-y-1.5 z-50 shadow-2xl backdrop-blur-xl"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
          >
            <div className="flex justify-between">
              <span>Scroll to top</span>
              <span className="text-orange-500 font-bold">T</span>
            </div>
            <div className="flex justify-between">
              <span>Scroll to bottom</span>
              <span className="text-orange-500 font-bold">B</span>
            </div>
            <div className="flex justify-between">
              <span>Toggle sound</span>
              <span className="text-orange-500 font-bold">S</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({
  isDark,
  onToggleTheme,
  onScrollTo,
  isAudioPlaying,
  onToggleAudio,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
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
  const zone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? '';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{ borderColor: 'var(--hairline)', background: 'color-mix(in srgb, var(--canvas) 70%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Studio Logo */}
        <button 
          data-hover 
          onClick={() => onScrollTo('hero')} 
          className="font-mono text-xs tracking-[0.15em] uppercase font-extrabold cursor-pointer flex items-center gap-2" 
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 shadow-[0_0_8px_#f97316]" />
          {PROFILE.studio}
        </button>

        {/* Navigation */}
        <div className="hidden sm:flex items-center gap-10 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
          <button data-hover onClick={() => onScrollTo('viewer')} className="cursor-pointer hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>Work</button>
          <button data-hover onClick={() => onScrollTo('about')} className="cursor-pointer hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>About</button>
          <button data-hover onClick={() => onScrollTo('contact')} className="cursor-pointer hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>Contact</button>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline font-mono text-[10px] tabular tracking-widest mr-2 text-orange-500/80 font-bold">
            {time} {zone}
          </span>
          <ShortcutsHint />
          
          <button 
            data-hover 
            onClick={onToggleAudio} 
            aria-label="Toggle background audio" 
            className={`p-2 rounded-full transition-all cursor-pointer ${isAudioPlaying ? 'text-orange-500 bg-orange-600/20 border border-orange-600/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'hover:opacity-70'}`} 
            style={{ color: isAudioPlaying ? undefined : 'var(--text-secondary)' }}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button 
            data-hover 
            onClick={onToggleTheme} 
            aria-label="Toggle theme" 
            className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-70" 
            style={{ color: 'var(--text-secondary)' }}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* =========================================================
   SVG HERO TEXT — spaghetti stroke-draw animation
   Three layers: depth shadow → neon stroke draw → gradient fill
========================================================= */
const STROKE_DASH = 9000; // generous upper bound for Pacifico outline perimeter

function HeroSVGText({ word, wordIndex }: { word: string; wordIndex: number }) {
  const dur = wordIndex === 0 ? 1.2 : 0.8;
  const delay = wordIndex === 0 ? 0.2 : 0;
  
  return (
    <motion.h1
      className="apple-glass-text text-center w-full select-none"
      style={{ 
        fontSize: word.length > 6 ? 'clamp(4rem, 15vw, 10rem)' : 'clamp(5rem, 20vw, 13rem)',
        lineHeight: 1.2,
      }}
      initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: dur, delay, ease: 'easeOut' }}
    >
      {word}
    </motion.h1>
  );
}

/* =========================================================
   HERO — Massive Apple Animation & Perfect Toggle Logic
========================================================= */
function Hero() {
  // We use wordIndex to perfectly alternate between 0 (Hello) and 1 (Yokoso)
  const [wordIndex, setWordIndex] = useState(0);
  const hasScrolledPast = useRef(false);
  
  const { scrollYProgress } = useScroll();
  
  // The logic now ONLY changes the word when you return to the absolute top
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest > 0.3) {
        // User has scrolled down significantly
        hasScrolledPast.current = true;
      } else if (latest < 0.05 && hasScrolledPast.current) {
        // User has returned to the top. Toggle the word and reset the lock.
        setWordIndex((prev) => (prev === 0 ? 1 : 0));
        hasScrolledPast.current = false;
      }
    });
  }, [scrollYProgress]);

  const isYokoso = wordIndex === 1;

  return (
    <section
      id="hero"
      className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-16 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-visible scroll-mt-20"
    >
      <div className="relative z-10 w-full flex flex-col items-center gap-5 md:gap-7">

        {/* Eyebrow — centered, fades in first */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>{PROFILE.role}</Eyebrow>
        </motion.div>

        {/* ── SPAGHETTI SVG DRAW ── */}
        <div className="relative w-full flex items-center justify-center overflow-visible py-0 -my-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={isYokoso ? 'yokoso' : 'welcome'}
              className="w-full"
              exit={{
                opacity: 0,
                scale: 0.95,
                filter: 'blur(14px)',
                transition: { duration: 0.35, ease: 'easeOut' },
              }}
            >
              <HeroSVGText
                word={isYokoso ? 'Yōkoso' : 'Welcome'}
                wordIndex={wordIndex}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtitle row — staggered in after Hello, set to z-20 so Yokoso goes backside */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 font-mono text-sm sm:text-lg md:text-2xl font-semibold tracking-wide flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color: 'var(--text-primary)' }}>
            {isYokoso ? 'Watashino' : 'to my'}
          </span>

          <span className="relative inline-block font-bold" style={{ color: 'var(--text-primary)' }}>
            Soul Society
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 1.25, ease: 'easeInOut' }}
              className="absolute left-0 top-1/2 w-full h-[3px] bg-rose-500 origin-left rounded-full shadow-[0_0_12px_rgba(244,63,94,0.9)]"
            />
          </span>

          <motion.span
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 110, delay: 1.45 }}
            className="font-mono text-xs sm:text-sm text-orange-500 font-bold tracking-wider uppercase bg-red-950/80 border border-orange-600/60 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center gap-1.5 ml-2"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 animate-spin" />
            <span className="text-[10px] sm:text-base">Editing Society</span>
          </motion.span>
        </motion.div>

        {/* Bio — last to enter */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          {PROFILE.bio}
        </motion.p>
      </div>
    </section>
  );
}

/* =========================================================
   KINETIC MARQUEE TICKER
========================================================= */
function KineticMarquee() {
  return (
    <div 
      className="w-full py-6 border-y overflow-hidden select-none my-8 backdrop-blur-md" 
      style={{ borderColor: 'var(--hairline)', background: 'rgba(52, 211, 153, 0.03)' }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
        className="flex whitespace-nowrap gap-12 font-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em] items-center"
        style={{ color: 'var(--text-primary)' }}
      >
        <span>THIS IS HOW YOU IMPROVE YOUR QUALITY OF EDIT</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
        <span className="text-cyan-400">THIS IS WHERE YOU CAN INCREASE YOUR IDEAS</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
        <span>RETENTION ARCHITECTURE // CINEMATIC PACING</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
        <span>THIS IS HOW YOU IMPROVE YOUR QUALITY OF EDIT</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
        <span className="text-cyan-400">THIS IS WHERE YOU CAN INCREASE YOUR IDEAS</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
        <span>RETENTION ARCHITECTURE // CINEMATIC PACING</span>
        <Star className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_#f97316] shrink-0" />
      </motion.div>
    </div>
  );
}

/* =========================================================
   INLINE MAIN VIEWER
========================================================= */
function InlineViewer({ activeProject }: { activeProject: VideoProject }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (isPlaying) v.play().catch(() => setIsPlaying(false));
    else v.pause();
  }, [isPlaying, isMuted, activeProject]);

  return (
    <section id="viewer" className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-12 scroll-mt-24">
      <motion.div 
        key={activeProject.id}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        {/* Left Side: Video Player */}
        <div 
          className="lg:col-span-8 border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative group backdrop-blur-xl" 
          style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-2)' }}
        >
          {/* Top Bar */}
          <div className="px-6 py-4 flex items-center justify-between font-mono text-xs tracking-widest border-b" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
              <span className="uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</span>
            </div>
            <span className="text-orange-500 font-bold">{activeProject.aspectRatio}</span>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video md:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden w-full">
            <video 
              ref={videoRef} 
              src={activeProject.videoUrl} 
              className="w-full h-full object-contain" 
              loop 
              playsInline 
              preload="metadata" 
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
                  className="absolute p-5 bg-white text-black rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer z-20 hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current text-black ml-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="px-6 py-4 flex items-center gap-4 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <button data-hover onClick={() => setIsPlaying((p) => !p)} className="cursor-pointer transition-colors hover:text-orange-500" style={{ color: 'var(--text-primary)' }}>
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button data-hover onClick={() => setIsMuted((m) => !m)} className="cursor-pointer transition-colors hover:text-orange-500" style={{ color: 'var(--text-secondary)' }}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Side: Details Card */}
        <div 
          className="lg:col-span-4 border p-8 rounded-2xl flex flex-col justify-between h-full min-h-[420px] backdrop-blur-xl" 
          style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-2)' }}
        >
          <div className="space-y-6">
            <div className="space-y-3 border-b pb-6" style={{ borderColor: 'var(--hairline)' }}>
              <span className="font-mono text-xs tracking-widest uppercase block font-bold text-orange-500">// ACTIVE INDEX</span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</h2>
              <span className="inline-block text-xs font-mono text-orange-500 bg-red-950/60 border border-orange-600/50 px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                {activeProject.category}
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
              {activeProject.description}
            </p>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <span className="font-mono text-xs tracking-widest uppercase block font-bold text-orange-500">// PIPELINE TECHNIQUES</span>
            <div className="flex flex-wrap gap-2">
              {activeProject.techniques.map((tech, i) => (
                <span key={i} className="tech-pill text-xs font-mono border px-3 py-1.5 rounded-lg font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   SELECTED WORKS — Horizontal Track
========================================================= */
function WorkTrack({ activeProject, onSelectProject }: { activeProject: VideoProject, onSelectProject: (p: VideoProject) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const rafRef = useRef<number>(0);

  /* Momentum-eased horizontal scroll via RAF */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      const diff = targetXRef.current - currentXRef.current;
      if (Math.abs(diff) < 0.4) {
        currentXRef.current = targetXRef.current;
        el.scrollLeft = currentXRef.current;
        return;
      }
      currentXRef.current += diff * 0.11;
      el.scrollLeft = currentXRef.current;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetXRef.current = Math.max(
        0,
        Math.min(el.scrollWidth - el.clientWidth, targetXRef.current + e.deltaY)
      );
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Arrow-button scroll also feeds the eased target */
  const scrollTrack = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -300 : 300;
    targetXRef.current = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, targetXRef.current + delta));
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const diff = targetXRef.current - currentXRef.current;
      if (Math.abs(diff) < 0.4) { currentXRef.current = targetXRef.current; el.scrollLeft = currentXRef.current; return; }
      currentXRef.current += diff * 0.11;
      el.scrollLeft = currentXRef.current;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <section className="relative py-12 md:py-16 border-t" style={{ borderColor: 'var(--hairline)' }}>
      
      {/* Header & Controls */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: false, amount: 0.1 }} 
        variants={fadeUp} 
        className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <Eyebrow>PORTFOLIO REEL</Eyebrow>
          <h2 className="font-heading font-normal uppercase tracking-wide text-3xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
            Selected Works
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => scrollTrack('left')} className="p-2.5 rounded-full border border-red-600/30 bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scrollTrack('right')} className="p-2.5 rounded-full border border-red-600/30 bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Horizontal Filmstrip — data-lenis-prevent stops page scroll while hovering */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div 
          ref={trackRef}
          data-lenis-prevent
          className="track-scroll track-mask flex gap-6 overflow-x-auto py-4 px-2"
        >
          {WORKS.map((w) => {
            const isActive = activeProject.id === w.id;
            return (
              <motion.button
                key={w.id}
                data-hover
                onClick={() => onSelectProject(w)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={listItem}
                whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl text-left cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ width: '220px', aspectRatio: '9/16', background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
              >
                <div className="absolute inset-0">
                  <video src={w.videoUrl} muted loop playsInline autoPlay onTimeUpdate={(e) => { const v = e.currentTarget; if (v.currentTime >= 4) v.currentTime = 0; }} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.05]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/70 font-bold block">{w.category}</span>
                  <h3 className="mt-1 text-sm font-bold text-white tracking-tight leading-snug truncate">{w.title}</h3>
                </div>
                <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-white font-bold tabular px-2 py-0.5 bg-black/70 rounded-md border border-white/20 backdrop-blur-md pointer-events-none">
                  {w.duration}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SIGNATURE & ABOUT
========================================================= */
function SignatureAbout() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="about" className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <div className="space-y-8">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
          <Eyebrow>PROFILE & CREATIVE DIRECTION</Eyebrow>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-center">
          
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="lg:col-span-3 order-2 lg:order-1">
            <p className="font-medium tracking-tight leading-relaxed text-xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>
              {PROFILE.bio}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="lg:col-span-2 relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div 
              onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border cursor-pointer group" 
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border-strong)' }}
            >
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="KD Profile" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            </div>

            {/* Glowing Vines/Branches Corner Overlay */}
            <div className="absolute -bottom-6 -right-6 w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] z-10 pointer-events-none drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]">
              <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="branchGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Main Stem */}
                <motion.path
                  d="M 280 120 C 270 190, 240 250, 170 270 C 120 280, 50 275, 10 270"
                  stroke={isHovered ? '#38bdf8' : '#f97316'} strokeWidth="3.5" strokeLinecap="round" filter="url(#branchGlow)"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 1.8, ease: 'easeOut' }}
                />
                {/* Branches */}
                <motion.path
                  d="M 255 170 C 235 150, 210 135, 190 140 C 175 145, 165 160, 160 175"
                  stroke={isHovered ? '#38bdf8' : '#f97316'} strokeWidth="2.5" strokeLinecap="round" filter="url(#branchGlow)"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 195 265 C 180 235, 150 220, 120 230 C 100 238, 90 255, 80 260"
                  stroke={isHovered ? '#38bdf8' : '#f97316'} strokeWidth="2.5" strokeLinecap="round" filter="url(#branchGlow)"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
                />
                {/* Twigs */}
                <motion.path
                  d="M 270 140 Q 250 125, 240 110 M 145 240 Q 130 215, 115 210 M 70 270 Q 50 250, 40 240"
                  stroke={isHovered ? '#38bdf8' : '#f97316'} strokeWidth="1.8" strokeLinecap="round" filter="url(#branchGlow)"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
                />
              </svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COLLABORATION
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
      viewport={{ once: false, amount: 0.2 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t space-y-8"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <motion.div variants={fadeUp}>
        <Eyebrow>WORKFLOW PIPELINE</Eyebrow>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((s) => (
          <motion.div key={s.n} variants={listItem} className="border p-8 rounded-2xl backdrop-blur-xl" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface)' }}>
            <span className="font-mono text-sm text-orange-500 font-extrabold block">{s.n} // STEP</span>
            <h3 className="mt-4 text-2xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* =========================================================
   INTERACTIVE GRID & PIXEL TRAIL (Bleach Theme)
========================================================= */
function InteractiveGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position offset from center, scaled down for subtlety
      mouseX.set((e.clientX - window.innerWidth / 2) * -0.05);
      mouseY.set((e.clientY - window.innerHeight / 2) * -0.05);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 80 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 80 });

  return (
    <motion.div 
      className="fixed inset-[-50%] z-0 pointer-events-none opacity-50 sm:opacity-80"
      style={{
        x: smoothX,
        y: smoothY,
        backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  );
}

function PixelTrailCursor() {
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let idCounter = 0;
    
    // Only spawn pixels on desktop to avoid mobile lag
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 15) { // Spawn a pixel every 15px moved to form a tight line
        lastX = e.clientX;
        lastY = e.clientY;
        const newPixel = { id: idCounter++, x: e.clientX, y: e.clientY };
        setTrail(prev => [...prev, newPixel].slice(-5)); // Keep max 5 pixels
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      <AnimatePresence>
        {trail.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }} // Shrink in place, don't fall down
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="absolute w-2 h-2 bg-red-600 border border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] rounded-none"
            style={{ left: p.x - 4, top: p.y - 4 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   CUSTOM CURSOR (Existing hollow ring)
========================================================= */
function ContactOutro() {
  /* Split into individual lines so each word wraps cleanly at any viewport size */
  const lines = ["Let's make", 'something', 'worth watching.']

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t scroll-mt-20 overflow-visible"
      style={{ borderColor: 'var(--hairline)' }}
    >
      {/* Stacked word lines — each on its own row so they never overflow */}
      <div className="flex flex-col gap-0 leading-none">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={wordVariant}
            transition={{ delay: i * 0.08 }}
            className="font-black tracking-tighter uppercase overflow-visible"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
              lineHeight: 1.0,
              color: 'var(--text-primary)',
              /* Prevent any individual line from overflowing */
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        variants={fadeUp}
        className="mt-12 flex flex-wrap items-center gap-4"
      >
        <a href={`mailto:${PROFILE.email}`} data-hover className="inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider px-8 py-4 border rounded-full transition-all duration-300 bg-orange-500 text-black border-orange-500 hover:bg-white hover:text-black hover:border-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
          <Mail className="w-4 h-4" /> {PROFILE.email}
        </a>

        <a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer" data-hover className="group inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider px-8 py-4 border rounded-full transition-all duration-300 bg-transparent border-orange-600/30 hover:bg-[var(--text-primary)] text-[var(--text-primary)] hover:text-[var(--canvas)] hover:border-[var(--text-primary)] backdrop-blur-md">
          <Instagram className="w-4 h-4 text-pink-400 group-hover:text-[var(--canvas)]" /> Instagram
        </a>
      </motion.div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */
function Footer() {
  return (
    <footer className="border-t backdrop-blur-xl" style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          {PROFILE.studio}
        </span>
        <span className="text-orange-500 font-bold">© 2026</span>
      </div>
    </footer>
  );
}

/* =========================================================
   MAIN APP SHELL
========================================================= */
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeProject, setActiveProject] = useState<VideoProject>(WORKS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const audioSource = "https://res.cloudinary.com/na4u8vzm/video/upload/v1784357186/White_Background_oxmqqe.mp4";

  /* Lenis Smooth Scroll Engine Setup */
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.15, 
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true 
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

  /* Audio Controls */
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isAudioPlaying) { 
      audio.pause(); 
      setIsAudioPlaying(false); 
    } else {
      audio.currentTime = 0;
      audio.play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => { 
          console.error("Audio error:", err); 
          setIsAudioPlaying(false); 
        });
    }
  };

  /* Theme Controls */
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.remove('light');
      else document.documentElement.classList.add('light');
      return next;
    });
  };

  /* Keyboard Shortcuts */
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) lenisRef.current?.scrollTo(el, { offset: -80, duration: 1.1 });
  };

  return (
    <div className={isDark ? '' : 'light'}>
      <div className="min-h-screen antialiased relative" style={{ background: 'var(--canvas)', color: 'var(--text-primary)' }}>
        


        {/* Layered Visuals */}
        <RetroGlitchShapes />
        <InteractiveGrid />
        <audio ref={audioRef} src={audioSource} loop preload="auto" crossOrigin="anonymous" />

        <PixelTrailCursor />
        <ScrollProgress />

        <Header 
          isDark={isDark} 
          onToggleTheme={toggleTheme} 
          onScrollTo={scrollTo} 
          isAudioPlaying={isAudioPlaying} 
          onToggleAudio={toggleAudio} 
        />

        <div className="relative z-10">
          <Hero />
          <KineticMarquee />
          <InlineViewer activeProject={activeProject} />
          
          <WorkTrack 
            activeProject={activeProject} 
            onSelectProject={(p) => { 
              setActiveProject(p); 
              scrollTo('viewer'); 
            }} 
          />
          
          <SignatureAbout />
          <Collaborate />
          <ContactOutro />
        </div>

        <Footer />
      </div>
    </div>
  );
}
