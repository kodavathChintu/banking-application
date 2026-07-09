import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankApi, customerApi } from '../services/api';
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import type { Bank } from '../types';

export default function AccountOpeningPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    mobileNumber: '',
    address: '',
    gender: 'MALE',
    accountType: 'SAVINGS',
    bankId: 0,
  });
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
        const data = new FormData();

        data.append(
            "request",
            new Blob(
                [JSON.stringify(formData)],
                {
                    type: "application/json"
                }
            )
        );

        if (aadhaar) {
            data.append("aadhaar", aadhaar);
        }

        await customerApi.submitAccountOpening(data);

        localStorage.setItem("selectedBankId", String(formData.bankId));
        setSuccess(true);

    } catch (err: any) {
        setError(err.message || "Failed to submit request");
    } finally {
        setSubmitting(false);
    }
};

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Request Submitted Successfully!
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Your account opening request has been submitted and is pending approval.
            You will be notified once approved by the bank manager.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  customerName: '',
                  email: '',
                  mobileNumber: '',
                  address: '',
                  gender: 'MALE',
                  accountType: 'SAVINGS',
                  bankId: 0,
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Open New Account</h1>
        <p className="text-slate-600 mt-1">
          Fill in the details below to request a new bank account
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Personal Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Enter a valid email address, for example user@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="123 Main St, City"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Gender
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MALE"
                  checked={formData.gender === 'MALE'}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <span className="text-slate-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="FEMALE"
                  checked={formData.gender === 'FEMALE'}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <span className="text-slate-700">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="OTHER"
                  checked={formData.gender === 'OTHER'}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <span className="text-slate-700">Other</span>
              </label>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Account Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Bank
                </label>
                <select
                  required
                  value={formData.bankId}
                  onChange={(e) =>
                    setFormData({ ...formData, bankId: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white"
                >
                  <option value={0}>Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.bankId} value={bank.bankId}>
                      {bank.bankName} - {bank.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Type
                </label>
                <select
                  required
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                </select>
              </div>
            </div>
          </div>
          {/* Aadhaar Upload */}

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Aadhaar Document
            </h3>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={(e) => {
                if (e.target.files) {
                  setAadhaar(e.target.files[0]);
                }
              }}
              className="w-full border-2 border-slate-200 rounded-xl p-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Upload Aadhaar Card (PDF, JPG or PNG only)
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Submit Account Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
