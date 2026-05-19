import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, CheckCircle } from 'lucide-react';

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const tutorial = location.state?.tutorial;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const price = tutorial?.price !== undefined && tutorial?.price !== null
    ? Number(tutorial.price).toFixed(2)
    : '9.99';

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }
    navigate('/tutorials');
  };

  const handlePayment = () => {
    if (!tutorial) return;

    if (!currentUser) {
      navigate('/login', {
        state: {
          next: '/cart',
          nextState: { tutorial }
        }
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('');
    setTimeout(() => {
      setLoading(false);
      setPaymentStatus('success');
    }, 1200);
  };

  if (!tutorial) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Select a premium tutorial from the tutorials page to start checkout.
          </p>
          <button
            onClick={() => navigate('/tutorials')}
            className="btn btn-primary"
          >
            Browse Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
      >
        <ArrowLeft size={16} /> Back to tutorials
      </button>

      <div className="card space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Premium checkout</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tutorial.title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Secure your premium access and unlock the full tutorial.</p>
          </div>
          <div className="rounded-3xl bg-primary-50 dark:bg-primary-900 px-5 py-4 text-center">
            <p className="text-sm text-primary-700 dark:text-white">Total</p>
            <p className="text-4xl font-semibold text-gray-900 dark:text-white">${price}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment options</h2>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selectedMethod === 'upi' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'} `}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">UPI</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                    <Smartphone size={24} className="text-primary-600 dark:text-primary-300" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('debit')}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selectedMethod === 'debit' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'} `}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Debit card</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, Rupay</p>
                    </div>
                    <CreditCard size={24} className="text-primary-600 dark:text-primary-300" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('credit')}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selectedMethod === 'credit' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'} `}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Credit card</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, Amex</p>
                    </div>
                    <CreditCard size={24} className="text-primary-600 dark:text-primary-300" />
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-primary-600 dark:text-primary-300" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Safe and secure checkout</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your payment information is protected and never shared.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Course</span>
                  <span>{tutorial.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amount</span>
                  <span>${price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment method</span>
                  <span className="capitalize">{selectedMethod}</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary-50 dark:bg-primary-900 p-3">
                <CheckCircle className="text-primary-600 dark:text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to complete your purchase</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{tutorial.isPremium ? 'Premium course access' : 'Tutorial access'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Selected item</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-2">{tutorial.title}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total due</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">${price}</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing payment...' : 'Pay securely'}
            </button>

            {paymentStatus === 'success' && (
              <div className="rounded-2xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/60 p-4 text-green-800 dark:text-green-200">
                <p className="font-semibold">Payment successful!</p>
                <p className="text-sm">You can now access the premium tutorial in your library.</p>
              </div>
            )}

            {!currentUser && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/50 p-4 text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Login required</p>
                <p className="text-sm">Sign in to complete checkout and unlock the tutorial.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
