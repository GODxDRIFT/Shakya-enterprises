
// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT + ORDER TRACKING  —  paste these components into your App.tsx
// before the "Main App" section, and update the Main App section below
// ═══════════════════════════════════════════════════════════════════════════

// ─── Types ────────────────────────────────────────────────────────────────
export interface ShippingAddress {
  address: string; city: string; state: string; pincode: string; country: string;
}
export interface CustomerInfo {
  name: string; email: string; phone: string;
}
export interface Order {
  id: string;
  cfOrderId?: string;
  date: string;
  items: CartItem[];
  customer: CustomerInfo;
  shipping: ShippingAddress;
  totalINR: number;
  totalUSD: string;
  status: 'pending' | 'PAID' | 'ACTIVE' | 'EXPIRED' | 'failed';
}

// ─── Cashfree SDK loader ──────────────────────────────────────────────────
declare global {
  interface Window {
    Cashfree?: (cfg: { mode: string }) => Promise<{
      checkout: (opts: { paymentSessionId: string; redirectTarget: string }) => Promise<{
        error?: { message: string };
        paymentDetails?: { paymentMessage: string };
        redirect?: boolean;
      }>;
    }>;
  }
}

const loadCashfreeSDK = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.getElementById('cashfree-sdk')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'cashfree-sdk';
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.head.appendChild(s);
  });

const CF_MODE = (import.meta.env.VITE_CASHFREE_MODE || 'sandbox') as string;

// ─── Order status badge ───────────────────────────────────────────────────
const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
  const map: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    EXPIRED: 'bg-zinc-100 text-zinc-500',
    failed: 'bg-red-100 text-red-600',
  };
  const label: Record<string, string> = { PAID: 'Paid', pending: 'Pending', ACTIVE: 'Awaiting Payment', EXPIRED: 'Expired', failed: 'Failed' };
  return <span className={cn('text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full', map[status] || map.pending)}>{label[status] || status}</span>;
};

// ─── Checkout Modal ───────────────────────────────────────────────────────
export const CheckoutModal = ({
  cart, onClose, onSuccess,
}: {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: (order: Order) => void;
}) => {
  const INR_RATE = 83.5; // approximate USD→INR rate
  const totalUSD = cart.reduce((s, i) => s + parseFloat(i.product.price.replace('$', '')) * i.qty, 0);
  const totalINR = Math.round(totalUSD * INR_RATE);

  const [step, setStep] = useState<'details' | 'processing' | 'success' | 'error'>('details');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<CustomerInfo & ShippingAddress>({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', country: 'India',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handlePay = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      setErrorMsg('Please fill all required fields.'); return;
    }
    if (!/^\d{10}$/.test(form.phone)) { setErrorMsg('Enter a valid 10-digit phone number.'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setErrorMsg('Enter a valid email address.'); return; }
    setErrorMsg('');
    setStep('processing');

    try {
      // 1. Load Cashfree SDK
      await loadCashfreeSDK();

      // 2. Create order on our backend
      const orderId = `SHAKYA_${Date.now()}`;
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amountINR: totalINR,
          customer: { name: form.name, email: form.email, phone: form.phone },
        }),
      });
      const data = await res.json() as { sessionId?: string; cfOrderId?: string; error?: string };

      if (!res.ok || !data.sessionId) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // 3. Open Cashfree inline modal
      const cashfree = await window.Cashfree!({ mode: CF_MODE });
      const result = await cashfree.checkout({
        paymentSessionId: data.sessionId,
        redirectTarget: '_modal',
      });

      if (result.error) throw new Error(result.error.message);

      // 4. Payment successful
      const order: Order = {
        id: orderId,
        cfOrderId: data.cfOrderId,
        date: new Date().toISOString(),
        items: cart,
        customer: { name: form.name, email: form.email, phone: form.phone },
        shipping: { address: form.address, city: form.city, state: form.state, pincode: form.pincode, country: form.country },
        totalINR,
        totalUSD: `$${totalUSD.toFixed(2)}`,
        status: 'PAID',
      };
      onSuccess(order);
      setStep('success');

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Payment failed. Please try again.');
      setStep('details');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={step === 'details' ? onClose : undefined} className="absolute inset-0 bg-brand-charcoal/70 backdrop-blur-sm cursor-pointer" />
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 28 }} className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-3xl sm:rounded-2xl">

        {/* Success screen */}
        {step === 'success' && (
          <div className="p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </motion.div>
            <h2 className="serif text-3xl text-brand-charcoal mb-3">Order Placed! 🎉</h2>
            <p className="text-brand-charcoal/60 mb-2">Thank you, <strong>{form.name}</strong>!</p>
            <p className="text-brand-charcoal/50 text-sm mb-6">Confirmation sent to <strong>{form.email}</strong></p>
            <div className="bg-brand-cream p-4 rounded-lg text-left mb-6 text-sm text-brand-charcoal/70">
              <p><span className="font-bold text-brand-charcoal">Amount paid:</span> ₹{totalINR.toLocaleString('en-IN')} ({`$${totalUSD.toFixed(2)}`})</p>
              <p className="mt-1"><span className="font-bold text-brand-charcoal">Items:</span> {cart.reduce((s, i) => s + i.qty, 0)} products</p>
              <p className="mt-1"><span className="font-bold text-brand-charcoal">Estimated delivery:</span> 7–14 business days</p>
            </div>
            <button onClick={onClose} className="w-full bg-brand-charcoal text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors">Continue Shopping</button>
          </div>
        )}

        {/* Processing screen */}
        {step === 'processing' && (
          <div className="p-16 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-14 h-14 border-4 border-brand-charcoal/20 border-t-brand-gold rounded-full mx-auto mb-6" />
            <p className="serif text-xl text-brand-charcoal">Opening Payment…</p>
            <p className="text-brand-charcoal/40 text-sm mt-2">Please complete the payment in the Cashfree window</p>
          </div>
        )}

        {/* Details form */}
        {step === 'details' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div><p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Secure Checkout</p><h2 className="serif text-2xl text-brand-charcoal">Your Details</h2></div>
              <button onClick={onClose} className="text-brand-charcoal/40 hover:text-brand-charcoal"><X size={22} /></button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 mb-6 flex items-center gap-2">
                <XCircle size={14} />{errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
              {/* Personal */}
              <div className="sm:col-span-2"><p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-4">Contact Information</p></div>
              <Field label="Full Name *" value={form.name} onChange={v => set('name', v)} placeholder="Rahul Sharma" />
              <Field label="Email *" type="email" value={form.email} onChange={v => set('email', v)} placeholder="rahul@email.com" />
              <Field label="Phone *" type="tel" value={form.phone} onChange={v => set('phone', v)} placeholder="9999999999 (10 digits)" />

              {/* Address */}
              <div className="sm:col-span-2 pt-2 border-t border-brand-charcoal/5"><p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-4 mt-4">Delivery Address</p></div>
              <div className="sm:col-span-2"><Field label="Address *" value={form.address} onChange={v => set('address', v)} placeholder="House no., Street, Area" /></div>
              <Field label="City *" value={form.city} onChange={v => set('city', v)} placeholder="Delhi" />
              <Field label="State" value={form.state} onChange={v => set('state', v)} placeholder="Delhi" />
              <Field label="Pincode *" value={form.pincode} onChange={v => set('pincode', v)} placeholder="110001" />
              <Field label="Country" value={form.country} onChange={v => set('country', v)} placeholder="India" />
            </div>

            {/* Order summary */}
            <div className="bg-brand-cream p-5 mb-6">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-4">Order Summary</p>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-brand-charcoal/70">{item.product.name} <span className="text-brand-charcoal/40">({item.selectedSize}, {item.selectedColor}) ×{item.qty}</span></span>
                    <span className="font-bold text-brand-charcoal">{item.product.priceINR}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-charcoal/10 pt-3 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50">Total</span>
                <div className="text-right">
                  <p className="serif text-2xl text-brand-charcoal font-bold">₹{totalINR.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-brand-charcoal/40">≈ ${totalUSD.toFixed(2)} USD</p>
                </div>
              </div>
            </div>

            <button onClick={handlePay} className="w-full bg-brand-gold hover:bg-brand-charcoal text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3">
              <ShieldCheck size={16} /> Pay ₹{totalINR.toLocaleString('en-IN')} via Cashfree
            </button>
            <p className="text-center text-[10px] text-brand-charcoal/30 mt-3 uppercase tracking-widest">UPI · Cards · NetBanking · Wallets</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ─── Reusable form field ──────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 block mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border-b border-brand-charcoal/20 pb-2 bg-transparent text-sm focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/20" />
  </div>
);

// ─── Orders Drawer ────────────────────────────────────────────────────────
export const OrdersDrawer = ({
  orders, onClose, onRefreshStatus,
}: {
  orders: Order[];
  onClose: () => void;
  onRefreshStatus: (orderId: string) => Promise<void>;
}) => {
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const handleRefresh = async (orderId: string) => {
    setRefreshing(orderId);
    await onRefreshStatus(orderId);
    setRefreshing(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm cursor-pointer" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="relative w-full max-w-md h-full bg-brand-cream shadow-2xl flex flex-col">
        <div className="p-8 border-b border-brand-charcoal/5 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3"><Package size={20} className="text-brand-gold" /><h2 className="serif text-2xl text-brand-charcoal">My Orders ({orders.length})</h2></div>
          <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-charcoal"><X size={24} strokeWidth={1} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={40} className="text-brand-charcoal/10 mx-auto mb-4" />
              <p className="serif text-xl text-brand-charcoal/40 italic">No orders yet</p>
              <a href="#collections" onClick={onClose} className="text-[11px] uppercase tracking-widest text-brand-gold font-bold mt-4 inline-block hover:underline">Start Shopping</a>
            </div>
          ) : [...orders].reverse().map(order => (
            <div key={order.id} className="bg-white p-5 border border-brand-charcoal/8">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-brand-charcoal/40 font-bold">Order ID</p>
                  <p className="text-xs font-mono text-brand-charcoal font-bold">{order.id}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items preview */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {order.items.map(item => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="shrink-0 w-12 h-12 overflow-hidden bg-brand-sand">
                    <img src={item.product.image} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="text-xs text-brand-charcoal/50 space-y-1 mb-3">
                <p><span className="font-bold text-brand-charcoal/70">Date:</span> {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p><span className="font-bold text-brand-charcoal/70">Items:</span> {order.items.reduce((s, i) => s + i.qty, 0)} products</p>
                <p><span className="font-bold text-brand-charcoal/70">Amount:</span> ₹{order.totalINR.toLocaleString('en-IN')} ({order.totalUSD})</p>
                <p><span className="font-bold text-brand-charcoal/70">Ship to:</span> {order.shipping.city}, {order.shipping.state}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRefresh(order.id)}
                  disabled={refreshing === order.id}
                  className="flex-1 py-2 border border-brand-charcoal/20 text-[9px] font-bold uppercase tracking-widest text-brand-charcoal hover:bg-brand-cream transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {refreshing === order.id ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }} className="w-3 h-3 border-2 border-brand-charcoal/30 border-t-brand-charcoal rounded-full" /> : '↻ Refresh Status'}
                </button>
                <a
                  href={`https://wa.me/918750590574?text=${encodeURIComponent(`Hi! I'd like to track my order: ${order.id}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <MessageCircle size={10} /> Track
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
