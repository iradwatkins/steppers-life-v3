import { useState, useEffect } from 'react';

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
    },
  });

  useEffect(() => {
    // Detect device and browser type
    const userAgent = navigator.userAgent.toLowerCase();
    
    const deviceInfo = {
      isAndroid: userAgent.includes('android'),
      isIOS: /ipad|iphone|ipod/.test(userAgent),
      isMac: userAgent.includes('mac') && !userAgent.includes('iphone') && !userAgent.includes('ipad'),
      isWindows: userAgent.includes('windows'),
      isChrome: userAgent.includes('chrome') && !userAgent.includes('edg'),
      isSafari: userAgent.includes('safari') && !userAgent.includes('chrome'),
    };

    // PWA install prompt detection
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        deferredPrompt: e,
        isInstallable: true,
      }));
    };

    // Check if already installed
    const checkIfInstalled = () => {
      const isInstalled = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      setState(prev => ({
        ...prev,
        isInstalled,
        deviceInfo,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!state.deferredPrompt) return false;

    setState(prev => ({ ...prev, isInstalling: true }));
    
    try {
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstalling: false,
          isInstallable: false,
          deferredPrompt: null,
        }));
        return true;
      } else {
        setState(prev => ({ ...prev, isInstalling: false }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isInstalling: false }));
      return false;
    }
  };

  const getInstallInstructions = () => {
    const { isAndroid, isIOS, isMac, isWindows, isChrome, isSafari } = state.deviceInfo;

    if (isAndroid && isChrome) {
      return {
        title: "Install from Chrome",
        steps: ["Tap the menu (⋮)", "Select 'Add to Home screen'", "Tap 'Add'"],
        canAutoInstall: true,
      };
    } else if (isIOS && isSafari) {
      return {
        title: "Install from Safari",
        steps: ["Tap the Share button (□↗)", "Select 'Add to Home Screen'", "Tap 'Add'"],
        canAutoInstall: false,
      };
    } else if ((isMac || isWindows) && isChrome) {
      return {
        title: "Install from Chrome",
        steps: ["Look for install icon in address bar", "Click 'Install'", "Confirm installation"],
        canAutoInstall: true,
      };
    } else {
      return {
        title: "Install PWA",
        steps: ["Use Chrome/Safari for best experience", "Look for install options in browser menu"],
        canAutoInstall: false,
      };
    }
  };

  return {
    ...state,
    install,
    getInstallInstructions,
  };
}; 