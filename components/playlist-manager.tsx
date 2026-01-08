'use client';

import { useState } from 'react';
import { Video } from '@/types/video';
import { Trash2, GripVertical, Play, Clock } from 'lucide-react';

interface PlaylistManagerProps {
  videos: Video[];
  currentVideoId: string | null;
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onPlay: (video: Video) => void;
}

export default function PlaylistManager({
  videos,
  currentVideoId,
  onRemove,
  onReorder,
  onPlay,
}: PlaylistManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
    // Create a ghost image if needed, or default
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Optional: could reset dragOverIndex if leaving the container
    // But usually needed per item logic. 
    // We rely on handleDragOver updating it.
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
    
    if (sourceIndex !== index) {
      onReorder(sourceIndex, index);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (videos.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 bg-muted/20 rounded-xl border border-dashed border-border">
        <p>No videos in playlist.</p>
        <p className="text-sm">Add a YouTube URL to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {videos.map((video, index) => {
        const isPlaying = currentVideoId === video.videoId; // Check logic: videoId vs id? currentVideoId prop.
        const isDragged = draggedIndex === index;
        const isOver = dragOverIndex === index;
        const isAbove = isOver && draggedIndex !== null && index < draggedIndex;
        const isBelow = isOver && draggedIndex !== null && index > draggedIndex;

        return (
          <div
            key={video.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group
              ${isPlaying 
                ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' 
                : 'bg-card border-border hover:border-primary/20 hover:shadow-sm'
              }
              ${isDragged ? 'opacity-50 scale-[0.98]' : 'opacity-100'}
              ${isAbove ? 'border-t-primary border-t-2' : ''}
              ${isBelow ? 'border-b-primary border-b-2' : ''}
              cursor-grab active:cursor-grabbing
            `}
          >
            {/* Drag Handle */}
            <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Thumbnail */}
            <div 
              className="relative w-32 aspect-video bg-muted rounded-md overflow-hidden flex-shrink-0 cursor-pointer group/thumb"
              onClick={() => onPlay(video)}
            >
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105"
              />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/thumb:opacity-100'}`}>
                 <Play className={`w-8 h-8 text-white fill-white ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
              <div>
                <h3 className={`font-medium line-clamp-1 text-sm ${isPlaying ? 'text-primary' : 'text-foreground'}`}>
                    {video.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{video.channel}</p>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                 <Clock className="w-3 h-3" />
                 <span>{video.duration || '00:00'}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => onRemove(video.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Remove video"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
