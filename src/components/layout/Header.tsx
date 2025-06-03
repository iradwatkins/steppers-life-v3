import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, Plus, CalendarPlus, ListPlus, Store, Users2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminCheck } from '@/hooks/useAdminCheck';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdminCheck();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'Events', href: '/events' },
    { name: 'Classes', href: '/classes' },
    { name: 'Community', href: '/community' },
    { name: 'Instructors', href: '/instructors' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-header-bg border-b border-border-default sticky top-0 z-50">
      <div className="container mx-auto px-4">
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
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'text-header-link-active'
                    : 'text-header-text hover:text-header-link-active'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user ? (
              <>
                {/* Post Content Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-header-text hover:text-header-link-active">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/organizer/events/create" className="flex items-center">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        <span>Post Event</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center">
                        <ListPlus className="mr-2 h-4 w-4" />
                        <span>List Class</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Add Store/Service</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center">
                        <Users2 className="mr-2 h-4 w-4" />
                        <span>Create Community</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/docs" className="flex items-center">
                        <span>Docs</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-header-text hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-default">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-header-link-active bg-brand-primary/10'
                      : 'text-header-text hover:text-header-link-active hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/docs"
                    className="px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  {/* Mobile Post Content Options */}
                  <div className="pt-2 border-t border-border-default mt-2">
                     <Link
                        to="/organizer/events/create"
                        className="flex items-center px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        <span>Post Event</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ListPlus className="mr-2 h-4 w-4" />
                        <span>List Class</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Store className="mr-2 h-4 w-4" />
                        <span>Add Store/Service</span>
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center px-3 py-2 text-sm font-medium text-header-text hover:text-header-link-active hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users2 className="mr-2 h-4 w-4" />
                        <span>Create Community</span>
                      </Link>
                  </div>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-2 text-sm font-medium text-left text-header-text hover:text-header-link-active hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-3 pt-2">
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
