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
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ SW registered successfully:', registration);
      
      // Check for updates immediately
      if (registration.waiting) {
        console.log('🔄 New service worker waiting');
      }
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 30000); // Check every 30 seconds
      
      return registration;
    } catch (error) {
      console.error('❌ SW registration failed:', error);
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
  let displayMode = 'browser';
  
  // Check various install indicators
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    displayMode = 'minimal-ui';
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    displayMode = 'fullscreen';
  }
  
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
  
  // Set up periodic checks for install prompt
  let checkCount = 0;
  const maxChecks = 12; // Check for 2 minutes (12 * 10 seconds)
  
  const installPromptChecker = setInterval(() => {
    checkCount++;
    
    if (installPromptReceived || checkInstallationStatus()) {
      clearInterval(installPromptChecker);
      return;
    }
    
    if (checkCount >= maxChecks) {
      console.warn('⚠️ PWA install prompt not received after 2 minutes');
      console.log('💡 Try: 1) Refresh page, 2) Use Chrome 68+, 3) Interact with page more');
      clearInterval(installPromptChecker);
      return;
    }
    
    console.log(`🔍 Checking for install prompt... (${checkCount}/${maxChecks})`);
    triggerInstallabilityCheck();
  }, 10000);
  
  // Force initial installability check
  triggerInstallabilityCheck();
};

// Global types for TypeScript
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePWA);
} else {
  initializePWA();
}

createRoot(document.getElementById("root")!).render(<App />);
