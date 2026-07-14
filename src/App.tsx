import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FileVideo, 
  Zap, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

interface VideoProject {
  id: string;
  title: string;
  category: string;
  views: string;
  duration: string;
  aspectRatio: string;
  fps: number;
  description: string;
  videoUrl: string;
  cinematicFilter: string;
  techniques: string[];
}

const VIDEO_WORKS: VideoProject[] = [
  {
    id: 'retention-hook-promo',
    title: 'High-Retention Hook',
    category: 'Short Form',
    duration: '00:13',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Dynamic product promo engineered with kinetic subtitles, zero dead air, and hyper-pacing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/v1783997093/FILE_1_ilryuy.mp4',
    cinematicFilter: 'saturate-[1.25] contrast-[1.1] brightness-[1.05]',
    techniques: ['Kinetic Typography', 'Pattern Interrupts', 'Speed Ramping']
  },
  {
    id: 'creator-efficiency-breakdown',
    title: 'Software Workflow Breakdown',
    category: 'Short Form',
    duration: '00:19',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Fast-paced timeline breakdown utilizing custom graphic callouts and hard sound hit syncing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/v1783997098/FILE_2_mc78dn.mp4', 
    cinematicFilter: 'saturate-[1.2] contrast-[1.15] brightness-[1.0]',
    techniques: ['Graphic Callouts', 'SFX Syncing', 'Defocus Transitions']
  },
  {
    id: 'lifestyle-brand-story',
    title: 'Aesthetic Brand Storytelling',
    category: 'Short Form',
    duration: '00:16',
    aspectRatio: '9:16 Vertical',
    fps: 23.976,
    description: 'Cinematic brand integration balancing premium color pacing with modern digital grit overlays.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/v1783997100/FILE_3_nhlwkf.mp4',
    cinematicFilter: 'saturate-[1.1] contrast-[1.2] brightness-[0.98] hue-rotate-[-2deg]',
    techniques: ['Glitch Textures', 'Atmospheric Pacing', 'Color Matching']
  },
  {
    id: 'micro-hook-retrospective',
    title: 'Viral Retention Architecture',
    category: 'Short Form',
    duration: '00:09',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Micro-retention structure utilizing immediate visual hooks and loop engineering to maximize replay rate.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/v1783997093/FILE_4_rfbxd1.mp4',
    cinematicFilter: 'saturate-[1.3] contrast-[1.1] brightness-[1.02]',
    techniques: ['Loop Engineering', 'Visual Hook Pacing', 'Micro-Zooming']
  },
  {
    id: 'motion-design-showcase',
    title: 'Visual Effects & Motion Layout',
    category: 'Motion Design',
    duration: '00:05',
    aspectRatio: '16:9 Widescreen',
    fps: 24.00,
    description: 'High-velocity visual edit driven entirely by custom motion design graphics and kinetic layout composition.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/v1783997072/FILE_5_li2r3u.mov',
    cinematicFilter: 'saturate-[1.15] contrast-[1.25] brightness-[1.0]',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding']
  }
];

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<VideoProject>(VIDEO_WORKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [colorGrade, setColorGrade] = useState<'raw' | 'cinematic'>('cinematic');

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [selectedVideo, isPlaying, isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTimecode = (seconds: number, fps: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * fps);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  const selectDeckVideo = (project: VideoProject) => {
    setSelectedVideo(project);
    setIsPlaying(false);
    setCurrentTime(0);
    const monitor = document.getElementById('hero-monitor-suite');
    if (monitor) monitor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setClientName('');
      setClientEmail('');
      setProjectBrief('');
      setFormSubmitted(false);
    }, 400);
  };

  return (
    <div className="bg-canvas text-text-primary font-sans selection:bg-accent-primary/30 selection:text-white min-h-screen relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Modern Minimalist Navigation Bar */}
      <nav id="main-navigation" className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-border-muted px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <a href="#works-section" className="text-text-secondary hover:text-text-primary transition-colors">SELECTED WORKS</a>
            <a href="#capabilities-section" className="text-text-secondary hover:text-text-primary transition-colors">CAPABILITIES</a>
            <a href="#contact-section" className="text-text-secondary hover:text-text-primary transition-colors">CONNECT</a>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden md:inline-block font-mono text-[10px] text-emerald-400 tracking-wider">AVAILABLE FOR PROJECTS</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-col gap-24 py-16">
        
        {/* SECTION 1: HERO & MAIN DECK DISPLAY */}
        <header id="hero-header" className="max-w-7xl mx-auto px-6 w-full text-center">
          <div className="space-y-6">
            <span className="font-mono text-xs text-text-secondary tracking-widest uppercase block">// VISUAL RETENTION ARCHITECTURE</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-light tracking-tight text-text-primary leading-none">
              Retaining attention.<br />
              <span className="bg-gradient-to-r from-text-primary via-text-secondary to-text-muted bg-clip-text text-transparent">Elevating scale.</span>
            </h1>
            <p className="text-xs md:text-sm text-text-secondary max-w-xl mx-auto font-mono uppercase tracking-wider">
              Glanced at, not read. My visual work speaks louder than my copy.
            </p>
          </div>

          {/* Cinematic Playback Deck Frame */}
          <div id="hero-monitor-suite" className="mt-16 bg-surface border border-border-muted rounded-sm overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative">
            
            {/* Monitor Metadata Header */}
            <div className="border-b border-border-muted bg-[#0F0F12] px-4 py-2.5 flex items-center justify-between font-mono text-[10px] text-text-secondary">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/40 inline-block"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500/40 inline-block"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/40 inline-block"></span>
                </div>
                <span className="hidden sm:inline-block tracking-widest text-text-muted">SOURCE: ACTIVE_MONITOR_DECK</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
                  {selectedVideo.title}
                </span>
                <span className="hidden sm:inline text-text-secondary">{selectedVideo.fps} FPS</span>
                <span className="bg-[#1A1A22] px-2 py-0.5 rounded text-text-primary tracking-widest">{selectedVideo.aspectRatio}</span>
              </div>
            </div>

{/* Dynamic Conditional Screen Panel: Handles 9:16 Split and 16:9 Widescreen Layouts */}
<div className={`grid bg-[#08080A] ${
  selectedVideo.aspectRatio.includes('16:9') ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-5'
}`}>
  
  {/* Left Side: Video Monitor Box (Adapts conditionally based on Aspect Ratio) */}
  <div className={`relative bg-black flex items-center justify-center group w-full ${
    selectedVideo.aspectRatio.includes('16:9') 
      ? 'aspect-video max-h-[600px] mx-auto' 
      : 'md:col-span-2 aspect-[9/16] max-h-[650px] mx-auto border-b md:border-b-0 md:border-r border-border-muted'
  }`}>
    <video
      ref={videoRef}
      src={selectedVideo.videoUrl}
      className={`w-full h-full object-cover transition-all duration-300 ${
        colorGrade === 'raw' ? 'saturate-[0.4] contrast-[0.9] brightness-[0.95]' : selectedVideo.cinematicFilter
      }`}
      loop
      playsInline
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onClick={() => setIsPlaying(!isPlaying)}
    />

    <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono text-[9px]">
      <span className="text-red-500 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>REC
      </span>
      <span>TC {formatTimecode(currentTime, selectedVideo.fps)}</span>
    </div>

    <AnimatePresence>
      {!isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={() => setIsPlaying(true)}
          className="absolute p-4 bg-white text-black hover:bg-neutral-200 transition-all rounded-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-20"
        >
          <Play className="w-5 h-5 fill-current text-black" />
        </motion.button>
      )}
    </AnimatePresence>

    <div className="absolute bottom-3 left-3 bg-[#050505]/95 backdrop-blur border border-border-muted px-2.5 py-1 rounded-sm font-mono text-[9px] text-text-primary">
      GRADE MODE: {colorGrade.toUpperCase()}
    </div>
  </div>

  {/* Right Side: Rendered ONLY if the video is vertical (9:16) */}
  {!selectedVideo.aspectRatio.includes('16:9') && (
    <div className="md:col-span-3 p-8 lg:p-12 flex flex-col justify-between text-left bg-[#0A0A0E]">
      <div className="space-y-8">
        <div>
          <span className="font-mono text-[10px] text-accent-primary tracking-widest uppercase block mb-2">
            // RETENTION CASE PARAMETERS
          </span>
          <h3 className="text-2xl lg:text-3xl font-display font-medium text-text-primary tracking-tight">
            Engineered for Replayability.
          </h3>
        </div>

        {/* Value Pillars */}
        <div className="space-y-6 font-sans">
          <div className="flex items-start gap-4">
            <div className="mt-1 font-mono text-xs text-text-muted">01/</div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">The 3-Second Rule Hook</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every edit is built with a heavy pattern-interrupt in the first 180 frames. Zero dead air means no swipe-aways.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 font-mono text-xs text-text-muted">02/</div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Syncopated Sound Design</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Audio drives 60% of vertical focus. I map custom field foley hits, low-end sub drops, and audio transitions right on clip jumps to keep brains hooked.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 font-mono text-xs text-text-muted">03/</div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Dynamic Type Mapping</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Subtitles aren't just text—they guide the viewer's focus. I sync custom tracking layouts with spoken cadence to minimize user cognitive load.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border-muted/50 pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-text-secondary">
          <div className="bg-surface p-3 border border-border-muted/30 rounded-sm">
            <span className="text-text-muted block uppercase mb-1">Target Platform</span>
            <span className="text-text-primary font-medium">TikTok / Reels / Shorts</span>
          </div>
          <div className="bg-surface p-3 border border-border-muted/30 rounded-sm">
            <span className="text-text-muted block uppercase mb-1">Pacing Focus</span>
            <span className="text-text-primary font-medium">Retention & Infinite Loop</span>
          </div>
        </div>
        
        <a 
          href="mailto:hello@studio-x.com"
          className="w-full bg-white hover:bg-neutral-200 text-black font-mono text-xs py-3 px-4 rounded-sm flex items-center justify-center gap-2 font-medium transition-all text-center"
        >
          Lock My Timeline Allocation
        </a>
      </div>
    </div>
  )}

</div>  

            {/* Dashboard Scrubber / Controls bar */}
            <div className="bg-[#0F0F12] border-t border-border-muted p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-canvas hover:bg-surface-hover border border-border-muted rounded-md text-text-primary transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current text-accent-primary" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-canvas hover:bg-surface-hover border border-border-muted rounded-md text-text-primary transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-accent-primary" />}
                </button>

                <div className="h-4 w-px bg-border-muted"></div>
                
                <button
                  onClick={() => setColorGrade(colorGrade === 'raw' ? 'cinematic' : 'raw')}
                  className={`px-2.5 py-1 text-[10px] font-mono border rounded-sm transition-all cursor-pointer ${
                    colorGrade === 'cinematic' ? 'bg-white text-black border-white' : 'bg-transparent text-text-secondary border-border-muted'
                  }`}
                >
                  TOGGLE LUT LAYER
                </button>
              </div>

              {/* Scrubber Line */}
              <div className="flex-1 w-full mx-4 flex items-center gap-3">
                <span className="font-mono text-[10px] text-text-muted">00:00</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.05"
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full h-1 bg-border-muted rounded-lg appearance-none cursor-ew-resize accent-accent-primary outline-none transition-all"
                />
                <span className="font-mono text-[10px] text-text-muted">
                  {duration ? `00:${Math.floor(duration)}` : '00:30'}
                </span>
              </div>

              <div className="font-mono text-xs text-text-primary bg-black border border-border-muted px-3 py-1 rounded tracking-widest">
                {formatTimecode(currentTime, selectedVideo.fps)}
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 2: WORKS BENTO GRID */}
        <section id="works-section" className="max-w-7xl mx-auto px-6 w-full scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-muted pb-6 mb-12">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-accent-primary tracking-widest uppercase block">// 01 // PROJECTS DECK</span>
              <h2 className="text-3xl font-display font-semibold tracking-tight text-text-primary">Selected Works</h2>
            </div>
            <p className="text-xs text-text-secondary font-mono max-w-sm mt-2 md:mt-0">
              Click on any index preview panel below to load the film directly into the master editing deck view.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIDEO_WORKS.map((work, index) => (
              <div 
                key={work.id}
                onClick={() => selectDeckVideo(work)}
                className={`group bg-surface border rounded-sm overflow-hidden cursor-pointer transition-all ${
                  index === 0 ? 'md:col-span-2 md:row-span-1' : ''
                } ${selectedVideo.id === work.id ? 'border-accent-primary ring-1 ring-accent-primary/50' : 'border-border-muted hover:border-border-active'}`}
              >
                <div className="aspect-video w-full bg-black relative overflow-hidden">
                  <video
                    src={work.videoUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 ${work.cinematicFilter}`}
                  />
                  <div className="absolute top-3 left-3 bg-[#050505]/90 border border-border-muted px-2 py-0.5 rounded-sm font-mono text-[8px]">
                    {index === 0 ? 'PREMIER ASSET' : `CUT INDEX_0${index + 1}`}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium text-text-primary group-hover:text-accent-primary transition-colors">{work.title}</h3>
                      <p className="text-[10px] text-text-secondary font-mono">{work.category}</p>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted">{work.duration}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {work.techniques.map((t, idx) => (
                      <span key={idx} className="bg-[#0C0C0C] text-[8px] font-mono px-2 py-0.5 rounded-sm text-text-secondary border border-border-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CAPABILITIES ACCORDION LIST */}
        <section id="capabilities-section" className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-muted pb-6 mb-12">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-accent-primary tracking-widest uppercase block">// 02 // LAB OPERATIONS</span>
              <h2 className="text-3xl font-display font-semibold tracking-tight text-text-primary">Creative Capabilities</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: '01', title: 'Cinematic Story & Pacing', desc: 'Custom dialogue timing and rhythmic sound structure. Optimized carefully to protect audience engagement loops.' },
              { num: '02', title: 'Premium Color Grading (LOG)', desc: 'Complete S-Log, REDCODE, and LOG-C tone corrections mapping targeted atmospheric and emotional moods.' },
              { num: '03', title: 'Sound Design Mechanics', desc: 'Multilayered field audio design, custom ambient sweeps, sound effect tracking, and dynamic range balance.' },
              { num: '04', title: 'Retention Optimization', desc: 'Micro-zoom frameworks, pattern interrupts, and seamless looping models built directly for modern digital pipelines.' }
            ].map((cap, i) => (
              <div key={i} className="bg-surface border border-border-muted rounded-sm p-6 hover:border-border-active transition-all flex items-start gap-4 text-left">
                <span className="font-mono text-xs text-text-primary bg-white/10 border border-border-muted px-2 py-0.5 rounded-sm">{cap.num}</span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-primary">{cap.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        

      </div>

      {/* FOOTER */}
      <footer id="contact-footer" className="border-t border-border-muted bg-[#050505] mt-24 py-12 text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-display font-light text-text-primary">Let's cut something iconic.</h2>
            <p className="text-xs text-text-secondary max-w-xs">Currently reserving specific timeline allocations for late-season project assignments.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 font-mono text-xs">
            <a href="mailto:hello@studio-x.com" className="text-text-primary hover:text-neutral-400 transition-colors flex items-center gap-1 text-base font-semibold">
              hello@studio-x.com <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex gap-6 text-text-muted text-[9px] border-t border-border-muted/30 pt-3 w-full justify-between md:w-auto">
              <span>© 2026 STUDIO—X</span>
              <span>GMT-7 PIPELINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}