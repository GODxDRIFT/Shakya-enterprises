// src/CustomerDashboard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Package, MapPin, Heart, Edit2, Plus, Trash2, CheckCircle2, Save, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { userService, orderService, type Address, type FSOrder } from './firebase';

const Field = ({ label, value, onChange, type = 'text', disabled }: { label: string; value: string; onChange?: (v: string) => void; type?: string; disabled?: boolean }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 block mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled} className={cn("w-full border-b pb-2 text-sm bg-transparent focus:outline-none transition-colors", disabled ? "border-brand-charcoal/10 text-brand-charcoal/40" : "border-brand-charcoal/20 focus:border-brand-olive")} />
  </div>
);

// ── Profile Tab ────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ name: profile.name, phone: profile.phone });
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    await userService.update(user.uid, form);
    await refreshProfile();
    setSaving(false); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">My Account</p>
          <h3 className="serif text-2xl text-brand-charcoal">Profile</h3>
        </div>
        {saved && <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 size={13}/> Saved!</span>}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center text-white text-2xl font-bold serif">
          {(profile?.name || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-brand-charcoal">{profile?.name || 'Your Name'}</p>
          <p className="text-sm text-brand-charcoal/50">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        <Field label="Full Name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} disabled={!editing} />
        <Field label="Email" value={user?.email || ''} disabled />
        <Field label="Phone" type="tel" value={form.phone} onChange={v => setForm(p => ({...p, phone: v}))} disabled={!editing} />
      </div>

      {editing ? (
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="flex-1 py-3 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={13}/> {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button onClick={() => setEditing(false)} className="px-5 py-3 border border-brand-charcoal/20 text-[11px] font-bold uppercase tracking-widest text-brand-charcoal hover:bg-brand-cream transition-colors">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-charcoal border border-brand-charcoal/20 px-5 py-3 hover:bg-brand-cream transition-colors">
          <Edit2 size={13}/> Edit Profile
        </button>
      )}
    </div>
  );
};

// ── Orders Tab ─────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FSOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    orderService.getByUser(user.uid).then(o => { setOrders(o); setLoading(false); });
  }, [user]);

  const statusColor: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700',
    Shipped: 'bg-purple-100 text-purple-700', Delivered: 'bg-teal-100 text-teal-700',
    Cancelled: 'bg-red-50 text-red-500', EXPIRED: 'bg-zinc-100 text-zinc-500',
  };

  return (
    <div>
      <div className="mb-8"><p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">History</p><h3 className="serif text-2xl text-brand-charcoal">My Orders</h3></div>
      {loading ? (
        <div className="py-16 text-center"><div className="w-8 h-8 border-2 border-brand-charcoal/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-3"/><p className="text-brand-charcoal/40 text-sm">Loading orders…</p></div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center"><Package size={40} className="text-brand-charcoal/10 mx-auto mb-4"/><p className="serif text-xl text-brand-charcoal/40 italic">No orders yet</p></div>
      ) : orders.map(o => {
        const items = o.items as { product: { name: string; image: string }; qty: number; selectedSize: string; selectedColor: string }[];
        return (
          <div key={o.id} className="bg-white border border-brand-charcoal/8 p-5 mb-4">
            <div className="flex justify-between items-start mb-3">
              <div><p className="text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold">Order</p><p className="text-xs font-mono font-bold text-brand-charcoal">{o.id}</p></div>
              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full", statusColor[o.status] || statusColor.pending)}>{o.status}</span>
            </div>
            <div className="flex gap-2 mb-3 overflow-x-auto">{items.slice(0,4).map((item, i) => <div key={i} className="shrink-0 w-12 h-12 bg-brand-sand overflow-hidden"><img src={item.product.image} className="w-full h-full object-cover"/></div>)}</div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-brand-charcoal/50"><p>{items.reduce((s, i) => s + i.qty, 0)} items</p><p>₹{o.totalINR?.toLocaleString('en-IN')} ({o.totalUSD})</p></div>
              <a href={`https://wa.me/918750590574?text=${encodeURIComponent(`Hi! Track my order: ${o.id}`)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:underline">Track via WhatsApp →</a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Addresses Tab ──────────────────────────────────────────────────────────
const AddressesTab = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', line1: '', city: '', state: '', pincode: '', country: 'India' });
  const set = (k: string, v: string) => setForm(p => ({...p, [k]: v}));
  const [saving, setSaving] = useState(false);

  const addresses: Address[] = profile?.addresses || [];

  const saveAddress = async () => {
    if (!user || !form.line1 || !form.city || !form.pincode) return;
    setSaving(true);
    const newAddr: Address = { id: editId || `addr_${Date.now()}`, isDefault: addresses.length === 0, ...form };
    const updated = editId ? addresses.map(a => a.id === editId ? newAddr : a) : [...addresses, newAddr];
    await userService.update(user.uid, { addresses: updated });
    await refreshProfile();
    setSaving(false); setAdding(false); setEditId(null);
    setForm({ label: '', line1: '', city: '', state: '', pincode: '', country: 'India' });
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    await userService.update(user.uid, { addresses: addresses.filter(a => a.id !== id) });
    await refreshProfile();
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await userService.update(user.uid, { addresses: addresses.map(a => ({...a, isDefault: a.id === id})) });
    await refreshProfile();
  };

  const startEdit = (a: Address) => {
    setForm({ label: a.label, line1: a.line1, city: a.city, state: a.state, pincode: a.pincode, country: a.country });
    setEditId(a.id); setAdding(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Saved</p><h3 className="serif text-2xl text-brand-charcoal">Addresses</h3></div>
        {!adding && <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal border border-brand-charcoal/20 px-4 py-2 hover:bg-brand-cream transition-colors"><Plus size={12}/> Add New</button>}
      </div>

      {adding && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-brand-cream p-5 mb-6 border border-brand-charcoal/10">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-4">{editId ? 'Edit Address' : 'New Address'}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2"><Field label="Label (e.g. Home, Office)" value={form.label} onChange={v => set('label', v)}/></div>
            <div className="col-span-2"><Field label="Street Address *" value={form.line1} onChange={v => set('line1', v)}/></div>
            <Field label="City *" value={form.city} onChange={v => set('city', v)}/>
            <Field label="State" value={form.state} onChange={v => set('state', v)}/>
            <Field label="Pincode *" value={form.pincode} onChange={v => set('pincode', v)}/>
            <Field label="Country" value={form.country} onChange={v => set('country', v)}/>
          </div>
          <div className="flex gap-3">
            <button onClick={saveAddress} disabled={saving} className="flex-1 py-2.5 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50">{saving?'Saving…':'Save Address'}</button>
            <button onClick={()=>{setAdding(false);setEditId(null);}} className="px-4 py-2.5 border border-brand-charcoal/20 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:bg-white transition-colors">Cancel</button>
          </div>
        </motion.div>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="py-12 text-center"><MapPin size={32} className="text-brand-charcoal/10 mx-auto mb-3"/><p className="text-brand-charcoal/40 text-sm italic">No addresses saved yet</p></div>
      ) : addresses.map(addr => (
        <div key={addr.id} className={cn("bg-white border p-5 mb-3", addr.isDefault ? "border-brand-gold" : "border-brand-charcoal/8")}>
          <div className="flex justify-between items-start">
            <div>
              {addr.label && <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-1">{addr.label} {addr.isDefault && <span className="text-brand-gold">· Default</span>}</p>}
              <p className="text-sm text-brand-charcoal">{addr.line1}</p>
              <p className="text-sm text-brand-charcoal/70">{addr.city}, {addr.state} {addr.pincode}</p>
              <p className="text-sm text-brand-charcoal/50">{addr.country}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(addr)} className="text-brand-charcoal/40 hover:text-brand-charcoal"><Edit2 size={14}/></button>
              <button onClick={() => deleteAddress(addr.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
            </div>
          </div>
          {!addr.isDefault && <button onClick={() => setDefault(addr.id)} className="text-[9px] uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-gold transition-colors font-bold mt-3">Set as Default</button>}
        </div>
      ))}
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
type Tab = 'profile' | 'orders' | 'addresses';

export const CustomerDashboard = ({ onClose }: { onClose: () => void }) => {
  const { user, profile, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');

  const handleLogout = async () => { await logout(); onClose(); };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-end">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-sm"/>
      <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'tween',duration:0.4}} className="relative w-full max-w-lg h-full bg-brand-cream shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-brand-charcoal text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-bold serif text-lg">
              {(profile?.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div><p className="font-bold text-sm">{profile?.name || 'My Account'}</p><p className="text-white/50 text-xs">{user.email}</p></div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={22}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-charcoal/10 bg-white">
          {([['profile', User, 'Profile'], ['orders', Package, 'Orders'], ['addresses', MapPin, 'Addresses']] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2", tab === key ? "border-brand-gold text-brand-charcoal" : "border-transparent text-brand-charcoal/40 hover:text-brand-charcoal")}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
              {tab === 'profile' && <ProfileTab/>}
              {tab === 'orders' && <OrdersTab/>}
              {tab === 'addresses' && <AddressesTab/>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-brand-charcoal/10 bg-white">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-widest text-brand-charcoal/50 hover:text-red-500 transition-colors">
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
