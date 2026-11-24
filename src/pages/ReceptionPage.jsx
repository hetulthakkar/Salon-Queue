<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQueue } from '../context/QueueContext';
import {
  Users,
  Plus,
  Clock,
  Scissors,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserX,
  Lock,
  Unlock,
  Check,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { getNextCustomerForBarber, calculateServicesSummary } from '../utils/queueLogic';

export const ReceptionPage = () => {
  const { lang, t } = useLanguage();
  const {
    services,
    barbers,
    queue,
    waitingCount,
    inChairCount,
    servedTodayCount,
    waitingAndCalledQueue,
    callNextForBarber,
    markNoShow,
    cancelCustomer,
    joinQueue,
  } = useQueue();

  // 1. PIN Lock State (PIN: 1234)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('salon_staff_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // 2. Modals & Notifications
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [customerToCancel, setCustomerToCancel] = useState(null);
  const [customerToNoShow, setCustomerToNoShow] = useState(null);
  const [toastNotification, setToastNotification] = useState('');

  // 3. Walk-in Form State
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServices, setWalkInServices] = useState(['haircut']);
  const [walkInBarber, setWalkInBarber] = useState('Any');
  const [walkInError, setWalkInError] = useState('');

  // Clock tick for live elapsed wait minutes
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput === '1234') {
      sessionStorage.setItem('salon_staff_unlocked', 'true');
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('salon_staff_unlocked');
    setIsUnlocked(false);
    setPinInput('');
  };

  const showToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(''), 4000);
  };

  // Call Next handler
  const handleCallNext = (barberName) => {
    const result = callNextForBarber(barberName);
    if (result.success) {
      const msg = t('customerCalledSuccess')
        .replace('{token}', result.customer.token)
        .replace('{name}', result.customer.name)
        .replace('{barber}', barberName);
      showToast(msg);
    } else {
      showToast(t('noEligibleCustomer'));
    }
  };

  // Walk-in Service selector toggle
  const toggleWalkInService = (id) => {
    if (walkInServices.includes(id)) {
      if (walkInServices.length > 1) {
        setWalkInServices(walkInServices.filter((s) => s !== id));
      }
    } else {
      if (walkInServices.length >= 3) {
        setWalkInError(t('serviceLimitReached'));
        setTimeout(() => setWalkInError(''), 3000);
        return;
      }
      setWalkInServices([...walkInServices, id]);
    }
  };

  // Walk-in submit handler
  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    setWalkInError('');

    if (!walkInName.trim()) {
      setWalkInError(t('nameRequired'));
      return;
    }

    if (walkInPhone.replace(/\D/g, '').length !== 10) {
      setWalkInError(t('phoneValidationMsg'));
      return;
    }

    const result = joinQueue({
      name: walkInName,
      phone: walkInPhone,
      serviceIds: walkInServices,
      preferredBarber: walkInBarber,
    });

    if (result.duplicate) {
      setWalkInError(t('duplicatePhoneAlert').replace('{token}', result.existingToken));
      return;
    }

    if (result.success) {
      const successMsg = t('walkInSuccess').replace('{token}', result.token);
      showToast(successMsg);
      setShowWalkInModal(false);
      setWalkInName('');
      setWalkInPhone('');
      setWalkInServices(['haircut']);
      setWalkInBarber('Any');
    } else {
      setWalkInError(result.error || 'Failed to add walk-in');
    }
  };

  // Calculate Walk-in totals
  const walkInSummary = calculateServicesSummary(walkInServices, services);

  // 4. PIN LOCKED SCREEN VIEW
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-charcoal-800 border border-gold-500/40 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold font-serif text-white tracking-wide">
              {t('lockedTitle')}
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('lockedSubtext')}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              autoFocus
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full text-center text-3xl tracking-[0.5em] font-mono py-3.5 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch"
            />

            {pinError && (
              <p className="text-red-400 text-xs font-semibold animate-shake">
                {t('invalidPin')}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm min-h-touch transition-all shadow-lg shadow-gold-500/20 active:scale-98"
            >
              {t('unlock')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 5. UNLOCKED RECEPTION DASHBOARD (10" TABLET LANDSCAPE VIEW)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="p-3.5 rounded-xl bg-gold-500 text-charcoal-950 text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 fill-current" />
            <span>{toastNotification}</span>
          </div>
          <button onClick={() => setToastNotification('')} className="p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-charcoal-800 border border-charcoal-700 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <span>{t('receptionTitle')}</span>
          </h1>

          {/* Live Salon Stats Pill */}
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="text-gray-300">
              {t('waitingPill')}:{' '}
              <strong className="text-gold-400 font-mono text-sm">{waitingCount}</strong>
            </span>
            <span className="text-charcoal-600 font-bold">•</span>
            <span className="text-gray-300">
              {t('inChairPill')}:{' '}
              <strong className="text-emerald-400 font-mono text-sm">{inChairCount}</strong>
            </span>
            <span className="text-charcoal-600 font-bold">•</span>
            <span className="text-gray-300">
              {t('servedTodayPill')}:{' '}
              <strong className="text-white font-mono text-sm">{servedTodayCount}</strong>
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
            </span>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Action Buttons: Add Walk-in & Lock */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm shadow-lg shadow-gold-500/20 active:scale-95 transition-all min-h-touch"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('addWalkInBtn')}</span>
          </button>

          <button
            onClick={handleLock}
            className="p-3 rounded-xl bg-charcoal-700/80 hover:bg-charcoal-600 text-gray-300 border border-charcoal-600 min-h-touch min-w-touch flex items-center justify-center active:scale-95 transition-all"
            title={t('lockDashboard')}
          >
            <Lock className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>

      {/* 2-Column Split Layout for 10" Tablet Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (40% width): Active Barber Chairs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              {t('activeBarberChairs')}
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              3 {t('barberChairsCount')}
            </span>
          </div>

          <div className="space-y-4">
            {barbers.map((barber, idx) => {
              const isOccupied = !!barber.currentCustomer || barber.status === 'Busy' || barber.status === 'Called';
              const isOnBreak = barber.onBreak;
              const isFree = !isOccupied && !isOnBreak;

              // Check if any eligible customer is waiting for this barber
              const eligibleCustomer = getNextCustomerForBarber(queue, barber.name);
              const canCallNext = isFree && !isOnBreak && !!eligibleCustomer;

              // Elapsed calculation for occupied customer
              const customerToken = barber.currentCustomer?.token;
              const queueMatch = queue.find((c) => c.token === customerToken);
              const totalDuration = barber.currentCustomer?.duration || 30;

              let elapsedMins = 12;
              if (queueMatch?.startedAt) {
                elapsedMins = Math.floor((now - queueMatch.startedAt) / 60000);
              } else if (queueMatch?.createdAt) {
                elapsedMins = Math.floor((now - queueMatch.createdAt) / 60000);
              }
              const progressPercent = Math.min(100, Math.max(10, (elapsedMins / totalDuration) * 100));

              return (
                <div
                  key={barber.id}
                  className={`bg-charcoal-800 border rounded-2xl p-5 space-y-4 shadow-lg transition-all ${
                    barber.status === 'Called'
                      ? 'border-gold-500 shadow-gold-500/10'
                      : isOccupied
                      ? 'border-charcoal-700'
                      : isOnBreak
                      ? 'border-charcoal-700/60 opacity-70'
                      : 'border-emerald-500/40'
                  }`}
                >
                  {/* Barber Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isFree
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : isOccupied
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                            : 'bg-charcoal-700 text-gray-400 border border-charcoal-600'
                        }`}
                      >
                        {barber.name.charAt(0)}
                      </div>

                      <div>
                        <span className="font-bold text-sm text-white block">
                          {barber.name}
                        </span>
                        <span className="text-[11px] text-gray-400">Chair {idx + 1}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isOnBreak ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-charcoal-700 text-gray-400 border border-charcoal-600">
                          {t('statusBreak')}
                        </span>
                      ) : barber.status === 'Called' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gold-500 text-charcoal-950 animate-pulse shadow">
                          {t('statusCalled')}
                        </span>
                      ) : isOccupied ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                          {t('statusInChair')}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {t('statusFree')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chair Occupant Info / Progress Bar */}
                  {isOccupied && barber.currentCustomer ? (
                    <div className="space-y-2 pt-2 border-t border-charcoal-700/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gold-400 font-mono text-sm">
                          {barber.currentCustomer.token}
                        </span>
                        <span className="font-semibold text-white">
                          {barber.currentCustomer.name}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>
                            {t('elapsedProgress')
                              .replace('{elapsed}', elapsedMins)
                              .replace('{total}', totalDuration)}
                          </span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-charcoal-900 rounded-full h-2 overflow-hidden border border-charcoal-700">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              barber.status === 'Called'
                                ? 'bg-gold-400 animate-pulse w-full'
                                : 'bg-gold-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-xs text-gray-400 italic">
                      {isOnBreak ? t('barberBreakActive') : t('chairAvailable')}
                    </div>
                  )}

                  {/* Primary Button: Call Next */}
                  <div>
                    <button
                      disabled={!canCallNext}
                      onClick={() => handleCallNext(barber.name)}
                      className={`w-full py-3 rounded-xl font-bold text-xs min-h-touch flex items-center justify-center gap-1.5 transition-all shadow ${
                        canCallNext
                          ? 'bg-gold-500 hover:bg-gold-600 text-charcoal-950 shadow-gold-500/20 active:scale-98 cursor-pointer'
                          : 'bg-charcoal-700/70 text-gray-500 cursor-not-allowed border border-charcoal-700'
                      }`}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>
                        {canCallNext
                          ? `${t('callNextBtn')} (${eligibleCustomer.token})`
                          : isOccupied
                          ? t('chairOccupied')
                          : isOnBreak
                          ? t('barberBreakActive')
                          : t('noEligibleCustomer')}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (60% width): Waiting Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              {t('waitingQueue')}
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              {waitingAndCalledQueue.length} {t('clientsCount')}
            </span>
          </div>

          {/* Empty State */}
          {waitingAndCalledQueue.length === 0 ? (
            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-12 text-center space-y-3 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t('queueClear')}
              </h3>
            </div>
          ) : (
            /* Ordered Customer List */
            <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl divide-y divide-charcoal-700/80 overflow-hidden shadow-xl">
              {waitingAndCalledQueue.map((c) => {
                const isCalled = c.status === 'Called';
                const elapsedMins = Math.floor((now - c.createdAt) / 60000);
                const isOver60 = elapsedMins > 60;
                const serviceNames = c.services
                  ?.map((s) => (lang === 'gu' ? s.nameGu : s.nameEn))
                  .join(', ') || 'Haircut';

                return (
                  <div
                    key={c.id || c.token}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isCalled
                        ? 'bg-gold-500/10 hover:bg-gold-500/15'
                        : 'hover:bg-charcoal-700/40'
                    }`}
                  >
                    {/* Left: Token & Client Info */}
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <span className="font-mono font-black text-base px-2.5 py-1 bg-charcoal-900 text-gold-400 rounded-xl border border-gold-500/40 block shadow-inner">
                          {c.token}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{c.name}</p>
                          {isCalled && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gold-500 text-charcoal-950 animate-pulse">
                              {t('statusCalled')}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400">
                          {serviceNames} •{' '}
                          <span className="text-gold-400 font-semibold">
                            Pref: {c.preferredBarber || 'Any'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Wait Duration Badge & Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Wait Duration Badge (Highlighted in Amber if > 60 mins) */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                          isOver60
                            ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20 animate-pulse'
                            : 'bg-charcoal-900 border-charcoal-700 text-gray-300'
                        }`}
                        title={isOver60 ? t('over60MinsAlert') : `${elapsedMins} min wait`}
                      >
                        {isOver60 ? (
                          <span className="flex items-center gap-1 text-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>{elapsedMins}m</span>
                          </span>
                        ) : (
                          t('waitDurationMins').replace('{mins}', elapsedMins)
                        )}
                      </span>

                      {/* No-Show Button (Enabled strictly when status is 'Called') */}
                      <button
                        disabled={!isCalled}
                        onClick={() => setCustomerToNoShow(c)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-touch flex items-center gap-1 ${
                          isCalled
                            ? 'bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 cursor-pointer shadow active:scale-95'
                            : 'bg-charcoal-900 text-gray-600 border border-charcoal-800 cursor-not-allowed opacity-50'
                        }`}
                        title={isCalled ? 'Mark customer as No-Show' : 'Available only when Called'}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>{t('noShowBtn')}</span>
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={() => setCustomerToCancel(c)}
                        className="px-3 py-2 rounded-xl bg-charcoal-700/70 hover:bg-red-950/80 hover:border-red-500/50 text-gray-400 hover:text-red-300 border border-charcoal-600 text-xs font-bold transition-all min-h-touch flex items-center gap-1 active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('cancelCustomerBtn')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6. + ADD WALK-IN MODAL */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-charcoal-800 border border-gold-500/50 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setShowWalkInModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-serif text-white tracking-wide">
                {t('walkInModalTitle')}
              </h3>
              <p className="text-xs text-gray-400">{t('walkInModalDesc')}</p>
            </div>

            {walkInError && (
              <div className="p-3 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{walkInError}</span>
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('fullName')} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 text-white outline-none text-sm min-h-touch"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('phoneNumber')} (10 digits) *</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('phoneNumberPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 text-white outline-none text-sm font-mono min-h-touch"
                />
              </div>

              {/* Services Selector (Limit 3) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                  <span>
                    {t('selectServices')} ({walkInServices.length}/3)
                  </span>
                  <span className="text-[11px] text-gray-400">{t('maxServicesHint')}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = walkInServices.includes(srv.id);
                    const displayName = lang === 'gu' ? srv.nameGu : srv.nameEn;

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleWalkInService(srv.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs select-none transition-all min-h-touch ${
                          isSelected
                            ? 'bg-charcoal-700 border-gold-500 shadow-sm'
                            : 'bg-charcoal-900 border-charcoal-700/80 hover:border-charcoal-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? 'bg-gold-500 border-gold-400 text-charcoal-950'
                                : 'border-charcoal-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{displayName}</span>
                            <span className="text-[10px] text-gray-400">
                              {srv.duration} {t('durationUnit')}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-gold-400 font-mono">₹{srv.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barber Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  {t('barberPreference')}
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setWalkInBarber('Any')}
                    className={`p-2.5 rounded-xl border text-left font-bold min-h-touch ${
                      walkInBarber === 'Any'
                        ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                        : 'bg-charcoal-900 border-charcoal-700 text-gray-300'
                    }`}
                  >
                    {t('anyBarberFastest')}
                  </button>

                  {barbers.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setWalkInBarber(b.name)}
                      className={`p-2.5 rounded-xl border text-left font-bold min-h-touch ${
                        walkInBarber === b.name
                          ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                          : 'bg-charcoal-900 border-charcoal-700 text-gray-300'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Walk-In Summary */}
              <div className="p-3 bg-charcoal-900 rounded-xl border border-charcoal-700 flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">
                  {t('totalSummary')}:{' '}
                  <strong className="text-white font-bold">{walkInSummary.totalDuration} {t('durationUnit')}</strong> •{' '}
                  <strong className="text-gold-400 font-mono">₹{walkInSummary.totalPrice}</strong>
                </span>
                <span className="text-gray-400 font-medium">Walk-in FIFO Token</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-3 rounded-xl bg-charcoal-700 hover:bg-charcoal-600 text-gray-300 font-bold text-xs min-h-touch"
                >
                  {t('walkInClose')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs min-h-touch shadow-lg shadow-gold-500/20"
                >
                  {t('submitWalkIn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. NO-SHOW CONFIRMATION MODAL */}
      {customerToNoShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-charcoal-800 border border-amber-500/50 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                {t('confirmNoShowTitle')}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t('confirmNoShowMsg')
                  .replace('{token}', customerToNoShow.token)
                  .replace('{name}', customerToNoShow.name)}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCustomerToNoShow(null)}
                className="flex-1 py-2.5 rounded-xl bg-charcoal-700 text-gray-300 text-xs font-bold min-h-touch"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  markNoShow(customerToNoShow.token);
                  setCustomerToNoShow(null);
                  showToast(`Token ${customerToNoShow.token} marked as No-Show`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-charcoal-950 font-bold text-xs min-h-touch shadow-md"
              >
                {t('noShowBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CANCEL CUSTOMER CONFIRMATION MODAL */}
      {customerToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-charcoal-800 border border-red-500/50 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                {t('confirmCancelCustomerTitle')}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t('confirmCancelCustomerMsg')
                  .replace('{token}', customerToCancel.token)
                  .replace('{name}', customerToCancel.name)}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCustomerToCancel(null)}
                className="flex-1 py-2.5 rounded-xl bg-charcoal-700 text-gray-300 text-xs font-bold min-h-touch"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  cancelCustomer(customerToCancel.token);
                  setCustomerToCancel(null);
                  showToast(`Token ${customerToCancel.token} cancelled`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-touch shadow-md"
              >
                {t('cancelCustomerBtn')}
              </button>
            </div>
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
          </div>
        </div>
      )}
    </div>
  );
};
