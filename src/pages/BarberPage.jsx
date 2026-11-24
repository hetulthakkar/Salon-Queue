import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Scissors, Play, CheckCircle2, Coffee, Clock, ArrowRight, User } from 'lucide-react';

export const BarberPage = () => {
  const { name } = useParams();
  const barberName = name || 'Ravi';
  const { t } = useLanguage();

  const [onBreak, setOnBreak] = useState(false);
  const [chairState, setChairState] = useState('Called'); // 'Free' | 'Called' | 'InChair'
  const [timerSeconds, setTimerSeconds] = useState(862); // 14m 22s

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* 1. Header with Status Switch */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500 text-charcoal-950 font-bold flex items-center justify-center text-lg">
            {barberName.charAt(0)}
          </div>
          <div>
            <h1 className="text-base font-bold text-white">{barberName}</h1>
            <p className="text-xs text-gray-400">{t('barberViewTitle')}</p>
          </div>
        </div>

        {/* Break Toggle */}
        <button
          onClick={() => setOnBreak(!onBreak)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
            onBreak
              ? 'bg-amber-950 border border-amber-500 text-amber-300'
              : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>{onBreak ? t('statusOnBreak') : t('statusAvailable')}</span>
        </button>
      </div>

      {/* 2. Active Chair Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-charcoal-700/80 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            Active Client
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-charcoal-900 border border-charcoal-700 text-gray-300 font-medium">
            Chair 1
          </span>
        </div>

        {chairState === 'Called' ? (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">
                Customer Called — Waiting for Seat
              </span>
              <div className="text-4xl font-mono font-black text-gold-400">
                S-14
              </div>
              <p className="text-sm font-semibold text-white">Kunal Shah</p>
              <p className="text-xs text-gray-400">Haircut (30m) + Beard Trim (15m)</p>
            </div>

            <button
              onClick={() => setChairState('InChair')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-sm shadow-lg shadow-gold-500/20 min-h-touch transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('startServiceBtn')}</span>
            </button>
          </div>
        ) : chairState === 'InChair' ? (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <div className="text-4xl font-mono font-black text-emerald-400">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-gray-400">{t('runningTimer')} / 45:00 min</p>
              <p className="text-sm font-bold text-white mt-2">S-14 • Kunal Shah</p>
            </div>

            <button
              onClick={() => setChairState('Free')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 min-h-touch transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('markDoneBtn')}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-gray-400 italic">{t('chairFreeMsg')}</p>
            <button
              onClick={() => setChairState('Called')}
              className="py-3 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs min-h-touch transition-all"
            >
              {t('callNextCustomer')}
            </button>
          </div>
        )}
      </div>

      {/* 3. Up Next Preview Card */}
      <div className="bg-charcoal-800/80 border border-charcoal-700/80 rounded-xl p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t('upNextPreview')}
        </h3>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-gold-400 bg-charcoal-900 px-2 py-0.5 rounded border border-gold-500/30">
              S-15
            </span>
            <span className="text-white font-medium">Dev Dave</span>
          </div>
          <span className="text-gray-400">Haircut (30m)</span>
        </div>
      </div>

      {/* State Switcher for Verification */}
      <div className="p-3 rounded-xl bg-charcoal-800/50 border border-charcoal-700/50 space-y-2">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center">
          Barber Chair State Simulation
        </p>
        <div className="flex gap-2">
          {['Called', 'InChair', 'Free'].map((st) => (
            <button
              key={st}
              onClick={() => setChairState(st)}
              className={`flex-1 py-1.5 rounded text-xs font-medium min-h-[32px] ${
                chairState === st
                  ? 'bg-gold-500 text-charcoal-950 font-bold'
                  : 'bg-charcoal-700 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
