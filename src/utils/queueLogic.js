/**
 * Single Source of Truth for all queue calculations:
 * - wait time estimation
 * - next customer selection algorithm
 * - sequential token generation
 * Adheres strictly to AGENTS.md rule 4 and docs/03-flows-rules.md
 */

export const INITIAL_SERVICES = [
  { id: 'haircut', nameEn: 'Haircut', nameGu: 'હેરકટ', duration: 30, price: 150, active: true },
  { id: 'beard', nameEn: 'Beard Trim & Styling', nameGu: 'દાઢી ટ્રીમ અને સ્ટાઇલ', duration: 15, price: 80, active: true },
  { id: 'spa', nameEn: 'Hair Spa', nameGu: 'હેર સ્પા', duration: 45, price: 400, active: true },
  { id: 'massage', nameEn: 'Head Massage', nameGu: 'હેડ મસાજ', duration: 20, price: 120, active: true },
  { id: 'cleanup', nameEn: 'Facial Cleanup', nameGu: 'ફેસ ક્લીનઅપ', duration: 40, price: 350, active: true },
];

export const INITIAL_BARBERS = [
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
 */
export function formatToken(number) {
  return `S-${number}`;
}
