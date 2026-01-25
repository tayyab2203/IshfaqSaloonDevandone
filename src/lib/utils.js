import { format, parseISO, isValid } from 'date-fns';

/**
 * Format date to display string
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
}

/**
 * Format time string (HH:mm)
 */
export function formatTime(time) {
  if (!time) return '';
  return time;
}

/**
 * Format currency (PKR)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'PKR 0';
  return `PKR ${Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
  if (!phone) return false;
  // Basic validation - adjust based on your country's format
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validate email
 */
export function validateEmail(email) {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate total duration from service durations
 */
export function calculateTotalDuration(services) {
  if (!services || !Array.isArray(services)) return 0;
  return services.reduce((total, service) => {
    return total + (service.duration || 0);
  }, 0);
}

/**
 * Calculate total price from services
 */
export function calculateTotalPrice(services) {
  if (!services || !Array.isArray(services)) return 0;
  return services.reduce((total, service) => {
    return total + (service.price || 0);
  }, 0);
}

/**
 * Generate time slots in 30-minute intervals
 */
export function generateTimeSlots(startTime = '09:00', endTime = '18:00', intervalMinutes = 30) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }
  
  return slots;
}

/**
 * Check if date is today
 */
export function isToday(date) {
  if (!date) return false;
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  return format(today, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd');
}

/**
 * Check if date is in the past
 */
export function isPastDate(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

/**
 * Get status badge classes
 */
export function getStatusBadgeClasses(status) {
  const statusMap = {
    scheduled: 'bg-info-bg text-info-text border border-blue-300',
    completed: 'bg-success-bg text-success-text border border-green-300',
    cancelled: 'bg-error-bg text-error-text border border-red-300',
    'no-show': 'bg-warning-bg text-warning-text border border-amber-300',
    active: 'bg-success-bg text-success-text border border-green-300',
    inactive: 'bg-medium-grey text-slate-blue border border-medium-grey',
  };
  
  return statusMap[status] || 'bg-medium-grey text-dark-charcoal border border-medium-grey';
}

/**
 * Format cookies from ReadonlyRequestCookies to Cookie header string
 */
export function formatCookiesForHeader(cookieStore) {
  const cookies = [];
  cookieStore.getAll().forEach(cookie => {
    cookies.push(`${cookie.name}=${cookie.value}`);
  });
  return cookies.join('; ');
}
