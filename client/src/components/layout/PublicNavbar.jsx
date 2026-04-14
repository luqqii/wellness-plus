import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FREE_TOOLS_ITEMS = [
  { label: 'BMI Calculator', href: '/bmi-calculator', desc: 'Find your body mass index' },
  { label: 'Macro Calculator', href: '/macro-calculator', desc: 'Protein, carb & fat targets' },
  { label: 'Calorie Deficit Calculator', href: '/calorie-deficit-calculator', desc: 'Daily calorie goal' },
  { label: 'Personality Quiz', href: '/personality-quiz', desc: 'Discover your eating style' },
  { label: 'Food Color Guide', href: '/food-guide', desc: 'Green / Yellow / Orange system' },
];

const COMPANY_ITEMS = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Research', href: '/research' },
  { label: 'Press', href: '/press' },
];


function NavDropdown({ title, items, active }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div 
      className="nav-dropdown-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <button style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 14, fontWeight: 700, color: active ? '#EC5A42' : '#0C2B35',
        textTransform: 'uppercase', letterSpacing: '0.5px',
        padding: '12px 0', transition: 'color 0.2s'
      }}>
        {title}
        <ChevronDown size={14} style={{ 
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' 
        }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              width: 280, background: '#FFFFFF', borderRadius: 20,
              boxShadow: '0 20px 50px rgba(12, 43, 53, 0.12)',
              border: '1px solid #E8DED8', padding: '12px', zIndex: 1000,
              marginTop: 10
            }}
          >
            {/* Arrow */}
            <div style={{
              position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
              width: 12, height: 12, background: '#FFFFFF', borderTop: '1px solid #E8DED8', borderLeft: '1px solid #E8DED8'
            }} />
            
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 2,
                  padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                className="dropdown-item"
              >
                <style>{`.dropdown-item:hover { background: #FFF3EB; }`}</style>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0C2B35' }}>{item.label}</span>
                {item.desc && <span style={{ fontSize: 12, color: '#718096', fontWeight: 500 }}>{item.desc}</span>}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900, height: scrolled ? 64 : 80,
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 243, 235, 0.98)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid #E8DED8' : '1px solid transparent',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
    }}>
      {/* Left: Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EC5A42', boxShadow: '0 4px 12px rgba(236,90,66,0.3)' }} />
        <span style={{ fontSize: 22, fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Wellness+</span>
      </Link>

      {/* Center: Desktop Links */}
      <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <style>{`@media (max-width: 1024px) { .desktop-links { display: none !important; } .desktop-actions { display: none !important; } .mobile-toggle { display: flex !important; } } @media (min-width: 1025px) { .mobile-toggle { display: none !important; } }`}</style>
        
        <Link to="/careers" style={{ textDecoration: 'none', color: isActive('/careers') ? '#EC5A42' : '#0C2B35', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }}>Careers</Link>
        <Link to="/weight-loss" style={{ textDecoration: 'none', color: isActive('/weight-loss') ? '#EC5A42' : '#0C2B35', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }}>Product</Link>
        
        <NavDropdown title="Free Tools" items={FREE_TOOLS_ITEMS} active={location.pathname.includes('calculator') || location.pathname.includes('quiz')} />
        <NavDropdown title="Company" items={COMPANY_ITEMS} active={isActive('/about') || isActive('/press') || isActive('/research')} />
        
        <Link to="/support" style={{ textDecoration: 'none', color: isActive('/support') ? '#EC5A42' : '#0C2B35', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }}>Support</Link>
      </div>

      {/* Right: Actions */}
      <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Login</Link>
        
        <button 
          onClick={() => navigate('/signup')}
          style={{
            background: '#0C2B35', color: 'white', border: 'none', padding: '10px 24px',
            borderRadius: 999, fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(12,43,53,0.15)', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(12,43,53,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(12,43,53,0.15)'; }}
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', display: 'none',
          alignItems: 'center', justifyContent: 'center', width: 40, height: 40, color: '#0C2B35'
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFF3EB',
              borderBottom: '1px solid #E8DED8', overflow: 'hidden', zIndex: 899
            }}
          >
            <div style={{ padding: '24px 5% 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Link to="/weight-loss" style={{ fontSize: 18, fontWeight: 800, color: '#0C2B35', textDecoration: 'none' }}>Product</Link>
              <div style={{ borderTop: '1px solid #E8DED8', paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#EC5A42', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Free Tools</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {FREE_TOOLS_ITEMS.map(item => (
                    <Link key={item.href} to={item.href} style={{ fontSize: 16, fontWeight: 700, color: '#0C2B35', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {item.label} <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #E8DED8', paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#EC5A42', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Company</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {COMPANY_ITEMS.map(item => (
                    <Link key={item.href} to={item.href} style={{ fontSize: 16, fontWeight: 700, color: '#0C2B35', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {item.label} <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/careers" style={{ fontSize: 18, fontWeight: 800, color: '#0C2B35', textDecoration: 'none' }}>Careers</Link>
              <Link to="/support" style={{ fontSize: 18, fontWeight: 800, color: '#0C2B35', textDecoration: 'none' }}>Support</Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                <button onClick={() => navigate('/signup')} style={{ background: '#EC5A42', color: 'white', padding: '16px', borderRadius: 999, border: 'none', fontSize: 17, fontWeight: 800, cursor: 'pointer' }}>Sign Up</button>
                <button onClick={() => navigate('/login')} style={{ background: '#FFFFFF', color: '#0C2B35', padding: '14px', borderRadius: 999, border: '2px solid #E8DED8', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Login</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
