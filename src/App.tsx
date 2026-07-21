import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'motion/react';
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
} from 'lucide-react';

/* =========================================================
   PROFILE — edit this block with your real info.
========================================================= */
const PROFILE = {
  mark: 'KD',
  studio: 'Studio — KD',
  role: 'Video Editor',
  heroLine: "I edit for the first three seconds, and every one after it.",
  bio:
    "I'm KD, a video editor working mostly in short-form: pacing, sound design, and color that make people stop scrolling. Outside client work, I spend most of my time studying retention — why a cut works, why a hook doesn't, and how a fraction of a second changes both.",
  email: 'kdeditzauthentic@gmail.com',
  instagram: 'https://instagram.com',
};

/* =========================================================
   WORK — your real projects, unchanged data, restyled.
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
  hook: string;
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
    hook: 'A product promo built entirely around never letting the eye rest.',
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
    hook: 'A timeline walkthrough that never once feels like a tutorial.',
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
    hook: 'Premium color pacing meeting a rougher, more honest texture.',
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
    hook: 'Nine seconds, engineered to be watched more than once.',
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
    hook: 'A short edit carried entirely by motion, not footage.',
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
    hook: 'Velocity curves and sound design doing the storytelling.',
    description:
      'A high-impact short-form edit leveraging synchronized velocity curves, complex mask layering, and custom impact sound design to carry the narrative without dialogue.',
    videoUrl:
      'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    techniques: ['Velocity Curves', 'Mask Layering', 'Impact SFX'],
  },
];

/* =========================================================
   Routing — no router dependency, just the hash.
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const listItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* =========================================================
   Small shared bits
========================================================= */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase tracking-[0.2em] text-[11px]"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </span>
  );
}

function formatTimecode(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* Magnetic hover — pulls an element gently toward the cursor */
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

/* Custom cursor — a ring that lags gently and inverts over content */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

/* Thin scroll progress bar — doubles as the site's "playhead" */
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
   Header — logotype, nav, theme toggle, live timecode clock
========================================================= */
function Header({
  isDark,
  onToggleTheme,
  onNavigateHome,
  onScrollTo,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onScrollTo: (id: string) => void;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? '';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        borderColor: 'var(--hairline)',
        background: 'color-mix(in srgb, var(--canvas) 82%, transparent)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <button
          data-hover
          onClick={onNavigateHome}
          className="font-mono text-xs tracking-[0.15em] uppercase font-medium cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          {PROFILE.studio}
        </button>

        <div className="hidden sm:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.15em]">
          <button
            data-hover
            onClick={() => onScrollTo('work')}
            className="cursor-pointer transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Work
          </button>
          <button
            data-hover
            onClick={() => onScrollTo('contact')}
            className="cursor-pointer transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="hidden md:inline font-mono text-xs tabular tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            {time} {zone}
          </span>
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
   Hero — scroll parallax + word-by-word entrance
========================================================= */
function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  const words = PROFILE.heroLine.split(' ');

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-16">
      <motion.div style={{ y, opacity }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Eyebrow>{PROFILE.role}</Eyebrow>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.045, delayChildren: 0.15 }}
          className="mt-4 text-[2.1rem] leading-[1.15] sm:text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {words.map((w, i) => (
            <motion.span key={i} className="kinetic-word mr-3" variants={wordVariant}>
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 + words.length * 0.045 }}
          className="mt-7 max-w-xl text-[15px] md:text-base leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {PROFILE.bio}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* =========================================================
   Work index — hybrid: thumbnail + one line, click for case study
========================================================= */
function WorkRow({ work, onOpen }: { work: VideoProject; onOpen: (id: string) => void }) {
  return (
    <motion.button
      variants={listItem}
      data-hover
      onClick={() => onOpen(work.id)}
      className="group w-full text-left flex items-center gap-5 md:gap-8 py-6 border-b cursor-pointer"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <motion.div
        layoutId={`media-${work.id}`}
        className="relative shrink-0 overflow-hidden rounded-md"
        style={{
          width: work.aspectRatio === '16:9' ? '9.5rem' : '4.6rem',
          aspectRatio: work.aspectRatio === '16:9' ? '16/9' : '9/16',
          background: 'var(--surface-2)',
        }}
      >
        <video
          src={work.videoUrl}
          muted
          loop
          playsInline
          autoPlay
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.currentTime >= 4) v.currentTime = 0;
          }}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.06]"
        />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3
            className="text-base md:text-lg font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {work.title}
          </h3>
          <span className="font-mono text-[11px] tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {work.category} · {work.year}
          </span>
        </div>
        <p
          className="mt-1.5 text-sm leading-snug hidden sm:block max-w-lg truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {work.hook}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-xs tabular hidden md:inline" style={{ color: 'var(--text-muted)' }}>
          {work.duration}
        </span>
        <ArrowUpRight
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>
    </motion.button>
  );
}

function WorkIndex({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="work" className="max-w-5xl mx-auto px-6 md:px-8 py-4 scroll-mt-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="flex items-baseline justify-between mb-2"
      >
        <h2 className="text-sm font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
          Selected Work
        </h2>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {String(WORKS.length).padStart(2, '0')} projects
        </span>
      </motion.div>

      <motion.div
        variants={listContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {WORKS.map((w) => (
          <WorkRow key={w.id} work={w} onOpen={onOpen} />
        ))}
      </motion.div>
    </section>
  );
}

/* =========================================================
   Project / case-study view
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
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }}
    >
      <motion.div
        layoutId={`media-${work.id}`}
        className={`relative flex items-center justify-center bg-black mx-auto ${
          isWidescreen ? 'aspect-video w-full' : 'aspect-[9/16] max-w-[380px] w-full'
        }`}
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
        <button
          data-hover
          onClick={() => setIsPlaying((p) => !p)}
          className="cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button
          data-hover
          onClick={() => setIsMuted((m) => !m)}
          className="cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--hairline)' }}>
          <motion.div
            className="h-full"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : '0%',
              background: 'var(--text-primary)',
            }}
          />
        </div>

        <span className="font-mono text-xs tabular" style={{ color: 'var(--text-muted)' }}>
          {formatTimecode(currentTime)} / {duration ? formatTimecode(duration) : work.duration}
        </span>
      </div>
    </div>
  );
}

function ProjectView({
  work,
  onBack,
  onOpen,
}: {
  work: VideoProject;
  onBack: () => void;
  onOpen: (id: string) => void;
}) {
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
      className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Eyebrow>{work.category} · {work.year}</Eyebrow>
          <h1
            className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {work.title}
          </h1>
          <p className="mt-5 text-sm md:text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {work.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {work.techniques.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] px-2.5 py-1 rounded-full border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {t}
              </span>
            ))}
          </div>

          <dl
            className="mt-10 pt-6 grid grid-cols-2 gap-y-4 gap-x-4 font-mono text-xs"
            style={{ borderTop: '1px solid var(--hairline)' }}
          >
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

      <div
        className="mt-16 pt-6 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        <button data-hover onClick={() => onOpen(prev.id)} className="text-left cursor-pointer group">
          <Eyebrow>Previous</Eyebrow>
          <div
            className="text-sm mt-1 group-hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            {prev.title}
          </div>
        </button>
        <button data-hover onClick={() => onOpen(next.id)} className="text-right cursor-pointer group">
          <Eyebrow>Next</Eyebrow>
          <div
            className="text-sm mt-1 group-hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            {next.title}
          </div>
        </button>
      </div>
    </motion.section>
  );
}

/* =========================================================
   Collaboration steps — a real sequence, so numbering earns its place
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
      className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-20"
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
   Contact outro — kinetic reveal + magnetic links
========================================================= */
function MagneticLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
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
    <section id="contact" className="max-w-5xl mx-auto px-6 md:px-8 py-20 md:py-28 scroll-mt-20">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.05 }}
        className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-tight"
        style={{ color: 'var(--text-primary)' }}
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
      <div
        className="max-w-5xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between font-mono text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>{PROFILE.studio}</span>
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
  const [route, setRoute] = useState<Route>(() => routeFromHash());

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateHome = () => {
    window.location.hash = '#/';
  };
  const openProject = (id: string) => {
    window.location.hash = `#/work/${id}`;
  };
  const scrollTo = (id: string) => {
    if (route.page !== 'home') {
      window.location.hash = '#/';
      requestAnimationFrame(() => {
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeWork = route.page === 'project' ? WORKS.find((w) => w.id === route.id) : undefined;

  return (
    <div className={isDark ? '' : 'light'}>
      <div
        className="min-h-screen antialiased transition-colors duration-300"
        style={{ background: 'var(--canvas)', color: 'var(--text-primary)' }}
      >
        <CustomCursor />
        <ScrollProgress />

        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onNavigateHome={navigateHome}
          onScrollTo={scrollTo}
        />

        <AnimatePresence mode="wait">
          {route.page === 'project' && activeWork ? (
            <ProjectView key="project" work={activeWork} onBack={navigateHome} onOpen={openProject} />
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero />
              <WorkIndex onOpen={openProject} />
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
