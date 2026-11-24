import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Volume2, VolumeX, Sparkles, QrCode } from 'lucide-react';

export const DisplayPage = () => {
  const { t } = useLanguage();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [clock, setClock] = useState('');
  const [flashAlert, setFlashAlert] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerDemoChime = () => {
    setFlashAlert(true);
    if (audioEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (err) {
        console.warn('Audio play blocked', err);
      }
    }
    setTimeout(() => setFlashAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-white p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden relative">
      {/* Flashing Gold Call Alert Overlay */}
      {flashAlert && (
        <div className="absolute inset-x-8 top-20 z-50 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-charcoal-950 p-6 shadow-2xl border-4 border-white animate-pulse flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles className="w-10 h-10 fill-current" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                {t('turnAlertOverlay')}
              </p>
              <p className="text-3xl font-black font-mono">
                TOKEN S-14 ➔ GO TO AMIT (CHAIR 2)
              </p>
            </div>
          </div>
          <span className="text-sm font-bold bg-charcoal-950 text-gold-400 px-4 py-2 rounded-xl font-mono">
            NOW
          </span>
        </div>
      )}

      {/* 1. TV Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-charcoal-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gold-400 tracking-wider">
            {t('salonName')}
          </h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide mt-1">
            {t('scanQrToJoin')}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setAudioEnabled(true);
              triggerDemoChime();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
              audioEnabled
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioEnabled ? t('audioActiveNotice') : t('enableAudioBtn')}</span>
          </button>

          <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-200">
            {clock}
          </div>
        </div>
      </header>

      {/* 2. Main TV Split View (1080p Readable 5m Away) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8">
        {/* Left Half (60% width): NOW SERVING Active Chairs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-widest text-gold-400 uppercase">
              {t('nowServing')}
            </h2>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Chairs On Duty</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Chair 1 */}
            <div className="bg-charcoal-900 border-2 border-emerald-500/40 rounded-2xl p-6 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Chair 1 • Ravi
                </span>
                <p className="text-lg font-bold text-gray-300">Available / Next Up</p>
              </div>
              <span className="text-2xl font-mono font-black text-emerald-400 bg-charcoal-950 px-4 py-2 rounded-xl border border-emerald-500/30">
                READY
              </span>
            </div>

            {/* Chair 2 */}
            <div className="bg-charcoal-900 border-2 border-gold-500/60 rounded-2xl p-6 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">
                  Chair 2 • Amit
                </span>
                <p className="text-2xl font-bold text-white">Rahul P.</p>
              </div>
              <span className="text-5xl font-mono font-black text-gold-400 bg-charcoal-950 px-5 py-2.5 rounded-2xl border border-gold-500/40">
                S-12
              </span>
            </div>

            {/* Chair 3 */}
            <div className="bg-charcoal-900 border-2 border-gold-500/60 rounded-2xl p-6 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">
                  Chair 3 • Imran
                </span>
                <p className="text-2xl font-bold text-white">Bhavin S.</p>
              </div>
              <span className="text-5xl font-mono font-black text-gold-400 bg-charcoal-950 px-5 py-2.5 rounded-2xl border border-gold-500/40">
                S-13
              </span>
            </div>
          </div>
        </div>

        {/* Right Half (40% width): UP NEXT Table (Next 5 Tokens) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-widest text-gray-300 uppercase">
              {t('upNextTable')}
            </h2>
            <span className="text-xs text-gold-400 font-semibold">Next 5 In Line</span>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-charcoal-800 bg-charcoal-800/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4">{t('tokenCol')}</th>
                  <th className="py-3 px-4">{t('nameCol')}</th>
                  <th className="py-3 px-4">{t('barberCol')}</th>
                  <th className="py-3 px-4 text-right">{t('waitCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sm">
                <tr className="hover:bg-charcoal-800/40">
                  <td className="py-4 px-4 font-mono font-black text-gold-400 text-lg">S-14</td>
                  <td className="py-4 px-4 font-semibold text-white">Kunal S.</td>
                  <td className="py-4 px-4 text-gray-400 text-xs">Amit</td>
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">~10 min</td>
                </tr>
                <tr className="hover:bg-charcoal-800/40">
                  <td className="py-4 px-4 font-mono font-black text-gold-400 text-lg">S-15</td>
                  <td className="py-4 px-4 font-semibold text-white">Dev D.</td>
                  <td className="py-4 px-4 text-gray-400 text-xs">Any</td>
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">~20 min</td>
                </tr>
                <tr className="hover:bg-charcoal-800/40">
                  <td className="py-4 px-4 font-mono font-black text-gold-400 text-lg">S-16</td>
                  <td className="py-4 px-4 font-semibold text-white">Pratik J.</td>
                  <td className="py-4 px-4 text-gray-400 text-xs">Imran</td>
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">~35 min</td>
                </tr>
                <tr className="hover:bg-charcoal-800/40">
                  <td className="py-4 px-4 font-mono font-black text-gold-400 text-lg">S-17</td>
                  <td className="py-4 px-4 font-semibold text-white">Jayesh M.</td>
                  <td className="py-4 px-4 text-gray-400 text-xs">Any</td>
                  <td className="py-4 px-4 text-right text-gray-300 font-mono">~45 min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. Bottom Demo Bar for Triggering Chime/Flash */}
      <footer className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs text-gray-500">
        <span>Screen 6: Waiting Area TV (<code>/display</code>)</span>
        <button
          onClick={triggerDemoChime}
          className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold-400 font-medium border border-charcoal-700 transition-colors"
        >
          Test TV Call Flash & Chime
        </button>
      </footer>
    </div>
  );
};
