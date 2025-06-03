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
  Chrome
} from 'lucide-react';

const StaffInstallPage = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installStatus, setInstallStatus] = useState<'available' | 'installing' | 'installed' | 'not-available'>('not-available');

  useEffect(() => {
    // Detect device and browser type
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Device detection
    setIsAndroid(userAgent.includes('android'));
    setIsIOS(/ipad|iphone|ipod/.test(userAgent));
    setIsMac(userAgent.includes('mac') && !userAgent.includes('iphone') && !userAgent.includes('ipad'));
    setIsWindows(userAgent.includes('windows'));
    
    // Browser detection
    setIsChrome(userAgent.includes('chrome') && !userAgent.includes('edg'));
    setIsSafari(userAgent.includes('safari') && !userAgent.includes('chrome'));

    // PWA install prompt detection
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setInstallStatus('available');
    };

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setInstallStatus('installed');
      }
    };

    // Online/offline detection
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstallStatus('installing');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallStatus('installed');
        setIsInstallable(false);
      } else {
        setInstallStatus('available');
      }
      setDeferredPrompt(null);
    }
  };

  const handleManualInstall = () => {
    // Scroll to instructions
    document.getElementById('install-instructions')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDeviceInstructions = () => {
    if (isAndroid && isChrome) {
      return {
        title: "Android Chrome Installation",
        steps: [
          "Look for the 'Add SteppersLife to Home screen' banner at the bottom",
          "Tap the [Add] button",
          "Or tap the three-dot menu → 'Add to Home screen'",
          "The app will appear on your home screen",
          "Open from home screen for full-screen experience"
        ],
        icon: "🤖",
        autoInstall: true
      };
    } else if (isAndroid) {
      return {
        title: "Android Installation",
        steps: [
          "Open this page in Chrome browser for best experience",
          "Tap the three-dot menu → 'Add to Home screen'",
          "Name the shortcut 'SteppersLife Staff'",
          "Tap 'Add' to create home screen icon"
        ],
        icon: "🤖",
        autoInstall: false
      };
    } else if (isIOS && isSafari) {
      return {
        title: "iPhone/iPad Installation (Safari)",
        steps: [
          "Tap the Share button (□↗) at the bottom of Safari",
          "Scroll down and tap 'Add to Home Screen'",
          "Edit the name to 'SteppersLife Staff' if desired",
          "Tap 'Add' in the top-right corner",
          "Find the app icon on your home screen"
        ],
        icon: "🍎",
        autoInstall: false
      };
    } else if (isIOS) {
      return {
        title: "iPhone/iPad Installation",
        steps: [
          "Open this page in Safari browser (not Chrome)",
          "Tap the Share button at the bottom",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to install the app"
        ],
        icon: "🍎",
        autoInstall: false
      };
    } else if (isMac && isSafari) {
      return {
        title: "Mac Safari Installation",
        steps: [
          "Look for 'Install SteppersLife...' in the File menu",
          "Or check the address bar for an install icon",
          "Follow the prompts to install",
          "The app will appear in your Applications folder"
        ],
        icon: "🍎",
        autoInstall: false
      };
    } else if ((isMac || isWindows) && isChrome) {
      return {
        title: "Desktop Chrome Installation",
        steps: [
          "Look for the install icon (⊕) in the address bar",
          "Click the install button",
          "Click 'Install' in the confirmation dialog",
          "The app will open in its own window",
          "Find it in your applications or on desktop"
        ],
        icon: "💻",
        autoInstall: true
      };
    } else {
      return {
        title: "Desktop Installation",
        steps: [
          "Use Chrome, Edge, or Safari for best PWA support",
          "Look for an install option in the browser menu",
          "Or bookmark this page for quick access",
          "Consider using Chrome for full PWA features"
        ],
        icon: "💻",
        autoInstall: false
      };
    }
  };

  const instructions = getDeviceInstructions();

  const renderInstallButtons = () => {
    if (installStatus === 'installed') {
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
      <div className="space-y-4">
        {/* Primary Install Button */}
        {isInstallable && deferredPrompt ? (
          <Alert className="bg-blue-50 border-blue-200">
            <Download className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                🎉 Ready to install! One-click installation available.
              </span>
              <Button 
                onClick={handleInstallClick} 
                className="ml-4 bg-blue-600 hover:bg-blue-700"
                disabled={installStatus === 'installing'}
              >
                {installStatus === 'installing' ? (
                  <>Installing...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Install App Now
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          // Platform-specific install buttons
          <div className="grid gap-4">
            {/* Android Install Button */}
            {isAndroid && (
              <Button 
                size="lg" 
                onClick={handleManualInstall}
                className="h-16 bg-green-600 hover:bg-green-700 text-white"
              >
                <Smartphone className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Install on Android</div>
                  <div className="text-sm opacity-90">Add to Home Screen</div>
                </div>
              </Button>
            )}

            {/* iOS Install Button */}
            {isIOS && (
              <Button 
                size="lg" 
                onClick={handleManualInstall}
                className="h-16 bg-gray-800 hover:bg-gray-900 text-white"
              >
                <Apple className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Install on iPhone/iPad</div>
                  <div className="text-sm opacity-90">Use Safari Share Button</div>
                </div>
              </Button>
            )}

            {/* Mac Install Button */}
            {isMac && !isIOS && (
              <Button 
                size="lg" 
                onClick={handleManualInstall}
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Monitor className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Install on Mac</div>
                  <div className="text-sm opacity-90">
                    {isChrome ? 'Chrome Install Button' : 'Safari File Menu'}
                  </div>
                </div>
              </Button>
            )}

            {/* Windows Install Button */}
            {isWindows && (
              <Button 
                size="lg" 
                onClick={handleManualInstall}
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Monitor className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Install on Windows</div>
                  <div className="text-sm opacity-90">
                    {isChrome ? 'Chrome Install Button' : 'Browser Menu Option'}
                  </div>
                </div>
              </Button>
            )}

            {/* Generic Install Button */}
            {!isAndroid && !isIOS && !isMac && !isWindows && (
              <Button 
                size="lg" 
                onClick={handleManualInstall}
                className="h-16 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Install PWA</div>
                  <div className="text-sm opacity-90">See instructions below</div>
                </div>
              </Button>
            )}
          </div>
        )}

        {/* Browser Recommendation */}
        {!isChrome && !isSafari && (
          <Alert className="bg-orange-50 border-orange-200">
            <Chrome className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Tip:</strong> For the best PWA experience, try opening this page in Chrome (Android/Windows/Mac) or Safari (iOS/Mac).
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
            <Smartphone className="h-8 w-8 text-blue-600" />
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

        {/* Install Buttons Section */}
        {renderInstallButtons()}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Installation Instructions */}
          <Card id="install-instructions">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{instructions.icon}</span>
                <span>{instructions.title}</span>
              </CardTitle>
              <CardDescription>
                {instructions.autoInstall 
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
              
              {instructions.autoInstall && (
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
              isAndroid ? 'Android' : 
              isIOS ? 'iOS' : 
              isMac ? 'Mac' : 
              isWindows ? 'Windows' : 
              'Unknown'
            } • {
              isChrome ? 'Chrome' : 
              isSafari ? 'Safari' : 
              'Other Browser'
            } • 
            <strong>PWA Support:</strong> {instructions.autoInstall ? 'Full' : 'Manual'} • 
            <strong>Offline:</strong> Full functionality available without internet
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default StaffInstallPage; 