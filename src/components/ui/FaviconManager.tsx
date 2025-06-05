import { useEffect } from 'react';
import { useFavicon } from '@/hooks/useImageAssets';

interface FaviconManagerProps {
  fallbackFavicon?: string;
}

export const FaviconManager: React.FC<FaviconManagerProps> = ({ 
  fallbackFavicon = '/steppers-icon.svg' 
}) => {
  // Temporarily disabled to prevent Supabase 404 errors while backend is being set up
  // const { faviconUrl, loading, error } = useFavicon();

  useEffect(() => {
    const updateFavicon = (url: string) => {
      // Get existing favicon link or create new one
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }

      // Update the favicon URL
      favicon.href = url;

      // Also update apple-touch-icon if it exists
      const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (appleTouchIcon) {
        appleTouchIcon.href = url;
      }

      // Update any other favicon variants
      const favicons = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
      favicons.forEach(icon => {
        if (icon.rel.includes('icon')) {
          icon.href = url;
        }
      });
    };

    // Use fallback favicon until Supabase image management is properly set up
    updateFavicon(fallbackFavicon);
    
    // Original logic (temporarily disabled):
    // if (!loading && !error && faviconUrl) {
    //   updateFavicon(faviconUrl);
    // } else if (!loading && (error || !faviconUrl)) {
    //   updateFavicon(fallbackFavicon);
    // }
  }, [fallbackFavicon]);

  // This component doesn't render anything visible
  return null;
};

// Hook to manually update favicon programmatically
export const useFaviconUpdater = () => {
  const updateFavicon = (url: string) => {
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }

    favicon.href = url;

    // Update all favicon variants
    const favicons = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
    favicons.forEach(icon => {
      if (icon.rel.includes('icon')) {
        icon.href = url;
      }
    });
  };

  return { updateFavicon };
}; 