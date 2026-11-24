import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
<<<<<<< HEAD
=======
import { QueueProvider } from './context/QueueContext';
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
import { Navbar } from './components/Navbar';

// All 7 Screens
import { HomePage } from './pages/HomePage';
import { JoinQueuePage } from './pages/JoinQueuePage';
import { StatusPage } from './pages/StatusPage';
import { ReceptionPage } from './pages/ReceptionPage';
import { BarberPage } from './pages/BarberPage';
import { DisplayPage } from './pages/DisplayPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <LanguageProvider>
<<<<<<< HEAD
      <BrowserRouter>
        <div className="min-h-screen bg-charcoal-900 text-gray-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Screen 1: Home */}
              <Route path="/" element={<HomePage />} />

              {/* Screen 2: Join Queue */}
              <Route path="/join" element={<JoinQueuePage />} />

              {/* Screen 3: My Status */}
              <Route path="/status/:id" element={<StatusPage />} />

              {/* Screen 4: Reception Dashboard */}
              <Route path="/reception" element={<ReceptionPage />} />

              {/* Screen 5: Barber View */}
              <Route path="/barber/:name" element={<BarberPage />} />
              <Route path="/barber" element={<Navigate to="/barber/Ravi" replace />} />

              {/* Screen 6: Waiting Area TV */}
              <Route path="/display" element={<DisplayPage />} />

              {/* Screen 7: Owner Settings */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
=======
      <QueueProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-charcoal-900 text-gray-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Screen 1: Home */}
                <Route path="/" element={<HomePage />} />

                {/* Screen 2: Join Queue */}
                <Route path="/join" element={<JoinQueuePage />} />

                {/* Screen 3: My Status */}
                <Route path="/status/:id" element={<StatusPage />} />

                {/* Screen 4: Reception Dashboard */}
                <Route path="/reception" element={<ReceptionPage />} />

                {/* Screen 5: Barber View */}
                <Route path="/barber/:name" element={<BarberPage />} />
                <Route path="/barber" element={<Navigate to="/barber/Ravi" replace />} />

                {/* Screen 6: Waiting Area TV */}
                <Route path="/display" element={<DisplayPage />} />

                {/* Screen 7: Owner Settings */}
                <Route path="/admin" element={<AdminPage />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueueProvider>
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
    </LanguageProvider>
  );
}

export default App;
