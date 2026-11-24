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
      {/* 1. Back Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 min-h-touch min-w-touch flex items-center justify-center border border-charcoal-700"
        >
          <ArrowLeft className="w-5 h-5 text-gold-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white font-serif tracking-wide">
            {t('joinTitle')}
          </h1>
          <p className="text-xs text-gray-400">{t('maxServicesHint')}</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Customer Details */}
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {t('customerDetails')}
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-500" />
              <span>{t('fullName')} *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fullNamePlaceholder')}
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
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all min-h-touch ${
                    isSelected
                      ? 'bg-charcoal-700/80 border-gold-500/80 shadow-md shadow-gold-500/10'
                      : 'bg-charcoal-800 border-charcoal-700/80 hover:border-charcoal-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-gold-500 border-gold-400 text-charcoal-950'
                          : 'border-charcoal-600 bg-charcoal-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{displayName}</p>
                      <p className="text-xs text-gray-400">
                        {srv.duration} {t('durationUnit')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gold-400">
                    ₹{srv.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Barber Preference */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {t('barberPreference')}
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'Any', label: t('anyBarberFastest') },
              { id: 'Ravi', label: 'Ravi' },
              { id: 'Amit', label: 'Amit' },
              { id: 'Imran', label: 'Imran' },
            ].map((barber) => {
              const isSelected = preferredBarber === barber.id;
              return (
                <button
                  type="button"
                  key={barber.id}
                  onClick={() => setPreferredBarber(barber.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all min-h-touch ${
                    isSelected
                      ? 'bg-gold-500/15 border-gold-500 text-gold-300'
                      : 'bg-charcoal-800 border-charcoal-700 text-gray-300 hover:border-charcoal-600'
                  }`}
                >
                  {barber.label}
                </button>
              );
            })}
          </div>
        </div>

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
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
