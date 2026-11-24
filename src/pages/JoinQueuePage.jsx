<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowLeft, User, Phone, Check, Clock, AlertCircle } from 'lucide-react';
import { INITIAL_SERVICES } from '../utils/queueLogic';

export const JoinQueuePage = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState(['haircut']);
  const [preferredBarber, setPreferredBarber] = useState('Any');
  const [toastMessage, setToastMessage] = useState('');

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      if (selectedServices.length >= 3) {
        setToastMessage(t('serviceLimitReached'));
        setTimeout(() => setToastMessage(''), 3000);
        return;
      }
      setSelectedServices([...selectedServices, id]);
    }
  };

  const currentServices = INITIAL_SERVICES.filter((s) =>
    selectedServices.includes(s.id)
  );
  const totalMinutes = currentServices.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = currentServices.reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length !== 10) {
      setToastMessage(t('phoneValidationMsg'));
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    // Phase 1 placeholder: navigate to sample status screen
    const demoToken = 'S-14';
    navigate(`/status/${demoToken}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-28">
=======
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { ArrowLeft, User, Phone, Check, Clock, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { calculateServicesSummary, calculateEstimatedWaitTime } from '../utils/queueLogic';

export const JoinQueuePage = () => {
  const { lang, t } = useLanguage();
  const { services, barbers, queue, joinQueue, onlineQueueOpen } = useQueue();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState(['haircut']);
  const [preferredBarber, setPreferredBarber] = useState('Any');

  // UI Feedback State
  const [errorToast, setErrorToast] = useState('');
  const [duplicateRedirectInfo, setDuplicateRedirectInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If online queue is closed, redirect to home
  useEffect(() => {
    if (!onlineQueueOpen) {
      navigate('/');
    }
  }, [onlineQueueOpen, navigate]);

  // Handle Service Selection with 3-service limit
  const toggleService = (serviceId) => {
    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length === 1) {
        setErrorToast(t('selectAtLeastOneService'));
        setTimeout(() => setErrorToast(''), 3000);
        return;
      }
      setSelectedServiceIds(selectedServiceIds.filter((id) => id !== serviceId));
    } else {
      if (selectedServiceIds.length >= 3) {
        setErrorToast(t('serviceLimitReached'));
        setTimeout(() => setErrorToast(''), 3500);
        return;
      }
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  // Phone input sanitizer (strictly numbers, max 10 digits)
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const cleanNumbers = rawVal.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanNumbers);
    if (errorToast && cleanNumbers.length === 10) {
      setErrorToast('');
    }
  };

  // Dynamic Live Summary Calculations
  const { totalDuration, totalPrice, selectedList } = calculateServicesSummary(
    selectedServiceIds,
    services
  );

  const dynamicEstWait = calculateEstimatedWaitTime(queue, barbers, preferredBarber);

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorToast('');

    // 1. Name validation
    if (!name.trim()) {
      setErrorToast(t('nameRequired'));
      return;
    }

    // 2. Strict 10-digit phone validation
    if (phone.length !== 10) {
      setErrorToast(t('phoneValidationMsg'));
      return;
    }

    // 3. Service selection validation
    if (selectedServiceIds.length === 0) {
      setErrorToast(t('selectAtLeastOneService'));
      return;
    }

    if (selectedServiceIds.length > 3) {
      setErrorToast(t('serviceLimitReached'));
      return;
    }

    setIsSubmitting(true);

    const result = joinQueue({
      name,
      phone,
      serviceIds: selectedServiceIds,
      preferredBarber,
    });

    if (result.duplicate) {
      // Duplicate phone detected!
      const alertMsg = t('duplicatePhoneAlert').replace('{token}', result.existingToken);
      setDuplicateRedirectInfo({
        token: result.existingToken,
        message: alertMsg,
      });

      // Auto-redirect to their existing status screen
      setTimeout(() => {
        navigate(`/status/${result.existingToken}`);
      }, 2000);
      return;
    }

    if (result.success) {
      // Successfully joined queue!
      navigate(`/status/${result.token}`);
    } else {
      setIsSubmitting(false);
      setErrorToast(result.error || 'Failed to join queue.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-36">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
      {/* 1. Back Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
<<<<<<< HEAD
          className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 min-h-touch min-w-touch flex items-center justify-center border border-charcoal-700"
=======
          className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 min-h-touch min-w-touch flex items-center justify-center border border-charcoal-700 active:scale-95 transition-all shadow-sm"
          aria-label={t('backToHome')}
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
        >
          <ArrowLeft className="w-5 h-5 text-gold-400" />
        </Link>
        <div>
<<<<<<< HEAD
          <h1 className="text-xl font-bold text-white font-serif tracking-wide">
=======
          <h1 className="text-xl font-bold text-white font-serif tracking-wide leading-tight">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
            {t('joinTitle')}
          </h1>
          <p className="text-xs text-gray-400">{t('maxServicesHint')}</p>
        </div>
      </div>

<<<<<<< HEAD
      {toastMessage && (
        <div className="p-3 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
=======
      {/* Duplicate Phone Redirect Overlay Banner */}
      {duplicateRedirectInfo && (
        <div className="p-4 rounded-2xl bg-amber-950 border-2 border-gold-500 text-amber-200 text-xs sm:text-sm space-y-2 shadow-2xl animate-pulse">
          <div className="flex items-center gap-2 font-bold text-gold-400 text-sm">
            <Sparkles className="w-5 h-5" />
            <span>{t('haveTokenPrompt')}</span>
          </div>
          <p className="font-semibold leading-relaxed">{duplicateRedirectInfo.message}</p>
          <p className="text-[11px] text-amber-300/80 font-mono italic">
            {t('redirecting')}
          </p>
        </div>
      )}

      {/* Floating Error Toast */}
      {errorToast && (
        <div className="p-3.5 rounded-xl bg-red-950/95 border border-red-500 text-red-200 text-xs flex items-center gap-2.5 shadow-xl animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-semibold">{errorToast}</span>
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Customer Details */}
<<<<<<< HEAD
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {t('customerDetails')}
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-500" />
=======
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 space-y-4 shadow-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400">
            {t('customerDetails')}
          </h2>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-400" />
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
              <span>{t('fullName')} *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fullNamePlaceholder')}
<<<<<<< HEAD
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              <span>{t('phoneNumber')} (10 digits) *</span>
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder={t('phoneNumberPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch text-sm"
            />
          </div>
        </div>

        {/* 3. Service Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {t('selectServices')} ({selectedServices.length}/3)
            </h2>
            <span className="text-[11px] text-gray-400">{t('maxServicesHint')}</span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_SERVICES.map((srv) => {
              const isSelected = selectedServices.includes(srv.id);
              const displayName = lang === 'gu' ? srv.nameGu : srv.nameEn;
=======
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900 border border-charcoal-600 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white outline-none min-h-touch text-sm font-medium transition-colors"
            />
          </div>

          {/* Phone Number (Strict 10-digit validation) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>{t('phoneNumber')} *</span>
              </label>
              <span
                className={`text-[11px] font-mono font-bold ${
                  phone.length === 10 ? 'text-emerald-400' : 'text-gray-400'
                }`}
              >
                {phone.length}/10
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs font-bold">
                +91
              </div>
              <input
                type="tel"
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder={t('phoneNumberPlaceholder')}
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-charcoal-900 border font-mono text-sm tracking-wider outline-none min-h-touch transition-colors ${
                  phone.length === 10
                    ? 'border-emerald-500/80 text-white focus:border-emerald-500'
                    : phone.length > 0
                    ? 'border-amber-500/80 text-white focus:border-amber-500'
                    : 'border-charcoal-600 text-white focus:border-gold-500'
                }`}
              />
            </div>
            {phone.length > 0 && phone.length < 10 && (
              <p className="text-[11px] text-amber-400 font-medium">
                {t('phoneValidationMsg')}
              </p>
            )}
          </div>
        </div>

        {/* 3. Service Selector (Multi-select, strictly max 3) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              {t('selectServices')}{' '}
              <span className="text-white">({selectedServiceIds.length}/3)</span>
            </h2>
            <span className="text-[11px] text-gray-400 font-medium">
              {t('maxServicesHint')}
            </span>
          </div>

          <div className="space-y-2.5">
            {services.map((srv) => {
              const isSelected = selectedServiceIds.includes(srv.id);
              const displayName = lang === 'gu' ? srv.nameGu : srv.nameEn;

>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
<<<<<<< HEAD
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all min-h-touch ${
                    isSelected
                      ? 'bg-charcoal-700/80 border-gold-500/80 shadow-md shadow-gold-500/10'
=======
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all min-h-touch ${
                    isSelected
                      ? 'bg-charcoal-700/90 border-gold-500 shadow-md shadow-gold-500/15'
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
                      : 'bg-charcoal-800 border-charcoal-700/80 hover:border-charcoal-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
<<<<<<< HEAD
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-gold-500 border-gold-400 text-charcoal-950'
                          : 'border-charcoal-600 bg-charcoal-900'
=======
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-gold-500 border-gold-400 text-charcoal-950 font-black'
                          : 'border-charcoal-600 bg-charcoal-900 text-transparent'
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
<<<<<<< HEAD
                    <div>
                      <p className="text-sm font-semibold text-white">{displayName}</p>
                      <p className="text-xs text-gray-400">
=======

                    <div>
                      <p className="text-sm font-bold text-white leading-tight">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
                        {srv.duration} {t('durationUnit')}
                      </p>
                    </div>
                  </div>
<<<<<<< HEAD
                  <span className="text-sm font-bold text-gold-400">
=======

                  <span className="text-sm font-black text-gold-400 font-mono">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
                    ₹{srv.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Barber Preference */}
        <div className="space-y-3">
<<<<<<< HEAD
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
=======
          <h2 className="text-xs font-bold uppercase tracking-wider text-gold-400">
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
            {t('barberPreference')}
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
<<<<<<< HEAD
            {[
              { id: 'Any', label: t('anyBarberFastest') },
              { id: 'Ravi', label: 'Ravi' },
              { id: 'Amit', label: 'Amit' },
              { id: 'Imran', label: 'Imran' },
            ].map((barber) => {
              const isSelected = preferredBarber === barber.id;
=======
            {/* Any Barber (Fastest) */}
            <button
              type="button"
              onClick={() => setPreferredBarber('Any')}
              className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all min-h-touch ${
                preferredBarber === 'Any'
                  ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-sm'
                  : 'bg-charcoal-800 border-charcoal-700 text-gray-300 hover:border-charcoal-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{t('anyBarberFastest')}</span>
                {preferredBarber === 'Any' && (
                  <Check className="w-3.5 h-3.5 text-gold-400 stroke-[3]" />
                )}
              </div>
            </button>

            {/* Individual On-Duty Barbers (Ravi, Amit, Imran) */}
            {barbers.map((barber) => {
              const isSelected = preferredBarber === barber.name;
              const isOnBreak = barber.onBreak;

>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
              return (
                <button
                  type="button"
                  key={barber.id}
<<<<<<< HEAD
                  onClick={() => setPreferredBarber(barber.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all min-h-touch ${
                    isSelected
                      ? 'bg-gold-500/15 border-gold-500 text-gold-300'
                      : 'bg-charcoal-800 border-charcoal-700 text-gray-300 hover:border-charcoal-600'
                  }`}
                >
                  {barber.label}
=======
                  disabled={isOnBreak}
                  onClick={() => !isOnBreak && setPreferredBarber(barber.name)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all min-h-touch ${
                    isOnBreak
                      ? 'bg-charcoal-900 border-charcoal-800 text-gray-500 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-sm'
                      : 'bg-charcoal-800 border-charcoal-700 text-gray-300 hover:border-charcoal-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {barber.name}
                      {isOnBreak && (
                        <span className="block text-[10px] text-gray-500 font-normal">
                          ({t('statusBreak')})
                        </span>
                      )}
                    </span>
                    {isSelected && !isOnBreak && (
                      <Check className="w-3.5 h-3.5 text-gold-400 stroke-[3]" />
                    )}
                  </div>
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
                </button>
              );
            })}
          </div>
        </div>

<<<<<<< HEAD
        {/* 5. Sticky Live Summary Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal-900/95 backdrop-blur border-t border-charcoal-700 p-4 z-30">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400">
                {t('totalSummary')}: <span className="text-white font-medium">{totalMinutes} {t('durationUnit')}</span> •{' '}
                <span className="text-gold-400 font-bold">₹{totalPrice}</span>
              </p>
              <p className="text-xs text-gray-400">
                {t('estimatedWait')}: <span className="text-white font-bold">~35 {t('durationUnit')}</span>
              </p>
            </div>
            <button
              type="submit"
              className="py-3 px-5 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm shadow-lg shadow-gold-500/20 active:scale-[0.98] transition-all min-h-touch whitespace-nowrap"
            >
              {t('confirmAndGetToken')}
=======
        {/* 5. Sticky Live Summary Footer (Bilingual EN / GU) */}
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal-900/95 backdrop-blur-md border-t border-charcoal-700/90 p-4 z-40 shadow-2xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs text-gray-300 font-semibold">
                <span>{t('totalSummary')}: </span>
                <span className="text-white font-bold">
                  {totalDuration} {t('durationUnit')}
                </span>{' '}
                •{' '}
                <span className="text-gold-400 font-black font-mono">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                <span>{t('estWaitLabel')}: </span>
                <strong className="text-white font-bold font-mono">
                  ~{dynamicEstWait} {t('durationUnit')}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!duplicateRedirectInfo}
              className={`py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-xl min-h-touch whitespace-nowrap active:scale-95 transition-all ${
                isSubmitting || duplicateRedirectInfo
                  ? 'bg-charcoal-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gold-500 hover:bg-gold-600 text-charcoal-950 shadow-gold-500/20'
              }`}
            >
              {isSubmitting ? t('redirecting') : t('confirmAndGetToken')}
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
