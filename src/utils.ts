import { Bill } from './types';

const STORAGE_KEY = 'bills';

export const saveBills = (bills: Bill[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
};

export const loadBills = (): Bill[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isToday = (dateStr: string): boolean => {
  const today = formatDate(Date.now());
  return dateStr === today;
};

export const getTodayBills = (bills: Bill[]): Bill[] => {
  return bills.filter(bill => isToday(bill.date));
};

export const getTotalEarnings = (bills: Bill[]): number => {
  return bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
};

export const getTodayEarnings = (bills: Bill[]): number => {
  return getTodayBills(bills).reduce((sum, bill) => sum + bill.totalAmount, 0);
};

export const getTodayServicesCount = (bills: Bill[]): number => {
  return getTodayBills(bills).reduce(
    (count, bill) => count + bill.services.length,
    0
  );
};

export const getRevenueByService = (bills: Bill[]) => {
  const todayBills = getTodayBills(bills);
  const serviceMap: { [key: string]: { count: number; revenue: number } } = {};

  todayBills.forEach(bill => {
    bill.services.forEach(service => {
      if (!serviceMap[service.name]) {
        serviceMap[service.name] = { count: 0, revenue: 0 };
      }
      serviceMap[service.name].count += 1;
      serviceMap[service.name].revenue += service.price;
    });
  });

  return Object.entries(serviceMap).map(([name, data]) => ({
    name,
    ...data,
  }));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
