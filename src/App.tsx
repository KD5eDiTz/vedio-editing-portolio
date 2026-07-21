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
} from 'lucide-react';

/* =========================================================
   PROFILE
========================================================= */
const PROFILE = {
  studio: 'Studio — KD',
  role: 'Video Editor & Motion Designer',
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
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding'],
  },
];

/* =========================================================
   Shared Motion Variants
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono uppercase tracking-[0.25em] text-[11px] font-bold text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      <span>{children}</span>
    </div>
  );
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
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

/* =========================================================
   Retro Gaming Floating Glitch Shapes Overlay
========================================================= */
function RetroGlitchShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
      {/* Triangle */}
      <div className="absolute top-[18%] left-[8%] text-emerald-400 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#34d399]">
        ▲
      </div>
      {/* Circle */}
      <div className="absolute top-[35%] right-[10%] text-rose-500 font-mono text-4xl font-bold glitch-symbol drop-shadow-[0_0_10px_#f43f5e]">
        ○
      </div>
      {/* Cross X */}
      <div className="absolute bottom-[28%] left-[12%] text-cyan-400 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#38bdf8]">
        ✕
      </div>
      {/* Square */}
      <div className="absolute bottom-[18%] right-[15%] text-amber-400 font-mono text-3xl font-bold glitch-symbol drop-shadow-[0_0_8px_#fbbf24]">
        □
      </div>
    </div>
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
            className="absolute right-0 mt-2 w-52 rounded-xl border p-3 font-mono text-[11px] space-y-1.5 z-50 shadow-2xl backdrop-blur-xl"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
          >
            <div className="flex justify-between"><span>Scroll to top</span><span className="text-emerald-400 font-bold">T</span></div>
            <div className="flex justify-between"><span>Scroll to bottom</span><span className="text-emerald-400 font-bold">B</span></div>
            <div className="flex justify-between"><span>Toggle sound</span><span className="text-emerald-400 font-bold">S</span></div>
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
        <button
          data-hover
          onClick={() => onScrollTo('hero')}
          className="font-mono text-xs tracking-[0.15em] uppercase font-extrabold cursor-pointer flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_8px_#34d399]" />
          {PROFILE.studio}
        </button>

        <div className="hidden sm:flex items-center gap-10 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
          <button data-hover onClick={() => onScrollTo('viewer')} className="cursor-pointer hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
            Work
          </button>
          <button data-hover onClick={() => onScrollTo('about')} className="cursor-pointer hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
            About
          </button>
          <button data-hover onClick={() => onScrollTo('contact')} className="cursor-pointer hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline font-mono text-[10px] tabular tracking-widest mr-2 text-emerald-400/80 font-bold">
            {time} {zone}
          </span>
          <ShortcutsHint />
          <button
            data-hover
            onClick={onToggleAudio}
            aria-label="Toggle background audio"
            className={`p-2 rounded-full transition-all cursor-pointer ${isAudioPlaying ? 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'hover:opacity-70'}`}
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
   Hero
========================================================= */
function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [useYokoso, setUseYokoso] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest > 0.6 && !useYokoso) {
        setUseYokoso(true);
      } else if (latest < 0.2 && useYokoso) {
        setUseYokoso(false);
      }
    });
  }, [scrollYProgress, useYokoso]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32 min-h-screen flex flex-col justify-center overflow-hidden scroll-mt-20"
    >
      <div className="relative z-10 space-y-6">
        <Eyebrow>{PROFILE.role}</Eyebrow>

        {/* Apple Cursive Liquid Glass Title */}
        <div className="overflow-hidden py-2 min-h-[160px] md:min-h-[220px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={useYokoso ? 'yokoso' : 'hello'}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="apple-glass-text font-bold leading-tight"
              style={{ fontSize: 'clamp(5rem, 16vw, 13rem)' }}
            >
              {useYokoso ? 'Yōkoso' : 'Hello'}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subtitle Line with Strikethrough Effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-base sm:text-xl md:text-2xl font-semibold tracking-wide flex flex-wrap items-center gap-3 pt-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color: 'var(--text-primary)' }}>{useYokoso ? 'Watashino' : 'Welcome to my'}</span>

          <span className="relative inline-block font-bold" style={{ color: 'var(--text-primary)' }}>
            Soul Society
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeInOut' }}
              className="absolute left-0 top-1/2 w-full h-[3px] bg-rose-500 origin-left rounded-full shadow-[0_0_12px_rgba(244,63,94,0.9)]"
            />
          </span>

          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="text-emerald-400 font-bold tracking-wider uppercase bg-emerald-950/60 border border-emerald-500/60 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.3)] flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            Editing Society
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed font-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          {PROFILE.bio}
        </motion.p>
      </div>
    </section>
  );
}

/* =========================================================
   Kinetic Marquee Ticker
========================================================= */
function KineticMarquee() {
  return (
    <div className="w-full py-6 border-y overflow-hidden select-none my-8 backdrop-blur-md" style={{ borderColor: 'var(--hairline)', background: 'rgba(52, 211, 153, 0.03)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
        className="flex whitespace-nowrap gap-12 font-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em]"
        style={{ color: 'var(--text-primary)' }}
      >
        <span>THIS IS HOW YOU IMPROVE YOUR QUALITY OF EDIT</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
        <span className="text-cyan-400">THIS IS WHERE YOU CAN INCREASE YOUR IDEAS</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
        <span>RETENTION ARCHITECTURE // CINEMATIC PACING</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
        <span>THIS IS HOW YOU IMPROVE YOUR QUALITY OF EDIT</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
        <span className="text-cyan-400">THIS IS WHERE YOU CAN INCREASE YOUR IDEAS</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
        <span>RETENTION ARCHITECTURE // CINEMATIC PACING</span>
        <span className="text-emerald-400 shadow-[0_0_10px_#34d399]">★</span>
      </motion.div>
    </div>
  );
}

/* =========================================================
   Inline Main Viewer
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        <div className="lg:col-span-8 border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative group backdrop-blur-xl" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-2)' }}>
          <div className="px-6 py-4 flex items-center justify-between font-mono text-xs tracking-widest border-b" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</span>
            </div>
            <span className="text-emerald-400 font-bold">{activeProject.aspectRatio}</span>
          </div>

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
                  className="absolute p-5 bg-emerald-400 text-black rounded-full shadow-[0_0_25px_rgba(52,211,153,0.8)] cursor-pointer z-20 hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current text-black ml-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 py-4 flex items-center gap-4 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <button data-hover onClick={() => setIsPlaying((p) => !p)} className="cursor-pointer transition-colors hover:text-emerald-400" style={{ color: 'var(--text-primary)' }}>
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button data-hover onClick={() => setIsMuted((m) => !m)} className="cursor-pointer transition-colors hover:text-emerald-400" style={{ color: 'var(--text-secondary)' }}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 border p-8 rounded-2xl flex flex-col justify-between h-full min-h-[420px] backdrop-blur-xl" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface-2)' }}>
          <div className="space-y-6">
            <div className="space-y-3 border-b pb-6" style={{ borderColor: 'var(--hairline)' }}>
              <span className="font-mono text-xs tracking-widest uppercase block font-bold text-emerald-400">// ACTIVE INDEX</span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</h2>
              <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/50 px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                {activeProject.category}
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
              {activeProject.description}
            </p>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <span className="font-mono text-xs tracking-widest uppercase block font-bold text-emerald-400">// PIPELINE TECHNIQUES</span>
            <div className="flex flex-wrap gap-2">
              {activeProject.techniques.map((tech, i) => (
                <span key={i} className="text-xs font-mono border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 rounded-lg text-emerald-300 font-semibold">
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
   Selected Works — Fixed Native Smooth Track
========================================================= */
function WorkTrack({ activeProject, onSelectProject }: { activeProject: VideoProject, onSelectProject: (p: VideoProject) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const distance = 300;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative py-12 md:py-16 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Eyebrow>PORTFOLIO REEL</Eyebrow>
          <h2 className="font-extrabold uppercase tracking-tight text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Selected Works
          </h2>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTrack('left')}
            className="p-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTrack('right')}
            className="p-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={trackRef}
          className="track-scroll flex gap-6 overflow-x-auto py-4 px-2 snap-x snap-mandatory"
        >
          {WORKS.map((w) => {
            const isActive = activeProject.id === w.id;
            return (
              <motion.button
                key={w.id}
                data-hover
                onClick={() => onSelectProject(w)}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl text-left cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.02]' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ width: '220px', aspectRatio: '9/16', background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
              >
                <div className="absolute inset-0">
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
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold block">
                    {w.category}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-white tracking-tight leading-snug truncate">{w.title}</h3>
                </div>
                <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-emerald-400 font-bold tabular px-2 py-0.5 bg-black/70 rounded-md border border-emerald-500/30 backdrop-blur-md pointer-events-none">
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
   Signature & About
========================================================= */
function SignatureAbout() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="about" className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <div className="space-y-8">
        <Eyebrow>PROFILE & CREATIVE DIRECTION</Eyebrow>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            <p className="font-medium tracking-tight leading-relaxed text-xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>
              {PROFILE.bio}
            </p>
          </motion.div>

          <div className="lg:col-span-2 relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border cursor-pointer group" 
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border-strong)' }}
            >
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                 alt="KD Profile" 
                 className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
               />
            </div>

            <div className="absolute -bottom-8 -right-4 lg:-right-10 w-[240px] md:w-[320px] z-10 pointer-events-none drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">
              <svg viewBox="0 0 400 120" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  d="M 30 70 Q 50 20 70 70 T 110 70 Q 140 30 170 70 T 210 70 M 230 40 L 230 90 M 250 40 C 290 40 290 90 250 90 Z"
                  stroke={isHovered ? '#38bdf8' : '#34d399'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#sigGlow)"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t space-y-8"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <Eyebrow>WORKFLOW PIPELINE</Eyebrow>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((s) => (
          <motion.div key={s.n} variants={listItem} className="border p-8 rounded-2xl backdrop-blur-xl" style={{ borderColor: 'var(--border-strong)', background: 'var(--surface)' }}>
            <span className="font-mono text-sm text-emerald-400 font-extrabold block">{s.n} // STEP</span>
            <h3 className="mt-4 text-2xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* =========================================================
   Contact Outro
========================================================= */
function ContactOutro() {
  const phrase = "Let's make something worth watching.";
  const words = phrase.split(' ');

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.05 }}
        className="font-black tracking-tighter max-w-4xl leading-[1.05] uppercase"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--text-primary)' }}
      >
        {words.map((w, i) => (
          <motion.span key={i} className="kinetic-word mr-4" variants={wordVariant}>
            {w}
          </motion.span>
        ))}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-12 flex flex-wrap items-center gap-4"
      >
        <a
          href={`mailto:${PROFILE.email}`}
          data-hover
          className="inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider px-8 py-4 border rounded-full transition-all duration-300 bg-emerald-400 text-black border-emerald-400 hover:bg-white hover:text-black hover:border-white shadow-[0_0_20px_rgba(52,211,153,0.4)]"
        >
          <Mail className="w-4 h-4" /> {PROFILE.email}
        </a>

        <a
          href={PROFILE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider px-8 py-4 border rounded-full transition-all duration-300 bg-transparent border-emerald-500/30 hover:bg-white hover:text-black hover:border-white backdrop-blur-md"
          style={{ color: 'var(--text-primary)' }}
        >
          <Instagram className="w-4 h-4 text-pink-400" /> Instagram
        </a>
      </motion.div>
    </section>
  );
}

/* =========================================================
   Footer
========================================================= */
function Footer() {
  return (
    <footer className="border-t backdrop-blur-xl" style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {PROFILE.studio}
        </span>
        <span className="text-emerald-400 font-bold">© 2026</span>
      </div>
    </footer>
  );
}

/* =========================================================
   Main App
========================================================= */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeProject, setActiveProject] = useState<VideoProject>(WORKS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const audioSource = "https://res.cloudinary.com/na4u8vzm/video/upload/v1784357186/White_Background_oxmqqe.mp4";

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

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsAudioPlaying(false);
        });
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      return next;
    });
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) lenisRef.current?.scrollTo(el, { offset: -80, duration: 1.1 });
  };

  const handleSelectProject = (project: VideoProject) => {
    setActiveProject(project);
    scrollTo('viewer');
  };

  return (
    <div className={isDark ? '' : 'light'}>
      <div className="min-h-screen antialiased relative overflow-x-hidden" style={{ background: 'var(--canvas)', color: 'var(--text-primary)' }}>
        
        {/* MP4 LIVE VIDEO BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-50 scale-105"
            src="/Neon Rounded Red Geometric live Wallpaper Abstract Gradient Background Animation    Free Version.mp4"
          />
          <div className="video-bg-overlay" />
        </div>

        {/* Retro Gaming Floating Glitch Shapes */}
        <RetroGlitchShapes />

        <div className="grid-overlay" />
        <audio ref={audioRef} src={audioSource} loop preload="auto" crossOrigin="anonymous" />

        <CustomCursor />
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
          <WorkTrack activeProject={activeProject} onSelectProject={handleSelectProject} />
          <SignatureAbout />
          <Collaborate />
          <ContactOutro />
        </div>

        <Footer />
      </div>
    </div>
  );
}