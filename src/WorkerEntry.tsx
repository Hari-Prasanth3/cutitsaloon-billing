import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Scissors,
  Check,
  Save,
  Sparkles,
} from 'lucide-react';
import { Bill, SelectedService } from './types';
import { WORKERS, SERVICES } from './data';
import {
  loadBills,
  saveBills,
  formatTime,
  formatDate,
  generateId,
  getTodayBills,
} from './utils';

interface WorkerEntryProps {
  onNavigateToDashboard: () => void;
}

export default function WorkerEntry({
  onNavigateToDashboard,
}: WorkerEntryProps) {
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [bills, setBills] = useState<Bill[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setBills(loadBills());
  }, []);

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const calculateTotal = (): number => {
    let total = 0;
    selectedServices.forEach(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });
    return total;
  };

  const handleSaveBill = () => {
    if (!selectedWorker || selectedServices.size === 0) {
      alert('Please select a worker and at least one service');
      return;
    }

    const timestamp = Date.now();
    const servicesArray: SelectedService[] = Array.from(selectedServices).map(
      serviceId => {
        const service = SERVICES.find(s => s.id === serviceId)!;
        return {
          name: service.name,
          price: service.price,
        };
      }
    );

    const newBill: Bill = {
      id: generateId(),
      timestamp,
      date: formatDate(timestamp),
      time: formatTime(timestamp),
      workerName: WORKERS.find(w => w.id === selectedWorker)!.name,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      services: servicesArray,
      totalAmount: calculateTotal(),
    };

    const updatedBills = [newBill, ...bills];
    saveBills(updatedBills);
    setBills(updatedBills);

    setSelectedWorker('');
    setCustomerName('');
    setCustomerPhone('');
    setSelectedServices(new Set());

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const totalAmount = calculateTotal();
  const todayBills = getTodayBills(bills);

  const getServiceIcon = (serviceName: string) => {
    const service = SERVICES.find(s => s.name === serviceName);
    if (!service) return null;

    if (service.icon === 'scissors')
      return <Scissors className="text-white" size={16} />;
    if (service.icon === 'razor')
      return <Sparkles className="text-white" size={16} />;
    if (service.icon === 'hand') return <span className="text-white">✋</span>;
    if (service.icon === 'palette')
      return <span className="text-white">🎨</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onNavigateToDashboard}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors active:scale-95"
          >
            <ArrowLeft className="text-slate-700" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">New Entry</h1>
            <p className="text-slate-500 text-sm">Create a new bill</p>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-emerald-500 text-white p-4 rounded-xl mb-4 flex items-center gap-2 shadow-lg animate-bounce">
            <Check size={20} />
            <span className="font-semibold">Bill saved successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={20} />
            Select Worker
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {WORKERS.map(worker => (
              <button
                key={worker.id}
                onClick={() => setSelectedWorker(worker.id)}
                className={`p-4 rounded-xl font-semibold transition-all active:scale-95 ${
                  selectedWorker === worker.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {worker.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Customer Details (Optional)
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Scissors size={20} />
            Select Services
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {SERVICES.map(service => {
              const isSelected = selectedServices.has(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`relative p-6 rounded-xl transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg scale-105'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                      <Check className="text-blue-500" size={16} />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {service.icon === 'scissors' && '✂️'}
                      {service.icon === 'razor' && '🪒'}
                      {service.icon === 'hand' && '✋'}
                      {service.icon === 'palette' && '🎨'}
                    </div>
                    <p
                      className={`font-semibold mb-1 ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {service.name}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        isSelected ? 'text-blue-100' : 'text-slate-600'
                      }`}
                    >
                      ₹{service.price}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg mb-6">
          <p className="text-amber-100 text-sm font-medium mb-1">Total Amount</p>
          <p className="text-5xl font-bold text-white">₹{totalAmount}</p>
        </div>

        <button
          onClick={handleSaveBill}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all mb-8"
        >
          <Save size={20} />
          Save Bill
        </button>

        {todayBills.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Today's Bills
            </h2>
            <div className="space-y-3">
              {todayBills.map(bill => (
                <div
                  key={bill.id}
                  className="bg-slate-50 rounded-xl p-4 border-2 border-slate-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        {bill.time}
                      </p>
                      <p className="font-bold text-slate-800">{bill.workerName}</p>
                      {bill.customerName && (
                        <p className="text-sm text-slate-600">{bill.customerName}</p>
                      )}
                    </div>
                    <p className="text-xl font-bold text-slate-800">
                      ₹{bill.totalAmount}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {bill.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        {getServiceIcon(service.name)}
                        <span>{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
