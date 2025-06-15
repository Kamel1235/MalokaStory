
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { THEME_COLORS, SITE_NAME, NAVIGATION_LINKS, DEFAULT_SITE_LOGO_URL, ADMIN_SETTINGS_SITE_LOGO_KEY } from '../../constants';
import { EarringIcon } from '../icons/EarringIcon';
import { RingIcon } from '../icons/RingIcon';
import { NecklaceIcon } from '../icons/NecklaceIcon';
import { OfferIcon } from '../icons/OfferIcon';
import { ContactIcon } from '../icons/ContactIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { MenuIcon } from '../icons/MenuIcon';
import { CloseIcon } from '../icons/CloseIcon';
import useLocalStorage from '../../hooks/useLocalStorage'; // Import useLocalStorage

const IconMap: { [key: string]: React.FC<{className?: string}> } = {
  HomeIcon,
  EarringIcon,
  RingIcon,
  NecklaceIcon,
  OfferIcon,
  ContactIcon,
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteLogoUrl] = useLocalStorage<string>(ADMIN_SETTINGS_SITE_LOGO_KEY, DEFAULT_SITE_LOGO_URL);

  const activeLinkStyle = `${THEME_COLORS.accentGold} font-bold`;
  const inactiveLinkStyle = `${THEME_COLORS.textSecondary} hover:${THEME_COLORS.accentGold}`;

  const navItems = NAVIGATION_LINKS.map(link => {
    const IconComponent = IconMap[link.icon];
    return (
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) => 
          `flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${isActive ? activeLinkStyle : inactiveLinkStyle}`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {IconComponent && <IconComponent className="w-7 h-7 mb-1" />}
        <span className="text-xs">{link.name}</span>
      </NavLink>
    );
  });

  return (
    <header className={`${THEME_COLORS.cardBackground} shadow-lg sticky top-0 z-40 bg-opacity-80 backdrop-blur-md`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className={`flex items-center text-3xl font-bold ${THEME_COLORS.accentGold}`}>
            <img 
              src={siteLogoUrl || DEFAULT_SITE_LOGO_URL} 
              alt="Maloka Story Logo" 
              className="h-10 w-auto mr-3 object-contain" // Added object-contain
              onError={(e) => (e.currentTarget.src = DEFAULT_SITE_LOGO_URL)} // Fallback for broken images
            />
            <span>{SITE_NAME}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-3 items-center">
            {navItems}
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                `p-2 rounded-md transition-colors duration-200 ${isActive ? activeLinkStyle : inactiveLinkStyle} text-sm`
              }
            >
              لوحة التحكم
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={THEME_COLORS.textPrimary}>
              {isMobileMenuOpen ? <CloseIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 ${THEME_COLORS.cardBackground} shadow-xl pb-4 border-t ${THEME_COLORS.borderColor}`}>
          <nav className="flex flex-col items-center space-y-2 p-4">
            {navItems}
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                `w-full text-center p-2 rounded-md transition-colors duration-200 ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              لوحة التحكم
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;