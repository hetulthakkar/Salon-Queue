/**
 * Single Source of Truth for all queue calculations:
<<<<<<< HEAD
 * - wait time estimation
 * - next customer selection algorithm
 * - sequential token generation
 * Adheres strictly to AGENTS.md rule 4 and docs/03-flows-rules.md
=======
 * - Sequential token generation ('S-1', 'S-2', ...)
 * - Wait time estimation exact formula (adheres to docs/03-flows-rules.md)
 * - Next customer FIFO selection algorithm
 * - Phone validation & duplicate detection
 * - Service pricing and duration calculation
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
 */

export const INITIAL_SERVICES = [
  { id: 'haircut', nameEn: 'Haircut', nameGu: 'હેરકટ', duration: 30, price: 150, active: true },
  { id: 'beard', nameEn: 'Beard Trim & Styling', nameGu: 'દાઢી ટ્રીમ અને સ્ટાઇલ', duration: 15, price: 80, active: true },
  { id: 'spa', nameEn: 'Hair Spa', nameGu: 'હેર સ્પા', duration: 45, price: 400, active: true },
  { id: 'massage', nameEn: 'Head Massage', nameGu: 'હેડ મસાજ', duration: 20, price: 120, active: true },
  { id: 'cleanup', nameEn: 'Facial Cleanup', nameGu: 'ફેસ ક્લીનઅપ', duration: 40, price: 350, active: true },
];

export const INITIAL_BARBERS = [
<<<<<<< HEAD
  { id: 'b1', name: 'Ravi', onDuty: true, onBreak: false },
  { id: 'b2', name: 'Amit', onDuty: true, onBreak: false },
  { id: 'b3', name: 'Imran', onDuty: true, onBreak: false },
];

/**
 * Calculates estimated wait time in minutes for a customer in queue
 */
export function calculateEstimatedWaitTime(waitingAhead, inChairCustomers, onDutyBarbers) {
  const activeBarbers = Math.max(1, onDutyBarbers.filter(b => b.onDuty && !b.onBreak).length);
  
  const totalWaitingMinutes = waitingAhead.reduce((sum, c) => {
    const serviceMinutes = c.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 0;
    return sum + serviceMinutes;
  }, 0);

  const inChairRemainingMinutes = inChairCustomers.reduce((sum, c) => {
    return sum + (c.remainingMinutes || 15);
  }, 0);

  const totalMinutes = totalWaitingMinutes + inChairRemainingMinutes;
  const rawWait = totalMinutes / activeBarbers;
  // Round to nearest 5 minutes
  return Math.ceil(rawWait / 5) * 5;
}

/**
 * Next customer selection algorithm for barber X
 * Earliest FIFO eligible customer with preferredBarber === X or 'Any'
 */
export function getNextCustomerForBarber(waitingQueue, barberName) {
  return waitingQueue.find(customer => {
    return customer.status === 'Waiting' && 
      (!customer.preferredBarber || customer.preferredBarber === 'Any' || customer.preferredBarber === barberName);
  });
}

/**
 * Generate sequential token format 'S-X'
=======
  {
    id: 'b1',
    name: 'Ravi',
    onDuty: true,
    onBreak: false,
    status: 'Free',
    remainingMinutes: 0,
    currentCustomer: null,
  },
  {
    id: 'b2',
    name: 'Amit',
    onDuty: true,
    onBreak: false,
    status: 'Busy',
    remainingMinutes: 12,
    currentCustomer: { token: 'S-12', name: 'Rahul Patel' },
  },
  {
    id: 'b3',
    name: 'Imran',
    onDuty: true,
    onBreak: false,
    status: 'Busy',
    remainingMinutes: 5,
    currentCustomer: { token: 'S-13', name: 'Bhavin Shah' },
  },
];

export const INITIAL_QUEUE = [
  {
    id: 'token-12',
    token: 'S-12',
    name: 'Rahul Patel',
    phone: '9876543210',
    services: [INITIAL_SERVICES[0]], // Haircut (30m, 150)
    preferredBarber: 'Amit',
    assignedBarber: 'Amit',
    status: 'In Chair',
    remainingMinutes: 12,
    createdAt: Date.now() - 18 * 60 * 1000,
  },
  {
    id: 'token-13',
    token: 'S-13',
    name: 'Bhavin Shah',
    phone: '9876543211',
    services: [INITIAL_SERVICES[3]], // Head Massage (20m, 120)
    preferredBarber: 'Imran',
    assignedBarber: 'Imran',
    status: 'In Chair',
    remainingMinutes: 5,
    createdAt: Date.now() - 15 * 60 * 1000,
  },
  {
    id: 'token-14',
    token: 'S-14',
    name: 'Kunal Shah',
    phone: '9876543212',
    services: [INITIAL_SERVICES[0], INITIAL_SERVICES[1]], // Haircut + Beard (45m, 230)
    preferredBarber: 'Amit',
    assignedBarber: null,
    status: 'Waiting',
    remainingMinutes: 45,
    createdAt: Date.now() - 10 * 60 * 1000,
  },
  {
    id: 'token-15',
    token: 'S-15',
    name: 'Dev Dave',
    phone: '9876543213',
    services: [INITIAL_SERVICES[0]], // Haircut (30m, 150)
    preferredBarber: 'Any',
    assignedBarber: null,
    status: 'Waiting',
    remainingMinutes: 30,
    createdAt: Date.now() - 5 * 60 * 1000,
  },
];

/**
 * Validates strictly 10-digit mobile number
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return /^[0-9]{10}$/.test(cleaned);
}

/**
 * Finds an active customer in queue by 10-digit phone
 * Active statuses: 'Waiting', 'Called', 'In Chair'
 */
export function findDuplicateActivePhone(queue, phone) {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  const activeStatuses = ['Waiting', 'Called', 'In Chair'];
  return queue.find(
    (item) => activeStatuses.includes(item.status) && item.phone.replace(/\D/g, '') === cleaned
  );
}

/**
 * Calculates total minutes and price for a selected service array
 */
export function calculateServicesSummary(selectedServiceIds, catalog = INITIAL_SERVICES) {
  const selectedList = catalog.filter((srv) => selectedServiceIds.includes(srv.id));
  const totalDuration = selectedList.reduce((sum, srv) => sum + (srv.duration || 0), 0);
  const totalPrice = selectedList.reduce((sum, srv) => sum + (srv.price || 0), 0);
  return { totalDuration, totalPrice, selectedList };
}

/**
 * Returns a customer's 1-based numerical position among Waiting customers
 */
export function getCustomerQueuePosition(queue, customerToken) {
  const waitingList = queue
    .filter((c) => c.status === 'Waiting')
    .sort((a, b) => a.createdAt - b.createdAt);

  const idx = waitingList.findIndex(
    (c) => c.token === customerToken || c.id === customerToken
  );

  return idx >= 0 ? idx + 1 : null;
}

/**
 * EXACT wait time formula adhering to docs/03-flows-rules.md:
 * - Count active on-duty barbers who are NOT On Break (minimum 1 to avoid division by zero).
 * - Sum total service minutes of all Waiting customers ahead of target customer
 *   (matching their barber constraint or general pool) + remaining minutes of customers In Chair.
 * - Divide total ahead minutes by active working barbers, rounded to nearest 5 minutes.
 */
export function calculateCustomerWaitTime(queue, barbers, customer) {
  if (!customer) return 0;
  if (customer.status === 'Called' || customer.status === 'In Chair') return 0;
  if (customer.status === 'Done' || customer.status === 'Cancelled' || customer.status === 'No-Show') return 0;

  // 1. Active on-duty working barbers (min 1)
  const activeBarbers = Math.max(
    1,
    barbers.filter((b) => b.onDuty && !b.onBreak).length
  );

  // 2. Identify Waiting customers strictly ahead of this target customer (earliest createdAt)
  const waitingList = queue
    .filter((c) => c.status === 'Waiting')
    .sort((a, b) => a.createdAt - b.createdAt);

  const targetIndex = waitingList.findIndex(
    (c) => c.token === customer.token || c.id === customer.id
  );

  const waitingAhead = targetIndex > 0 ? waitingList.slice(0, targetIndex) : [];

  // Filter ahead customers matching target's barber preference or general pool
  const targetPref = customer.preferredBarber || 'Any';

  let relevantWaitingMinutes = 0;
  if (targetPref !== 'Any') {
    relevantWaitingMinutes = waitingAhead
      .filter((c) => !c.preferredBarber || c.preferredBarber === 'Any' || c.preferredBarber === targetPref)
      .reduce((sum, c) => {
        const srvMins = c.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 30;
        return sum + srvMins;
      }, 0);
  } else {
    relevantWaitingMinutes = waitingAhead.reduce((sum, c) => {
      const srvMins = c.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 30;
      return sum + srvMins;
    }, 0);
  }

  // In Chair remaining minutes
  const inChairCustomers = queue.filter((c) => c.status === 'In Chair');
  let relevantInChairMinutes = 0;

  if (targetPref !== 'Any') {
    const barberChair = inChairCustomers.find((c) => c.assignedBarber === targetPref);
    relevantInChairMinutes = barberChair ? (barberChair.remainingMinutes || 12) : 0;
  } else {
    relevantInChairMinutes = inChairCustomers.reduce((sum, c) => {
      return sum + (c.remainingMinutes || 12);
    }, 0);
  }

  const totalAheadMinutes = relevantWaitingMinutes + relevantInChairMinutes;

  if (totalAheadMinutes === 0) {
    // If no customers ahead and a chair is ready
    return 5;
  }

  const rawWait = totalAheadMinutes / activeBarbers;
  // Round to nearest 5 minutes
  return Math.max(5, Math.ceil(rawWait / 5) * 5);
}

/**
 * General estimated wait time (used before joining, or when looking at overall queue)
 */
export function calculateEstimatedWaitTime(queue, barbers, preferredBarber = 'Any') {
  const activeBarbers = Math.max(
    1,
    barbers.filter((b) => b.onDuty && !b.onBreak).length
  );

  const waitingCustomers = queue.filter((c) => c.status === 'Waiting');
  const inChairCustomers = queue.filter((c) => c.status === 'In Chair');

  if (waitingCustomers.length === 0 && inChairCustomers.length === 0) {
    return 0;
  }

  let relevantWaitingMinutes = 0;
  let relevantInChairMinutes = 0;

  if (preferredBarber && preferredBarber !== 'Any') {
    relevantWaitingMinutes = waitingCustomers
      .filter((c) => !c.preferredBarber || c.preferredBarber === 'Any' || c.preferredBarber === preferredBarber)
      .reduce((sum, c) => {
        const srvMins = c.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 30;
        return sum + srvMins;
      }, 0);

    const barberChair = inChairCustomers.find((c) => c.assignedBarber === preferredBarber);
    relevantInChairMinutes = barberChair ? (barberChair.remainingMinutes || 12) : 0;

    const rawWait = relevantWaitingMinutes + relevantInChairMinutes;
    return Math.max(5, Math.ceil(rawWait / 5) * 5);
  }

  relevantWaitingMinutes = waitingCustomers.reduce((sum, c) => {
    const srvMins = c.services?.reduce((s, srv) => s + (srv.duration || 0), 0) || 30;
    return sum + srvMins;
  }, 0);

  relevantInChairMinutes = inChairCustomers.reduce((sum, c) => {
    return sum + (c.remainingMinutes || 12);
  }, 0);

  const totalMinutes = relevantWaitingMinutes + relevantInChairMinutes;
  const rawWait = totalMinutes / activeBarbers;
  return Math.max(5, Math.ceil(rawWait / 5) * 5);
}

/**
 * Next customer selection algorithm for barber X (docs/03-flows-rules.md):
 * Earliest FIFO eligible customer with preferredBarber === X or 'Any'
 */
export function getNextCustomerForBarber(waitingQueue, barberName) {
  return waitingQueue
    .filter((c) => c.status === 'Waiting')
    .sort((a, b) => a.createdAt - b.createdAt)
    .find((customer) => {
      return (
        !customer.preferredBarber ||
        customer.preferredBarber === 'Any' ||
        customer.preferredBarber === barberName
      );
    });
}

/**
 * Format token string: S-1, S-2, S-3...
>>>>>>> dad08c2 (feat: scaffold Vite + Tailwind app and update live demo URL)
 */
export function formatToken(number) {
  return `S-${number}`;
}
