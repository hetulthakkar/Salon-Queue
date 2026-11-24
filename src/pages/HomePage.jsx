import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Users, Clock, Scissors, ArrowRight, Search, CheckCircle } from 'lucide-react';

export const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [lookupQuery, setLookupQuery] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    if (lookupQuery.trim()) {
      navigate(`/status/${encodeURIComponent(lookupQuery.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* 1. Header / Status Pill */}
      <div className="flex items-center justify-between pb-2 border-b border-charcoal-700/60">
        <div>
          <h1 className="text-xl font-bold font-serif text-white tracking-wide">
            {t('homeTitle')}
          </h1>
          <p className="text-xs text-gray-400">{t('tagline')}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {t('statusOpen')}
        </span>
      </div>

      {/* 2. Live Wait Summary Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-gold-500 to-gold-700"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
            {t('liveWaitSummary')}
          </span>
          <Users className="w-5 h-5 text-gold-400" />
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-gold-400 tracking-tight">
            4 {t('peopleWaiting')}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>{t('estimatedWait')}: <strong className="text-white">~35 {t('durationUnit')}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Barbers on Duty Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {t('barbersOnDuty')}
          </h2>
          <span className="text-xs text-gold-400 font-medium">3 active</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Barber 1 */}
          <div className="bg-charcoal-800 border border-charcoal-700/80 rounded-xl p-3 text-center space-y-2 hover:border-gold-500/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-charcoal-700 text-gold-400 font-bold flex items-center justify-center mx-auto text-sm border border-gold-500/30">
              R
            </div>
            <div>
              <p className="font-semibold text-xs text-white">Ravi</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                {t('statusFree')}
              </span>
            </div>
          </div>

          {/* Barber 2 */}
          <div className="bg-charcoal-800 border border-charcoal-700/80 rounded-xl p-3 text-center space-y-2 hover:border-gold-500/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-charcoal-700 text-gold-400 font-bold flex items-center justify-center mx-auto text-sm border border-gold-500/30">
              A
            </div>
            <div>
              <p className="font-semibold text-xs text-white">Amit</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-600/40">
                {t('statusBusy')} (~12m)
              </span>
            </div>
          </div>

          {/* Barber 3 */}
          <div className="bg-charcoal-800 border border-charcoal-700/80 rounded-xl p-3 text-center space-y-2 hover:border-gold-500/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-charcoal-700 text-gold-400 font-bold flex items-center justify-center mx-auto text-sm border border-gold-500/30">
              I
            </div>
            <div>
              <p className="font-semibold text-xs text-white">Imran</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                {t('statusFree')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Primary CTA: Join Queue */}
      <div>
        <Link
          to="/join"
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-base shadow-lg shadow-gold-500/20 active:scale-[0.99] transition-all min-h-touch"
        >
          <span>{t('joinQueueCTA')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </Link>
      </div>

      {/* 5. Quick Lookup Link */}
      <div className="bg-charcoal-800/60 border border-charcoal-700/70 rounded-xl p-4">
        <p className="text-xs text-gray-300 font-medium mb-2">
          {t('haveTokenPrompt')}
        </p>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder={t('enterTokenOrPhone')}
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-charcoal-700 hover:bg-charcoal-600 text-gold-400 border border-charcoal-600 hover:border-gold-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-touch"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('checkStatusBtn')}</span>
          </button>
        </form>
      </div>

      {/* Scaffolding status banner */}
      <div className="pt-2 text-center text-[11px] text-gray-500">
        <span>Screen 1: Home (<code>/</code>) — Placeholder UI Loaded</span>
      </div>
    </div>
  );
};
