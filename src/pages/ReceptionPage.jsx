import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Users, Plus, Clock, Scissors, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

export const ReceptionPage = () => {
  const { t } = useLanguage();
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Top Action Bar & Live Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-charcoal-800 border border-charcoal-700 rounded-2xl p-4 shadow-lg">
        <div>
          <h1 className="text-xl font-bold font-serif text-white tracking-wide">
            {t('receptionTitle')}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-gray-300">
              {t('waitingPill')}: <strong className="text-gold-400">4</strong>
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">
              {t('inChairPill')}: <strong className="text-emerald-400">2</strong>
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">
              {t('servedTodayPill')}: <strong className="text-white">14</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowWalkInModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm shadow-md transition-all min-h-touch"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addWalkInBtn')}</span>
        </button>
      </div>

      {/* 2-Column Split View for 10" Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (40% width): Active Barber Chairs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t('activeBarberChairs')}
            </h2>
            <span className="text-xs text-gray-400">3 on duty</span>
          </div>

          {/* Chair 1 - Ravi (Free) */}
          <div className="bg-charcoal-800 border border-emerald-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white">Ravi</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                  {t('statusFree')}
                </span>
              </div>
              <span className="text-xs text-gray-400">Chair 1</span>
            </div>
            <p className="text-xs text-gray-400 italic">{t('chairAvailable')}</p>
            <button className="w-full py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs min-h-touch shadow">
              {t('callNextBtn')}
            </button>
          </div>

          {/* Chair 2 - Amit (In Chair) */}
          <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white">Amit</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                  {t('statusInChair')}
                </span>
              </div>
              <span className="text-xs text-gray-400">Chair 2</span>
            </div>
            <div className="text-xs text-gray-300 space-y-1">
              <p><strong className="text-gold-400 font-mono">S-12</strong> • Rahul Patel</p>
              <p className="text-gray-400">Haircut (30m) • Elapsed: 18 min</p>
            </div>
            <div className="w-full bg-charcoal-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gold-500 h-1.5 rounded-full w-3/5"></div>
            </div>
          </div>

          {/* Chair 3 - Imran (In Chair) */}
          <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white">Imran</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                  {t('statusInChair')}
                </span>
              </div>
              <span className="text-xs text-gray-400">Chair 3</span>
            </div>
            <div className="text-xs text-gray-300 space-y-1">
              <p><strong className="text-gold-400 font-mono">S-13</strong> • Bhavin Shah</p>
              <p className="text-gray-400">Head Massage (20m) • Elapsed: 5 min</p>
            </div>
            <div className="w-full bg-charcoal-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gold-500 h-1.5 rounded-full w-1/4"></div>
            </div>
          </div>
        </div>

        {/* Right Column (60% width): Waiting Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t('waitingQueue')}
            </h2>
            <span className="text-xs text-gray-400">4 clients</span>
          </div>

          <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl divide-y divide-charcoal-700/70 overflow-hidden shadow-lg">
            {/* Customer 1 */}
            <div className="p-4 flex items-center justify-between gap-3 hover:bg-charcoal-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-base font-black font-mono text-gold-400 px-2 py-1 bg-charcoal-900 rounded-lg border border-gold-500/30">
                  S-14
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Kunal Shah</p>
                  <p className="text-xs text-gray-400">Haircut, Beard • Pref: Amit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-charcoal-900 text-gray-300 font-medium">
                  12m wait
                </span>
                <button className="px-2.5 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-amber-300 text-xs font-semibold min-h-[36px]">
                  {t('noShowBtn')}
                </button>
                <button className="px-2.5 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-red-400 text-xs font-semibold min-h-[36px]">
                  {t('cancelCustomerBtn')}
                </button>
              </div>
            </div>

            {/* Customer 2 */}
            <div className="p-4 flex items-center justify-between gap-3 hover:bg-charcoal-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-base font-black font-mono text-gold-400 px-2 py-1 bg-charcoal-900 rounded-lg border border-gold-500/30">
                  S-15
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Dev Dave</p>
                  <p className="text-xs text-gray-400">Haircut • Pref: Any</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-charcoal-900 text-gray-300 font-medium">
                  25m wait
                </span>
                <button className="px-2.5 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-red-400 text-xs font-semibold min-h-[36px]">
                  {t('cancelCustomerBtn')}
                </button>
              </div>
            </div>

            {/* Customer 3 */}
            <div className="p-4 flex items-center justify-between gap-3 hover:bg-charcoal-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-base font-black font-mono text-gold-400 px-2 py-1 bg-charcoal-900 rounded-lg border border-gold-500/30">
                  S-16
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Pratik Joshi</p>
                  <p className="text-xs text-gray-400">Hair Spa • Pref: Imran</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-charcoal-900 text-gray-300 font-medium">
                  40m wait
                </span>
                <button className="px-2.5 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-red-400 text-xs font-semibold min-h-[36px]">
                  {t('cancelCustomerBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Walk-in Modal Placeholder */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal-800 border border-gold-500/40 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">{t('addWalkInBtn')}</h3>
            <p className="text-xs text-gray-400">Walk-in customer entry form placeholder.</p>
            <button
              onClick={() => setShowWalkInModal(false)}
              className="w-full py-2.5 rounded-xl bg-charcoal-700 text-gray-200 text-xs font-bold min-h-touch"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
