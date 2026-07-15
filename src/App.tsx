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
    views: '1.2M',
    duration: '00:13',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Dynamic product promo engineered with kinetic subtitles, zero dead air, and hyper-pacing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_1_ilryuy.mp4',
    cinematicFilter: 'saturate-[1.25] contrast-[1.1] brightness-[1.05]',
    techniques: ['Kinetic Typography', 'Pattern Interrupts', 'Speed Ramping']
  },
  {
    id: 'creator-efficiency-breakdown',
    title: 'Software Workflow Breakdown',
    category: 'Short Form',
    views: '840K',
    duration: '00:19',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Fast-paced timeline breakdown utilizing custom graphic callouts and hard sound hit syncing.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997098/FILE_2_mc78dn.mp4', 
    cinematicFilter: 'saturate-[1.2] contrast-[1.15] brightness-[1.0]',
    techniques: ['Graphic Callouts', 'SFX Syncing', 'Defocus Transitions']
  },
  {
    id: 'lifestyle-brand-story',
    title: 'Aesthetic Brand Storytelling',
    category: 'Short Form',
    views: '2.1M',
    duration: '00:16',
    aspectRatio: '9:16 Vertical',
    fps: 23.976,
    description: 'Cinematic brand integration balancing premium color pacing with modern digital grit overlays.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997100/FILE_3_nhlwkf.mp4',
    cinematicFilter: 'saturate-[1.1] contrast-[1.2] brightness-[0.98] hue-rotate-[-2deg]',
    techniques: ['Glitch Textures', 'Atmospheric Pacing', 'Color Matching']
  },
  {
    id: 'micro-hook-retrospective',
    title: 'Viral Retention Architecture',
    category: 'Short Form',
    views: '3.4M',
    duration: '00:09',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'Micro-retention structure utilizing immediate visual hooks and loop engineering to maximize replay rate.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997093/FILE_4_rfbxd1.mp4',
    cinematicFilter: 'saturate-[1.3] contrast-[1.1] brightness-[1.02]',
    techniques: ['Loop Engineering', 'Visual Hook Pacing', 'Micro-Zooming']
  },
  {
    id: 'motion-design-showcase',
    title: 'Visual Effects & Motion Layout',
    category: 'Motion Design',
    views: '450K',
    duration: '00:05',
    aspectRatio: '16:9 Widescreen',
    fps: 24.00,
    description: 'High-velocity visual edit driven entirely by custom motion design graphics and kinetic layout composition.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1783997072/FILE_5_li2r3u.mov',
    cinematicFilter: 'saturate-[1.15] contrast-[1.25] brightness-[1.0]',
    techniques: ['Vector Animation', 'Keyframe Precision', 'Dynamic Branding']
  },
  {
    id: 'premium-commercial-edit',
    title: 'Dynamic Narrative Flow',
    category: 'Short Form',
    views: '920K',
    duration: '00:12',
    aspectRatio: '9:16 Vertical',
    fps: 60.00,
    description: 'High-impact short-form edit leveraging synchronized velocity curves, complex mask layering, and custom impact sound design.',
    videoUrl: 'https://res.cloudinary.com/na4u8vzm/video/upload/f_auto,q_auto/v1784134682/FILE_6_hooop9.mp4',
    cinematicFilter: 'saturate-[1.2] contrast-[1.1] brightness-[1.02]',
    techniques: ['Velocity Curves', 'Mask Layering', 'Impact SFX']
  }
];

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<VideoProject>(VIDEO_WORKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [colorGrade, setColorGrade] = useState<'raw' | 'cinematic'>('cinematic');

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

  return (
    <div className="bg-[#050507] text-neutral-100 font-sans selection:bg-white/20 min-h-screen relative overflow-x-hidden antialiased">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Navigation */}
      <nav id="main-navigation" className="sticky top-0 z-40 bg-[#050507]/80 backdrop-blur-md border-b border-neutral-800/60 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">STUDIO // KD</span>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-wider text-neutral-400">
            <a href="#works-section" className="hover:text-white transition-colors">SELECTED WORKS</a>
            <a href="#capabilities-section" className="hover:text-white transition-colors">CAPABILITIES</a>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400 tracking-wider uppercase">ONLINE</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-col gap-16 md:gap-28 py-10 md:py-20">
        
        {/* HERO SECTION */}
        <header id="hero-header" className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center">
          <div className="space-y-4 md:space-y-6">
            <span className="font-mono text-[10px] md:text-xs text-neutral-400 tracking-[0.2em] uppercase block font-medium">// VISUAL RETENTION ARCHITECTURE</span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9]">
              Retaining attention.<br />
              <span className="bg-gradient-to-r from-neutral-100 via-neutral-400 to-neutral-600 bg-clip-text text-transparent">Elevating scale.</span>
            </h1>
            
            <p className="text-[10px] md:text-xs text-neutral-400 max-w-md mx-auto font-mono uppercase tracking-widest border-t border-b border-neutral-800/80 py-2">
              Visual editing mechanics engineered for modern high-velocity retention.
            </p>
          </div>

          {/* Master Editing Monitor Unit */}
          <div id="hero-monitor-suite" className="mt-12 md:mt-16 bg-[#0B0B0E] border border-neutral-800/80 rounded-sm overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] relative">
            
            {/* Monitor Header Metadata Bar */}
            <div className="border-b border-neutral-800/80 bg-[#0F0F12] px-3 md:px-4 py-3 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-neutral-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span>
                </div>
                <span className="hidden sm:inline-block tracking-widest text-neutral-500">MONITOR // LIVE_FEED</span>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-white flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 animate-pulse"></span>
                  {selectedVideo.title}
                </span>
                <span className="text-neutral-500">{selectedVideo.fps} FPS</span>
                <span className="bg-[#18181C] px-1.5 py-0.5 rounded text-white text-[8px] md:text-[9px] tracking-wider font-bold">{selectedVideo.aspectRatio}</span>
              </div>
            </div>

            {/* RESPONSIVE LAYOUT MATRIX */}
            <div className={`flex flex-col ${
              selectedVideo.aspectRatio.includes('16:9') ? 'w-full' : 'lg:grid lg:grid-cols-5'
            } bg-[#070709]`}>
              
              {/* VIDEO VIEWER WINDOW */}
              <div className={`relative bg-black flex items-center justify-center group w-full ${
                selectedVideo.aspectRatio.includes('16:9') 
                  ? 'aspect-video max-h-[550px] mx-auto' 
                  : 'lg:col-span-2 aspect-[9/16] max-h-[70vh] lg:max-h-[680px] mx-auto border-b lg:border-b-0 lg:border-r border-neutral-800/80'
              }`}>
                <video
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    colorGrade === 'raw' ? 'saturate-[0.4] contrast-[0.9] brightness-[0.95]' : selectedVideo.cinematicFilter
                  }`}
                  loop
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={() => setIsPlaying(!isPlaying)}
                />

                <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono text-[9px] text-neutral-300">
                  <span className="text-red-500 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>LIVE
                  </span>
                  <span>TC {formatTimecode(currentTime, selectedVideo.fps)}</span>
                </div>

                <AnimatePresence>
                  {!isPlaying && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setIsPlaying(true)}
                      className="absolute p-4 bg-white text-black hover:scale-105 transition-all rounded-full cursor-pointer shadow-2xl z-20"
                    >
                      <Play className="w-5 h-5 fill-current text-black" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur border border-neutral-800/60 px-2 py-0.5 rounded-sm font-mono text-[8px] text-neutral-300 tracking-wider">
                  LUT: {colorGrade.toUpperCase()}
                </div>
              </div>

              {/* DYNAMIC SIDEBAR CONTEXT PANEL */}
              {!selectedVideo.aspectRatio.includes('16:9') && (
                <div className="lg:col-span-3 p-6 md:p-10 lg:p-12 flex flex-col justify-start text-left bg-[#0A0A0E]">
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <span className="font-mono text-[10px] text-neutral-400 tracking-[0.25em] uppercase block mb-1 font-bold">
                        // CORE PRODUCTION METRICS
                      </span>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase font-display">
                        {selectedVideo.title}
                      </h3>
                    </div>

                    <div className="border-t border-b border-neutral-800/50 py-4 font-mono">
                      <div>
                        <span className="text-neutral-500 text-[9px] block uppercase font-medium">Retention Focus</span>
                        <span className="text-white text-xs font-bold tracking-wide">{selectedVideo.category}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="font-mono text-[10px] text-neutral-400 tracking-wider block uppercase font-bold">// CONTEXT SYNOPSIS</span>
                      <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans font-light">
                        {selectedVideo.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="font-mono text-[10px] text-neutral-400 tracking-wider block uppercase font-bold">// TIMELINE TECHNIQUES APPLIED</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedVideo.techniques.map((tech, idx) => (
                          <span key={idx} className="bg-[#121217] text-white text-[9px] font-mono px-2.5 py-1 rounded-sm border border-neutral-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div> 

            {/* Dashboard Control Deck Media Strip */}
            <div className="bg-[#0F0F12] border-t border-neutral-800/80 p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-[#050507] hover:bg-neutral-800 border border-neutral-800 rounded-md text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current text-neutral-300" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-[#050507] hover:bg-neutral-800 border border-neutral-800 rounded-md text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
                
                <button
                  onClick={() => setColorGrade(colorGrade === 'raw' ? 'cinematic' : 'raw')}
                  className={`px-2 py-1 text-[9px] font-mono border rounded-sm transition-all cursor-pointer font-bold uppercase tracking-wider ${
                    colorGrade === 'cinematic' ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-800'
                  }`}
                >
                  LUT SWITCH
                </button>
              </div>

              {/* Media Timeline Scrubber Bar */}
              <div className="flex-1 w-full flex items-center gap-2 font-mono text-[9px] text-neutral-500">
                <span>00:00</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.02"
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-ew-resize accent-white outline-none"
                />
                <span>
                  {duration ? `00:${Math.floor(duration).toString().padStart(2, '0')}` : '00:30'}
                </span>
              </div>

              <div className="font-mono text-[10px] md:text-xs text-white bg-black border border-neutral-800/80 px-2.5 py-1 rounded tracking-widest font-bold w-full sm:w-auto text-center">
                {formatTimecode(currentTime, selectedVideo.fps)}
              </div>
            </div>
          </div>
        </header>

        {/* WORKS BENTO GRID SECTION */}
        <section id="works-section" className="max-w-7xl mx-auto px-4 md:px-6 w-full scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 mb-8">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// INDEX DECK CONTROLLER</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-display">Selected Works</h2>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono max-w-xs mt-2 md:mt-0 text-left md:text-right">
              Select an asset interface target below to run pipeline stream updates inside the playback deck frame.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {VIDEO_WORKS.map((work, index) => {
              const isWidescreen = work.aspectRatio.includes('16:9');
              
              return (
                <div 
                  key={work.id}
                  onClick={() => selectDeckVideo(work)}
                  className={`group bg-[#0B0B0E] border rounded-sm overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full ${
                    selectedVideo.id === work.id ? 'border-neutral-200 ring-1 ring-white/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* ADAPTIVE THUMBNAIL CONTAINER */}
                  <div className={`w-full bg-black relative overflow-hidden shrink-0 ${
                    isWidescreen ? 'aspect-video' : 'aspect-[9/16]'
                  }`}>
                    <video
                      src={work.videoUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 ${work.cinematicFilter}`}
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/90 border border-neutral-800 px-2 py-0.5 rounded-sm font-mono text-[8px] tracking-wider text-neutral-300">
                      INDEX // _0{index + 1}
                    </div>
                  </div>
                  
                  {/* TEXT DETAILS CONTROLLER */}
                  <div className="p-4 flex flex-col flex-grow justify-between text-left border-t border-neutral-800/40 bg-[#0B0B0E]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-xs md:text-sm font-bold text-white tracking-wide group-hover:text-neutral-300 transition-colors uppercase font-sans leading-tight">
                          {work.title}
                        </h3>
                        <span className="font-mono text-[9px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded-sm font-bold shrink-0">
                          {work.duration}
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">{work.category}</p>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {work.techniques.map((tech, idx) => (
                        <span key={idx} className="bg-black text-[8px] font-mono px-2 py-0.5 rounded-sm text-neutral-400 border border-neutral-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section id="capabilities-section" className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="border-b border-neutral-800 pb-4 mb-8 text-left">
            <span className="font-mono text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// TECHNICAL OPERATIONS WORKFLOW</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-display">Creative Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              { num: '01', title: 'Cinematic Story & Pacing', desc: 'Custom dialogue timing and rhythmic sound structure. Optimized carefully to protect audience engagement loops.' },
              { num: '02', title: 'Premium Color Grading (LOG)', desc: 'Complete S-Log, REDCODE, and LOG-C tone corrections mapping targeted atmospheric and emotional moods.' },
              { num: '03', title: 'Sound Design Mechanics', desc: 'Multilayered field audio design, custom ambient sweeps, sound effect tracking, and dynamic range balance.' },
              { num: '04', title: 'Retention Optimization', desc: 'Micro-zoom frameworks, pattern interrupts, and seamless looping models built directly for modern digital pipelines.' }
            ].map((cap, i) => (
              <div key={i} className="bg-[#0B0B0E] border border-neutral-800 rounded-sm p-5 md:p-6 flex items-start gap-4 text-left">
                <span className="font-mono text-[10px] text-white bg-white/5 border border-neutral-800 px-2 py-0.5 rounded-sm font-bold">{cap.num}</span>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wide font-sans">{cap.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer id="contact-footer" className="border-t border-neutral-800 bg-black/40 py-10 md:py-14 text-left px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white uppercase font-display">Let's cut something iconic.</h2>
            <p className="text-xs text-neutral-400 font-mono tracking-wide">// PIPELINE CAPACITY RESERVED FOR PREMIUM ALLOCATIONS</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 font-mono text-[10px] md:text-xs text-neutral-400 w-full md:w-auto border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0">
            <a href="mailto:hello@studio-x.com" className="text-white hover:text-neutral-300 transition-colors flex items-center gap-1 text-sm md:text-base font-bold uppercase tracking-wider">
              hello@studio-x.com <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex gap-6 text-neutral-600 text-[9px] w-full justify-between md:justify-end">
              <span>© 2026 STUDIO—KD</span>
              <span>GLOBAL PIPELINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}