import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bankApi, customerApi } from '../services/api';
import {
  Home,
  Building2,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  History,
  Wallet,
  User,
  UserCheck,
  LogOut,
  Landmark,
  CreditCard,
  Users,
  Search,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isManager } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [bankLookup, setBankLookup] = useState<Record<string, number>>({});

  const readStoredBankId = () => Number(localStorage.getItem('bankId') || localStorage.getItem('selectedBankId') || '1');

  const persistSelectedBankId = (bankId: number | string | null | undefined) => {
    const normalizedBankId = Number(bankId || 1);
    localStorage.setItem('bankId', String(normalizedBankId));
    localStorage.setItem('selectedBankId', String(normalizedBankId));
    return normalizedBankId;
  };

  const resolveBankId = (account: any) => {
    const bankName = account?.bank?.bankName || account?.bankName;
    const lookupBankId = bankName ? bankLookup[bankName.trim().toLowerCase()] : undefined;
    return account?.bank?.bankId || account?.bankId || lookupBankId || readStoredBankId() || 1;
  };

  useEffect(() => {
    if (!user || isManager) {
      setAccounts([]);
      setActiveAccount(null);
      return;
    }

    const loadAccounts = async () => {
      try {
        const savedBankId = readStoredBankId();
        let normalizedAccounts: any[] = [];

        try {
          normalizedAccounts = await customerApi.getAccounts(user.userId);
        } catch (err) {
          console.warn('customer/accounts endpoint failed, falling back to profile endpoint', err);
          const data = await customerApi.getProfile(user.userId, savedBankId);
          normalizedAccounts = Array.isArray(data?.accounts) ? data.accounts : [];
        }

        try {
          const banks = await bankApi.getAll();
          const nextBankLookup = Object.fromEntries(
            banks.map((bank: any) => [String(bank.bankName).trim().toLowerCase(), bank.bankId])
          );
          setBankLookup(nextBankLookup);
        } catch (bankError) {
          console.warn('Failed to load bank lookup for sidebar', bankError);
        }

        const selectedAccountNumber = localStorage.getItem('selectedAccountNumber');
        const selectedAccount =
          normalizedAccounts.find((account: any) => account.accountNumber === selectedAccountNumber) ||
          normalizedAccounts[0] ||
          null;

        setAccounts(normalizedAccounts);
        setActiveAccount(selectedAccount);

        if (selectedAccount?.accountNumber) {
          localStorage.setItem('selectedAccountNumber', selectedAccount.accountNumber);
        }

        const resolvedBankId = resolveBankId(selectedAccount) || savedBankId || 1;
        persistSelectedBankId(resolvedBankId);
      } catch (error) {
        console.error('Failed to load customer accounts in sidebar', error);
      }
    };

    void loadAccounts();
  }, [user, isManager]);

  const handleLogout = () => {
    logout();
   navigate('/');
  };

  const customerLinks = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },

  { to: '/banks', icon: Building2, label: 'View Banks' },

  { to: '/account-opening', icon: FileText, label: 'Open Account' },

  { to: '/profile', icon: User, label: 'My Profile' },

  { to: '/deposit', icon: ArrowDownCircle, label: 'Deposit' },

  { to: '/withdraw', icon: ArrowUpCircle, label: 'Withdraw' },

  { to: '/transfer', icon: ArrowRightLeft, label: 'Transfer' },

  { to: '/balance', icon: Wallet, label: 'Check Balance' },

  { to: '/history', icon: History, label: 'Transaction History' },
];

  const managerLinks = [
    { to: '/manager/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/manager/pending', icon: UserCheck, label: 'Pending Requests' },
    { to: '/manager/customers', icon: Users, label: 'Customers' },
    { to: '/manager/accounts', icon: CreditCard, label: 'Accounts' },
    { to: '/manager/search-account', icon: Search, label: 'Search Account' },
  ];

  const links = isManager ? managerLinks : customerLinks;

  const handleAccountSelect = (account: any) => {
    setActiveAccount(account);

    if (account?.accountNumber) {
      localStorage.setItem('selectedAccountNumber', account.accountNumber);
    }

    const resolvedBankId = persistSelectedBankId(resolveBankId(account));
    console.log('Selected Bank:', account?.bank?.bankName || account?.bankName || 'Unknown');
    console.log('Selected BankId:', resolvedBankId);

    window.dispatchEvent(new CustomEvent('bank-selection-changed', { detail: resolvedBankId }));
    navigate('/dashboard');
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KumaranBank</h1>
            <p className="text-xs text-slate-400">Banking Made Simple</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-700">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Welcome back
          </p>
          <p className="text-white font-semibold truncate">{user?.fullName}</p>
          <p className="text-emerald-400 text-sm mt-1">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}

        {!isManager && (
          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
              My Accounts
            </p>
            <div className="space-y-2">
              {accounts.length > 0 ? (
                accounts.map((account) => {
                  const isSelected = activeAccount?.accountNumber === account.accountNumber;
                  return (
                    <button
                      key={account.accountNumber || account.bank?.bankName}
                      type="button"
                      onClick={() => handleAccountSelect(account)}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{account.bank?.bankName || account.bankName || 'HDFC'}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {account.accountNumber || 'No account number'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="px-2 text-sm text-slate-500">No accounts available yet.</p>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
