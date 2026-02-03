import { Worker, Service } from './types';

export const WORKERS: Worker[] = [
  { id: 'w1', name: 'Ramesh' },
  { id: 'w2', name: 'Suresh' },
  { id: 'w3', name: 'Anil' },
];

export const SERVICES: Service[] = [
  { id: 's1', name: 'Hair Cut', price: 150, icon: 'scissors' },
  { id: 's2', name: 'Beard Trim', price: 80, icon: 'razor' },
  { id: 's3', name: 'Face Massage', price: 200, icon: 'hand' },
  { id: 's4', name: 'Hair Color', price: 500, icon: 'palette' },
];
