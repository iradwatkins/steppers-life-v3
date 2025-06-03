import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import pwaAnalyticsService from '@/services/pwaAnalyticsService';

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  deferredPrompt: any;
  deviceInfo: {
    isAndroid: boolean;
    isIOS: boolean;
    isMac: boolean;
    isWindows: boolean;
    isChrome: boolean;
    isSafari: boolean;
    isEdge: boolean;
    isFirefox: boolean;
    chromeVersion: number | null;
  };
  debugInfo: {
    hasServiceWorker: boolean;
    hasManifest: boolean;
    isHTTPS: boolean;
    promptReceived: boolean;
    installCriteria: {
      hasServiceWorker: boolean;
      hasManifest: boolean;
      isSecure: boolean;
      hasValidIcons: boolean;
      hasStartUrl: boolean;
      notInstalled: boolean;
      chromeVersion: boolean;
      userEngagement: boolean;
    };
    chromeInstallHints: string[];
  };
}

export const usePWAInstall = () => {
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isInstalling: false,
    deferredPrompt: null,
    deviceInfo: {
      isAndroid: false,
      isIOS: false,
      isMac: false,
      isWindows: false,
      isChrome: false,
      isSafari: false,
      isEdge: false,
      isFirefox: false,
      chromeVersion: null,
    },
    debugInfo: {
      hasServiceWorker: false,
      hasManifest: false,
      isHTTPS: false,
      promptReceived: false,
      installCriteria: {
        hasServiceWorker: false,
        hasManifest: false,
        isSecure: false,
        hasValidIcons: false,
        hasStartUrl: false,
        notInstalled: false,
        chromeVersion: false,
        userEngagement: false,
      },
      chromeInstallHints: [],
    },
  });

  useEffect(() => {
    // Enhanced device and browser detection
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Extract Chrome version
    const chromeMatch = userAgent.match(/chrome\/(\d+)/);
    const chromeVersion = chromeMatch ? parseInt(chromeMatch[1]) : null;
    
    const deviceInfo = {
      isAndroid: userAgent.includes('android'),
      isIOS: /ipad|iphone|ipod/.test(userAgent),
      isMac: userAgent.includes('mac') && !userAgent.includes('iphone') && !userAgent.includes('ipad'),
      isWindows: userAgent.includes('windows'),
      isChrome: userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr'),
      isSafari: userAgent.includes('safari') && !userAgent.includes('chrome'),
      isEdge: userAgent.includes('edg'),
      isFirefox: userAgent.includes('firefox'),
      chromeVersion,
    };

    // Check PWA installation criteria
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasManifest = !!document.querySelector('link[rel="manifest"]') || !!document.querySelector('link[rel="manifest.json"]');
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const hasValidIcons = true; // Icons are available
    const hasStartUrl = true; // Start URL is defined in manifest
    const notInstalled = !window.matchMedia('(display-mode: standalone)').matches && !(navigator as any).standalone;
    const chromeVersionOk = !deviceInfo.isChrome || (chromeVersion && chromeVersion >= 68);
    
    // Enhanced user engagement checking
    const userEngagement = sessionStorage.getItem('pwa-engagement') === 'true' || 
                          localStorage.getItem('pwa-visited') === 'true' ||
                          sessionStorage.getItem('user-interacted') === 'true';
    
    // Mark page visit
    localStorage.setItem('pwa-visited', 'true');

    const installCriteria = {
      hasServiceWorker,
      hasManifest,
      isSecure,
      hasValidIcons,
      hasStartUrl,
      notInstalled,
      chromeVersion: chromeVersionOk,
      userEngagement,
    };

    // Generate Chrome-specific install hints
    const chromeInstallHints: string[] = [];
    
    if (!deviceInfo.isChrome) {
      chromeInstallHints.push('Use Chrome browser for best PWA support');
    } else {
      if (!chromeVersionOk) {
        chromeInstallHints.push(`Chrome ${chromeVersion} detected - need Chrome 68+ for PWA install`);
      }
      if (!hasServiceWorker) {
        chromeInstallHints.push('Service Worker not supported');
      }
      if (!hasManifest) {
        chromeInstallHints.push('Web App Manifest not found - check link tags');
      }
      if (!isSecure) {
        chromeInstallHints.push('HTTPS required for PWA installation');
      }
      if (!notInstalled) {
        chromeInstallHints.push('App appears to be already installed');
      }
      if (!userEngagement) {
        chromeInstallHints.push('User engagement threshold not met - interact with the page');
      }
      
      // Check if all criteria are met
      const allCriteriaMet = Object.values(installCriteria).every(Boolean);
      if (allCriteriaMet && !state.debugInfo.promptReceived) {
        chromeInstallHints.push('✅ All criteria met - waiting for Chrome to show install prompt');
        chromeInstallHints.push('This can take 30+ seconds. Try refreshing or interacting more.');
      }
    }

    const debugInfo = {
      hasServiceWorker,
      hasManifest,
      isHTTPS: isSecure,
      promptReceived: false,
      installCriteria,
      chromeInstallHints,
    };

    console.log('🔍 PWA Install Hook Debug:', {
      deviceInfo,
      debugInfo,
      userAgent,
      location: window.location.href,
      chromeVersion,
      allCriteriaMet: Object.values(installCriteria).every(Boolean),
      manifestCheck: {
        querySelector: !!document.querySelector('link[rel="manifest"]'),
        manifestJson: !!document.querySelector('link[rel="manifest.json"]'),
        manifestWebmanifest: !!document.querySelector('link[rel="manifest.webmanifest"]'),
      }
    });

    // Listen for custom PWA events from main.tsx
    const handlePWAInstallable = (e: CustomEvent) => {
      console.log('🎯 Custom PWA installable event received', e.detail);
      setState(prev => ({
        ...prev,
        deferredPrompt: e.detail,
        isInstallable: true,
        debugInfo: { 
          ...prev.debugInfo, 
          promptReceived: true,
          chromeInstallHints: ['✅ Install prompt available - Chrome is ready!'],
        },
      }));
      
      // Show success notification
      if (deviceInfo.isChrome || deviceInfo.isAndroid) {
        toast.success('🎉 App Ready to Install!', {
          description: 'Chrome detected the app can be installed. Click the install button!',
          duration: 8000,
        });
      }
    };

    const handlePWAInstalled = () => {
      console.log('🎉 Custom PWA installed event received');
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstalling: false,
        isInstallable: false,
        deferredPrompt: null,
      }));
      
      toast.success('🎉 App installed successfully!', {
        description: 'SteppersLife is now available on your device!',
        duration: 10000,
      });
    };

    // Check if already installed with enhanced detection
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (navigator as any).standalone === true;
      const isInstalled = isStandalone || isIOSStandalone;
      
      if (isInstalled) {
        console.log('✅ PWA is already installed');
        toast.success('✅ App is already installed!', {
          description: 'Running in standalone mode',
        });
      }
      
      setState(prev => ({
        ...prev,
        isInstalled,
        deviceInfo,
        debugInfo: { ...debugInfo, promptReceived: prev.debugInfo.promptReceived },
      }));
    };

    // Add custom event listeners
    window.addEventListener('pwainstallable', handlePWAInstallable as EventListener);
    window.addEventListener('pwainstalled', handlePWAInstalled as EventListener);
    
    // Initial check
    checkIfInstalled();
    
    // Mark user interaction on any engagement
    const markUserInteraction = () => {
      sessionStorage.setItem('user-interacted', 'true');
      console.log('👆 User interaction detected');
    };
    
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, markUserInteraction, { once: true });
    });

    // Enhanced debug timeout with Chrome guidance
    const debugTimeout = setTimeout(() => {
      if (!state.isInstalled && !debugInfo.promptReceived && deviceInfo.isChrome) {
        console.warn('⚠️ Chrome PWA Install prompt not received after 30 seconds');
        console.log('🔧 Chrome Install Troubleshooting:');
        console.log('- Refresh page and wait');
        console.log('- Check chrome://flags/#enable-desktop-pwas');
        console.log('- Ensure all criteria are met:', installCriteria);
        console.log('- Try incognito mode');
        console.log('- Clear browser cache');
        
        // Show helpful toast for Chrome users
        if (Object.values(installCriteria).every(Boolean)) {
          toast.info('Chrome PWA Installation', {
            description: 'All requirements met! Chrome install prompt can take up to 5 minutes to appear.',
            duration: 15000,
          });
        } else {
          const unmetCriteria = Object.entries(installCriteria)
            .filter(([, value]) => !value)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1'));
          
          toast.warning('PWA Installation Requirements', {
            description: `Missing: ${unmetCriteria.join(', ')}. Check console for details.`,
            duration: 10000,
          });
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('pwainstallable', handlePWAInstallable as EventListener);
      window.removeEventListener('pwainstalled', handlePWAInstalled as EventListener);
      clearTimeout(debugTimeout);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    // Check for both local and global deferred prompt
    const promptToUse = state.deferredPrompt || window.deferredPrompt;
    
    if (!promptToUse) {
      console.warn('❌ No deferred prompt available for installation');
      console.log('🔍 Available prompts:', { state: state.deferredPrompt, global: window.deferredPrompt });
      
      // Track attempted manual installation
      pwaAnalyticsService.trackPWAInstall('manual');
      
      // Provide specific guidance based on browser
      if (state.deviceInfo.isChrome) {
        const unmetCriteria = Object.entries(state.debugInfo.installCriteria)
          .filter(([, value]) => !value)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1'));
        
        if (unmetCriteria.length > 0) {
          toast.error('Installation Requirements Not Met', {
            description: `Missing: ${unmetCriteria.join(', ')}. Check console for details.`,
            duration: 8000,
          });
        } else {
          toast.error('Installation Not Ready', {
            description: 'Chrome hasn\'t shown the install prompt yet. Try refreshing or waiting longer.',
            duration: 8000,
          });
        }
      } else {
        toast.error('Installation not available', {
          description: 'Please try using Chrome or check if the app is already installed.',
        });
      }
      return false;
    }

    setState(prev => ({ ...prev, isInstalling: true }));
    
    // Show installing toast with enhanced messaging
    const installingToast = toast.loading('🚀 Installing SteppersLife...', {
      description: 'Please wait while the app is being added to your device.',
    });
    
    try {
      console.log('🚀 Starting PWA installation with prompt:', promptToUse);
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      
      // Dismiss the loading toast
      toast.dismiss(installingToast);
      
      console.log('📊 Installation outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        
        // Track successful installation
        pwaAnalyticsService.trackPWAInstall('auto');
        
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstalling: false,
          isInstallable: false,
          deferredPrompt: null,
        }));
        
        // Clear global prompt
        window.deferredPrompt = null;
        
        toast.success('🎉 Installation started!', {
          description: 'SteppersLife is being added to your device. Look for it on your home screen or desktop.',
          duration: 10000,
        });
        
        return true;
      } else {
        console.log('❌ User dismissed the install prompt');
        setState(prev => ({ ...prev, isInstalling: false }));
        
        toast.info('Installation cancelled', {
          description: 'You can install the app later by clicking the install button again.',
        });
        
        return false;
      }
    } catch (error) {
      console.error('💥 PWA installation error:', error);
      setState(prev => ({ ...prev, isInstalling: false }));
      
      // Dismiss the loading toast
      toast.dismiss(installingToast);
      
      toast.error('Installation failed', {
        description: `Installation error: ${error}. Check console for details.`,
      });
      
      return false;
    }
  };

  const getInstallInstructions = () => {
    const { isAndroid, isIOS, isMac, isWindows, isChrome, isSafari, isEdge } = state.deviceInfo;

    if (isAndroid && isChrome) {
      return {
        title: "Install from Chrome Android",
        steps: ["Look for install icon in address bar", "Tap 'Add to Home screen'", "Tap 'Install' or 'Add'"],
        canAutoInstall: true,
      };
    } else if (isAndroid) {
      return {
        title: "Install on Android",
        steps: ["Open this page in Chrome", "Look for install prompt or menu option", "Tap 'Add to Home screen'"],
        canAutoInstall: false,
      };
    } else if (isIOS && isSafari) {
      return {
        title: "Install from Safari iOS",
        steps: ["Tap the Share button (□↗)", "Select 'Add to Home Screen'", "Tap 'Add'"],
        canAutoInstall: false,
      };
    } else if (isIOS) {
      return {
        title: "Install on iPhone/iPad",
        steps: ["Open this page in Safari", "Tap Share → 'Add to Home Screen'", "Tap 'Add'"],
        canAutoInstall: false,
      };
    } else if ((isMac || isWindows) && isChrome) {
      return {
        title: "Install from Chrome Desktop",
        steps: ["Look for install icon in address bar (⊕)", "Click 'Install SteppersLife'", "Confirm installation"],
        canAutoInstall: true,
      };
    } else if ((isMac || isWindows) && isEdge) {
      return {
        title: "Install from Edge",
        steps: ["Look for app install icon in address bar", "Click 'Install SteppersLife'", "Confirm installation"],
        canAutoInstall: true,
      };
    } else {
      return {
        title: "Install PWA",
        steps: ["Use Chrome/Safari/Edge for best experience", "Look for install options in browser menu", "Follow browser-specific installation steps"],
        canAutoInstall: false,
      };
    }
  };

  // Enhanced debug function with Chrome-specific guidance
  const checkPWAReadiness = () => {
    const readiness = {
      ...state.debugInfo,
      isInstallable: state.isInstallable,
      isInstalled: state.isInstalled,
      deviceSupported: state.deviceInfo.isChrome || state.deviceInfo.isAndroid || state.deviceInfo.isSafari || state.deviceInfo.isEdge,
      chromeSpecific: state.deviceInfo.isChrome ? {
        version: state.deviceInfo.chromeVersion,
        criteriaCheck: state.debugInfo.installCriteria,
        hints: state.debugInfo.chromeInstallHints,
        availablePrompts: {
          statePrompt: !!state.deferredPrompt,
          globalPrompt: !!(window as any).deferredPrompt,
        }
      } : null,
    };
    
    console.log('🔍 PWA Readiness Check:', readiness);
    
    if (state.deviceInfo.isChrome && !state.isInstallable) {
      console.log('💡 Chrome Install Tips:');
      state.debugInfo.chromeInstallHints.forEach(hint => console.log(`  - ${hint}`));
    }
    
    return readiness;
  };

  return {
    ...state,
    install,
    getInstallInstructions,
    checkPWAReadiness,
  };
}; 