import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe, Shield, Lock, X, Scissors } from 'lucide-react';

export const Navbar = () => {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);

  const handleStaffClick = (route) => {
    // If already verified or authenticated in session, navigate directly
    const isUnlocked = sessionStorage.getItem('salon_staff_unlocked') === 'true';
    if (isUnlocked) {
      navigate(route);
    } else {
      setTargetRoute(route);
      setPin('');
      setError(false);
      setShowStaffModal(true);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      sessionStorage.setItem('salon_staff_unlocked', 'true');
      setShowStaffModal(false);
      if (targetRoute) {
        navigate(targetRoute);
      }
    } else {
      setError(true);
    }
  };

  const isTvDisplay = location.pathname === '/display';

  // Do not show full header on TV Display to keep it 1080p clean without interactive clutter,
  // but keep small corner toggles
  if (isTvDisplay) {
    return (
      <header className="fixed top-3 right-4 z-50 flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800/90 hover:bg-charcoal-700 border border-gold-500/40 text-gold-300 text-xs font-semibold backdrop-blur transition-all min-h-[36px]"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
        </button>
        <Link
          to="/"
          className="px-3 py-1.5 rounded-lg bg-charcoal-800/90 hover:bg-charcoal-700 border border-charcoal-600 text-gray-300 text-xs font-medium backdrop-blur transition-all min-h-[36px] flex items-center"
        >
          {t('navHome')}
        </Link>
      </header>
    );
  }

  return (
    <nav className="sticky top-0 z-40 bg-charcoal-800/95 backdrop-blur border-b border-charcoal-700/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-charcoal-900 font-bold shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-charcoal-900 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif tracking-wider font-bold text-lg text-gold-400 block leading-tight">
                {t('salonName')}
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase block">
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Right Controls: Language Toggle & Staff Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-700 border border-gold-500/50 text-gold-400 text-xs sm:text-sm font-semibold transition-all min-h-touch active:scale-95 shadow-sm"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-gold-400" />
              <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
            </button>

            {/* Staff Quick Menu */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-700/80 hover:bg-charcoal-700 text-gray-200 text-xs sm:text-sm font-medium border border-charcoal-600 transition-all min-h-touch"
              >
                <Shield className="w-4 h-4 text-gold-400" />
                <span className="hidden sm:inline">{t('staffAccess')}</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-800 border border-charcoal-700 shadow-2xl py-2 hidden group-hover:block hover:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-charcoal-700">
                  {t('staffNavTitle')}
                </div>
                <button
                  onClick={() => handleStaffClick('/reception')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-charcoal-700/70 hover:text-gold-300 flex items-center justify-between"
                >
                  <span>{t('navReception')}</span>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button
                  onClick={() => handleStaffClick('/barber/Ravi')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-charcoal-700/70 hover:text-gold-300 flex items-center justify-between"
                >
                  <span>{t('navBarber')} (Ravi)</span>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <Link
                  to="/display"
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-charcoal-700/70 hover:text-gold-300 block"
                >
                  {t('navDisplay')}
                </Link>
                <button
                  onClick={() => handleStaffClick('/admin')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-charcoal-700/70 hover:text-gold-300 flex items-center justify-between border-t border-charcoal-700/60 mt-1 pt-2"
                >
                  <span>{t('navAdmin')}</span>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff PIN Modal (PIN: 1234) */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-charcoal-800 border border-gold-500/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowStaffModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('pinRequired')}</h3>
              <p className="text-xs text-gray-400 mt-1">Default Demo PIN: <span className="text-gold-400 font-mono font-bold">1234</span></p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                  placeholder={t('enterPin')}
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2 text-center font-medium">
                    {t('invalidPin')}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-charcoal-700 hover:bg-charcoal-600 text-gray-300 font-medium text-sm transition-all min-h-touch"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm transition-all min-h-touch"
                >
                  {t('unlock')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};
