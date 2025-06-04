import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced PWA install detection with better timing
let deferredPrompt: any = null;
let installPromptReceived = false;

// Register service worker for PWA functionality
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      console.log('🔧 Registering service worker...');
      
      // In development, use dev-dist path; in production use root
      const swPath = import.meta.env.DEV ? '/dev-dist/sw.js' : '/sw.js';
      console.log(`📍 Service worker path: ${swPath}`);
      
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: '/'
      });
      
      console.log('✅ SW registered successfully:', registration);
      
      // Check for updates immediately
      if (registration.waiting) {
        console.log('🔄 New service worker waiting');
      }
      
      // In development, check for updates more frequently
      const updateInterval = import.meta.env.DEV ? 10000 : 30000;
      setInterval(() => {
        registration.update();
      }, updateInterval);
      
      return registration;
    } catch (error) {
      console.error('❌ SW registration failed:', error);
      
      // In development, show helpful message
      if (import.meta.env.DEV) {
        console.warn('💡 Development mode: Service worker issues are normal. Try production build for full PWA testing.');
      }
      throw error;
    }
  } else {
    console.warn('⚠️ Service Worker not supported');
    return null;
  }
};

// Enhanced beforeinstallprompt handler
const handleBeforeInstallPrompt = (e: any) => {
  console.log('🎯 PWA Install Prompt received!', e);
  
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Store the event globally
  deferredPrompt = e;
  window.deferredPrompt = e;
  installPromptReceived = true;
  
  console.log('📱 PWA is now installable!');
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('pwainstallable', { detail: e }));
  
  // Show immediate notification
  console.log('🎉 Install prompt is ready - look for install buttons!');
  
  return false;
};

// Track successful installation
const handleAppInstalled = (evt: any) => {
  console.log('🎉 PWA was installed successfully!', evt);
  
  // Clear the deferred prompt
  deferredPrompt = null;
  window.deferredPrompt = null;
  installPromptReceived = false;
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('pwainstalled'));
  
  // Track installation for analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'app_installed', {
      method: 'pwa'
    });
  }
};

// Enhanced user engagement detection
const setupUserEngagement = () => {
  let engagementScore = 0;
  const requiredScore = 3; // Chrome's typical requirement
  
  const trackEngagement = (type: string) => {
    engagementScore++;
    console.log(`📈 User engagement: ${type} (score: ${engagementScore}/${requiredScore})`);
    
    if (engagementScore >= requiredScore) {
      sessionStorage.setItem('pwa-engagement', 'true');
      console.log('✅ User engagement threshold met for PWA install');
    }
  };
  
  // Track various user interactions
  const engagementEvents = ['click', 'scroll', 'keydown', 'touchstart'];
  engagementEvents.forEach(event => {
    document.addEventListener(event, () => trackEngagement(event), { once: true });
  });
  
  // Automatic engagement after time delay
  setTimeout(() => {
    trackEngagement('time-spent');
  }, 5000);
  
  // Page navigation tracking
  let navigationCount = 0;
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    navigationCount++;
    trackEngagement(`navigation-${navigationCount}`);
    return originalPushState.apply(history, args);
  };
};

// Check if app is already installed with enhanced detection
const checkInstallationStatus = () => {
  const displayMode = getDisplayMode();
  
  console.log('📱 PWA Display Mode:', displayMode);
  
  const isInstalled = displayMode === 'standalone' || displayMode === 'standalone-ios';
  
  if (isInstalled) {
    console.log('✅ App is running as installed PWA');
  } else {
    console.log('🌐 App is running in browser mode');
  }
  
  return isInstalled;
};

// Force Chrome to reevaluate PWA installability
const triggerInstallabilityCheck = () => {
  // Force Chrome to check installability by triggering events
  setTimeout(() => {
    if (!installPromptReceived && !checkInstallationStatus()) {
      console.log('🔄 Triggering Chrome installability check...');
      
      // Simulate user interaction to trigger Chrome's internal checks
      const event = new Event('click', { bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      
      // Force service worker update check
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.update());
        });
      }
      
      // Dispatch a custom event that might trigger Chrome's checks
      window.dispatchEvent(new CustomEvent('beforeinstallprompt-check'));
    }
  }, 2000);
};

// Main initialization
const initializePWA = async () => {
  console.log('🚀 Initializing PWA...');
  
  // Set up development helpers first
  setupDevelopmentPWAHelpers();
  
  // Set up user engagement tracking
  setupUserEngagement();
  
  // Check current installation status
  checkInstallationStatus();
  
  // Add event listeners for PWA events
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
  
  // Register service worker
  try {
    await registerServiceWorker();
    console.log('✅ Service worker registration complete');
  } catch (error) {
    console.error('❌ Service worker registration failed:', error);
  }
  
  // Set up periodic checks for install prompt (reduced for development)
  let checkCount = 0;
  const maxChecks = import.meta.env.DEV ? 6 : 12; // Shorter in development
  const checkInterval = import.meta.env.DEV ? 5000 : 10000; // More frequent in development
  
  const installPromptChecker = setInterval(() => {
    checkCount++;
    
    if (installPromptReceived || checkInstallationStatus()) {
      clearInterval(installPromptChecker);
      return;
    }
    
    if (checkCount >= maxChecks) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ PWA install prompt not received in development mode');
        console.log('💡 This is normal on localhost. Use production build for full PWA testing.');
        console.log('🧪 Try: window.mockPWAInstall() to test install flow');
      } else {
        console.warn('⚠️ PWA install prompt not received after checking');
        console.log('💡 Try: 1) Refresh page, 2) Use Chrome 68+, 3) Interact with page more');
      }
      clearInterval(installPromptChecker);
      return;
    }
    
    console.log(`🔍 Checking for install prompt... (${checkCount}/${maxChecks})`);
    triggerInstallabilityCheck();
  }, checkInterval);
  
  // Force initial installability check
  triggerInstallabilityCheck();
};

// Global types for TypeScript
declare global {
  interface Window {
    deferredPrompt: any;
    mockPWAInstall?: () => void;
    checkPWAStatus?: () => void;
  }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePWA);
} else {
  initializePWA();
}

// Enhanced development mode helpers
const setupDevelopmentPWAHelpers = () => {
  if (!import.meta.env.DEV) return;
  
  console.log('🛠️ Development PWA helpers enabled');
  
  // Mock install prompt for development testing
  window.mockPWAInstall = () => {
    console.log('🧪 Mocking PWA install prompt for development');
    const mockEvent = {
      preventDefault: () => console.log('Mock preventDefault called'),
      prompt: () => {
        console.log('Mock prompt triggered');
        return Promise.resolve({ outcome: 'accepted' });
      }
    };
    handleBeforeInstallPrompt(mockEvent);
  };
  
  // Development PWA status checker
  window.checkPWAStatus = () => {
    console.log('🔍 PWA Development Status:');
    console.log('- Service Worker supported:', 'serviceWorker' in navigator);
    console.log('- Install prompt received:', installPromptReceived);
    console.log('- Deferred prompt:', !!deferredPrompt);
    console.log('- Is HTTPS:', location.protocol === 'https:');
    console.log('- Current display mode:', getDisplayMode());
    console.log('- User engagement stored:', !!sessionStorage.getItem('pwa-engagement'));
  };
  
  // Warn about localhost limitations
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.warn('⚠️ Development on localhost: Chrome may not show install prompts');
    console.log('💡 For full PWA testing:');
    console.log('  1. Build production version: npm run build');
    console.log('  2. Serve over HTTPS or use ngrok');
    console.log('  3. Use: window.mockPWAInstall() to test install flow');
  }
};

// Enhanced display mode detection
const getDisplayMode = () => {
  if (navigator.standalone) return 'standalone-ios';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  return 'browser';
};

createRoot(document.getElementById("root")!).render(<App />);
