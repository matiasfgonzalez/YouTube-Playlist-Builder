export interface Video {
  id: string;           // Internal unique ID (e.g. uuid)
  videoId: string;      // YouTube Video ID
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;     // Format "MM:SS"
}

export interface VideoInfo {
  title: string;
  author_name: string;
  thumbnail_url: string;
  // oEmbed api fields
}
