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
      
      {/* Top Branding Navigation */}
      <nav className="w-full bg-[#F4F4F4]/60 backdrop-blur-md border-b border-neutral-300/80 px-6 py-4 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-futura text-xs font-black tracking-widest uppercase text-neutral-800">STUDIO // KD</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-futura text-[10px] text-blue-600 tracking-wider uppercase font-bold">LIVE ENVIRONMENT</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8 md:space-y-12">
        
        {/* SECTION 1: TOP PROFILE INTRO WITH TYPE ANIMATION & STYLED TEXT */}
        <section className="bg-[#F4F4F4] border border-neutral-300/70 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.06)]">
          <div className="w-28 h-28 rounded-xl bg-[#EAEAEA] border border-neutral-300 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:8px_8px]" />
            <span className="font-futura text-[9px] text-neutral-400 font-black tracking-widest uppercase relative z-10">MY PHOTO</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="font-futura text-[9px] text-neutral-400 tracking-[0.25em] uppercase block font-bold">// WORKSTATION INGESTION</span>
            {/* INTER / BLUE COLOR TYPING COMBINATION */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-neutral-950 uppercase leading-none">
              Hi. I am <br />
              <span className="inline-block text-blue-600 border-r-2 border-blue-600 animate-[typing_3.5s_steps(30)_infinite,blink_0.75s_step-end_infinite] overflow-hidden whitespace-nowrap pr-1 max-w-fit font-inter">
                Video Editor
              </span>
            </h1>
          </div>
        </section>

        <hr className="border-neutral-300/80" />

        {/* SECTION 2: MIDDLE REEL DISPLAY STATION */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Main Video Screen Container */}
          <div className="lg:col-span-3 bg-[#FAFAFA] border border-neutral-300/80 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">
            <div className="border-b border-neutral-300 bg-[#F4F4F4] px-4 py-2.5 flex items-center justify-between font-futura text-[9px] text-neutral-500 font-bold">
              <span className="text-neutral-800 flex items-center gap-1.5 uppercase font-black">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                {selectedVideo.title}
              </span>
              <span className="tracking-widest uppercase text-neutral-400">{selectedVideo.aspectRatio}</span>
            </div>

            <div className="relative bg-neutral-950 flex items-center justify-center group aspect-[9/16] md:aspect-video max-h-[55vh] lg:max-h-[465px] w-full mx-auto">
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

            {/* Deck Bar Strip Controls */}
            <div className="bg-[#F4F4F4] border-t border-neutral-300 p-3 flex items-center justify-between gap-4 font-futura">
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

              <div className="text-[10px] text-neutral-800 bg-white border border-neutral-300 px-2 py-0.5 rounded tracking-widest font-bold shadow-sm">
                {formatTimecode(currentTime, selectedVideo.fps)}
              </div>
            </div>
          </div>

          {/* Dynamic Details Frame Right to Video Viewer */}
          <div className="lg:col-span-2 space-y-5 bg-[#F4F4F4] border border-neutral-300/70 p-6 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-neutral-300 pb-2">
                <span className="font-futura text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// RECORD INDEX LOG</span>
                {/* PLAYFAIR DISPLAY SERIF INTEGRATION */}
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
                  <span key={idx} className="bg-white text-neutral-800 text-[9px] font-futura px-2.5 py-1 rounded border border-neutral-300 font-bold shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-neutral-300/80" />

        {/* SECTION 3: BOTTOM HORIZONTAL WAVE PREVIEW DECK */}
        <section className="space-y-4">
          <div className="px-1 flex items-center justify-between">
            <div className="space-y-0.5 text-left">
              <span className="font-futura text-[9px] text-neutral-400 tracking-[0.2em] uppercase block font-bold">// HORIZONTAL SEQUENCER</span>
              <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight font-playfair">Selected Works</h2>
            </div>
            <span className="hidden sm:inline-block font-futura text-[9px] text-neutral-500 uppercase tracking-widest bg-neutral-300/40 border border-neutral-300 px-2 py-0.5 rounded font-bold">
              SCROLL THROUGH DECK TAPE
            </span>
          </div>

          <div 
            ref={horizontalScrollRef}
            onScroll={handleHorizontalScroll}
            className="w-full flex items-center gap-5 overflow-x-auto pb-12 pt-8 px-[35%] sm:px-[42%] snap-x snap-mandatory select-none scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {VIDEO_WORKS.map((work, idx) => {
              const isCenter = idx === activeScrollIndex;
              const isWidescreen = work.aspectRatio.includes('16:9');
              
              return (
                <div
                  key={work.id}
                  onClick={() => selectDeckVideo(work, idx)}
                  className="snap-center shrink-0 w-[140px] sm:w-[170px] transition-all duration-500 transform-gpu"
                  style={{
                    transform: `scale(${isCenter ? 1.15 : 0.88})`,
                    opacity: isCenter ? 1 : 0.55
                  }}
                >
                  {/* ROUNDED-XL / DROP-SHADOW ADJUSTMENT PATCH */}
                  <div className={`bg-[#F4F4F4] rounded-xl overflow-hidden transition-all duration-300 flex flex-col border ${
                    selectedVideo.id === work.id 
                      ? 'border-neutral-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]' 
                      : 'border-neutral-300 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] hover:border-neutral-400'
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
                      <div className="absolute top-2 left-2 bg-white/95 border border-neutral-300 px-1.5 py-0.5 rounded text-[8px] font-futura tracking-wider text-neutral-800 font-bold shadow-sm">
                        _0{idx + 1}
                      </div>
                    </div>
                    
                    <div className="p-3 text-left bg-[#F4F4F4]">
                      {/* CARD ENTRIES USE PREMIUM PLAYFAIR BRANDING TITLE */}
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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