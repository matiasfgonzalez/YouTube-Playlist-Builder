'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script'; // Using Next.js Script for better handling, or standard tag? 
// User prompt said: "useEffect ... document.createElement('script')"
// I will stick to useEffect to conform to prompt suggestions, but ensure safety.

interface VideoPlayerProps {
  currentVideoId: string | null;
  isPlaying: boolean;
  onEnded: () => void;
  onStateChange?: (state: number) => void;
  onDuration?: (duration: number) => void;
}

export default function VideoPlayer({ currentVideoId, isPlaying, onEnded, onStateChange, onDuration }: VideoPlayerProps) {
  const playerRef = useRef<any>(null); // YT.Player instance
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Refs to hold latest callbacks
  const onEndedRef = useRef(onEnded);
  const onStateChangeRef = useRef(onStateChange);
  const onDurationRef = useRef(onDuration);

  // Update refs when props change
  useEffect(() => {
    onEndedRef.current = onEnded;
    onStateChangeRef.current = onStateChange;
    onDurationRef.current = onDuration;
  }, [onEnded, onStateChange, onDuration]);

  // Load API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsReady(true);
      };
    } else {
      setIsReady(true);
    }
  }, []);

  // Initialize Player when ready
  useEffect(() => {
    if (isReady && !playerRef.current && currentVideoId && containerRef.current) {
      // Create player
      playerRef.current = new window.YT.Player(containerRef.current.id, {
        height: '100%',
        width: '100%',
        videoId: currentVideoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin, // Fix for CORS/postMessage error on Vercel
        },
        events: {
          onReady: (event: any) => {
            if (isPlaying) event.target.playVideo();
            if (onDurationRef.current) onDurationRef.current(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            if (onStateChangeRef.current) onStateChangeRef.current(event.data);
            if (event.data === window.YT.PlayerState.ENDED) {
              if (onEndedRef.current) onEndedRef.current();
            }
          },
        },
      });
    } else if (playerRef.current && currentVideoId) {
      // Update existing player
      // Check if video is different
      const currentId = playerRef.current.getVideoData()?.video_id;
      if (currentId !== currentVideoId) {
        playerRef.current.loadVideoById(currentVideoId);
      }
    }
  }, [isReady, currentVideoId, isPlaying]); // Deps need care.

  // Handle Play/Pause props
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      const state = playerRef.current.getPlayerState();
      // 1 = Playing, 2 = Paused
      if (isPlaying && state !== 1 && state !== 3) { // 3 is buffering
        playerRef.current.playVideo();
      } else if (!isPlaying && state === 1) {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/10">
      {/* Container for YouTube Player */}
      <div id="youtube-player" ref={containerRef} className="w-full h-full" />
      
      {!currentVideoId && (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
           {/* Placeholder */}
           <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
             <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-muted-foreground border-b-[10px] border-b-transparent ml-1" />
           </div>
           <p>Select a video to start playing</p>
        </div>
      )}
    </div>
  );
}
