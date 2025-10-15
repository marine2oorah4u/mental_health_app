import React, { useState } from 'react';
import { Menu, X, Home, Book, Users, Heart, MapPin, Settings, FileText, Gamepad2, ClipboardList, Award, Phone, LogIn, LogOut, User as UserIcon, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'disabilities', label: 'Support Guides', icon: Heart },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'planning', label: 'Planning', icon: ClipboardList },
    { id: 'awards', label: 'Awards', icon: Award },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'activities', label: 'Activities', icon: Gamepad2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <div className="brand-icon">🏕️</div>
          <div className="brand-text">
            <h1 className="brand-title">Scout Inclusion</h1>
            <p className="brand-subtitle">Supporting Every Scout</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user ? (
            <>
              <button
                onClick={() => onNavigate('profiles')}
                className={`nav-link ${currentPage === 'profiles' ? 'active' : ''}`}
              >
                <UserIcon size={20} />
                <span>My Scouts</span>
              </button>
              <button
                onClick={handleSignOut}
                className="nav-link"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className={`nav-link ${currentPage === 'auth' ? 'active' : ''}`}
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user ? (
            <>
              <button
                onClick={() => {
                  onNavigate('profiles');
                  setMobileMenuOpen(false);
                }}
                className={`mobile-nav-link ${currentPage === 'profiles' ? 'active' : ''}`}
              >
                <UserIcon size={20} />
                <span>My Scouts</span>
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="mobile-nav-link"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigate('auth');
                setMobileMenuOpen(false);
              }}
              className={`mobile-nav-link ${currentPage === 'auth' ? 'active' : ''}`}
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
