import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, User } from 'lucide-react';

const BottomNavPWA = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-default z-50 safe-area-bottom">
      <div className="grid grid-cols-5 h-14 xs:h-16 sm:h-16">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center space-y-0.5 xs:space-y-1 transition-colors px-1 ${
                isActive 
                  ? 'text-brand-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5" />
              <span className="text-xs xs:text-xs sm:text-xs font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavPWA;
