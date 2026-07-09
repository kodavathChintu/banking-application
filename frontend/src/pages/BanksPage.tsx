import { useState, useEffect } from 'react';
import { bankApi } from '../services/api';
import {
  Building2,
  MapPin,
  Hash,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import type { Bank } from '../types';

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const data = await bankApi.getAll();
      setBanks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load banks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Partner Banks</h1>
        <p className="text-slate-600 mt-1">
          Choose from our trusted banking partners
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {banks.map((bank) => (
          <div
            key={bank.bankId}
            className={`bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border-2 transition-all duration-200 cursor-pointer ${
              selectedBank?.bankId === bank.bankId
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-slate-100 hover:border-slate-200'
            }`}
            onClick={() => setSelectedBank(bank)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {bank.bankName}
                  </h3>
                  <p className="text-slate-500">{bank.branchName}</p>
                </div>
              </div>
              {selectedBank?.bankId === bank.bankId && (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-sm">IFSC: {bank.ifscCode}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="text-sm">{bank.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Active Partner
              </span>
            </div>
          </div>
        ))}
      </div>

      {banks.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">No banks available</p>
        </div>
      )}
    </div>
  );
}
