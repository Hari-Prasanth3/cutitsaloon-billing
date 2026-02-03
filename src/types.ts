export interface Service {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface SelectedService {
  name: string;
  price: number;
}

export interface Bill {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  workerName: string;
  customerName?: string;
  customerPhone?: string;
  services: SelectedService[];
  totalAmount: number;
}

export interface Worker {
  id: string;
  name: string;
}
