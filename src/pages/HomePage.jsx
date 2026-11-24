import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
<<<<<<< HEAD
import { Users, Clock, Scissors, ArrowRight, Search, CheckCircle } from 'lucide-react';

export const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [lookupQuery, setLookupQuery] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    if (lookupQuery.trim()) {
      navigate(`/status/${encodeURIComponent(lookupQuery.trim().toUpperCase())}`);
=======
import { useQueue } from '../context/QueueContext';
import { Users, Clock, ArrowRight, Search, AlertCircle, Scissors } from 'lucide-react';

export const HomePage = () => {
  const { lang, t } = useLanguage();
  const { barbers, waitingCount, getEstimatedWait, onlineQueueOpen, findCustomer } = useQueue();
  const navigate = useNavigate();

  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupError, setLookupError] = useState('');

  const estWait = getEstimatedWait('Any');
  const activeBarbersCount = barbers.filter((b) => b.onDuty && !b.onBreak).length;

  const handleLookup = (e) => {
    e.preventDefault();
    setLookupError('');
    if (!lookupQuery.trim()) return;

    const found = findCustomer(lookupQuery);
    if (found) {
      navigate(`/status/${found.token}`);
    } else {
      const errorMsg = t('tokenNotFoundAlert').replace('{query}', lookupQuery.trim());
      setLookupError(errorMsg);
      setTimeout(() => setLookupError(''), 4000);
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
<<<<<<< HEAD
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
=======
      {/* 1. Header with Salon Title & Live Status Pill */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-700/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-charcoal-950 font-bold shadow-md">
            <Scissors className="w-5 h-5 text-charcoal-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white tracking-wide leading-tight">
              {t('salonName')}
            </h1>
            <p className="text-[11px] text-gray-400">{t('tagline')}</p>
          </div>
        </div>

        {/* Live Status Pill */}
        {onlineQueueOpen ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('statusOpen')}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-950/90 text-red-400 border border-red-500/40 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span>{t('statusClosed')}</span>
          </span>
        )}
      </div>

      {/* 2. Live Wait Summary Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600"></div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
            {t('liveWaitSummary')}
          </span>
          <Users className="w-5 h-5 text-gold-400" />
        </div>

<<<<<<< HEAD
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-gold-400 tracking-tight">
            4 {t('peopleWaiting')}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>{t('estimatedWait')}: <strong className="text-white">~35 {t('durationUnit')}</strong></span>
          </div>
        </div>
=======
        {waitingCount === 0 ? (
          <div className="py-2">
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              {t('walkRightIn')}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Zero waiting line • Walk-in chairs ready
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-3xl font-black text-gold-400 tracking-tight">
              {waitingCount} {t('peopleWaiting')}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <Clock className="w-4 h-4 text-gold-500" />
              <span>
                {t('estimatedWait')}:{' '}
                <strong className="text-white font-bold">
                  ~{estWait} {t('durationUnit')}
                </strong>
              </span>
            </div>
          </div>
        )}
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
      </div>

      {/* 3. Barbers on Duty Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
<<<<<<< HEAD
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
=======
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {t('barbersOnDuty')}
          </h2>
          <span className="text-xs text-gold-400 font-semibold">
            {activeBarbersCount} {t('onDutyCount')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {barbers.map((barber) => {
            const isFree = barber.status === 'Free' && !barber.onBreak;
            const isBusy = barber.status === 'Busy' && !barber.onBreak;
            const isOnBreak = barber.onBreak;

            return (
              <div
                key={barber.id}
                className="bg-charcoal-800 border border-charcoal-700/80 rounded-xl p-3 text-center space-y-2 hover:border-gold-500/40 transition-colors shadow-sm"
              >
                {/* Avatar with Status Ring */}
                <div
                  className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center font-bold text-sm border-2 ${
                    isFree
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                      : isBusy
                      ? 'bg-amber-950/70 border-gold-500 text-gold-300'
                      : 'bg-charcoal-700 border-gray-600 text-gray-400'
                  }`}
                >
                  {barber.name.charAt(0)}
                </div>

                <div>
                  <p className="font-bold text-xs text-white">{barber.name}</p>

                  {/* Status Badge */}
                  <div className="mt-1">
                    {isFree && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                        {t('chairFree')}
                      </span>
                    )}

                    {isBusy && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40">
                        {t('busyMinsLeft').replace('{mins}', barber.remainingMinutes || 10)}
                      </span>
                    )}

                    {isOnBreak && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-charcoal-700 text-gray-400 border border-charcoal-600">
                        {t('statusBreak')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
        </div>
      </div>

      {/* 4. Primary CTA: Join Queue */}
      <div>
<<<<<<< HEAD
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
=======
        {onlineQueueOpen ? (
          <Link
            to="/join"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-base shadow-xl shadow-gold-500/20 active:scale-[0.99] transition-all min-h-touch"
          >
            <span>{t('joinQueueCTA')}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
        ) : (
          <div className="space-y-2">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-charcoal-700 text-gray-400 font-bold text-base cursor-not-allowed opacity-80 min-h-touch"
            >
              <span>{t('queueClosedBtn')}</span>
            </button>
            <p className="text-xs text-red-400/90 text-center font-medium bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              {t('queueClosedMsg')}
            </p>
          </div>
        )}
      </div>

      {/* 5. Quick Lookup Link */}
      <div className="bg-charcoal-800/80 border border-charcoal-700 rounded-xl p-4 space-y-2.5 shadow-md">
        <p className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-gold-400" />
          <span>{t('haveTokenPrompt')}</span>
        </p>

>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupQuery}
<<<<<<< HEAD
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
=======
            onChange={(e) => {
              setLookupQuery(e.target.value);
              setLookupError('');
            }}
            placeholder={t('enterTokenOrPhone')}
            className="flex-1 px-3 py-2.5 text-xs rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-charcoal-700 hover:bg-charcoal-600 text-gold-400 border border-charcoal-600 hover:border-gold-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all min-h-touch whitespace-nowrap active:scale-95"
          >
            <span>{t('checkStatusBtn')}</span>
          </button>
        </form>

        {lookupError && (
          <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{lookupError}</span>
          </div>
        )}
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
      </div>
    </div>
  );
};
