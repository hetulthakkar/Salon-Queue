<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useQueue } from '../context/QueueContext';
import {
  ArrowLeft,
  Clock,
  Bell,
  Sparkles,
  AlertTriangle,
  Scissors,
  CheckCircle2,
  XCircle,
  Coffee,
  RotateCcw,
} from 'lucide-react';

export const StatusPage = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const {
    queue,
    barbers,
    findCustomer,
    getCustomerWait,
    getCustomerPosition,
    cancelSpot,
    updateCustomerStatus,
    toggleBarberBreak,
  } = useQueue();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [vibrationFired, setVibrationFired] = useState(false);

  // Look up customer from reactive store
  const customer = findCustomer(id);

  // Fallback if accessed via direct token link that hasn't been seeded
  const activeToken = customer ? customer.token : (id ? id.toUpperCase() : 'S-14');
  const activeName = customer ? customer.name : 'Kunal Shah';
  const activePreferredBarber = customer ? customer.preferredBarber : 'Amit';
  const activeStatus = customer ? customer.status : 'Waiting';

  const customerServices = customer
    ? customer.services.map((s) => (lang === 'gu' ? s.nameGu : s.nameEn)).join(', ')
    : 'Haircut (30m), Beard Trim & Styling (15m)';

  // Calculate dynamic queue position & exact wait time
  const positionInLine = customer ? getCustomerPosition(customer.token) : 2;
  const estimatedWaitMins = customer ? getCustomerWait(customer) : 15;

  // Check if preferred barber is currently on break
  const preferredBarberObj = barbers.find((b) => b.name === activePreferredBarber);
  const isPreferredBarberOnBreak = preferredBarberObj?.onBreak || false;

  // Assigned or active barber display name
  const servingBarber = customer?.assignedBarber || activePreferredBarber || 'Barber';

  // Trigger vibration when status becomes 'Called'
  useEffect(() => {
    if (activeStatus === 'Called') {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate([300, 150, 300]);
          setVibrationFired(true);
        } catch {
          // Vibrations may be restricted by user agent policies
        }
      }
    }
  }, [activeStatus]);

  // Handle spot cancellation
  const handleConfirmCancel = () => {
    cancelSpot(activeToken);
    setShowCancelModal(false);
  };

  // Helper for simulation buttons
  const handleSimulateStatus = (newStatus, assignedBarber = 'Amit') => {
    updateCustomerStatus(activeToken, newStatus, assignedBarber);
  };

  // 1. FULL SCREEN GOLD TAKEOVER WHEN CALLED
  if (activeStatus === 'Called') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gold-500 via-gold-400 to-amber-500 text-charcoal-950 p-6 flex flex-col justify-between items-center text-center animate-fade-in relative select-none">
        {/* Subtle pulsing background glow */}
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>

        {/* Top header */}
        <div className="w-full max-w-md flex items-center justify-between z-10">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900/20 text-charcoal-950 hover:bg-charcoal-900/30 font-bold text-xs backdrop-blur transition-all min-h-touch"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>{t('backToHome')}</span>
          </Link>
          <span className="font-mono font-black text-sm bg-charcoal-950 text-gold-400 px-3 py-1.5 rounded-xl shadow-md">
            {activeToken}
          </span>
        </div>

        {/* Center Hero Takeover */}
        <div className="max-w-md w-full my-auto space-y-6 z-10 py-8">
          <div className="w-24 h-24 rounded-full bg-charcoal-950 text-gold-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <Bell className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="space-y-3">
            <div className="inline-block px-4 py-1 rounded-full bg-charcoal-950/20 text-charcoal-950 text-xs font-black tracking-widest uppercase">
              {t('statusCalled')}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-serif uppercase drop-shadow-sm">
              {t('alertCalledTitle')}
            </h1>

            <p className="text-lg sm:text-xl font-bold leading-snug text-charcoal-900">
              {t('alertCalledSubtitle').replace('{barber}', servingBarber)}
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-charcoal-950 text-white rounded-2xl p-6 shadow-2xl border-2 border-charcoal-900/40 space-y-2">
            <span className="text-xs uppercase font-bold text-gold-400 tracking-widest">
              {t('tokenLabel')}
            </span>
            <div className="text-5xl font-black font-mono tracking-tight text-gold-400">
              {activeToken}
            </div>
            <p className="text-sm font-semibold text-gray-200">{activeName}</p>
            <p className="text-xs text-gray-400">{customerServices}</p>
          </div>
        </div>

        {/* Bottom Simulation Controls */}
        <div className="w-full max-w-md z-10 space-y-2 pt-4 border-t border-charcoal-950/20">
          <p className="text-[11px] font-bold text-charcoal-950 uppercase tracking-wider">
            {t('testSimulation')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSimulateStatus('In Chair', servingBarber)}
              className="flex-1 py-2.5 rounded-xl bg-charcoal-950 hover:bg-charcoal-900 text-gold-400 font-bold text-xs min-h-touch shadow"
            >
              Start Service (In Chair)
            </button>
            <button
              onClick={() => handleSimulateStatus('Waiting')}
              className="flex-1 py-2.5 rounded-xl bg-charcoal-900/30 hover:bg-charcoal-900/40 text-charcoal-950 font-bold text-xs min-h-touch"
            >
              Back to Waiting
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. STANDARD LIVE STATUS VIEW
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs font-semibold border border-charcoal-700 min-h-touch transition-all"
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
        >
          <ArrowLeft className="w-4 h-4 text-gold-400" />
          <span>{t('backToHome')}</span>
        </Link>
<<<<<<< HEAD
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
=======

        {/* Status Badge */}
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            activeStatus === 'In Chair'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
              : activeStatus === 'Cancelled'
              ? 'bg-red-950 text-red-400 border-red-500/40'
              : activeStatus === 'Done'
              ? 'bg-blue-950 text-blue-400 border-blue-500/40'
              : 'bg-gold-500/20 text-gold-300 border-gold-500/40'
          }`}
        >
          {activeStatus === 'Waiting'
            ? t('statusWaiting')
            : activeStatus === 'In Chair'
            ? t('statusInChair')
            : activeStatus === 'Cancelled'
            ? t('statusCancelled')
            : t('statusDone')}
        </span>
      </div>

      {/* 1. Hero Token Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600"></div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
            {t('tokenLabel')}
          </p>
          <div className="text-6xl font-black font-mono tracking-tight text-gold-400 drop-shadow-md py-1">
            {activeToken}
          </div>
        </div>

        <div className="pt-3 border-t border-charcoal-700/80 text-xs text-gray-300 space-y-1">
          <p>
            <strong className="text-white text-sm">{activeName}</strong> •{' '}
            <span className="text-gray-400">{t('barberPreference')}:</span>{' '}
            <strong className="text-gold-400 font-semibold">{activePreferredBarber}</strong>
          </p>
          <p className="text-gray-400">{customerServices}</p>
        </div>
      </div>

      {/* 2. CANCELLED STATE BANNER */}
      {activeStatus === 'Cancelled' && (
        <div className="bg-red-950/80 border border-red-500/50 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{t('spotCancelledTitle')}</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {t('spotCancelledMsg')}
            </p>
          </div>
          <Link
            to="/join"
            className="inline-block py-3 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs min-h-touch shadow-md"
          >
            {t('rejoinQueueBtn')}
          </Link>
        </div>
      )}

      {/* 3. IN CHAIR CALM CARD */}
      {activeStatus === 'In Chair' && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3 shadow-xl animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-emerald-300">
              {t('alertInChair').replace('{barber}', servingBarber)}
            </h2>
            <p className="text-xs text-gray-400">
              Relax while your styling is in progress.
            </p>
          </div>
        </div>
      )}

      {/* 4. WAITING STATE: LIVE COUNTDOWN RING & POSITION BADGE */}
      {activeStatus === 'Waiting' && (
        <div className="space-y-5">
          {/* Position #2 Pulsing Amber Alert Banner */}
          {positionInLine === 2 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-2 border-amber-500/80 text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xl animate-pulse">
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold text-white uppercase text-[11px] tracking-wider">
                  {t('secondInLine')}
                </p>
                <p className="leading-snug">{t('alertPos2')}</p>
              </div>
            </div>
          )}

          {/* Barber on break notice */}
          {isPreferredBarberOnBreak && (
            <div className="p-4 rounded-2xl bg-charcoal-800 border border-amber-500/50 text-amber-300 text-xs flex items-center gap-3 shadow-md">
              <Coffee className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {t('barberOnBreakNotice').replace('{barber}', activePreferredBarber)}
              </span>
            </div>
          )}

          {/* Countdown Ring Card */}
          <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 text-center space-y-5 shadow-xl">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-charcoal-700"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-gold-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={Math.max(40, 264 - (estimatedWaitMins / 60) * 264)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Ring Metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black font-mono text-white">
                  ~{estimatedWaitMins}
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  {t('durationUnit')} {t('estimatedWait')}
                </span>
              </div>
            </div>

            {/* Position Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-extrabold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
                <span>
                  {positionInLine === 1
                    ? t('nextInLine')
                    : positionInLine
                    ? t('inLinePosition').replace('{pos}', positionInLine)
                    : t('yourPosition')}
                </span>
              </span>
            </div>

            <p className="text-[11px] text-gray-500 font-medium">
              {t('statusLiveAuto')}
            </p>
          </div>

          {/* Cancel Spot Button (Strictly visible only while Waiting) */}
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full py-3.5 px-4 rounded-xl border border-red-500/40 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-bold transition-all min-h-touch active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            <span>{t('cancelSpotBtn')}</span>
          </button>
        </div>
      )}

      {/* 5. INTERACTIVE TESTING / DEMO STATE SWITCHER */}
      <div className="p-4 rounded-2xl bg-charcoal-800/60 border border-charcoal-700/70 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {t('testSimulation')}
          </span>
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleSimulateStatus('Waiting')}
            className={`py-2 px-3 rounded-lg font-bold min-h-[38px] transition-all ${
              activeStatus === 'Waiting'
                ? 'bg-gold-500 text-charcoal-950 shadow'
                : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
            }`}
          >
            Waiting
          </button>

          <button
            onClick={() => handleSimulateStatus('Called', servingBarber)}
            className={`py-2 px-3 rounded-lg font-bold min-h-[38px] transition-all ${
              activeStatus === 'Called'
                ? 'bg-gold-500 text-charcoal-950 shadow'
                : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
            }`}
          >
            Called (Gold Alert)
          </button>

          <button
            onClick={() => handleSimulateStatus('In Chair', servingBarber)}
            className={`py-2 px-3 rounded-lg font-bold min-h-[38px] transition-all ${
              activeStatus === 'In Chair'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
            }`}
          >
            In Chair
          </button>

          <button
            onClick={() => toggleBarberBreak(activePreferredBarber)}
            className={`py-2 px-3 rounded-lg font-bold min-h-[38px] transition-all ${
              isPreferredBarberOnBreak
                ? 'bg-amber-950 border border-amber-500 text-amber-300'
                : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
            }`}
          >
            {activePreferredBarber} Break: {isPreferredBarberOnBreak ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 6. CANCEL CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-charcoal-800 border border-red-500/50 rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl relative">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                {t('confirmCancelTitle')}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t('confirmCancelMsg')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl bg-charcoal-700 hover:bg-charcoal-600 text-gray-200 font-bold text-xs min-h-touch transition-all active:scale-95"
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
              >
                {t('keepMySpot')}
              </button>
              <button
<<<<<<< HEAD
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-touch"
=======
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs min-h-touch transition-all active:scale-95 shadow-md shadow-red-600/30"
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
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
