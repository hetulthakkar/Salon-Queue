import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Users, Clock, AlertOctagon, Power, Check, Edit2, ShieldAlert } from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_BARBERS } from '../utils/queueLogic';

export const AdminPage = () => {
  const { lang, t } = useLanguage();
  const [onlineQueueOpen, setOnlineQueueOpen] = useState(true);
  const [barbers, setBarbers] = useState(INITIAL_BARBERS);
  const [services, setServices] = useState(INITIAL_SERVICES);

  const toggleBarber = (id) => {
    setBarbers(
      barbers.map((b) => (b.id === id ? { ...b, onDuty: !b.onDuty } : b))
    );
  };

  const toggleService = (id) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. Header */}
      <div className="border-b border-charcoal-700/80 pb-4">
        <h1 className="text-2xl font-bold font-serif text-white tracking-wide">
          {t('adminTitle')}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Salon Management, Service Catalog & Live Operational Controls
        </p>
      </div>

      {/* 2. Today's Performance Cards (3-column) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold tracking-wider">
              {t('kpiServed')}
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">18</div>
          <p className="text-[11px] text-emerald-400 font-medium">+4 since last hour</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold tracking-wider">
              {t('kpiAvgWait')}
            </span>
            <Clock className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-extrabold text-gold-400">22 min</div>
          <p className="text-[11px] text-gray-400 font-medium">Optimal under 30 min target</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold tracking-wider">
              {t('kpiNoShows')}
            </span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400">1</div>
          <p className="text-[11px] text-gray-400 font-medium">5.2% of total bookings</p>
        </div>
      </div>

      {/* 3. Master Queue Control */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {t('masterQueueToggle')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {onlineQueueOpen ? t('queueOpenDesc') : t('queueClosedDesc')}
          </p>
        </div>

        <button
          onClick={() => setOnlineQueueOpen(!onlineQueueOpen)}
          className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all min-h-touch flex items-center justify-center gap-2 ${
            onlineQueueOpen
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{onlineQueueOpen ? 'OPEN (ACTIVE)' : 'CLOSED'}</span>
        </button>
      </div>

      {/* 4. Barbers on Duty Manager */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('barbersOnDutyTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-white">{barber.name}</p>
                <span
                  className={`text-[10px] font-bold ${
                    barber.onDuty ? 'text-emerald-400' : 'text-gray-500'
                  }`}
                >
                  {barber.onDuty ? t('onDuty') : t('offToday')}
                </span>
              </div>
              <button
                onClick={() => toggleBarber(barber.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                  barber.onDuty
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    : 'bg-charcoal-800 border border-charcoal-600 text-gray-400'
                }`}
              >
                {barber.onDuty ? 'On' : 'Off'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Service Catalog Manager */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('serviceCatalogTitle')}
        </h2>

        <div className="divide-y divide-charcoal-700/80">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {lang === 'gu' ? srv.nameGu : srv.nameEn}
                  <span className="text-xs text-gray-400 font-normal ml-2">
                    ({srv.nameEn} / {srv.nameGu})
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  {srv.duration} mins • <strong className="text-gold-400">₹{srv.price}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleService(srv.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    srv.active
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-charcoal-900 text-gray-500 border border-charcoal-700'
                  }`}
                >
                  {srv.active ? t('serviceActive') : t('serviceInactive')}
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 text-gray-300 text-xs font-semibold flex items-center gap-1 min-h-[36px]">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{t('editService')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
