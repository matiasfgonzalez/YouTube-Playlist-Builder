import { Video } from '@/types/video';

// Extracts Video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Fetches video metadata using oEmbed
export async function fetchVideoInfo(videoId: string): Promise<Partial<Video> | null> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch video info');
    }

    const data = await response.json();
    
    return {
        videoId: videoId,
        title: data.title,
        channel: data.author_name,
        thumbnail: data.thumbnail_url,
        duration: "00:00", // Placeholder, will be updated by player if possible or remains 00:00
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
}
