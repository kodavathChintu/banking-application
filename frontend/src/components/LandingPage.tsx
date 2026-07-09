import { Link } from 'react-router-dom';
import {
  Landmark,
  Shield,
  Zap,
  Smartphone,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Wallet,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-35 animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">KumaranBank</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Trusted by millions worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Banking That
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {' '}Works For You
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience seamless digital banking with instant transfers, real-time
            notifications, and bank-grade security. Your money, your control.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              Open Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10M+', label: 'Active Users' },
            { value: '₹50B+', label: 'Transactions' },
            { value: '99.9%', label: 'Uptime' },
            { value: '150+', label: 'Countries' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 text-center shadow-lg shadow-slate-200/50 border border-slate-100"
            >
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features designed to simplify your financial life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description:
                  '256-bit encryption, biometric authentication, and 24/7 fraud monitoring keep your money safe.',
                color: 'emerald',
              },
              {
                icon: Zap,
                title: 'Instant Transfers',
                description:
                  'Send and receive money instantly with zero fees. Transfer to any bank account in seconds.',
                color: 'teal',
              },
              {
                icon: Smartphone,
                title: 'Mobile First',
                description:
                  'Access your accounts anytime, anywhere. Full-featured banking right in your pocket.',
                color: 'cyan',
              },
              {
                icon: Wallet,
                title: 'Smart Savings',
                description:
                  'Automated savings goals, round-up transactions, and competitive interest rates.',
                color: 'blue',
              },
              {
                icon: TrendingUp,
                title: 'Investment Ready',
                description:
                  'Track your portfolio, invest in stocks, and grow your wealth with expert insights.',
                color: 'indigo',
              },
              {
                icon: CreditCard,
                title: 'Virtual Cards',
                description:
                  'Create unlimited virtual cards for secure online shopping and subscription management.',
                color: 'violet',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${
                      feature.color === 'emerald'
                        ? 'from-emerald-400 to-emerald-600'
                        : feature.color === 'teal'
                        ? 'from-teal-400 to-teal-600'
                        : feature.color === 'cyan'
                        ? 'from-cyan-400 to-cyan-600'
                        : feature.color === 'blue'
                        ? 'from-blue-400 to-blue-600'
                        : feature.color === 'indigo'
                        ? 'from-indigo-400 to-indigo-600'
                        : 'from-violet-400 to-violet-600'
                    } shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Get started in minutes
            </h2>
            <p className="text-xl text-slate-400">
              Open your account in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up with your email and basic details. No paperwork required.',
              },
              {
                step: '02',
                title: 'Verify Identity',
                description: 'Quick KYC verification with Aadhaar and PAN. Takes less than 2 minutes.',
              },
              {
                step: '03',
                title: 'Start Banking',
                description: 'Your account is ready! Deposit money and start transacting instantly.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                )}
                <div className="text-center">
                  <div className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                    <span className="text-4xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why customers trust us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'No Hidden Fees',
                description: 'What you see is what you get. Transparent pricing with no surprise charges.',
              },
              {
                title: '24/7 Support',
                description: 'Our team is always here to help. Reach us anytime via chat, phone, or email.',
              },
              {
                title: 'Quick Approvals',
                description: 'Account opening requests processed within 24 hours. Fast and efficient.',
              },
              {
                title: 'Secure Transactions',
                description: 'Every transaction is encrypted and monitored. Your security is our priority.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predefined Banks Info */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Partner Banks
            </h3>
            <p className="text-slate-600 mb-8">
              We work with trusted banking partners to ensure your money is always safe
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              {['HDFC Bank', 'SBI Bank', 'ICICI Bank', 'Axis Bank'].map(
                (bank, i) => (
                  <div
                    key={i}
                    className="px-8 py-4 bg-white rounded-xl shadow-md border border-slate-200 font-semibold text-slate-700"
                  >
                    {bank}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join millions of happy customers and experience banking like never before.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 text-lg"
          >
            Open Your Account Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">KumaranBank</span>
            </div>
            <p className="text-slate-400 text-sm">
              2024 KumaranBank. All rights reserved.
            </p>
          </div>
        </div> 
      </footer>
    </div>
  );
}
