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

  // Main install handler
  const handlePlatformInstall = async () => {
    setInstallationAttempts(prev => prev + 1);
    const attemptNumber = installationAttempts + 1;
    console.log(`🚀 Install attempt #${attemptNumber} started`);
    
    // Show download message immediately
    setShowDownloadMessage(true);
    
    // Enhanced PWA readiness check
    const pwaReadiness = checkPWAReadiness();
    console.log('🔍 PWA Readiness Check:', pwaReadiness);
    
    // Debug current state
    console.log('📊 Current PWA State:', {
      isInstallable,
      isInstalled,
      isInstalling,
      hasPrompt: debugInfo.promptReceived,
      deferredPrompt: !!window.deferredPrompt,
      browser: deviceInfo.isChrome ? 'Chrome' : deviceInfo.isSafari ? 'Safari' : 'Other',
      platform: deviceInfo.isAndroid ? 'Android' : deviceInfo.isIOS ? 'iOS' : deviceInfo.isMac ? 'Mac' : 'Other',
      environment: {
        isHTTPS: window.location.protocol === 'https:',
        hostname: window.location.hostname,
        isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      }
    });
    
    // Force user engagement for instant install
    sessionStorage.setItem('pwa-engagement', 'true');
    sessionStorage.setItem('user-interacted', 'true');
    localStorage.setItem('pwa-visited', 'true');
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('🛠️ Development mode detected');
      console.log('💡 Testing options:');
      console.log('  1. Try: window.mockPWAInstall() for testing');
      console.log('  2. Build for production: npm run build && npm run preview');
      console.log('  3. Use HTTPS deployment for full testing');
      
      // Offer mock install for development
      if (typeof window.mockPWAInstall === 'function') {
        console.log('🧪 Using mock install for development');
        setShowDownloadMessage(false);
        toast.info('Development Mode', {
          description: 'Using mock install. In production, real PWA install will be used.',
          duration: 5000,
        });
        window.mockPWAInstall();
        return;
      }
    }
    
    // Check if we have HTTPS (required for PWA)
    if (!window.location.protocol.includes('https') && !isDevelopment) {
      console.error('❌ PWA requires HTTPS in production');
      toast.error('HTTPS Required', {
        description: 'PWA installation requires HTTPS (secure connection)',
        duration: 5000,
      });
      setShowDownloadMessage(false);
      return;
    }
    
    // Check if service worker is available
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Service Worker not supported');
      toast.error('Browser Not Supported', {
        description: 'Your browser does not support PWA installation',
        duration: 5000,
      });
      setShowDownloadMessage(false);
      return;
    }
    
    try {
      // Enhanced install attempt with better error handling
      console.log('⚡ Attempting PWA install...');
      console.log('📱 Install criteria met:', pwaReadiness.ready);
      console.log('🔗 Deferred prompt available:', !!window.deferredPrompt);
      
      const success = await install();
      
      if (success) {
        console.log('✅ PWA install successful!');
        
        // Enhanced success message for different platforms
        if (deviceInfo.isAndroid) {
          toast.success('🎉 Added to Home Screen!', {
            description: 'SteppersLife has been added to your Android home screen. Look for the app icon!',
            duration: 8000,
          });
        } else if (deviceInfo.isIOS) {
          toast.success('🎉 iOS Installation Started!', {
            description: 'Use Safari\'s Share button (□↗) and select "Add to Home Screen" to complete installation.',
            duration: 10000,
          });
        } else {
          toast.success('🎉 Installation Started!', {
            description: 'The app is being installed. Check your desktop or app menu in a moment.',
            duration: 5000,
          });
        }
        
        // Hide the download message after successful install
        setTimeout(() => {
          setShowDownloadMessage(false);
        }, 3000);
        
      } else {
        console.log('❌ PWA install failed, showing guidance');
        setShowDownloadMessage(false);
        
        // Enhanced platform-specific guidance
        if (isDevelopment) {
          toast.info('💻 Development Mode', {
            description: 'PWA install prompts don\'t work on localhost. Try production build or deployment.',
            duration: 10000,
          });
        } else if (deviceInfo.isIOS) {
          // Enhanced iOS guidance
          if (deviceInfo.isSafari) {
            toast.info('🍎 Safari Installation Ready!', {
              description: 'Use Safari\'s Share button (□↗) at the bottom, then select "Add to Home Screen". The app will appear on your home screen!',
              duration: 12000,
            });
          } else {
            toast.info('🍎 Switch to Safari for iOS Installation', {
              description: 'For the best experience, open this page in Safari and use the Share button → "Add to Home Screen"',
              duration: 10000,
            });
          }
        } else if (deviceInfo.isAndroid) {
          // For Android, if install failed, it might be because the prompt wasn't ready yet
          if (!debugInfo.promptReceived) {
            toast.info('📱 Android Install Loading...', {
              description: 'Chrome is preparing the install option. Wait a few seconds and try again. The button will turn green when ready!',
              duration: 10000,
            });
          } else {
            toast.info('📱 Android Installation', {
              description: 'Use the install button in Chrome\'s address bar, or try the button again in a moment.',
              duration: 8000,
            });
          }
        } else if (deviceInfo.isChrome) {
          toast.info('💻 Chrome Installation', {
            description: 'Look for the install icon in the address bar, or check Chrome menu → Install',
            duration: 8000,
          });
        } else {
          toast.info('🌐 Manual Installation', {
            description: 'Check your browser menu for "Install" or "Add to Home Screen" option',
            duration: 8000,
          });
        }
        
        // Fall back to scrolling to instructions
        document.getElementById('install-instructions')?.scrollIntoView({ behavior: 'smooth' });
      }
      
    } catch (error) {
      console.error('💥 Installation error:', error);
      setShowDownloadMessage(false);
      
      // Enhanced error reporting
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('📊 Error details:', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace',
        pwaState: { isInstallable, isInstalled, hasPrompt: debugInfo.promptReceived },
        environment: { isDevelopment, protocol: window.location.protocol }
      });
      
      toast.error('Installation Error', {
        description: `Failed to install: ${errorMessage}. Check console for details.`,
        duration: 8000,
      });
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

  // Comprehensive PWA requirements check
  const checkPWARequirements = () => {
    const requirements = {
      https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      serviceWorker: 'serviceWorker' in navigator,
      manifest: document.querySelector('link[rel="manifest"]') !== null,
      icons: true, // We know we have icons
      startUrl: true, // We have start_url in manifest
      display: true, // We have display mode
      scope: true, // We have scope
      installPrompt: debugInfo.promptReceived,
      notInstalled: !isInstalled,
      chromeVersion: deviceInfo.isChrome ? parseInt(deviceInfo.chromeVersion || '0') >= 68 : true,
      engagement: sessionStorage.getItem('pwa-engagement') === 'true'
    };

    const missingRequirements = Object.entries(requirements)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    return {
      requirements,
      missingRequirements,
      canInstall: missingRequirements.length === 0 || (missingRequirements.length === 1 && missingRequirements[0] === 'installPrompt'),
      score: (Object.values(requirements).filter(Boolean).length / Object.keys(requirements).length) * 100
    };
  };

  useEffect(() => {
    // Online/offline detection
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const instructions = getInstallInstructions();

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
      <div className="space-y-8">
        {/* Prominent Install Header */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-yellow-50 p-8 rounded-2xl border-4 border-blue-200">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-gray-900">📲 Install SteppersLife App</h3>
              <p className="text-xl text-gray-700 font-medium">Get instant access with one click!</p>
              <p className="text-lg text-gray-600">Works offline • Faster loading • Home screen access</p>
            </div>
          </div>
        </div>

        {/* Single Prominent Install Button */}
        <div className="text-center space-y-6 relative bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
          {/* Show download message overlay if installing */}
          {showDownloadMessage && (
            <div className="absolute inset-0 bg-blue-50 border-4 border-blue-400 rounded-2xl z-10 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-blue-800 font-bold text-2xl mb-2">
                  {deviceInfo.isIOS ? 'Follow Safari instructions...' : 'Download will begin shortly...'}
                </h3>
                <p className="text-blue-600 text-lg">
                  {deviceInfo.isIOS 
                    ? 'Use Safari\'s Share button and select "Add to Home Screen"' 
                    : 'Please follow any browser prompts to complete installation.'}
                </p>
                <p className="text-blue-500 text-sm mt-2">
                  {deviceInfo.isIOS ? '📱 Safari installation in progress!' : '✅ Installation process started!'}
                </p>
              </div>
            </div>
          )}

          {/* Installation Status Banner - Enhanced for iOS */}
          {(isInstallable || deviceInfo.isIOS) && (
            <div className={`border-2 rounded-lg p-4 mb-6 ${
              deviceInfo.isIOS 
                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300' 
                : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  deviceInfo.isIOS ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className={`font-bold text-lg ${
                  deviceInfo.isIOS ? 'text-blue-800' : 'text-green-800'
                }`}>
                  {deviceInfo.isIOS 
                    ? '🍎 Ready for iOS Installation! (Safari)'
                    : isInstallable && deviceInfo.isAndroid 
                    ? '🚀 Ready for One-Click Install! (Android)'
                    : '🚀 Ready for Installation!'}
                </span>
              </div>
              <p className={`text-center mt-2 ${
                deviceInfo.isIOS ? 'text-blue-700' : 'text-green-700'
              }`}>
                {deviceInfo.isIOS 
                  ? 'Click below, then use Safari\'s Share button (□↗) → "Add to Home Screen"' 
                  : deviceInfo.isAndroid 
                  ? "Click below to add directly to your home screen!" 
                  : "Install as a desktop app"}
              </p>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handlePlatformInstall}
            className={`h-24 w-full font-black text-2xl relative overflow-hidden transform transition-all duration-300 hover:scale-105 border-4 shadow-2xl ${
              deviceInfo.isIOS
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-600 border-blue-400 animate-pulse'
                : isInstallable 
                ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 hover:from-green-700 hover:via-emerald-700 hover:to-teal-600 border-green-400 animate-pulse' 
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 hover:from-blue-700 hover:via-purple-700 hover:to-yellow-600 border-yellow-400'
            }`}
            disabled={isInstalling}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
            <Download className="h-10 w-10 mr-6 animate-bounce" />
            <div className="text-center flex-1 relative z-10">
              <div className="font-black text-3xl mb-1">
                {isInstalling ? '🔄 INSTALLING...' : 
                 deviceInfo.isIOS ? '🍎 ADD TO HOME SCREEN' :
                 isInstallable ? '⚡ ADD TO HOME SCREEN' : 
                 '⚡ INSTALL STEPPERS APP'}
              </div>
              <div className="text-lg opacity-95 font-bold">
                {isInstalling ? 'Please wait...' : 
                 deviceInfo.isIOS ? '📱 Safari Share Button Required' :
                 isInstallable && deviceInfo.isAndroid ? '📱 One-Click Android Install' :
                 isInstallable ? '💻 Desktop Installation' :
                 `${deviceInfo.isAndroid ? '📱 Android' : deviceInfo.isIOS ? '🍎 iOS' : deviceInfo.isMac ? '💻 Mac' : deviceInfo.isWindows ? '🖥️ Windows' : '📲 Device'} Installation`}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="text-5xl animate-bounce">
                {isInstalling ? '🔄' : 
                 deviceInfo.isIOS ? '🍎' :
                 isInstallable ? '🏠' : '⚡'}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
              {deviceInfo.isIOS ? 'SAFARI' : isInstallable ? 'ONE-CLICK' : 'GUIDED'}
            </div>
          </Button>

          <div className="space-y-2">
            <p className="text-gray-700 text-lg font-semibold">
              🎯 <strong>
                {deviceInfo.isIOS
                  ? "Click above, then follow Safari's Share menu!"
                  : isInstallable && deviceInfo.isAndroid 
                  ? "Click above for instant home screen installation!" 
                  : "Click above to start installation!"}
              </strong>
            </p>
            <p className="text-gray-600 text-sm">
              {deviceInfo.isIOS
                ? "Safari will show detailed instructions after clicking • Works offline • Faster than website"
                : deviceInfo.isAndroid && isInstallable 
                ? "Will show 'Add to Home Screen' dialog directly • Works offline • Faster than website"
                : "Works offline • Faster than website • Home screen access"}
            </p>
            
            {/* Enhanced iOS-specific guidance */}
            {deviceInfo.isIOS && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">iPhone/iPad Installation Steps:</h4>
                    <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                      <li>Click the big blue button above</li>
                      <li>Look for Safari's <strong>Share button</strong> (□↗) at the bottom</li>
                      <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                      <li>Customize the name if desired, then tap <strong>"Add"</strong></li>
                      <li>Find the SteppersLife app icon on your home screen!</li>
                    </ol>
                    <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
                      <strong>💡 Pro tip:</strong> The app icon will appear on your home screen just like any other app. 
                      It works offline and loads much faster than the website!
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Platform-specific guidance for Android */}
            {deviceInfo.isAndroid && !isInstallable && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>Android users:</strong> Wait a few seconds for Chrome to enable one-click install. 
                  You'll see the button change to green when ready!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Information */}
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
                deviceInfo.isIOS ? '🍎 iOS (Safari)' : 
                deviceInfo.isMac ? '💻 Mac' : 
                deviceInfo.isWindows ? '🖥️ Windows' : 
                '❓ Unknown'
              } • Ready: {isInstallable || deviceInfo.isIOS ? '✅' : '⏳'}
            </span>
          </AlertDescription>
        </Alert>

        {/* Enhanced iOS Safari Detection Alert */}
        {deviceInfo.isIOS && (
          <Alert className="bg-blue-50 border-blue-200">
            <span className="text-2xl">🍎</span>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>iOS Safari Installation:</strong> {' '}
                  {deviceInfo.isSafari ? '✅ Safari detected - ready to install!' : '⚠️ For best results, use Safari browser'}
                  <br />
                  <span className="text-sm">
                    {deviceInfo.isSafari 
                      ? 'Perfect! Safari supports "Add to Home Screen" for full PWA experience.'
                      : 'Safari offers the best PWA installation experience on iOS devices.'}
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

        {/* Enhanced Debug Alert for Chrome */}
        {deviceInfo.isChrome && !deviceInfo.isIOS && (
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

        {/* Development Testing Section */}
        {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
          <Alert className="bg-blue-50 border-blue-200">
            <Bug className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <strong>🛠️ Development Mode Detected</strong>
                  <br />
                  <span className="text-sm">PWA install prompts may not work on localhost. Try these options:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (typeof window.mockPWAInstall === 'function') {
                        window.mockPWAInstall();
                        toast.success('Mock install triggered', { duration: 3000 });
                      } else {
                        toast.error('Mock function not available', { duration: 3000 });
                      }
                    }}
                    className="text-xs"
                  >
                    🧪 Test Mock Install
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const previewUrl = 'http://localhost:4173/staff-install';
                      window.open(previewUrl, '_blank');
                      toast.info('Opening preview build', { duration: 3000 });
                    }}
                    className="text-xs"
                  >
                    🏗️ Test Preview Build
                  </Button>
                </div>
                
                <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                  <strong>💡 For full PWA testing:</strong><br />
                  Production preview server is running at <code>http://localhost:4173/staff-install</code>
                </div>
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

        {/* Bottom spacing to ensure page movement is visible */}
        <div className="h-24 bg-gradient-to-b from-blue-50 to-transparent rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center">
          <p className="text-blue-600 font-medium text-center">
            🎯 Install button positioned for optimal PWA detection<br />
            <span className="text-sm text-blue-500">This spacing ensures Google recognizes page movement</span>
          </p>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-medium">Device Info:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Android: {deviceInfo.isAndroid ? '✅' : '❌'}</li>
                    <li>iOS: {deviceInfo.isIOS ? '✅' : '❌'}</li>
                    <li>Chrome: {deviceInfo.isChrome ? '✅' : '❌'}</li>
                    <li>Safari: {deviceInfo.isSafari ? '✅' : '❌'}</li>
                    {deviceInfo.isChrome && <li>Chrome Version: {deviceInfo.chromeVersion}</li>}
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

              {/* PWA Requirements Check */}
              <div className="mt-4 p-3 bg-white rounded border">
                <h4 className="font-medium mb-2">📋 PWA Installation Requirements:</h4>
                {(() => {
                  const pwaCheck = checkPWARequirements();
                  return (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className={`font-bold ${pwaCheck.score >= 80 ? 'text-green-600' : pwaCheck.score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                          Score: {Math.round(pwaCheck.score)}%
                        </span>
                        <span className="ml-2 text-xs">
                          {pwaCheck.canInstall ? '✅ Ready to install' : '⏳ Missing requirements'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <strong>✅ Met:</strong>
                          <ul className="ml-2">
                            {Object.entries(pwaCheck.requirements)
                              .filter(([_, value]) => value)
                              .map(([key, _]) => (
                                <li key={key}>• {key}</li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <strong>❌ Missing:</strong>
                          <ul className="ml-2">
                            {pwaCheck.missingRequirements.length > 0 ? (
                              pwaCheck.missingRequirements.map(req => (
                                <li key={req} className="text-red-600">• {req}</li>
                              ))
                            ) : (
                              <li className="text-green-600">• None!</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {pwaCheck.missingRequirements.includes('installPrompt') && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <strong>💡 Install Prompt Missing:</strong> Chrome needs time to determine installability. 
                          Try: waiting 30+ seconds, scrolling, clicking, or visiting multiple times.
                        </div>
                      )}

                      {pwaCheck.missingRequirements.includes('engagement') && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                          <strong>👆 User Engagement Required:</strong> Click around, scroll, or interact with the page more.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Page
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const pwaCheck = checkPWARequirements();
                    console.log('🔍 PWA Requirements Check:', pwaCheck);
                    console.log('🎯 Current PWA State:', { isInstallable, isInstalled, debugInfo, deviceInfo });
                  }}
                >
                  📊 Log Status
                </Button>
              </div>
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
                {deviceInfo.isIOS 
                  ? "Safari's 'Add to Home Screen' creates a full app experience on your iPhone/iPad"
                  : instructions.canAutoInstall 
                  ? "Automatic installation should be available - check for install prompts!"
                  : "Follow these steps to install the app on your device"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deviceInfo.isIOS && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">🍎</span>
                    <h4 className="font-bold text-blue-800">iPhone/iPad Quick Guide:</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">📱 What to Look For:</h5>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Share button (□↗) in Safari toolbar</li>
                        <li>• Usually at bottom of screen</li>
                        <li>• "Add to Home Screen" option in menu</li>
                        <li>• App icon preview will appear</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">⚡ Benefits:</h5>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Works like a native app</li>
                        <li>• Opens without Safari address bar</li>
                        <li>• Available offline for core features</li>
                        <li>• Much faster than web version</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
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
              
              {deviceInfo.isIOS && deviceInfo.isSafari && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Perfect Setup!</strong> You're using Safari on iOS - this is ideal for PWA installation. 
                    The "Add to Home Screen" feature will give you the full app experience.
                  </AlertDescription>
                </Alert>
              )}
              
              {deviceInfo.isIOS && !deviceInfo.isSafari && (
                <Alert className="mt-4 bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Recommendation:</strong> For the best iOS installation experience, 
                    try opening this page in Safari and using "Add to Home Screen".
                  </AlertDescription>
                </Alert>
              )}
              
              {instructions.canAutoInstall && !deviceInfo.isIOS && (
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

        {/* Additional Content Section - Added to push install buttons lower */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              <span>Technical Requirements & Setup</span>
            </CardTitle>
            <CardDescription>
              Device and browser requirements for optimal PWA experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-lg">🔧 System Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Modern browser (Chrome 68+, Safari 11+, Edge 79+)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>HTTPS connection (secure site)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Service Worker support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Manifest file with valid icons</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-lg">📱 Platform Support</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🤖</span>
                      <span>Android: Full PWA support in Chrome</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🍎</span>
                      <span>iOS: Add to Home Screen via Safari</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">🖥️</span>
                      <span>Desktop: Chrome, Edge, Firefox support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-lg">💻</span>
                      <span>Mac: Safari and Chrome PWA support</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 text-lg">⚡ Performance Benefits</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <h5 className="font-medium">Faster Loading</h5>
                    <p className="text-xs text-gray-600 mt-1">Up to 3x faster than web version</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">📴</div>
                    <h5 className="font-medium">Offline Ready</h5>
                    <p className="text-xs text-gray-600 mt-1">Works without internet connection</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">📲</div>
                    <h5 className="font-medium">Native Feel</h5>
                    <p className="text-xs text-gray-600 mt-1">App-like experience on device</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section - Additional content to ensure proper page movement */}
        <Card>
          <CardHeader>
            <CardTitle>❓ Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about the SteppersLife Staff App
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-medium">What happens if I lose internet connection?</h5>
                <p className="text-sm text-gray-600 mt-1">The app continues to work offline. All data is cached locally and will sync when connection is restored.</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-medium">How do I update the app?</h5>
                <p className="text-sm text-gray-600 mt-1">Updates happen automatically when you're online. You'll see a notification when a new version is available.</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h5 className="font-medium">Can I use this on multiple devices?</h5>
                <p className="text-sm text-gray-600 mt-1">Yes! Install the app on all your devices. Your data stays synced across all installations.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h5 className="font-medium">Is my data secure?</h5>
                <p className="text-sm text-gray-600 mt-1">All data is encrypted and transmitted over secure HTTPS connections. Local data is also protected.</p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Install Buttons Section - MOVED TO BOTTOM for Google PWA "page movement" requirement */}
        <div className="mt-12 pt-8 border-t-4 border-dashed border-blue-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Ready to Install?</h2>
            <p className="text-lg text-gray-600">Download the app now for the best experience!</p>
          </div>
          {renderInstallButtons()}
        </div>
      </div>
    </div>
  );
};

export default StaffInstallPage; 