import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Wifi,
  WifiOff,
  Monitor,
  Apple,
  Chrome,
  Bug,
  RefreshCw
} from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from '@/components/ui/sonner';

const StaffInstallPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDebug, setShowDebug] = useState(false);
  const [installationAttempts, setInstallationAttempts] = useState(0);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [showFullPageModal, setShowFullPageModal] = useState(false);
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const { 
    isInstallable, 
    isInstalled, 
    isInstalling, 
    install, 
    getInstallInstructions,
    deviceInfo,
    debugInfo,
    checkPWAReadiness
  } = usePWAInstall();

  // Define functions before they're used in useEffect to prevent temporal dead zone errors
  const handlePlatformInstall = async () => {
    setInstallationAttempts(prev => prev + 1);
    console.log(`🚀 Install attempt #${installationAttempts + 1}`);
    
    // Show download message immediately
    setShowDownloadMessage(true);
    
    // Force user engagement for instant install
    sessionStorage.setItem('pwa-engagement', 'true');
    sessionStorage.setItem('user-interacted', 'true');
    localStorage.setItem('pwa-visited', 'true');
    
    // Try auto-install first if available
    const success = await install();
    if (!success) {
      console.log('❌ Auto-install failed, showing manual instructions');
      // Hide download message and show instructions
      setShowDownloadMessage(false);
      // Fall back to scrolling to instructions if auto-install not available
      document.getElementById('install-instructions')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Hide the modal after successful install
      setTimeout(() => {
        setShowFullPageModal(false);
        setShowDownloadMessage(false);
      }, 3000);
    }
  };

  const handleDebugToggle = () => {
    setShowDebug(!showDebug);
    if (!showDebug) {
      // Show debug info when enabling
      const readiness = checkPWAReadiness();
      console.log('🔍 PWA Debug Info:', readiness);
    }
  };

  const forceInstallPromptCheck = () => {
    console.log('🔄 Forcing install prompt check...');
    
    // Simulate user engagement
    sessionStorage.setItem('pwa-engagement', 'true');
    sessionStorage.setItem('user-interacted', 'true');
    
    // Trigger custom events
    window.dispatchEvent(new CustomEvent('beforeinstallprompt-check'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('click'));
    
    // Force service worker update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('🔄 Updating service worker...');
          registration.update();
        });
      });
    }
    
    toast.info('🔄 Forced PWA check', {
      description: 'Triggered install prompt check and user engagement. Wait 10-30 seconds.',
      duration: 5000,
    });
  };

  useEffect(() => {
    // Add blinking animation styles to the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blinkBlueYellow {
        0%, 50% { 
          background-color: rgb(37, 99, 235); 
          border-color: rgb(37, 99, 235);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
        }
        51%, 100% { 
          background-color: rgb(234, 179, 8); 
          border-color: rgb(234, 179, 8);
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
        }
      }
      
      @keyframes blinkGreenYellow {
        0%, 50% { 
          background-color: rgb(21, 128, 61); 
          border-color: rgb(21, 128, 61);
          box-shadow: 0 0 20px rgba(21, 128, 61, 0.5);
        }
        51%, 100% { 
          background-color: rgb(234, 179, 8); 
          border-color: rgb(234, 179, 8);
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
        }
      }
      
      @keyframes blinkGrayYellow {
        0%, 50% { 
          background-color: rgb(31, 41, 55); 
          border-color: rgb(31, 41, 55);
          box-shadow: 0 0 20px rgba(31, 41, 55, 0.5);
        }
        51%, 100% { 
          background-color: rgb(234, 179, 8); 
          border-color: rgb(234, 179, 8);
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.5);
        }
      }
      
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }
        50% { 
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(234, 179, 8, 0.6);
        }
      }
      
      @keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .blink-blue-yellow {
        animation: blinkBlueYellow 1.5s infinite, pulse 2s infinite;
      }
      
      .blink-green-yellow {
        animation: blinkGreenYellow 1.5s infinite, pulse 2s infinite;
      }
      
      .blink-gray-yellow {
        animation: blinkGrayYellow 1.5s infinite, pulse 2s infinite;
      }
      
      .slide-in-up {
        animation: slideInUp 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);

    // Online/offline detection
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Install popup timer - show full page modal after 5 seconds if not installed
    const popupTimer = setTimeout(() => {
      if (!isInstalled && !showFullPageModal) {
        setShowFullPageModal(true);
        toast.info('📲 Ready to Install SteppersLife App!', {
          description: 'Click the install button to download the app to your device.',
          duration: 5000,
        });
      }
    }, 5000); // 5 seconds

    // Also show modal when user scrolls to bottom
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrolled / maxScroll;
      
      // Show modal when user scrolls 50% down the page
      if (scrollPercentage > 0.5 && !isInstalled && !showFullPageModal) {
        setShowFullPageModal(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(popupTimer);
      // Clean up the style element
      document.head.removeChild(style);
    };
  }, [isInstalled, showFullPageModal]);

  const instructions = getInstallInstructions();

  const renderFullPageModal = () => {
    if (!showFullPageModal || isInstalled) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto slide-in-up border-4 border-yellow-400">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 text-white p-8 rounded-t-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">📲</div>
              <h2 className="text-3xl font-black mb-2">Install SteppersLife App</h2>
              <p className="text-blue-100 text-lg font-medium">Fast, offline-capable event management</p>
              <div className="flex justify-center mt-4">
                <div className="bg-white bg-opacity-20 rounded-full px-6 py-2">
                  <span className="text-sm font-bold">⚡ ONE-CLICK INSTALL ⚡</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Message */}
          {showDownloadMessage && (
            <div className="bg-green-50 border-l-8 border-green-400 p-6 m-4 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-600 mr-4"></div>
                <div>
                  <h3 className="text-green-800 font-bold text-xl">Download will begin shortly...</h3>
                  <p className="text-green-600 text-lg mt-2">Please follow any browser prompts to complete installation.</p>
                  <p className="text-green-500 text-sm mt-2">✅ Installation process started successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Install Button */}
          {!showDownloadMessage && (
            <div className="p-8 space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Ready to install on your {
                    deviceInfo.isAndroid ? 'Android Device' : 
                    deviceInfo.isIOS ? 'iPhone/iPad' : 
                    deviceInfo.isMac ? 'Mac Computer' : 
                    deviceInfo.isWindows ? 'Windows Computer' : 
                    'device'
                  }
                </h3>
                <p className="text-gray-600 text-lg">
                  {isInstallable ? 
                    '🎉 One-click installation available!' : 
                    '📋 Follow the instructions after clicking install.'
                  }
                </p>
              </div>

              {/* Platform-specific install button */}
              <div className="space-y-4">
                {/* Android Install Button */}
                {deviceInfo.isAndroid && (
                  <Button 
                    size="lg" 
                    onClick={handlePlatformInstall}
                    className="h-20 w-full blink-green-yellow text-white font-bold text-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                    disabled={isInstalling}
                  >
                    <Smartphone className="h-8 w-8 mr-4" />
                    <div className="text-center flex-1">
                      <div className="font-black text-2xl">
                        {isInstalling ? '🔄 INSTALLING...' : '📱 INSTALL ON ANDROID'}
                      </div>
                      <div className="text-lg opacity-90 font-medium">
                        {isInstallable ? 'Instant install available!' : 'Add to Home Screen'}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-4xl animate-bounce">⚡</span>
                    </div>
                  </Button>
                )}

                {/* iOS Install Button */}
                {deviceInfo.isIOS && (
                  <Button 
                    size="lg" 
                    onClick={handlePlatformInstall}
                    className="h-20 w-full blink-gray-yellow text-white font-bold text-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                    disabled={isInstalling}
                  >
                    <Apple className="h-8 w-8 mr-4" />
                    <div className="text-center flex-1">
                      <div className="font-black text-2xl">
                        {isInstalling ? '🔄 INSTALLING...' : '🍎 INSTALL ON iPHONE/iPAD'}
                      </div>
                      <div className="text-lg opacity-90 font-medium">
                        Safari Share Button Method
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-4xl animate-bounce">🍎</span>
                    </div>
                  </Button>
                )}

                {/* Mac Install Button */}
                {deviceInfo.isMac && !deviceInfo.isIOS && (
                  <Button 
                    size="lg" 
                    onClick={handlePlatformInstall}
                    className="h-20 w-full blink-blue-yellow text-white font-bold text-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                    disabled={isInstalling}
                  >
                    <Monitor className="h-8 w-8 mr-4" />
                    <div className="text-center flex-1">
                      <div className="font-black text-2xl">
                        {isInstalling ? '🔄 INSTALLING...' : '💻 INSTALL ON MAC'}
                      </div>
                      <div className="text-lg opacity-90 font-medium">
                        {deviceInfo.isChrome ? 'Chrome Install Available' : 'Safari File Menu'}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-4xl animate-bounce">💻</span>
                    </div>
                  </Button>
                )}

                {/* Windows Install Button */}
                {deviceInfo.isWindows && (
                  <Button 
                    size="lg" 
                    onClick={handlePlatformInstall}
                    className="h-20 w-full blink-blue-yellow text-white font-bold text-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                    disabled={isInstalling}
                  >
                    <Monitor className="h-8 w-8 mr-4" />
                    <div className="text-center flex-1">
                      <div className="font-black text-2xl">
                        {isInstalling ? '🔄 INSTALLING...' : '🖥️ INSTALL ON WINDOWS'}
                      </div>
                      <div className="text-lg opacity-90 font-medium">
                        Browser Install Button Available
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-4xl animate-bounce">🖥️</span>
                    </div>
                  </Button>
                )}

                {/* Generic Install Button */}
                {!deviceInfo.isAndroid && !deviceInfo.isIOS && !deviceInfo.isMac && !deviceInfo.isWindows && (
                  <Button 
                    size="lg" 
                    onClick={handlePlatformInstall}
                    className="h-20 w-full blink-blue-yellow text-white font-bold text-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                    disabled={isInstalling}
                  >
                    <Download className="h-8 w-8 mr-4" />
                    <div className="text-center flex-1">
                      <div className="font-black text-2xl">
                        {isInstalling ? '🔄 INSTALLING...' : '📲 INSTALL PWA'}
                      </div>
                      <div className="text-lg opacity-90 font-medium">
                        Install Progressive Web App
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-4xl animate-bounce">📲</span>
                    </div>
                  </Button>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-4 pt-6 border-t-2 border-gray-200">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-lg font-semibold"
                  onClick={() => setShowFullPageModal(false)}
                >
                  ⏰ Maybe Later
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-lg font-semibold"
                  onClick={() => {
                    setShowFullPageModal(false);
                    document.getElementById('install-instructions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  📋 See Instructions
                </Button>
              </div>
            </div>
          )}

          {/* Close button */}
          {!showDownloadMessage && (
            <button
              onClick={() => setShowFullPageModal(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors z-20 bg-black bg-opacity-30 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderInstallButtons = () => {
    if (isInstalled) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800 font-medium">✅ App is already installed! You can open it from your home screen or desktop.</span>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-6">
        {/* Main Install Button - Direct Installation */}
        <div className="text-center space-y-6 relative">
          {/* Show download message overlay if installing */}
          {showDownloadMessage && (
            <div className="absolute inset-0 bg-green-50 border-4 border-green-400 rounded-2xl z-10 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
                <h3 className="text-green-800 font-bold text-2xl mb-2">Download will begin shortly...</h3>
                <p className="text-green-600 text-lg">Please follow any browser prompts to complete installation.</p>
                <p className="text-green-500 text-sm mt-2">✅ Installation process started!</p>
              </div>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handlePlatformInstall}
            className="h-24 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 hover:from-blue-700 hover:via-purple-700 hover:to-yellow-600 text-white font-black text-2xl relative overflow-hidden transform transition-all duration-300 hover:scale-105 border-4 border-yellow-400 shadow-2xl"
            disabled={isInstalling}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
            <Download className="h-10 w-10 mr-6 animate-bounce" />
            <div className="text-center flex-1 relative z-10">
              <div className="font-black text-3xl mb-1">
                {isInstalling ? '🔄 INSTALLING...' : '⚡ INSTALL STEPPERS APP'}
              </div>
              <div className="text-lg opacity-95 font-bold">
                {isInstalling ? 'Please wait...' : `${deviceInfo.isAndroid ? '📱 Android' : deviceInfo.isIOS ? '🍎 iOS' : deviceInfo.isMac ? '💻 Mac' : deviceInfo.isWindows ? '🖥️ Windows' : '📲 Device'} Installation`}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="text-5xl animate-bounce">
                {isInstalling ? '🔄' : '⚡'}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
              {isInstallable ? 'ONE-CLICK' : 'GUIDED'}
            </div>
          </Button>

          <div className="space-y-2">
            <p className="text-gray-700 text-lg font-semibold">
              🎯 <strong>Click above to start installation!</strong>
            </p>
            <p className="text-gray-600 text-sm">
              Works offline • Faster than website • Home screen access
            </p>
          </div>

          {/* Alternative modal trigger button for those who prefer guided experience */}
          <Button 
            variant="outline"
            size="lg" 
            onClick={() => setShowFullPageModal(true)}
            className="h-16 w-full border-2 border-blue-400 hover:bg-blue-50 text-blue-700 font-bold text-lg"
          >
            <Monitor className="h-6 w-6 mr-3" />
            🔍 Show Guided Installation Experience
          </Button>
        </div>

        {/* Attention Banner */}
        <Alert className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 border-orange-400 border-3">
          <AlertCircle className="h-6 w-6 text-orange-600 animate-pulse" />
          <AlertDescription className="text-center">
            <span className="font-black text-orange-800 text-xl">
              ⬆️ CLICK THE BIG BUTTON ABOVE FOR INSTANT INSTALL! ⬆️
            </span>
            <br />
            <span className="text-orange-700 font-semibold text-lg">
              The app works offline and is much faster than using the website!
            </span>
            <br />
            <span className="text-sm text-orange-600 font-medium">
              Attempts: {installationAttempts} • Platform: {
                deviceInfo.isAndroid ? '📱 Android' : 
                deviceInfo.isIOS ? '🍎 iOS' : 
                deviceInfo.isMac ? '💻 Mac' : 
                deviceInfo.isWindows ? '🖥️ Windows' : 
                '❓ Unknown'
              } • Ready: {isInstallable ? '✅' : '⏳'}
            </span>
          </AlertDescription>
        </Alert>

        {/* Enhanced Debug Alert for Chrome */}
        {deviceInfo.isChrome && (
          <Alert className={`${debugInfo.promptReceived ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <Chrome className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Chrome PWA Status:</strong> {' '}
                  {debugInfo.promptReceived ? '✅ Install prompt ready!' : '⏳ Waiting for install prompt...'}
                  <br />
                  <span className="text-sm">
                    {debugInfo.chromeInstallHints.slice(0, 2).join('. ')}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDebugToggle}
                  className="ml-2"
                >
                  <Bug className="h-3 w-3 mr-1" />
                  {showDebug ? 'Hide' : 'Debug'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Force check button for debugging */}
        {deviceInfo.isChrome && !isInstallable && (
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={forceInstallPromptCheck}
              className="w-full h-12 text-lg"
            >
              🔄 Force Install Check (Debug Mode)
            </Button>
          </div>
        )}

        {/* Browser Recommendation */}
        {!deviceInfo.isChrome && !deviceInfo.isSafari && !deviceInfo.isEdge && (
          <Alert className="bg-orange-50 border-orange-200">
            <Chrome className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>💡 Tip:</strong> For the best PWA experience, try opening this page in Chrome (Android/Windows/Mac) or Safari (iOS/Mac).
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center space-x-2">
            <Smartphone className="h-8 w-8 text-blue-600 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900">
              SteppersLife Event Staff App
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Install the Progressive Web App (PWA) on your device for fast, offline-capable event management
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-orange-600" />
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Offline Mode
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Debug Info Panel */}
        {showDebug && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                PWA Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-medium">Device Info:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Android: {deviceInfo.isAndroid ? '✅' : '❌'}</li>
                    <li>iOS: {deviceInfo.isIOS ? '✅' : '❌'}</li>
                    <li>Chrome: {deviceInfo.isChrome ? '✅' : '❌'}</li>
                    <li>Safari: {deviceInfo.isSafari ? '✅' : '❌'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">PWA Status:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Service Worker: {debugInfo.hasServiceWorker ? '✅' : '❌'}</li>
                    <li>Manifest: {debugInfo.hasManifest ? '✅' : '❌'}</li>
                    <li>HTTPS: {debugInfo.isHTTPS ? '✅' : '❌'}</li>
                    <li>Install Prompt: {debugInfo.promptReceived ? '✅' : '❌'}</li>
                    <li>Installable: {isInstallable ? '✅' : '❌'}</li>
                    <li>Installed: {isInstalled ? '✅' : '❌'}</li>
                  </ul>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-3"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Installation Instructions */}
          <Card id="install-instructions">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">
                  {deviceInfo.isAndroid ? '🤖' : 
                   deviceInfo.isIOS ? '🍎' : 
                   deviceInfo.isMac ? '🍎' : 
                   deviceInfo.isWindows ? '🖥️' : '💻'}
                </span>
                <span>{instructions.title}</span>
              </CardTitle>
              <CardDescription>
                {instructions.canAutoInstall 
                  ? "Automatic installation should be available - check for install prompts!"
                  : "Follow these steps to install the app on your device"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
              
              {instructions.canAutoInstall && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your browser supports automatic PWA installation! Look for install prompts or buttons.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* App Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>App Features</span>
              </CardTitle>
              <CardDescription>
                What you can do with the staff app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">QR Code Scanning</h4>
                    <p className="text-sm text-gray-600">Quickly check in attendees with camera scanning</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <WifiOff className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Offline Capability</h4>
                    <p className="text-sm text-gray-600">Works without internet, syncs when connected</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Attendee Management</h4>
                    <p className="text-sm text-gray-600">Manual lookup, VIP tracking, guest lists</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Roles & Access */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Roles & Access Levels</CardTitle>
            <CardDescription>
              Different access levels for event staff members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <Badge className="bg-blue-100 text-blue-800">Event Staff</Badge>
                <h4 className="font-medium">Basic Access</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Attendee check-in</li>
                  <li>• QR code scanning</li>
                  <li>• Manual lookup</li>
                  <li>• View attendance stats</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <Badge className="bg-green-100 text-green-800">Sales Agent</Badge>
                <h4 className="font-medium">Sales Access</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All staff features</li>
                  <li>• Cash payment processing</li>
                  <li>• On-site ticket sales</li>
                  <li>• Payment code generation</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <Badge className="bg-purple-100 text-purple-800">Organizer</Badge>
                <h4 className="font-medium">Full Access</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All features</li>
                  <li>• Staff management</li>
                  <li>• Role assignments</li>
                  <li>• Analytics & reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Install Buttons Section - Moved to bottom for better UX */}
        {renderInstallButtons()}

        {/* Quick Access Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-16"
            onClick={() => window.location.href = '/pwa/login'}
          >
            <Smartphone className="h-5 w-5 mr-2" />
            Go to Staff Login
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16"
            onClick={() => window.location.href = '/'}
          >
            <Users className="h-5 w-5 mr-2" />
            Main Website
          </Button>
        </div>

        {/* Technical Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Detected:</strong> {
              deviceInfo.isAndroid ? 'Android' : 
              deviceInfo.isIOS ? 'iOS' : 
              deviceInfo.isMac ? 'Mac' : 
              deviceInfo.isWindows ? 'Windows' : 
              'Unknown'
            } • {
              deviceInfo.isChrome ? 'Chrome' : 
              deviceInfo.isSafari ? 'Safari' : 
              'Other Browser'
            } • 
            <strong>PWA Support:</strong> {instructions.canAutoInstall ? 'Full' : 'Manual'} • 
            <strong>Offline:</strong> Full functionality available without internet
          </AlertDescription>
        </Alert>
      </div>

      {/* Full Page Modal */}
      {renderFullPageModal()}
    </div>
  );
};

export default StaffInstallPage; 