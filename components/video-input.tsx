'use client';

import { useState } from 'react';
import { extractVideoId, fetchVideoInfo } from '@/lib/youtube';
import { Video } from '@/types/video';
import { Plus, Loader2, Youtube } from 'lucide-react';

interface VideoInputProps {
  onAddVideo: (video: Video) => void;
  isProcessing?: boolean;
}

export default function VideoInput({ onAddVideo, isProcessing = false }: VideoInputProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const info = await fetchVideoInfo(videoId);
      if (!info) {
        throw new Error('Could not fetch video details');
      }

      // Generate a unique ID for the list item
      const newVideo: Video = {
        id: crypto.randomUUID(),
        videoId: videoId,
        title: info.title || 'Unknown Title',
        thumbnail: info.thumbnail || '',
        channel: info.channel || 'Unknown Channel',
        duration: info.duration || '00:00',
      };

      onAddVideo(newVideo);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-card rounded-lg p-2 border border-border shadow-sm">
          <div className="pl-3 text-muted-foreground">
            <Youtube className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground px-3 py-2 outline-none"
            disabled={loading || isProcessing}
          />
          <button
            type="submit"
            disabled={loading || isProcessing || !url.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add</span>
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </form>
  );
}
