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
            className="absolute right-0 mt-2 w-52 rounded-md border p-3 font-mono text-[11px] space-y-1.5 z-50 shadow-2xl"
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
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b"
      style={{ borderColor: 'var(--hairline)', background: 'color-mix(in srgb, var(--canvas) 60%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <button
          data-hover
          onClick={() => onScrollTo('hero')}
          className="font-mono text-xs tracking-[0.15em] uppercase font-bold cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          {PROFILE.studio}
        </button>

        <div className="hidden sm:flex items-center gap-10 font-mono text-xs uppercase tracking-[0.15em] font-medium">
          <button data-hover onClick={() => onScrollTo('viewer')} className="cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            Work
          </button>
          <button data-hover onClick={() => onScrollTo('about')} className="cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            About
          </button>
          <button data-hover onClick={() => onScrollTo('contact')} className="cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            Contact
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline font-mono text-[10px] tabular tracking-widest mr-2" style={{ color: 'var(--text-muted)' }}>
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  
  const helloScale = useTransform(scrollYProgress, [0, 1], [1, 0.42]);
  const helloY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const helloRotate = useTransform(scrollYProgress, [0, 1], [0, -16]);
  const helloOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32 min-h-screen flex flex-col justify-center overflow-hidden scroll-mt-20"
    >
      <motion.div
        style={{ scale: helloScale, y: helloY, rotate: helloRotate, opacity: helloOpacity }}
        className="pointer-events-none select-none absolute right-[-5%] sm:right-[0%] top-[10%] w-[85vw] max-w-[900px] z-0"
      >
        <svg viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
           <motion.path 
              d="M 50 100 C 50 60 70 40 90 40 C 110 40 100 80 100 120 C 100 140 115 140 125 120 C 140 80 145 40 145 40 M 145 40 C 145 80 140 120 160 120 C 180 120 185 80 185 80 C 185 60 165 60 160 80 C 155 100 165 120 185 120 C 205 120 215 80 215 40 C 215 20 215 20 215 20 M 215 20 C 215 60 210 120 230 120 C 250 120 255 80 255 40 C 255 20 255 20 255 20 M 255 20 C 255 60 250 120 270 120 C 290 120 305 80 305 60 C 305 40 285 40 275 60 C 265 80 275 120 300 120 C 320 120 340 80 340 80"
              stroke="var(--text-primary)" 
              strokeWidth="6" 
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
          className="mt-8 font-semibold uppercase leading-[0.9] tracking-tighter"
          style={{ color: 'var(--text-primary)', fontSize: 'clamp(3.5rem, 11vw, 9.5rem)' }}
        >
          {PROFILE.heroLines.map((line, li) => (
            <span key={li} className="block overflow-hidden pb-2">
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
          className="mt-8 max-w-xl text-base md:text-lg leading-relaxed font-light"
          style={{ color: 'var(--text-secondary)' }}
        >
          {PROFILE.bio}
        </motion.p>
      </div>
    </section>
  );
}

/* =========================================================
   Inline Main Viewer (Loaded into same page)
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
    <section id="viewer" className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-16 scroll-mt-24">
      <motion.div 
        key={activeProject.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        {/* Video Player */}
        <div className="lg:col-span-8 border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative group" style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}>
          
          <div className="px-6 py-4 flex items-center justify-between font-mono text-[10px] tracking-widest border-b" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase font-bold" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{activeProject.aspectRatio}</span>
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
                  className="absolute p-5 bg-white text-black rounded-full shadow-2xl cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current text-black ml-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 py-4 flex items-center gap-4 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <button data-hover onClick={() => setIsPlaying((p) => !p)} className="cursor-pointer transition-colors hover:opacity-70" style={{ color: 'var(--text-primary)' }}>
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button data-hover onClick={() => setIsMuted((m) => !m)} className="cursor-pointer transition-colors hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Project Details Side Card */}
        <div className="lg:col-span-4 border p-8 rounded-2xl flex flex-col justify-between h-full min-h-[420px]" style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}>
          <div className="space-y-6">
            <div className="space-y-3 border-b pb-6" style={{ borderColor: 'var(--hairline)' }}>
              <span className="font-mono text-[10px] tracking-widest uppercase block" style={{ color: 'var(--text-muted)' }}>// ACTIVE INDEX</span>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{activeProject.title}</h2>
              <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded uppercase tracking-wider">
                {activeProject.category}
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
              {activeProject.description}
            </p>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t" style={{ borderColor: 'var(--hairline)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase block" style={{ color: 'var(--text-muted)' }}>// PIPELINE TECHNIQUES</span>
            <div className="flex flex-wrap gap-2">
              {activeProject.techniques.map((tech, i) => (
                <span key={i} className="text-[10px] font-mono border px-3 py-1.5 rounded-md" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}>
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
   Selected Works — Fixed CSS Padding & Aspect Ratios
========================================================= */
function WorkTrack({ activeProject, onSelectProject }: { activeProject: VideoProject, onSelectProject: (p: VideoProject) => void }) {
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
    <section className="relative py-12 md:py-16 border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-baseline justify-between mb-8">
        <h2 className="font-semibold uppercase tracking-tight" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          Selected Works
        </h2>
        <span className="font-mono text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
          Scroll horizontally →
        </span>
      </div>

      <div ref={trackRef} className="track-scroll flex gap-6 overflow-x-auto px-6 md:px-12 pb-8 pt-4 snap-x snap-mandatory">
        {WORKS.map((w) => {
          const isActive = activeProject.id === w.id;
          return (
            <motion.button
              key={w.id}
              data-hover
              onClick={() => onSelectProject(w)}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative shrink-0 snap-center overflow-hidden rounded-xl text-left cursor-pointer transition-all duration-300 ${
                isActive ? 'ring-2 ring-emerald-500 shadow-2xl' : 'opacity-70 hover:opacity-100'
              }`}
              // FIX: Clean exactly 9:16 vertical rectangles preventing cut off.
              style={{ width: '260px', aspectRatio: '9/16', background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                  {w.category} · {w.year}
                </span>
                <h3 className="mt-1.5 text-base font-bold text-white tracking-tight leading-snug">{w.title}</h3>
              </div>
              <span className="absolute top-4 right-4 font-mono text-[10px] text-white/80 tabular px-2 py-1 bg-black/40 rounded backdrop-blur-sm pointer-events-none">
                {w.duration}
              </span>
            </motion.button>
          )
        })}
      </div>
    </section>
  );
}

/* =========================================================
   Profile / About
========================================================= */
function SignatureAbout() {
  return (
    <section id="about" className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 border-t scroll-mt-20" style={{ borderColor: 'var(--hairline)' }}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-center">
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="lg:col-span-3 order-2 lg:order-1"
        >
          <Eyebrow>Profile</Eyebrow>
          <p className="mt-6 font-medium tracking-tight leading-relaxed" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)' }}>
            {PROFILE.bio}
          </p>
        </motion.div>

        <div className="lg:col-span-2 relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--hairline)' }}>
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
               alt="KD Profile" 
               className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
             />
          </div>

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
                stroke="#34d399"
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
      className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <motion.div variants={listItem}>
        <Eyebrow>How we'd work together</Eyebrow>
      </motion.div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((s) => (
          <motion.div key={s.n} variants={listItem} className="border p-8 rounded-2xl" style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }}>
            <span className="font-mono text-xs text-emerald-400 font-bold">{s.n}</span>
            <h3 className="mt-4 text-xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
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
      className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider px-6 py-4 border rounded-full transition-colors hover:bg-white hover:text-black"
    >
      {children}
    </motion.a>
  );
}

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
        className="font-semibold tracking-tighter max-w-3xl leading-[1.05] uppercase"
        style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        <span className="font-bold text-white">{PROFILE.studio}</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/* =========================================================
   App
========================================================= */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeProject, setActiveProject] = useState<VideoProject>(WORKS[0]);
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
      <div className="min-h-screen antialiased relative" style={{ background: 'var(--canvas)', color: 'var(--text-primary)' }}>
        <div className="grid-overlay" />
        <audio ref={audioRef} src="/audio/ambient-loop.mp3" loop preload="none" />

        <CustomCursor />
        <ScrollProgress />

        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onScrollTo={scrollTo}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />

        <div className="relative z-10">
          <Hero />
          {/* THE NEW INLINE MAIN VIEWER */}
          <InlineViewer activeProject={activeProject} />
          {/* THE FIXED HORIZONTAL TRACK */}
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