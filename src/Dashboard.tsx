import { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Scissors,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Bill } from './types';
import {
  loadBills,
  getTotalEarnings,
  getTodayEarnings,
  getTodayServicesCount,
  getRevenueByService,
} from './utils';
import { SERVICES } from './data';

interface DashboardProps {
  onNavigateToEntry: () => void;
}

export default function Dashboard({ onNavigateToEntry }: DashboardProps) {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const loadedBills = loadBills();
    setBills(loadedBills);
  }, []);

  const totalEarnings = getTotalEarnings(bills);
  const todayEarnings = getTodayEarnings(bills);
  const todayServicesCount = getTodayServicesCount(bills);
  const revenueByService = getRevenueByService(bills);

  const getServiceIcon = (serviceName: string) => {
    const service = SERVICES.find(s => s.name === serviceName);
    return service?.icon || 'sparkles';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Salon Performance</p>
          </div>
          <Sparkles className="text-amber-500" size={32} />
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <DollarSign className="text-white" size={24} />
              </div>
              <p className="text-emerald-50 font-medium">Total Earnings</p>
            </div>
            <p className="text-4xl font-bold text-white">₹{totalEarnings}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <p className="text-blue-50 font-medium">Today's Earnings</p>
            </div>
            <p className="text-4xl font-bold text-white">₹{todayEarnings}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Scissors className="text-white" size={24} />
              </div>
              <p className="text-purple-50 font-medium">Services Today</p>
            </div>
            <p className="text-4xl font-bold text-white">{todayServicesCount}</p>
          </div>
        </div>

        {revenueByService.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Revenue by Service (Today)
            </h2>
            <div className="space-y-3">
              {revenueByService.map(service => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 p-2 rounded-lg">
                      {getServiceIcon(service.name) === 'scissors' && (
                        <Scissors className="text-slate-700" size={20} />
                      )}
                      {getServiceIcon(service.name) === 'razor' && (
                        <Sparkles className="text-slate-700" size={20} />
                      )}
                      {getServiceIcon(service.name) === 'hand' && (
                        <span className="text-slate-700 text-xl">✋</span>
                      )}
                      {getServiceIcon(service.name) === 'palette' && (
                        <span className="text-slate-700 text-xl">🎨</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {service.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {service.count} service{service.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-slate-800">
                    ₹{service.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onNavigateToEntry}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all"
        >
          New Entry
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
