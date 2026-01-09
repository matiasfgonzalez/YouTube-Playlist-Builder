'use client';

import { useState, useCallback, useEffect } from 'react';
import { Video } from '@/types/video';
import VideoInput from '@/components/video-input';
import VideoPlayer from '@/components/video-player';
import PlaylistManager from '@/components/playlist-manager';
import { LayoutList, PlayCircle, SkipBack, SkipForward, Trash2, Moon, Sun, Download, Upload } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import ImportDialog from '@/components/import-dialog';
import { useRef } from 'react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondary transition-colors"
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedVideos = localStorage.getItem('playlist_videos');
    const storedCurrentId = localStorage.getItem('playlist_current_video_id');
    
    if (storedVideos) {
      try {
        setVideos(JSON.parse(storedVideos));
      } catch (error) {
        console.error('Failed to parse videos from localStorage', error);
      }
    }
    
    if (storedCurrentId) {
      setCurrentVideoId(storedCurrentId);
    }
    
    setIsLoaded(true);
  }, []);

  // Save videos to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('playlist_videos', JSON.stringify(videos));
    }
  }, [videos, isLoaded]);

  // Save currentVideoId to localStorage
  useEffect(() => {
    if (isLoaded) {
      if (currentVideoId) {
        localStorage.setItem('playlist_current_video_id', currentVideoId);
      } else {
        localStorage.removeItem('playlist_current_video_id');
      }
    }
  }, [currentVideoId, isLoaded]);
  
  // Computed index for navigation
  const currentIndex = videos.findIndex(v => v.videoId === currentVideoId);

  const handleAddVideo = (video: Video) => {
    setVideos(prev => [...prev, video]);
    // If first video, auto select? Or wait for user play?
    // User flow: "3. Video se agrega... 5. Usuario click video or play all"
    // So we don't auto play strictly, but if it's the first one, maybe good DX.
    // Let's stick to no auto-play on add, waiting for explicit action.
  };

  const handleRemoveVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    // If removing currently playing?
    const videoToRemove = videos.find(v => v.id === id);
    if (videoToRemove?.videoId === currentVideoId) {
      setCurrentVideoId(null); // Stop playback
    }
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      const [reorderedItem] = newVideos.splice(startIndex, 1);
      newVideos.splice(endIndex, 0, reorderedItem);
      return newVideos;
    });
  };

  const handlePlay = (video: Video) => {
    setCurrentVideoId(video.videoId);
  };

  const handleVideoEnd = () => {
    // Auto play next
    if (currentIndex >= 0 && currentIndex < videos.length - 1) {
      setCurrentVideoId(videos[currentIndex + 1].videoId);
    } else {
      // Playlist finished? Loop?
      // Requirement: "3. Auto-reproducción del siguiente video al finalizar"
      // Doesn't say loop globally.
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < videos.length - 1) {
      setCurrentVideoId(videos[currentIndex + 1].videoId);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentVideoId(videos[currentIndex - 1].videoId);
    }
  };

  const handlePlayAll = () => {
    if (videos.length > 0) {
      const firstVideoId = videos[0].videoId;
      if (currentVideoId === firstVideoId) {
        // If already selected, force re-selection or seek to 0? 
        // We can toggle to null and back, or expose a seek method. 
        // Simpler: Just ensure it's playing. 
        // But if it finished, we want to restart.
        // We can pass a timestamp to force update? 
        // Or better: Current Video Player handles "isPlaying" prop. 
        // If we set it to null then back? 
        // Let's rely on the player logic: if we set state to same, it might not re-render.
        // But we can reset the key of the player? No, that's heavy.
        // Let's just make sure it plays. The user complained it "does nothing".
        // Likely because currentVideoId was already that ID (but maybe paused/ended).
        // Sending a command to the player component would be ideal.
        // But for now, let's just make sure we are not stuck.
        setCurrentVideoId(null);
        setTimeout(() => setCurrentVideoId(firstVideoId), 0);
      } else {
        setCurrentVideoId(firstVideoId);
      }
    }
  };
  
  const handleDurationUpdate = (duration: number) => {
    // Optional: update video duration in state if we want accurate "MM:SS"
    // formatMMSS(duration)
    // videos[currentIndex].duration = format...
    // Set state...
  };

  // -- Import / Export Logic --
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImportVideos, setPendingImportVideos] = useState<Video[] | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(videos));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "playlist.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result;
        if (typeof json === 'string') {
          const importedVideos: Video[] = JSON.parse(json);
          // Basic validation checking if it's an array and has items
          if (Array.isArray(importedVideos)) {
             if (videos.length === 0) {
               // Direct replacement if empty
               setVideos(importedVideos);
             } else {
               // Ask user
               setPendingImportVideos(importedVideos);
               setShowImportDialog(true);
             }
          }
        }
      } catch (error) {
         console.error("Error reading file:", error);
         alert("Failed to parse JSON file.");
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(fileObj);
  };

  const handleImportReplace = () => {
    if (pendingImportVideos) {
      setVideos(pendingImportVideos);
      // Reset selection if replacing
      setCurrentVideoId(null); 
    }
    setShowImportDialog(false);
    setPendingImportVideos(null);
  };

  const handleImportAppend = () => {
    if (pendingImportVideos) {
      // Generate new IDs to avoid key collisions
      const newVideos = pendingImportVideos.map(v => ({...v, id: crypto.randomUUID()}));
      setVideos(prev => [...prev, ...newVideos]);
    }
    setShowImportDialog(false);
    setPendingImportVideos(null);
  };

  const handleImportCancel = () => {
    setShowImportDialog(false);
    setPendingImportVideos(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="bg-primary/10 p-2 rounded-lg">
                <LayoutList className="w-5 h-5 text-primary" />
             </div>
             <h1 className="font-bold text-lg tracking-tight">Playlist Builder</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden sm:block">
                 {videos.length} videos • {videos.length > 0 ? 'Ready to play' : 'Empty'}
              </span>
               <div className="flex items-center gap-1 border-r border-border pr-4 mr-1">
                 <button 
                   onClick={handleExport}
                   className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                   title="Export to JSON"
                   disabled={videos.length === 0}
                 >
                   <Download className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleImportClick}
                   className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                   title="Import from JSON"
                 >
                   <Upload className="w-5 h-5" />
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept=".json" 
                   className="hidden" 
                 />
               </div>
              <ThemeToggle />
           </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <VideoInput onAddVideo={handleAddVideo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Player (Sticky on Desktop) */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
             <VideoPlayer 
               currentVideoId={currentVideoId}
               isPlaying={!!currentVideoId}
               onEnded={handleVideoEnd}
               onDuration={handleDurationUpdate}
             />
             
             {/* Player Controls / Info */}
             <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center justify-between">
                 <div className="flex flex-col">
                    <h2 className="font-semibold text-lg line-clamp-1">
                      {currentVideoId ? videos[currentIndex]?.title : 'No Video Selected'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                       {currentVideoId ? videos[currentIndex]?.channel : '---'}
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button onClick={handlePrev} disabled={currentIndex <= 0} className="p-2 hover:bg-secondary rounded-full disabled:opacity-30 transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button onClick={handleNext} disabled={currentIndex === -1 || currentIndex >= videos.length - 1} className="p-2 hover:bg-secondary rounded-full disabled:opacity-30 transition-colors">
                       <SkipForward className="w-5 h-5" />
                    </button>
                 </div>
             </div>
          </div>

          {/* Right Column: Playlist */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>Up Next</span>
                  <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{videos.length}</span>
                </h3>
                
                {videos.length > 0 && (
                  <button 
                    onClick={handlePlayAll}
                    disabled={videos.length === 0} 
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Play All
                  </button>
                )}
             </div>
             
             <div className="flex flex-col gap-4">
               <PlaylistManager 
                 videos={videos}
                 currentVideoId={currentVideoId}
                 onRemove={handleRemoveVideo}
                 onReorder={handleReorder}
                 onPlay={handlePlay}
               />
             </div>
          </div>
        </div>
      </main>
      <ImportDialog 
        isOpen={showImportDialog}
        videoCount={pendingImportVideos?.length || 0}
        onReplace={handleImportReplace}
        onAppend={handleImportAppend}
        onClose={handleImportCancel}
      />
    </div>
  );
}
