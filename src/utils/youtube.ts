/**
 * Utility functions for YouTube URL parsing, high-res thumbnail extraction,
 * and responsive iframe rendering.
 */

export interface YouTubeInfo {
  videoId: string;
  embedUrl: string;
  thumbnailMaxRes: string;
  thumbnailHq: string;
  watchUrl: string;
}

/**
 * Extracts video ID from any valid YouTube URL (standard, shortened youtu.be, shorts, or embed).
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const cleanUrl = url.trim();
  
  // Patterns for youtu.be, youtube.com/watch?v=, youtube.com/embed/, youtube.com/shorts/
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
    /^([\w-]{11})$/ // Raw 11-char ID
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Returns full YouTube info including privacy-enhanced embed URL and thumbnails.
 */
export function getYouTubeInfo(urlOrId: string): YouTubeInfo | null {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  return {
    videoId,
    // Using youtube-nocookie.com for privacy and GDPR compliance
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
    thumbnailMaxRes: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
