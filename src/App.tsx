import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight, Mail, Instagram, Music, Keyboard } from 'lucide-react';
import Lenis from '@studio-freight/lenis';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  videoUrl: string;
  techniques: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'retention-hook-promo',
    title: 'High-Retention Hook',
    category: 'Short Form / Motion',
    year: '2026',
    description: 'Dynamic product promo engineered with kinetic typography, zero dead air, and aggressive hyper-pacing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_1_ilryuy.mp4',
    techniques: ['Kinetic Typography', 'Pattern Interrupts', 'Speed Ramping']
  },
  {
    id: 'creator-efficiency-breakdown',
    title: 'Software Workflow Breakdown',
    category: 'Short Form / Editorial',
    year: '2026',
    description: 'Fast-paced timeline breakdown utilizing custom graphic callouts and hard sound hit syncing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997098/FILE_2_mc78dn.mp4',
    techniques: ['Graphic Callouts', 'SFX Syncing', 'Defocus Transitions']
  },
  {
    id: 'lifestyle-brand-story',
    title: 'Aesthetic Brand Storytelling',
    category: 'Commercial / Narrative',
    year: '2026',
    description: 'Cinematic brand integration balancing premium color pacing with modern digital grit overlays.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997100/FILE_3_nhlwkf.mp4',
    techniques: ['Glitch Textures', 'Atmospheric Pacing', 'Color Matching']
  },
  {
    id: 'micro-hook-retrospective',
    title: 'Viral Retention Architecture',
    category: 'Short Form / Strategy',
    year: '2026',
    description: 'Micro-retention structure utilizing immediate visual hooks and loop engineering to maximize replay rate.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_4_rfbxd1.mp4',
    techniques: ['Loop Engineering', 'Visual Hook Pacing', 'Micro-Zooming']
  },
  {
    id: 'motion-design-showcase',
    title: 'Visual Effects & Motion Layout',
    category: 'Motion Design',
    year: '2026',
    description: 'High-velocity visual edit driven entirely by custom motion design graphics and kinetic layout composition.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997072/FILE_5_li2r3u.mov',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding']
  },
  {
    id: 'premium-commercial-edit',
    title: 'Dynamic Narrative Flow',
    category: 'Commercial Cut',
    year: '2026',
    description: 'High-impact short-form edit leveraging synchronized velocity curves and complex mask layering.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    techniques: ['Velocity Curves', 'Mask Layering', 'Impact SFX']
  }
];

export default function App() {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Hardware-Accelerated Mouse Tracking
  const mouseX = useSpring(0, { stiffness: 220, damping: 24 });
  const mouseY = useSpring(0, { stiffness: 220, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  // Lenis Inertia Smooth Scrolling Engine Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Keyboard Shortcuts Handler (T: Top, B: Bottom, S: Sound Toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 't') {
        lenisRef.current?.scrollTo(0);
      } else if (key === 'b') {
        lenisRef.current?.scrollTo(document.body.scrollHeight);
      } else if (key === 's') {
        setIsBgmPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Music Controller Sync
  useEffect(() => {
    if (bgmRef.current) {
      if (isBgmPlaying) {
        bgmRef.current.play().catch(() => setIsBgmPlaying(false));
      } else {
        bgmRef.current.pause();
      }
    }
  }, [isBgmPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeProject, isPlaying, isMuted]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="bg-[#0D0D0E] text-[#ECECEC] font-sans min-h-screen selection:bg-white selection:text-black antialiased relative overflow-x-hidden"
    >
      
      {/* Background Audio Element (Lo-Fi Ambient Loop) */}
      <audio 
        ref={bgmRef} 
        src="https://res.cloudinary.com/na4u8vzm/video/upload/v1784357186/White_Background_oxmqqe.mp4" 
        loop 
      />

      {/* Background Grid Lines Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />

      {/* CURSOR-FOLLOWING FLOATING VIDEO HOVER PREVIEW */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              x: mouseX,
              y: mouseY,
            }}
            className="fixed top-0 left-0 w-48 sm:w-64 aspect-video rounded-xl overflow-hidden pointer-events-none z-50 border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75)] bg-neutral-900 hidden sm:block"
          >
            <video
              src={hoveredProject.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">HOVER PREVIEW</span>
              <span className="text-xs font-bold text-white uppercase truncate">{hoveredProject.title}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-md bg-[#0D0D0E]/80 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-neutral-400 font-bold">VIDEO D EDITOR // STUDIO</span>
        </div>

        <div className="flex items-center gap-6">
          {/* THEME CONTROL & KEYBOARD SHORTCUT TOOLTIP TRIGGER */}
          <div 
            className="relative"
            onMouseEnter={() => setShowThemeTooltip(true)}
            onMouseLeave={() => setShowThemeTooltip(false)}
          >
            <button className="font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 transition-colors">
              <Keyboard className="w-3.5 h-3.5" />
              <span>THEME [A]</span>
            </button>

            <AnimatePresence>
              {showThemeTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-8 w-64 p-4 bg-[#141416] border border-white/15 rounded-xl shadow-2xl z-50 font-mono text-xs space-y-2.5 text-left"
                >
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block border-b border-white/10 pb-1">
                    // KEYBOARD SHORTCUTS
                  </span>
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>Scroll To Top</span>
                    <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] text-white">Press T</kbd>
                  </div>
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>Scroll To Bottom</span>
                    <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] text-white">Press B</kbd>
                  </div>
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>Pause / Resume BGM</span>
                    <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] text-white">Press S</kbd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BGM MUSIC TOGGLE BUTTON */}
          <button
            onClick={() => setIsBgmPlaying(!isBgmPlaying)}
            className={`font-mono text-xs tracking-wider uppercase flex items-center gap-2 border px-3.5 py-1.5 rounded-full transition-all duration-300 ${
              isBgmPlaying 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-spin' : ''}`} />
            <span>SOUND [{isBgmPlaying ? 'ON' : 'OFF'}]</span>
          </button>

          <a 
            href="mailto:kdeditzauthentic@gmail.com"
            className="text-xs font-mono tracking-wider uppercase border border-white/20 hover:border-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-white hover:text-black font-semibold hidden sm:inline-block"
          >
            Get In Touch
          </a>
        </div>
      </header>

      {/* Hero Header Section */}
      <main className="relative z-10 pt-32 md:pt-40 px-6 md:px-12 max-w-7xl mx-auto space-y-24">
        
        {/* TEXT REVEAL MASKED ANIMATION */}
        <section className="space-y-6">
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs text-neutral-500 tracking-[0.3em] uppercase block font-bold"
            >
              PORTFOLIO 2026
            </motion.span>
          </div>
          
          <div className="overflow-hidden py-1">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase font-display leading-[0.9]"
            >
              Video D Editor<span className="text-neutral-600">.</span>
            </motion.h1>
          </div>
          
          <div className="overflow-hidden">
            <motion.p 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-neutral-400 max-w-2xl text-base md:text-xl font-light leading-relaxed"
            >
              Crafting high-retention short-form edits, cinematic motion graphics, and viral storytelling architectures for modern digital brands.
            </motion.p>
          </div>
        </section>

        {/* Featured Theater / Main Monitor */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Stage Video Display */}
          <div className="lg:col-span-8 bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
            <div className="relative aspect-video md:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={activeProject.videoUrl}
                className="w-full h-full object-contain"
                loop
                playsInline
                preload="metadata"
                onClick={() => setIsPlaying(!isPlaying)}
              />

              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute p-5 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer z-20"
                  >
                    <Play className="w-6 h-6 fill-current text-black ml-0.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Video Sub-Bar Controls */}
            <div className="px-6 py-4 bg-[#111113] border-t border-white/5 flex items-center justify-between font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors p-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white transition-colors p-1"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
              </div>
              <span className="font-bold tracking-widest text-neutral-300">{activeProject.title.toUpperCase()}</span>
              <span className="text-neutral-600">{activeProject.year}</span>
            </div>
          </div>

          {/* Active Project Details Side Card */}
          <div className="lg:col-span-4 bg-[#141416] border border-white/10 p-8 rounded-2xl space-y-8 flex flex-col justify-between h-full min-h-[420px]">
            <div className="space-y-6">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block">// ACTIVE INDEX</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{activeProject.title}</h2>
                <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                  {activeProject.category}
                </span>
              </div>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                {activeProject.description}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block">// TECHNIQUES APPLIED</span>
              <div className="flex flex-wrap gap-2">
                {activeProject.techniques.map((tech, i) => (
                  <span key={i} className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-neutral-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Work List */}
        <section className="space-y-8 pt-12">
          <div className="border-b border-white/10 pb-4 flex justify-between items-end">
            <div>
              <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block">// INDEX</span>
              <h2 className="text-3xl font-black uppercase tracking-tight">Selected Works</h2>
            </div>
            <span className="font-mono text-xs text-neutral-500">01 — 06</span>
          </div>

          <div className="divide-y divide-white/5">
            {PROJECTS.map((project, index) => {
              const isActive = activeProject.id === project.id;
              return (
                <motion.div
                  key={project.id}
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    setActiveProject(project);
                    setIsPlaying(true);
                  }}
                  className={`group py-6 md:py-8 px-4 md:px-6 rounded-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/[0.03] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xs text-neutral-600 font-bold">0{index + 1}</span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs text-neutral-500 md:hidden block mt-1">{project.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12 font-mono text-xs">
                    <span className="hidden md:block text-neutral-500">{project.category}</span>
                    <span className="text-neutral-500">{project.year}</span>
                    <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white rotate-45' : 'text-neutral-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-[#141416] border border-white/10 rounded-2xl p-8 md:p-12 space-y-10">
          <div className="border-b border-white/10 pb-6">
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase block">// PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mt-1">How To Work Together</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="space-y-3 bg-white/[0.02] border border-white/5 p-6 rounded-xl">
              <span className="font-mono text-xs text-emerald-400 font-bold block">01 // BRIEFING</span>
              <h3 className="font-bold text-lg text-white">Footage & Direction</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Send your raw footage assets along with tracking references, mood boards, and stylistic project goals.
              </p>
            </div>

            <div className="space-y-3 bg-white/[0.02] border border-white/5 p-6 rounded-xl">
              <span className="font-mono text-xs text-emerald-400 font-bold block">02 // PIPELINE CUT</span>
              <h3 className="font-bold text-lg text-white">Assembly & Polish</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                I assemble the cuts using velocity hooks, dynamic color grading, sound hit syncing, and kinetic motion overlays.
              </p>
            </div>

            <div className="space-y-3 bg-white/[0.02] border border-white/5 p-6 rounded-xl">
              <span className="font-mono text-xs text-emerald-400 font-bold block">03 // DELIVERY</span>
              <h3 className="font-bold text-lg text-white">Master Export</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Review draft cuts and receive high-fidelity, platform-optimized files ready for publication pipelines.
              </p>
            </div>
          </div>

          {/* Contact Block */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <p className="text-sm font-mono text-neutral-300">Click this to contact me via Gmail:</p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:kdeditzauthentic@gmail.com"
                className="inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-200 px-6 py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
              >
                <Mail className="w-4 h-4 text-black" />
                kdeditzauthentic@gmail.com
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                Instagram
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 py-12 px-6 md:px-12 bg-[#0A0A0B] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase font-display tracking-tight">Let's cut something iconic.</h3>
            <p className="font-mono text-xs text-neutral-500">// ALLOCATION SLOTS RESERVED FOR 2026 COMMISSIONS</p>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs text-neutral-400">
            <span className="font-bold text-white uppercase">Video D Editor</span>
            <span>© 2026 STUDIO—KD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}