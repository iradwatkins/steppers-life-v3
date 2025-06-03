import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PWAInstallButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'ghost',
  size = 'sm',
  showText = true,
  className = '',
}) => {
  const { 
    isInstallable, 
    isInstalled, 
    isInstalling, 
    install, 
    getInstallInstructions,
    deviceInfo 
  } = usePWAInstall();

  const instructions = getInstallInstructions();

  if (isInstalled) {
    return (
      <Button variant={variant} size={size} className={`${className} cursor-default`} disabled>
        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
        {showText && <span>App Installed</span>}
      </Button>
    );
  }

  if (isInstallable && instructions.canAutoInstall) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={install}
        disabled={isInstalling}
      >
        {isInstalling ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {showText && (
          <span>
            {isInstalling ? 'Installing...' : 'Install App'}
          </span>
        )}
      </Button>
    );
  }

  // Show dropdown with instructions for manual installation
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Smartphone className="h-4 w-4 mr-2" />
          {showText && <span>Install App</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            {instructions.title}
          </h4>
          <ol className="text-xs text-gray-600 space-y-1 mb-3">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          
          {/* Quick device info */}
          <div className="text-xs text-gray-500 pt-2 border-t">
            <span>
              {deviceInfo.isAndroid ? '📱 Android' : 
               deviceInfo.isIOS ? '🍎 iOS' : 
               deviceInfo.isMac ? '💻 Mac' : 
               deviceInfo.isWindows ? '🖥️ Windows' : '📱 Device'} • {' '}
              {deviceInfo.isChrome ? 'Chrome' : 
               deviceInfo.isSafari ? 'Safari' : 'Other Browser'}
            </span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => window.open('/staff-install', '_blank')}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>View Full Install Guide</span>
        </DropdownMenuItem>
        
        {!deviceInfo.isChrome && !deviceInfo.isSafari && (
          <DropdownMenuItem className="text-orange-600">
            <span className="text-xs">💡 Try Chrome or Safari for better PWA support</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PWAInstallButton; 