export interface Video {
  id: string;           // Internal unique ID (e.g. uuid or just parsing index?) User said "Video ID de YouTube", but lists usually need unique keys if duplicates allowed.
                        // Prompt said: "id: string; // Video ID de YouTube". "videoId: string; // Video ID de YouTube (duplicado para compatibilidad)".
                        // This implies id and videoId are same? or id is unique key? 
                        // Prompt: "id: string; // Video ID de YouTube"
                        // But if I add same video twice? 
                        // "1. Input de Videos" -> "3. Extracción automática del video ID".
                        // "2. Lista de Reproducción" -> "6. Funcionalidad de eliminación de videos individuales".
                        // If I add same video twice, removal might be ambiguous if id is just videoId.
                        // I will use `crypto.randomUUID()` for `id` and `videoId` for YouTube ID.
                        // But I will respect the interface from prompt:
  id: string;           // Using as unique instance ID
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
