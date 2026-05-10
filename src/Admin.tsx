// src/Admin.tsx
import { useState, useMemo } from 'react';
import { X, Package, Star, Archive, TrendingUp, LogOut, Trash2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { PRODUCTS } from './data';
import type { Review } from './Reviews';

// Change this password or move to env var
const ADMIN_PASSWORD = 'SHAKYA2024';

interface Order {
  id: string; date: string; status: string;
  totalINR: number; totalUSD: string;
  customer: { name: string; email: string; phone: string };
  shipping: { city: string; state: string };
  items: { product: { name: string; image: string }; qty: number; selectedSize: string; selectedColor: string }[];
}

// ── Stat card ──────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, color = 'text-brand-charcoal' }: { label: string; value: string | number; sub?: string; color?: string }) => (
  <div className="bg-white border border-brand-charcoal/8 p-5">
    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-1">{label}</p>
    <p className={cn("serif text-3xl font-bold", color)}>{value}</p>
    {sub && <p className="text-[10px] text-brand-charcoal/40 mt-0.5">{sub}</p>}
  </div>
);

// ── Main admin component ───────────────────────────────────────────────────
export const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('shakya_admin') === '1');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState<'stats' | 'orders' | 'reviews' | 'inventory'>('stats');
  const [orders, setOrders] = useState<Order[]>(() => { try { return JSON.parse(localStorage.getItem('shakya_orders_v1') || '[]'); } catch { return []; } });
  const [reviews, setReviews] = useState<Review[]>(() => { try { return JSON.parse(localStorage.getItem('shakya_reviews_v1') || '[]'); } catch { return []; } });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const login = () => {
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem('shakya_admin', '1'); setAuthed(true); setPwError(''); }
    else { setPwError('Incorrect password.'); }
  };

  const logout = () => { sessionStorage.removeItem('shakya_admin'); setAuthed(false); setPassword(''); };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('shakya_reviews_v1', JSON.stringify(updated));
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('shakya_orders_v1', JSON.stringify(updated));
  };

  const stats = useMemo(() => {
    const totalRevINR = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.totalINR, 0);
    const totalRevUSD = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + parseFloat(o.totalUSD.replace('$', '')), 0);
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    return { totalRevINR, totalRevUSD, avgRating, paidOrders: orders.filter(o => o.status === 'PAID').length, pendingOrders: orders.filter(o => o.status !== 'PAID').length };
  }, [orders, reviews]);

  const statusColor = (s: string) => ({ PAID: 'text-emerald-600 bg-emerald-50', ACTIVE: 'text-blue-600 bg-blue-50', pending: 'text-amber-600 bg-amber-50', EXPIRED: 'text-zinc-500 bg-zinc-100', failed: 'text-red-600 bg-red-50', Shipped: 'text-purple-600 bg-purple-50' }[s] || 'text-zinc-500 bg-zinc-100');

  // ── Login gate ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-charcoal/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm p-10 rounded-2xl shadow-2xl">
        <div className="flex justify-between mb-8"><div><p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Shakya Enterprises</p><h2 className="serif text-2xl text-brand-charcoal">Admin Login</h2></div><button onClick={onClose} className="text-brand-charcoal/30 hover:text-brand-charcoal"><X size={20} /></button></div>
        {pwError && <p className="text-red-500 text-xs mb-4">{pwError}</p>}
        <div className="relative mb-6">
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Password" className="w-full border-b border-brand-charcoal/20 pb-2 pr-8 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25" />
          <button onClick={() => setShowPw(v => !v)} className="absolute right-0 top-0 text-brand-charcoal/30 hover:text-brand-charcoal">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
        </div>
        <button onClick={login} className="w-full py-4 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors flex items-center justify-center gap-2"><ShieldCheck size={14} /> Login</button>
      </motion.div>
    </div>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[300] bg-brand-cream overflow-y-auto">
      {/* Header */}
      <div className="bg-brand-charcoal text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div><p className="text-brand-gold text-[9px] uppercase tracking-widest font-bold">Shakya Enterprises</p><h1 className="serif text-xl font-bold">Admin Dashboard</h1></div>
        <div className="flex items-center gap-4">
          <button onClick={logout} className="flex items-center gap-1.5 text-white/50 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors"><LogOut size={13} /> Logout</button>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-brand-charcoal/10 p-1 rounded-lg w-fit">
          {([['stats', TrendingUp, 'Overview'], ['orders', Package, 'Orders'], ['reviews', Star, 'Reviews'], ['inventory', Archive, 'Inventory']] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={cn("flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all", tab === key ? "bg-brand-charcoal text-white" : "text-brand-charcoal/50 hover:text-brand-charcoal")}>
              <Icon size={12} />{label}
            </button>
          ))}
        </div>

        {/* ── Stats tab ── */}
        {tab === 'stats' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Stat label="Total Revenue" value={`₹${stats.totalRevINR.toLocaleString('en-IN')}`} sub={`≈ $${stats.totalRevUSD.toFixed(2)}`} color="text-brand-olive" />
              <Stat label="Paid Orders" value={stats.paidOrders} sub="completed" color="text-emerald-600" />
              <Stat label="Pending Orders" value={stats.pendingOrders} sub="awaiting payment" color="text-amber-600" />
              <Stat label="Avg Rating" value={stats.avgRating ? stats.avgRating.toFixed(1) + ' ★' : 'No reviews'} sub={`${reviews.length} total reviews`} color="text-brand-gold" />
            </div>
            {/* Recent orders preview */}
            <div className="bg-white border border-brand-charcoal/8 p-6">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-4">Recent Orders</p>
              {orders.length === 0 ? <p className="text-brand-charcoal/30 text-sm italic">No orders yet.</p> : [...orders].reverse().slice(0, 5).map(o => (
                <div key={o.id} className="flex justify-between items-center py-3 border-b border-brand-charcoal/5 last:border-0">
                  <div><p className="text-xs font-mono font-bold text-brand-charcoal">{o.id}</p><p className="text-[10px] text-brand-charcoal/50">{o.customer.name} · {new Date(o.date).toLocaleDateString('en-IN')}</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-brand-charcoal">₹{o.totalINR.toLocaleString('en-IN')}</p><span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", statusColor(o.status))}>{o.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Orders tab ── */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 ? <div className="text-center py-20 text-brand-charcoal/30 serif text-xl italic">No orders yet.</div>
              : [...orders].reverse().map(o => (
                <div key={o.id} className="bg-white border border-brand-charcoal/8">
                  <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">{o.items.slice(0, 3).map((item, i) => <div key={i} className="w-8 h-8 overflow-hidden border border-white rounded-full bg-brand-sand"><img src={item.product.image} className="w-full h-full object-cover" /></div>)}</div>
                      <div><p className="text-xs font-mono font-bold text-brand-charcoal">{o.id}</p><p className="text-[10px] text-brand-charcoal/50">{o.customer.name} · {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-sm text-brand-charcoal">₹{o.totalINR.toLocaleString('en-IN')}</p>
                      <span className={cn("text-[9px] font-bold px-2 py-1 rounded-full", statusColor(o.status))}>{o.status}</span>
                    </div>
                  </div>
                  {expandedOrder === o.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden border-t border-brand-charcoal/5">
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-sm space-y-1 text-brand-charcoal/70">
                          <p><strong>Email:</strong> {o.customer.email}</p>
                          <p><strong>Phone:</strong> {o.customer.phone}</p>
                          <p><strong>Ship to:</strong> {o.shipping.city}, {o.shipping.state}</p>
                          <p><strong>Items:</strong> {o.items.map(i => `${i.product.name} (${i.selectedSize}) ×${i.qty}`).join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-2">Update Status</p>
                          <div className="flex flex-wrap gap-2">
                            {['PAID', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                              <button key={s} onClick={() => updateOrderStatus(o.id, s)} className={cn("px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all", o.status === s ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{s}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* ── Reviews tab ── */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length === 0 ? <div className="text-center py-20 text-brand-charcoal/30 serif text-xl italic">No reviews yet.</div>
              : [...reviews].reverse().map(r => {
                const product = PRODUCTS.find(p => p.id === r.productId);
                return (
                  <div key={r.id} className="bg-white border border-brand-charcoal/8 p-5 flex gap-4">
                    {product && <div className="w-12 h-12 overflow-hidden shrink-0 bg-brand-sand"><img src={product.image} className="w-full h-full object-cover" /></div>}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {[1,2,3,4,5].map(i => <Star key={i} size={11} className={r.rating >= i ? "text-brand-gold fill-brand-gold" : "text-brand-charcoal/15"} />)}
                            <span className="text-[9px] text-brand-charcoal/40">{new Date(r.date).toLocaleDateString('en-IN')}</span>
                          </div>
                          <p className="text-[10px] font-bold text-brand-charcoal/50">{product?.name || r.productId}</p>
                          {r.title && <p className="text-sm font-bold text-brand-charcoal mt-1">{r.title}</p>}
                          <p className="text-sm text-brand-charcoal/70 mt-1">{r.text}</p>
                          <p className="text-[10px] text-brand-charcoal/40 mt-2">— {r.name}{r.location && `, ${r.location}`}</p>
                        </div>
                        <button onClick={() => deleteReview(r.id)} className="text-red-400 hover:text-red-600 transition-colors ml-3 shrink-0"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ── Inventory tab ── */}
        {tab === 'inventory' && (
          <div className="bg-white border border-brand-charcoal/8">
            <table className="w-full">
              <thead><tr className="border-b border-brand-charcoal/8"><th className="text-left p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Product</th><th className="text-left p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Category</th><th className="text-right p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Price</th><th className="text-right p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Stock</th></tr></thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.id} className="border-b border-brand-charcoal/5 last:border-0 hover:bg-brand-cream/50 transition-colors">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 overflow-hidden bg-brand-sand shrink-0"><img src={p.image} className="w-full h-full object-cover" /></div><span className="text-sm font-bold text-brand-charcoal">{p.name}</span></div></td>
                    <td className="p-4 text-[10px] text-brand-charcoal/50 font-bold uppercase tracking-widest">{p.category}</td>
                    <td className="p-4 text-sm font-bold text-brand-charcoal text-right">{p.price}</td>
                    <td className="p-4 text-right">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", p.stock === 0 ? "bg-red-50 text-red-500" : p.stock <= 5 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600")}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? `Low — ${p.stock}` : `${p.stock} units`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
