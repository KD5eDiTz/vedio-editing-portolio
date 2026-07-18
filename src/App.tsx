import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
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

  // Track dynamic centers for scroll wheel transformation physics
  const [activeScrollIndex, setActiveScrollIndex] = useState<number>(0);
  const leftScrollContainerRef = useRef<HTMLDivElement | null>(null);
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

  // Handle high-performance smooth wheel positioning updates
  const handleTileContainerScroll = () => {
    if (!leftScrollContainerRef.current) return;
    const container = leftScrollContainerRef.current;
    const containerCenter = container.scrollTop + container.clientHeight / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetTop + htmlChild.clientHeight / 2;
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveScrollIndex(closestIndex);
  };

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
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const selectDeckVideo = (project: VideoProject, idx: number) => {
    setSelectedVideo(project);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Automatically center clicked item in hidden scroll wheel layout
    if (leftScrollContainerRef.current) {
      const targetElement = leftScrollContainerRef.current.children[idx] as HTMLElement;
      if (targetElement) {
        leftScrollContainerRef.current.scrollTo({
          top: targetElement.offsetTop - leftScrollContainerRef.current.clientHeight / 2 + targetElement.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="bg-[#EAEAEA] text-[#1E1E24] font-sans selection:bg-black/10 min-h-screen relative overflow-hidden antialiased flex flex-col">
      
      {/* Premium Minimal Navigation Banner */}
      <nav className="w-full bg-[#F4F4F4]/80 backdrop-blur-md border-b border-neutral-300 px-6 py-4 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs font-black tracking-widest uppercase text-neutral-800">STUDIO // KD</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" />
            <span className="font-mono text-[10px] text-neutral-600 tracking-wider uppercase font-bold">READY TO CUT</span>
          </div>
        </div>
      </nav>

      {/* 3-COLUMN MASTER split WORKSTATION WINDOW DESIGN MATRIX */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch overflow-hidden">
        
        {/* COLUMN 1: LEFT SIDE - PREMIUM HIDDEN SCROLL WHEEL GRID (DESKTOP INTERACTIVE) */}
        <div className="w-full lg:w-[32%] px-4 py-6 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300 flex flex-col order-3 lg:order-1">
          <div className="mb-4 shrink-0 px-2">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block font-bold">// TAPE DECK CONTROLLER</span>
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Selected Works</h2>
          </div>

          {/* Scrolling Chamber: Custom hidden scrollbar wrapper tracking scroll animations */}
          <div 
            ref={leftScrollContainerRef}
            onScroll={handleTileContainerScroll}
            className="flex-1 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-32 pt-4 px-2 snap-x lg:snap-y snap-mandatory select-none scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VIDEO_WORKS.map((work, idx) => {
              const isCenter = idx === activeScrollIndex;
              const isWidescreen = work.aspectRatio.includes('16:9');
              
              return (
                <div
                  key={work.id}
                  onClick={() => selectDeckVideo(work, idx)}
                  className="snap-center shrink-0 w-[180px] sm:w-[220px] lg:w-full cursor-pointer transition-all duration-500 transform-gpu"
                  style={{
                    // Dynamic scaling physics: Center scales large, outer tiers shrink smoothly on desktop
                    transform: `scale(${isCenter ? 1.03 : 0.94})`,
                    opacity: isCenter ? 1 : 0.65
                  }}
                >
                  <div className={`bg-[#F4F4F4] border rounded-md overflow-hidden transition-all duration-300 flex flex-col ${
                    selectedVideo.id === work.id 
                      ? 'border-neutral-900 shadow-2xl shadow-black/30' 
                      : 'border-neutral-300 shadow-lg shadow-black/5 hover:border-neutral-400'
                  }`}>
                    {/* Portrait Adaptive Preview Windows */}
                    <div className={`w-full bg-neutral-900 relative overflow-hidden shrink-0 ${
                      isWidescreen ? 'aspect-video' : 'aspect-[9/16]'
                    }`}>
                      <video
                        src={work.videoUrl}
                        muted
                        loop
                        playsInline
                        autoPlay
                        className={`w-full h-full object-cover opacity-80 ${work.cinematicFilter}`}
                      />
                      <div className="absolute top-2 left-2 bg-white/90 border border-neutral-300 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider text-neutral-800 font-bold">
                        _0{idx + 1}
                      </div>
                    </div>
                    
                    <div className="p-3 text-left bg-[#F4F4F4]">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wide leading-tight line-clamp-1">
                          {work.title}
                        </h3>
                        <span className="font-mono text-[8px] text-neutral-500 shrink-0 font-bold">
                          {work.duration}
                        </span>
                      </div>
                      <p className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase mt-0.5">{work.category}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: MIDDLE - THE PREMIUM DEDICATED MAIN VIDEO VIEWER & CONTEXT PANEL */}
        <div className="flex-1 px-4 lg:px-8 py-6 lg:py-12 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-neutral-300 order-2 overflow-y-auto">
          <div className="mb-4 shrink-0">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block font-bold">// BROADCAST MONITOR</span>
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Main Monitor Feed</h2>
          </div>

          {/* Premium Video Monitor Frame */}
          <div className="w-full bg-[#FAFAFA] border border-neutral-300 rounded-md shadow-2xl shadow-black/15 overflow-hidden flex flex-col relative shrink-0">
            <div className="border-b border-neutral-300 bg-[#F4F4F4] px-4 py-2.5 flex items-center justify-between font-mono text-[9px] text-neutral-500 font-bold">
              <span className="text-neutral-800 flex items-center gap-1.5 uppercase font-black">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 animate-pulse" />
                {selectedVideo.title}
              </span>
              <span className="tracking-widest uppercase">{selectedVideo.aspectRatio}</span>
            </div>

            {/* Main Player Bounding Box */}
            <div className="relative bg-neutral-900 flex items-center justify-center group aspect-[9/16] lg:aspect-video max-h-[60vh] lg:max-h-[500px] w-full mx-auto">
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className={`w-full h-full object-contain ${
                  colorGrade === 'raw' ? 'saturate-[0.4] contrast-[0.9] brightness-[0.95]' : selectedVideo.cinematicFilter
                }`}
                loop
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={() => setIsPlaying(!isPlaying)}
              />

              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute p-4 bg-white text-black hover:scale-105 transition-all rounded-full cursor-pointer shadow-2xl z-20"
                  >
                    <Play className="w-4 h-4 fill-current text-black" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur border border-neutral-300 px-2 py-0.5 rounded-sm font-mono text-[8px] text-neutral-800 tracking-wider font-bold">
                LUT: {colorGrade.toUpperCase()}
              </div>
            </div>

            {/* Custom Control Deck Media Bar */}
            <div className="bg-[#F4F4F4] border-t border-neutral-300 p-3 flex items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-neutral-800 cursor-pointer shadow-sm transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-neutral-800 cursor-pointer shadow-sm transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-500" /> : <Volume2 className="w-3.5 h-3.5 text-neutral-900" />}
                </button>
                <button
                  onClick={() => setColorGrade(colorGrade === 'raw' ? 'cinematic' : 'raw')}
                  className={`px-2.5 py-1 text-[8px] border rounded transition-all cursor-pointer font-black uppercase tracking-wider shadow-sm ${
                    colorGrade === 'cinematic' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-300'
                  }`}
                >
                  LUT SWITCH
                </button>
              </div>

              {/* Media Timeline Timeline Bar */}
              <div className="flex-1 hidden sm:flex items-center gap-2 text-[9px] text-neutral-400">
                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.02"
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full h-1 bg-neutral-300 rounded-lg appearance-none cursor-ew-resize accent-neutral-800 outline-none"
                />
              </div>

              <div className="text-[10px] text-neutral-800 bg-white border border-neutral-300 px-2 py-0.5 rounded tracking-widest font-bold shadow-sm">
                {formatTimecode(currentTime, selectedVideo.fps)}
              </div>
            </div>
          </div>

          {/* DYNAMIC METADATA ABOUT FIELD */}
          <div className="mt-8 text-left space-y-6">
            <div className="border-b border-neutral-300 pb-3">
              <span className="font-mono text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// CONTEXT SYNOPSIS</span>
              <h3 className="text-xl font-black text-neutral-900 uppercase font-display tracking-tight mt-0.5">{selectedVideo.title}</h3>
            </div>

            <div className="bg-[#F4F4F4] border border-neutral-300 rounded p-4 font-mono text-xs text-neutral-700 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-900">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-500">Retention Focus:</span>
                <span className="font-bold">{selectedVideo.category}</span>
              </div>
              <p className="font-sans font-light leading-relaxed border-t border-neutral-300/60 pt-2 text-neutral-800">
                {selectedVideo.description}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[9px] text-neutral-400 tracking-wider block uppercase font-bold">// PRODUCTION STRATEGY BADGES</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVideo.techniques.map((tech, idx) => (
                  <span key={idx} className="bg-white text-neutral-800 text-[9px] font-mono px-2.5 py-1 rounded-sm border border-neutral-300 font-bold shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT SIDE - PERSONAL RESUME BIOGRAPHY PANEL */}
        <div className="w-full lg:w-[28%] px-6 py-6 lg:py-12 bg-[#F4F4F4] lg:border-l border-neutral-300 flex flex-col justify-start text-left order-1 lg:order-3 shrink-0 overflow-y-auto">
          <div className="space-y-8">
            {/* Minimalist Grid Placeholder for Photo Frame */}
            <div className="w-32 h-32 rounded-md bg-[#EAEAEA] border border-neutral-300 flex items-center justify-center relative overflow-hidden shadow-lg shadow-black/5 group">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
              <span className="font-mono text-[10px] text-neutral-400 font-black tracking-widest uppercase relative z-10">MY PHOTO</span>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[10px] text-neutral-400 tracking-[0.25em] uppercase block font-bold">// EXECUTIVE ALLOCATION</span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-neutral-950 uppercase leading-none">
                Hi. I am <br />
                <span className="text-neutral-600">Video Editor</span>
              </h1>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed font-light">
                Specialized in visual architecture, high-velocity sequence flow pacing, color LUT mapping, and advanced multi-channel sound design dynamics.
              </p>
            </div>

            <div className="border-t border-neutral-300 pt-6 space-y-4 font-mono text-[10px]">
              <span className="text-neutral-400 tracking-wider block uppercase font-bold">// PIPELINE STATUS</span>
              <div className="space-y-2.5 text-neutral-700">
                <div className="flex justify-between border-b border-neutral-300/60 pb-1.5">
                  <span className="uppercase font-bold text-neutral-500">OPERATIONS:</span>
                  <span className="text-neutral-900 font-bold">FREELANCE / CONTRACT</span>
                </div>
                <div className="flex justify-between border-b border-neutral-300/60 pb-1.5">
                  <span className="uppercase font-bold text-neutral-500">LOCATION:</span>
                  <span className="text-neutral-900 font-bold">GLOBAL INGESTION</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="mailto:hello@studio-x.com"
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-[10px] tracking-widest py-3 px-4 rounded-md flex items-center justify-center gap-2 font-black transition-all text-center uppercase shadow-md shadow-black/10 cursor-pointer"
              >
                Initiate Timeline Request <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}