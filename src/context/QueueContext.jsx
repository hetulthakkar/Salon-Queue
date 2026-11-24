import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_QUEUE,
  validatePhone,
  findDuplicateActivePhone,
  calculateServicesSummary,
  calculateEstimatedWaitTime,
  calculateCustomerWaitTime,
  getCustomerQueuePosition,
  getNextCustomerForBarber,
  formatToken,
} from '../utils/queueLogic';

const QueueContext = createContext(null);

export const QueueProvider = ({ children }) => {
  // 1. Initial State from localStorage with initial seeds
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [barbers, setBarbers] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_barbers');
      return saved ? JSON.parse(saved) : INITIAL_BARBERS;
    } catch {
      return INITIAL_BARBERS;
    }
  });

  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_queue');
      return saved ? JSON.parse(saved) : INITIAL_QUEUE;
    } catch {
      return INITIAL_QUEUE;
    }
  });

  const [nextTokenNumber, setNextTokenNumber] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_next_token_num');
      return saved ? parseInt(saved, 10) : 16;
    } catch {
      return 16;
    }
  });

  const [servedTodayCount, setServedTodayCount] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_served_today_count');
      return saved ? parseInt(saved, 10) : 14;
    } catch {
      return 14;
    }
  });

  const [onlineQueueOpen, setOnlineQueueOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('salon_online_queue_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // 2. Real-time Multi-Tab Sync with BroadcastChannel & Storage Event
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('salon_queue_sync_channel');
      channel.onmessage = (event) => {
        if (!event.data || !event.data.type) return;
        const { type, payload } = event.data;
        if (type === 'SYNC_ALL') {
          if (payload.queue) setQueue(payload.queue);
          if (payload.barbers) setBarbers(payload.barbers);
          if (payload.services) setServices(payload.services);
          if (payload.nextTokenNumber) setNextTokenNumber(payload.nextTokenNumber);
          if (payload.servedTodayCount !== undefined) setServedTodayCount(payload.servedTodayCount);
          if (payload.onlineQueueOpen !== undefined) setOnlineQueueOpen(payload.onlineQueueOpen);
        }
      };
    } catch {
      // Fallback
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'salon_queue' && e.newValue) {
        setQueue(JSON.parse(e.newValue));
      }
      if (e.key === 'salon_barbers' && e.newValue) {
        setBarbers(JSON.parse(e.newValue));
      }
      if (e.key === 'salon_online_queue_open' && e.newValue) {
        setOnlineQueueOpen(JSON.parse(e.newValue));
      }
      if (e.key === 'salon_next_token_num' && e.newValue) {
        setNextTokenNumber(parseInt(e.newValue, 10));
      }
      if (e.key === 'salon_served_today_count' && e.newValue) {
        setServedTodayCount(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Broadcast state changes helper
  const broadcastSync = (data) => {
    try {
      const channel = new BroadcastChannel('salon_queue_sync_channel');
      channel.postMessage({ type: 'SYNC_ALL', payload: data });
      channel.close();
    } catch {
      // noop
    }
  };

  // 3. Actions & Helpers
  const joinQueue = useCallback(
    ({ name, phone, serviceIds, preferredBarber }) => {
      const cleanPhone = phone.replace(/\D/g, '');

      if (!validatePhone(cleanPhone)) {
        return { success: false, error: 'INVALID_PHONE' };
      }

      if (!serviceIds || serviceIds.length === 0) {
        return { success: false, error: 'NO_SERVICES' };
      }

      if (serviceIds.length > 3) {
        return { success: false, error: 'EXCEEDED_SERVICE_LIMIT' };
      }

      // Duplicate Check (only 1 active entry per 10-digit phone)
      const duplicate = findDuplicateActivePhone(queue, cleanPhone);
      if (duplicate) {
        return {
          success: false,
          duplicate: true,
          existingToken: duplicate.token,
          customer: duplicate,
        };
      }

      const token = formatToken(nextTokenNumber);
      const { selectedList, totalDuration } = calculateServicesSummary(serviceIds, services);

      const newCustomer = {
        id: `token-${nextTokenNumber}`,
        token,
        name: name.trim(),
        phone: cleanPhone,
        services: selectedList,
        preferredBarber: preferredBarber || 'Any',
        assignedBarber: null,
        status: 'Waiting',
        remainingMinutes: totalDuration,
        createdAt: Date.now(),
      };

      const updatedQueue = [...queue, newCustomer];
      const updatedNextToken = nextTokenNumber + 1;

      setQueue(updatedQueue);
      setNextTokenNumber(updatedNextToken);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_next_token_num', updatedNextToken.toString());

      broadcastSync({
        queue: updatedQueue,
        nextTokenNumber: updatedNextToken,
      });

      return {
        success: true,
        token,
        customer: newCustomer,
      };
    },
    [queue, nextTokenNumber, services]
  );

  // Call Next customer for a barber following exact preference rules (docs/03-flows-rules.md)
  const callNextForBarber = useCallback(
    (barberName) => {
      const eligibleCustomer = getNextCustomerForBarber(queue, barberName);

      if (!eligibleCustomer) {
        return { success: false, reason: 'NO_ELIGIBLE_CUSTOMER' };
      }

      // Transition customer to 'Called'
      const updatedQueue = queue.map((c) => {
        if (c.id === eligibleCustomer.id || c.token === eligibleCustomer.token) {
          return {
            ...c,
            status: 'Called',
            assignedBarber: barberName,
            calledAt: Date.now(),
          };
        }
        return c;
      });

      // Update Barber chair status to 'Called'
      const updatedBarbers = barbers.map((b) => {
        if (b.name === barberName) {
          return {
            ...b,
            status: 'Called',
            currentCustomer: {
              token: eligibleCustomer.token,
              name: eligibleCustomer.name,
              services: eligibleCustomer.services,
              duration: eligibleCustomer.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 30,
            },
          };
        }
        return b;
      });

      setQueue(updatedQueue);
      setBarbers(updatedBarbers);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));

      broadcastSync({
        queue: updatedQueue,
        barbers: updatedBarbers,
      });

      return { success: true, customer: eligibleCustomer };
    },
    [queue, barbers]
  );

  // Mark No-Show for a Called customer
  const markNoShow = useCallback(
    (token) => {
      let freedBarberName = null;

      const updatedQueue = queue.map((c) => {
        if (c.token === token || c.id === token) {
          freedBarberName = c.assignedBarber;
          return { ...c, status: 'No-Show' };
        }
        return c;
      });

      const updatedBarbers = barbers.map((b) => {
        if (b.name === freedBarberName || b.currentCustomer?.token === token) {
          return {
            ...b,
            status: b.onBreak ? 'Break' : 'Free',
            currentCustomer: null,
            remainingMinutes: 0,
          };
        }
        return b;
      });

      setQueue(updatedQueue);
      setBarbers(updatedBarbers);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));

      broadcastSync({
        queue: updatedQueue,
        barbers: updatedBarbers,
      });

      return true;
    },
    [queue, barbers]
  );

  // Cancel customer spot
  const cancelCustomer = useCallback(
    (token) => {
      let freedBarberName = null;

      const updatedQueue = queue.map((c) => {
        if (c.token === token || c.id === token) {
          freedBarberName = c.assignedBarber;
          return { ...c, status: 'Cancelled' };
        }
        return c;
      });

      const updatedBarbers = barbers.map((b) => {
        if (b.name === freedBarberName || b.currentCustomer?.token === token) {
          return {
            ...b,
            status: b.onBreak ? 'Break' : 'Free',
            currentCustomer: null,
            remainingMinutes: 0,
          };
        }
        return b;
      });

      setQueue(updatedQueue);
      setBarbers(updatedBarbers);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));

      broadcastSync({
        queue: updatedQueue,
        barbers: updatedBarbers,
      });

      return true;
    },
    [queue, barbers]
  );

  // Start service for barber ('Called' -> 'In Chair')
  const startServiceForBarber = useCallback(
    (barberName) => {
      let targetToken = null;

      const updatedBarbers = barbers.map((b) => {
        if (b.name === barberName) {
          targetToken = b.currentCustomer?.token;
          return { ...b, status: 'Busy' };
        }
        return b;
      });

      const updatedQueue = queue.map((c) => {
        if (c.token === targetToken || (c.assignedBarber === barberName && c.status === 'Called')) {
          return { ...c, status: 'In Chair', startedAt: Date.now() };
        }
        return c;
      });

      setQueue(updatedQueue);
      setBarbers(updatedBarbers);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));

      broadcastSync({ queue: updatedQueue, barbers: updatedBarbers });
    },
    [queue, barbers]
  );

  // Mark done for barber ('In Chair' -> 'Done')
  const markDoneForBarber = useCallback(
    (barberName) => {
      let targetToken = null;

      const updatedBarbers = barbers.map((b) => {
        if (b.name === barberName) {
          targetToken = b.currentCustomer?.token;
          return {
            ...b,
            status: b.onBreak ? 'Break' : 'Free',
            currentCustomer: null,
            remainingMinutes: 0,
          };
        }
        return b;
      });

      const updatedQueue = queue.map((c) => {
        if (c.token === targetToken || (c.assignedBarber === barberName && c.status === 'In Chair')) {
          return { ...c, status: 'Done', completedAt: Date.now() };
        }
        return c;
      });

      const newServedCount = servedTodayCount + 1;

      setQueue(updatedQueue);
      setBarbers(updatedBarbers);
      setServedTodayCount(newServedCount);

      localStorage.setItem('salon_queue', JSON.stringify(updatedQueue));
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));
      localStorage.setItem('salon_served_today_count', newServedCount.toString());

      broadcastSync({
        queue: updatedQueue,
        barbers: updatedBarbers,
        servedTodayCount: newServedCount,
      });
    },
    [queue, barbers, servedTodayCount]
  );

  // Toggle barber onBreak status
  const toggleBarberBreak = useCallback(
    (barberName) => {
      const updatedBarbers = barbers.map((b) => {
        if (b.name === barberName) {
          const nextBreak = !b.onBreak;
          return {
            ...b,
            onBreak: nextBreak,
            status: nextBreak ? 'Break' : (b.currentCustomer ? 'Busy' : 'Free'),
          };
        }
        return b;
      });

      setBarbers(updatedBarbers);
      localStorage.setItem('salon_barbers', JSON.stringify(updatedBarbers));
      broadcastSync({ barbers: updatedBarbers });
    },
    [barbers]
  );

  const findCustomer = useCallback(
    (query) => {
      if (!query) return null;
      const q = query.trim().toUpperCase();
      const cleanedPhone = query.replace(/\D/g, '');

      return queue.find((c) => {
        if (c.token.toUpperCase() === q || c.token.toUpperCase() === `S-${q}` || c.id === query) {
          return true;
        }
        if (cleanedPhone && cleanedPhone.length === 10 && c.phone === cleanedPhone) {
          return true;
        }
        return false;
      });
    },
    [queue]
  );

  const getEstimatedWait = useCallback(
    (preferredBarber = 'Any') => {
      return calculateEstimatedWaitTime(queue, barbers, preferredBarber);
    },
    [queue, barbers]
  );

  const getCustomerWait = useCallback(
    (customer) => {
      return calculateCustomerWaitTime(queue, barbers, customer);
    },
    [queue, barbers]
  );

  const getCustomerPosition = useCallback(
    (customerToken) => {
      return getCustomerQueuePosition(queue, customerToken);
    },
    [queue]
  );

  const waitingCount = queue.filter((c) => c.status === 'Waiting').length;
  const inChairCount = queue.filter((c) => c.status === 'In Chair').length;
  const waitingAndCalledQueue = queue
    .filter((c) => c.status === 'Waiting' || c.status === 'Called')
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <QueueContext.Provider
      value={{
        services,
        barbers,
        queue,
        nextTokenNumber,
        servedTodayCount,
        onlineQueueOpen,
        waitingCount,
        inChairCount,
        waitingAndCalledQueue,
        joinQueue,
        callNextForBarber,
        markNoShow,
        cancelCustomer,
        cancelSpot: cancelCustomer,
        startServiceForBarber,
        markDoneForBarber,
        toggleBarberBreak,
        findCustomer,
        getEstimatedWait,
        getCustomerWait,
        getCustomerPosition,
        setOnlineQueueOpen,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
