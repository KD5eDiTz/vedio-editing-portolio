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

  const [activeScrollIndex, setActiveScrollIndex] = useState<number>(0);
  const horizontalScrollRef = useRef<HTMLDivElement | null>(null);
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

  // HIGH PERFORMANCE HOVER SCROLLING LOGIC
  useEffect(() => {
    const el = horizontalScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      
      el.scrollTo({
        left: el.scrollLeft + e.deltaY * 2.5,
        behavior: 'auto' // Instant pixel response on wheel track
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleHorizontalScroll = () => {
    if (!horizontalScrollRef.current) return;
    const container = horizontalScrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + htmlChild.clientWidth / 2;
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
    
    if (horizontalScrollRef.current) {
      const targetElement = horizontalScrollRef.current.children[idx] as HTMLElement;
      if (targetElement) {
        horizontalScrollRef.current.scrollTo({
          left: targetElement.offsetLeft - horizontalScrollRef.current.clientWidth / 2 + targetElement.clientWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="bg-[#EAEAEA] text-[#1E1E24] font-inter selection:bg-black/10 min-h-screen antialiased flex flex-col overflow-x-hidden">
      
      {/* Top Branding Bar */}
      <nav className="w-full bg-[#F4F4F4]/60 backdrop-blur-md border-b border-neutral-300/80 px-6 py-4 z-50 shrink-0">
        <div className="max-w-[98vw] mx-auto flex items-center justify-between">
          <span className="font-futura text-xs font-black tracking-widest uppercase text-neutral-800">STUDIO // KD</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-futura text-[10px] text-blue-600 tracking-wider uppercase font-bold">LIVE ENVIRONMENT</span>
          </div>
        </div>
      </nav>

      {/* EXPANDED FULL SCREEN VIEWPORT CONTAINER */}
      <main className="flex-1 w-full max-w-[96vw] mx-auto px-2 md:px-4 py-6 md:py-8 space-y-10 md:space-y-14">
        
        {/* SECTION 1: PRO INTRO BANNER BOX */}
        <section className="bg-[#F4F4F4] border border-neutral-300/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="w-28 h-28 rounded-xl bg-[#EAEAEA] border border-neutral-300 flex items-center justify-center relative overflow-hidden shrink-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px]" />
            <span className="font-futura text-[9px] text-neutral-400 font-black tracking-widest uppercase relative z-10">MY PHOTO</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="font-futura text-[9px] text-neutral-400 tracking-[0.25em] uppercase block font-bold">// WORKSTATION INGESTION</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-neutral-950 uppercase leading-none">
              Hi. I am <br />
              <span className="inline-block text-blue-600 border-r-2 border-blue-600 animate-[typing_3.5s_steps(30)_infinite,blink_0.75s_step-end_infinite] overflow-hidden whitespace-nowrap pr-1 max-w-fit font-inter">
                Video Editor
              </span>
            </h1>
          </div>
        </section>

        {/* SECTION 2: WORKSPACE MONITORS ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          
          {/* Main Monitor Container */}
          <div className="lg:col-span-3 bg-[#FAFAFA] border border-neutral-300/80 rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-[0_35px_80px_-15px_rgba(0,0,0,0.22)]">
            <div className="border-b border-neutral-300 bg-[#F4F4F4] px-4 py-2.5 flex items-center justify-between font-futura text-[9px] text-neutral-500 font-bold">
              <span className="text-neutral-800 flex items-center gap-1.5 uppercase font-black">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                {selectedVideo.title}
              </span>
              <span className="tracking-widest uppercase text-neutral-400">{selectedVideo.aspectRatio}</span>
            </div>

            <div className="relative bg-neutral-950 flex items-center justify-center group aspect-[9/16] md:aspect-video max-h-[60vh] lg:max-h-[520px] w-full mx-auto flex-grow">
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

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur border border-neutral-300 px-2 py-0.5 rounded-sm font-futura text-[8px] text-neutral-800 tracking-wider font-bold">
                LUT: {colorGrade.toUpperCase()}
              </div>
            </div>

            {/* Media Controller Strips */}
            <div className="bg-[#F4F4F4] border-t border-neutral-300 p-3 flex items-center justify-between gap-4 font-futura shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md text-neutral-800 cursor-pointer shadow-sm transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md text-neutral-800 cursor-pointer shadow-sm transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-500" /> : <Volume2 className="w-3.5 h-3.5 text-neutral-900" />}
                </button>
                <button
                  onClick={() => setColorGrade(colorGrade === 'raw' ? 'cinematic' : 'raw')}
                  className={`px-2.5 py-1 text-[8px] border rounded-md transition-all cursor-pointer font-black uppercase tracking-wider shadow-sm ${
                    colorGrade === 'cinematic' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-300'
                  }`}
                >
                  LUT SWITCH
                </button>
              </div>

              <div className="flex-1 hidden sm:flex items-center gap-2">
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

              <div className="text-[10px] text-neutral-800 bg-white border border-neutral-300 px-2 py-0.5 rounded-md tracking-widest font-bold shadow-sm">
                {formatTimecode(currentTime, selectedVideo.fps)}
              </div>
            </div>
          </div>

          {/* About Column Container */}
          <div className="lg:col-span-2 space-y-5 bg-[#F4F4F4] border border-neutral-300/60 p-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.12)]">
            <div className="space-y-5">
              <div className="border-b border-neutral-300 pb-2">
                <span className="font-futura text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// ABOUT THE VIDEO</span>
                <h3 className="text-2xl font-black text-blue-900 uppercase font-playfair tracking-tight mt-1">
                  {selectedVideo.title}
                </h3>
              </div>

              <div className="font-inter text-xs text-neutral-700 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-futura font-bold uppercase tracking-wider text-[9px] text-neutral-400">Pacing Class:</span>
                  <span className="text-neutral-800 font-bold font-inter">{selectedVideo.category}</span>
                </div>
                <p className="font-inter font-light border-t border-neutral-300/50 pt-2.5 text-neutral-800 leading-relaxed text-sm">
                  {selectedVideo.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-300/60">
              <span className="font-futura text-[9px] text-neutral-400 tracking-wider block uppercase font-bold">// PIPELINE TAGGED PARAMETERS</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVideo.techniques.map((tech, idx) => (
                  <span key={idx} className="bg-white text-neutral-800 text-[9px] font-futura px-2.5 py-1 rounded-md border border-neutral-300 font-bold shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: RE-ENGINEERED HORIZONTAL SEQUENCER TIMELINE */}
        <section className="space-y-4">
          <div className="px-1 flex items-center justify-between">
            <div className="space-y-0.5 text-left">
              <span className="font-futura text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// HORIZONTAL OVERVIEW SEQUENCER</span>
              <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight font-playfair">Selected Works</h2>
            </div>
            <span className="hidden sm:inline-block font-futura text-[9px] text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-bold animate-pulse">
              HOVER MOUSE HERE & USE WHEEL TO SCROLL
            </span>
          </div>

          <div 
            ref={horizontalScrollRef}
            onScroll={handleHorizontalScroll}
            className="w-full flex items-center gap-6 overflow-x-auto pb-14 pt-8 px-[38%] sm:px-[44%] snap-x snap-mandatory select-none scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VIDEO_WORKS.map((work, idx) => {
              const isCenter = idx === activeScrollIndex;
              const isWidescreen = work.aspectRatio.includes('16:9');
              
              return (
                <div
                  key={work.id}
                  onClick={() => selectDeckVideo(work, idx)}
                  className="snap-center shrink-0 w-[145px] sm:w-[180px] transition-all duration-500 transform-gpu"
                  style={{
                    transform: `scale(${isCenter ? 1.16 : 0.86})`,
                    opacity: isCenter ? 1 : 0.45
                  }}
                >
                  {/* MULTI LAYERED CAST SHADOW FOR AUTHENTIC FLOAT EFFECT */}
                  <div className={`bg-[#F4F4F4] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col border ${
                    selectedVideo.id === work.id 
                      ? 'border-neutral-900 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.28),0_15px_30px_-15px_rgba(0,0,0,0.22)]' 
                      : 'border-neutral-300 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.06)] hover:border-neutral-400 hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.1)]'
                  }`}>
                    
                    <div className={`w-full bg-neutral-950 relative overflow-hidden shrink-0 ${
                      isWidescreen ? 'aspect-video' : 'aspect-[9/16]'
                    }`}>
                      <video
                        src={work.videoUrl}
                        muted
                        loop
                        playsInline
                        autoPlay
                        onTimeUpdate={(e) => {
                          const vid = e.currentTarget;
                          if (vid.currentTime >= 5) {
                            vid.currentTime = 0;
                          }
                        }}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-white/95 border border-neutral-300 px-1.5 py-0.5 rounded-md text-[8px] font-futura tracking-wider text-neutral-800 font-bold shadow-sm">
                        _0{idx + 1}
                      </div>
                    </div>
                    
                    <div className="p-3 text-left bg-[#F4F4F4]">
                      <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wide truncate font-playfair">
                        {work.title}
                      </h3>
                      <div className="flex justify-between items-center mt-1 font-futura text-[8px] text-neutral-400 font-bold">
                        <span className="uppercase tracking-widest text-blue-600">{work.category}</span>
                        <span>{work.duration}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact-footer" className="border-t border-neutral-300 bg-[#F4F4F4] py-8 text-left px-6 shrink-0 mt-auto">
        <div className="max-w-[98vw] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black tracking-tight text-neutral-950 uppercase font-playfair">Let's cut something iconic.</h2>
            <p className="text-[9px] text-neutral-400 font-futura tracking-wide uppercase font-bold">// ALLOCATION SLOTS RESERVED FOR WORLDWIDE COLLABORATIONS</p>
          </div>
          <div className="font-futura text-[10px] text-neutral-500 flex items-center gap-6 w-full md:w-auto justify-between border-t border-neutral-300/50 md:border-t-0 pt-4 md:pt-0 font-bold">
            <a href="mailto:hello@studio-x.com" className="text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-1 font-black uppercase tracking-widest text-xs font-futura">
              hello@studio-x.com <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[9px] text-neutral-400 font-futura">© 2026 STUDIO—KD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}