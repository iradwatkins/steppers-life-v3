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
import { usePWAInstall } from '@/hooks/usePWAInstall';
import PWAInstallButton from '@/components/PWAInstallButton';

const StaffInstallPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { 
    isInstallable, 
    isInstalled, 
    isInstalling, 
    install, 
    getInstallInstructions,
    deviceInfo 
  } = usePWAInstall();

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
      
      .blink-blue-yellow {
        animation: blinkBlueYellow 1.5s infinite, pulse 2s infinite;
      }
      
      .blink-green-yellow {
        animation: blinkGreenYellow 1.5s infinite, pulse 2s infinite;
      }
      
      .blink-gray-yellow {
        animation: blinkGrayYellow 1.5s infinite, pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);

    // Online/offline detection
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      // Clean up the style element
      document.head.removeChild(style);
    };
  }, []);

  const handlePlatformInstall = async () => {
    // Try auto-install first if available
    const success = await install();
    if (!success) {
      // Fall back to scrolling to instructions if auto-install not available
      document.getElementById('install-instructions')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <div className="space-y-4">
        {/* Primary Install Button */}
        {isInstallable && instructions.canAutoInstall ? (
          <Alert className="bg-blue-50 border-blue-200 relative overflow-hidden">
            <Download className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                🎉 Ready to install! One-click installation available.
              </span>
              <Button 
                onClick={install} 
                className="ml-4 blink-blue-yellow text-white font-bold"
                disabled={isInstalling}
                size="lg"
              >
                {isInstalling ? (
                  <>🔄 Installing...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    🚀 INSTALL APP NOW
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          // Platform-specific install buttons
          <div className="grid gap-4">
            {/* Android Install Button */}
            {deviceInfo.isAndroid && (
              <Button 
                size="lg" 
                onClick={handlePlatformInstall}
                className="h-20 blink-green-yellow text-white font-bold text-lg relative overflow-hidden"
                disabled={isInstalling}
              >
                <Smartphone className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-xl">
                    {isInstalling ? '🔄 INSTALLING...' : '📱 INSTALL ON ANDROID'}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {isInstallable ? 'Click for instant install!' : 'Tap to see how → Add to Home Screen'}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-2xl animate-bounce">
                    {isInstallable ? '⚡' : '⬇️'}
                  </span>
                </div>
              </Button>
            )}

            {/* iOS Install Button */}
            {deviceInfo.isIOS && (
              <Button 
                size="lg" 
                onClick={handlePlatformInstall}
                className="h-20 blink-gray-yellow text-white font-bold text-lg relative overflow-hidden"
                disabled={isInstalling}
              >
                <Apple className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-xl">
                    {isInstalling ? '🔄 INSTALLING...' : '🍎 INSTALL ON iPHONE/iPAD'}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {isInstallable ? 'Click for instant install!' : 'Tap to see how → Safari Share Button'}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-2xl animate-bounce">
                    {isInstallable ? '⚡' : '⬇️'}
                  </span>
                </div>
              </Button>
            )}

            {/* Mac Install Button */}
            {deviceInfo.isMac && !deviceInfo.isIOS && (
              <Button 
                size="lg" 
                onClick={handlePlatformInstall}
                className="h-20 blink-blue-yellow text-white font-bold text-lg relative overflow-hidden"
                disabled={isInstalling}
              >
                <Monitor className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-xl">
                    {isInstalling ? '🔄 INSTALLING...' : '💻 INSTALL ON MAC'}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {isInstallable ? 'Click for instant install!' : `Tap to see how → ${deviceInfo.isChrome ? 'Chrome Install Button' : 'Safari File Menu'}`}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-2xl animate-bounce">
                    {isInstallable ? '⚡' : '⬇️'}
                  </span>
                </div>
              </Button>
            )}

            {/* Windows Install Button */}
            {deviceInfo.isWindows && (
              <Button 
                size="lg" 
                onClick={handlePlatformInstall}
                className="h-20 blink-blue-yellow text-white font-bold text-lg relative overflow-hidden"
                disabled={isInstalling}
              >
                <Monitor className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-xl">
                    {isInstalling ? '🔄 INSTALLING...' : '🖥️ INSTALL ON WINDOWS'}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {isInstallable ? 'Click for instant install!' : `Tap to see how → ${deviceInfo.isChrome ? 'Chrome Install Button' : 'Browser Menu Option'}`}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-2xl animate-bounce">
                    {isInstallable ? '⚡' : '⬇️'}
                  </span>
                </div>
              </Button>
            )}

            {/* Generic Install Button */}
            {!deviceInfo.isAndroid && !deviceInfo.isIOS && !deviceInfo.isMac && !deviceInfo.isWindows && (
              <Button 
                size="lg" 
                onClick={handlePlatformInstall}
                className="h-20 blink-blue-yellow text-white font-bold text-lg relative overflow-hidden"
                disabled={isInstalling}
              >
                <Download className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-xl">
                    {isInstalling ? '🔄 INSTALLING...' : '📲 INSTALL PWA'}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {isInstallable ? 'Click for instant install!' : 'Tap to see instructions below'}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-2xl animate-bounce">
                    {isInstallable ? '⚡' : '⬇️'}
                  </span>
                </div>
              </Button>
            )}
          </div>
        )}

        {/* Attention Banner */}
        <Alert className="bg-gradient-to-r from-yellow-100 to-blue-100 border-yellow-300 border-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse" />
          <AlertDescription className="text-center">
            <span className="font-bold text-yellow-800 text-lg">
              👆 CLICK THE BUTTON ABOVE TO INSTALL THE APP! 👆
            </span>
            <br />
            <span className="text-yellow-700">
              The app works offline and is much faster than using the website!
            </span>
          </AlertDescription>
        </Alert>

        {/* Browser Recommendation */}
        {!deviceInfo.isChrome && !deviceInfo.isSafari && (
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

        {/* Install Buttons Section */}
        {renderInstallButtons()}

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
    </div>
  );
};

export default StaffInstallPage; 