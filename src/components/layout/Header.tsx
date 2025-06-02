
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-header-bg border-b border-border-default sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-text-on-primary font-bold text-sm">SL</span>
            </div>
            <span className="font-serif font-semibold text-xl text-header-text">SteppersLife</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/explore" 
              className={`font-medium transition-colors ${
                isActiveLink('/explore') 
                  ? 'text-header-link-active' 
                  : 'text-header-text hover:text-header-link-active'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/events" 
              className={`font-medium transition-colors ${
                isActiveLink('/events') 
                  ? 'text-header-link-active' 
                  : 'text-header-text hover:text-header-link-active'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/classes" 
              className={`font-medium transition-colors ${
                isActiveLink('/classes') 
                  ? 'text-header-link-active' 
                  : 'text-header-text hover:text-header-link-active'
              }`}
            >
              Classes
            </Link>
            <Link 
              to="/instructors" 
              className={`font-medium transition-colors ${
                isActiveLink('/instructors') 
                  ? 'text-header-link-active' 
                  : 'text-header-text hover:text-header-link-active'
              }`}
            >
              Instructors
            </Link>
            <Link 
              to="/community" 
              className={`font-medium transition-colors ${
                isActiveLink('/community') 
                  ? 'text-header-link-active' 
                  : 'text-header-text hover:text-header-link-active'
              }`}
            >
              Community
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-brand-primary hover:bg-brand-primary-hover">
                <Link to="/auth/register">Join Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
