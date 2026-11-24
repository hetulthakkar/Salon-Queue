import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowLeft, Clock, Bell, User, AlertTriangle, X } from 'lucide-react';

export const StatusPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [demoStatus, setDemoStatus] = useState('Waiting'); // 'Waiting' | 'Called' | 'In Chair'

  const tokenDisplay = id || 'S-14';

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 text-gold-400" />
          <span>{t('backToHome')}</span>
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-charcoal-800 border border-gold-500/30 text-gold-400 font-mono font-bold">
          {tokenDisplay}
        </span>
      </div>

      {/* Hero Token Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600"></div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
          {t('tokenLabel')}
        </p>
        <div className="text-6xl font-black font-mono tracking-tight text-gold-400 py-1 drop-shadow-md">
          {tokenDisplay}
        </div>
        <div className="pt-2 border-t border-charcoal-700/80 text-xs text-gray-300 space-y-1">
          <p><strong className="text-white">Kunal Shah</strong> • Preferred: <span className="text-gold-400 font-medium">Amit</span></p>
          <p className="text-gray-400">Haircut (30m), Beard Trim (15m)</p>
        </div>
      </div>

      {/* Dynamic Status Alert Takeover Banners */}
      {demoStatus === 'Called' ? (
        <div className="bg-gradient-to-br from-gold-500 to-gold-600 text-charcoal-950 rounded-2xl p-6 text-center space-y-3 shadow-2xl animate-pulse">
          <Bell className="w-12 h-12 mx-auto stroke-[2.5]" />
          <h2 className="text-2xl font-black tracking-tight uppercase">
            {t('alertCalledTitle')}
          </h2>
          <p className="text-sm font-semibold">
            {t('alertCalledSubtitle')} (Amit - Chair 2)
          </p>
        </div>
      ) : demoStatus === 'In Chair' ? (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-5 text-center text-emerald-300 space-y-2">
          <p className="text-sm font-bold">{t('alertInChair')}</p>
        </div>
      ) : (
        /* Live Countdown Ring & Position Badge */
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 text-center space-y-4">
          <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center rounded-full border-4 border-charcoal-700 border-t-gold-500 shadow-inner">
            <span className="text-3xl font-extrabold text-white">~35</span>
            <span className="text-xs text-gray-400 font-medium uppercase">{t('durationUnit')} {t('estimatedWait')}</span>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold">
            {t('yourPosition')}: 4th in line
          </div>

          {/* Position #2 simulated alert */}
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs text-left">
            <p className="font-semibold">{t('alertPos2')}</p>
          </div>
        </div>
      )}

      {/* Demo State Switcher for Previewing All States */}
      <div className="p-3 rounded-xl bg-charcoal-800/60 border border-charcoal-700/60 space-y-2">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider text-center">
          Preview Status States
        </p>
        <div className="flex gap-2">
          {['Waiting', 'Called', 'In Chair'].map((st) => (
            <button
              key={st}
              onClick={() => setDemoStatus(st)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-all ${
                demoStatus === st
                  ? 'bg-gold-500 text-charcoal-950 font-bold'
                  : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cancel Action */}
      {demoStatus === 'Waiting' && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 rounded-xl border border-red-500/50 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-all min-h-touch"
        >
          {t('cancelSpotBtn')}
        </button>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal-800 border border-red-500/40 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">{t('confirmCancelTitle')}</h3>
              <p className="text-xs text-gray-400 mt-1">{t('confirmCancelMsg')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-charcoal-700 text-gray-300 text-xs font-bold min-h-touch"
              >
                {t('keepMySpot')}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-touch"
              >
                {t('yesCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
