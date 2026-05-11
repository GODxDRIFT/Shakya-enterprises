// src/Admin.tsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Package, Star, Archive, TrendingUp, LogOut, Trash2, ShieldCheck, Eye, EyeOff, Plus, Edit2, Upload, CheckCircle2, BarChart2, Users, ImageIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { cn } from './lib/utils';
import { productService, orderService, reviewService, uploadToCloudinary, type FSProduct, type FSOrder, type FSReview } from './firebase';
import { PRODUCTS } from './data';

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'SHAKYA2024'; // change this!
const ADMIN_EMAILS   = ['admin@shakyaenterprises.com']; // add your email here

// ── Field helper ───────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type = 'text', textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 block mb-1.5">{label}</label>
    {textarea
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full border border-brand-charcoal/15 p-2 text-sm bg-white focus:outline-none focus:border-brand-olive transition-colors resize-none"/>
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/20"/>
    }
  </div>
);

// ── Stat card ──────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, color = 'text-brand-charcoal', icon: Icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: React.ElementType }) => (
  <div className="bg-white border border-brand-charcoal/8 p-5 flex items-start gap-4">
    {Icon && <div className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center shrink-0"><Icon size={18} className={color}/></div>}
    <div><p className="text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-1">{label}</p><p className={cn("text-2xl font-bold", color)}>{value}</p>{sub && <p className="text-[10px] text-brand-charcoal/40 mt-0.5">{sub}</p>}</div>
  </div>
);

// ── Product Form Modal ─────────────────────────────────────────────────────
const blankProduct = (): Omit<FSProduct,'id'> => ({
  name:'', category:'Bedsheets', price:'$0', priceINR:'₹0', description:'',
  image:'', images:[], details:[], materials:'', care:'', stock:10, active:true,
  variants:{ sizes:['Single','Double','King'], colors:[{name:'White',hex:'#ffffff'}] },
});

const ProductForm = ({ product, onSave, onClose }: { product?: FSProduct; onClose: ()=>void; onSave: ()=>void }) => {
  const [form, setForm] = useState<Omit<FSProduct,'id'>>(product ? { ...product } : blankProduct());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: unknown) => setForm(p => ({...p, [k]: v}));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      set('image', url);
      setForm(p => ({...p, images: [url, ...p.images.filter(i=>i!==url)]}));
    } catch { alert('Image upload failed. Check Cloudinary config.'); }
    finally { setUploading(false); }
  };

  const addMoreImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(p => ({...p, images: [...p.images, url]}));
    } catch { alert('Image upload failed.'); }
    finally { setUploading(false); }
  };

  const removeImage = (url: string) => {
    setForm(p => ({
      ...p,
      images: p.images.filter(i => i !== url),
      image: p.image === url ? p.images.find(i=>i!==url)||'' : p.image,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { alert('Name and price are required.'); return; }
    setSaving(true);
    if (product?.id) { await productService.update(product.id, form); }
    else { await productService.add(form); }
    onSave(); onClose(); setSaving(false);
  };

  const CATEGORIES = ['Bedsheets','Rajai','Cushions','Bags','Runners','Home Furnishing'];

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl">
        <div className="p-6 border-b border-brand-charcoal/10 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="serif text-xl text-brand-charcoal">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-brand-charcoal/30 hover:text-brand-charcoal"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Images */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-3">Product Images</p>
            <div className="flex gap-3 flex-wrap mb-3">
              {/* Main image upload */}
              <div onClick={() => fileRef.current?.click()} className={cn("w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors", form.image ? "border-brand-charcoal/20" : "border-brand-gold/50 bg-brand-gold/5")}>
                {form.image ? <img src={form.image} className="w-full h-full object-cover"/> : <><ImageIcon size={20} className="text-brand-charcoal/30 mb-1"/><span className="text-[9px] text-brand-charcoal/40 uppercase tracking-widest text-center">Main Photo</span></>}
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"/></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>

              {/* Additional images */}
              {form.images.filter(i=>i!==form.image).map(url => (
                <div key={url} className="relative w-24 h-24 group">
                  <img src={url} className="w-full h-full object-cover"/>
                  <button onClick={() => removeImage(url)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex"><X size={10}/></button>
                </div>
              ))}

              {/* Add more */}
              <label className="w-24 h-24 border-2 border-dashed border-brand-charcoal/15 flex flex-col items-center justify-center cursor-pointer hover:border-brand-charcoal/40 transition-colors">
                <Plus size={18} className="text-brand-charcoal/30 mb-1"/>
                <span className="text-[9px] text-brand-charcoal/40 uppercase tracking-widest">Add More</span>
                <input type="file" accept="image/*" className="hidden" onChange={addMoreImage}/>
              </label>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Product Name *" value={form.name} onChange={v=>set('name',v)} placeholder="Jaipuri Hand-Block Rajai"/></div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 block mb-1.5">Category</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)} className="w-full border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none">
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Stock Qty" type="number" value={String(form.stock)} onChange={v=>set('stock',parseInt(v)||0)}/>
            <Field label="Price (USD)" value={form.price} onChange={v=>set('price',v)} placeholder="$85"/>
            <Field label="Price (INR)" value={form.priceINR} onChange={v=>set('priceINR',v)} placeholder="₹6,999"/>
          </div>

          <Field label="Description" value={form.description} onChange={v=>set('description',v)} placeholder="Brief description" textarea/>
          <Field label="Details (one per line)" value={form.details.join('\n')} onChange={v=>set('details',v.split('\n').filter(Boolean))} textarea/>
          <Field label="Materials" value={form.materials} onChange={v=>set('materials',v)}/>
          <Field label="Care Instructions" value={form.care} onChange={v=>set('care',v)}/>

          {/* Sizes */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-2">Available Sizes (comma separated)</p>
            <input value={form.variants.sizes.join(', ')} onChange={e=>setForm(p=>({...p,variants:{...p.variants,sizes:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}}))} className="w-full border-b border-brand-charcoal/15 pb-2 text-sm bg-transparent focus:outline-none" placeholder="Single, Double, King"/>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)} className="w-4 h-4 accent-brand-olive"/>
              <span className="text-sm text-brand-charcoal/70 font-bold">Product Active (visible on site)</span>
            </label>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={14}/> {saving?'Saving…':product?'Update Product':'Add Product'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Admin Dashboard ───────────────────────────────────────────────────
export const AdminDashboard = ({ onClose }: { onClose: ()=>void }) => {
  const [authed, setAuthed]   = useState(()=>sessionStorage.getItem('shakya_admin')==='1');
  const [password, setPw]     = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [pwError, setPwError] = useState('');
  const [tab, setTab]         = useState<'stats'|'orders'|'products'|'reviews'>('stats');

  const [orders, setOrders]     = useState<FSOrder[]>([]);
  const [products, setProducts] = useState<FSProduct[]>([]);
  const [reviews, setReviews]   = useState<FSReview[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [productForm, setProductForm] = useState<{open:boolean;product?:FSProduct}>({open:false});
  const [expandedOrder, setExpandedOrder] = useState<string|null>(null);

  const login = () => {
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem('shakya_admin','1'); setAuthed(true); setPwError(''); loadAllData(); }
    else setPwError('Incorrect password.');
  };
  const logout = () => { sessionStorage.removeItem('shakya_admin'); setAuthed(false); setPw(''); };

  const loadAllData = async () => {
    setLoadingData(true);
    const [o, p, r] = await Promise.all([orderService.getAll(), productService.getAll(), reviewService.getAll()]);
    setOrders(o); setReviews(r);
    // If no products in Firestore yet, seed from code
    if (p.length === 0) {
      for (const prod of PRODUCTS) {
        await productService.add({ ...prod, active: true });
      }
      const seeded = await productService.getAll();
      setProducts(seeded);
    } else { setProducts(p); }
    setLoadingData(false);
  };

  useEffect(() => { if (authed) loadAllData(); }, [authed]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter(o=>o.status==='PAID'||o.status==='Shipped'||o.status==='Delivered');
    const totalINR = paidOrders.reduce((s,o)=>s+(o.totalINR||0),0);
    const totalUSD = paidOrders.reduce((s,o)=>s+parseFloat((o.totalUSD||'$0').replace('$','')),0);
    const avgRating = reviews.length ? reviews.reduce((s,r)=>s+r.rating,0)/reviews.length : 0;
    // Monthly revenue chart data (last 6 months)
    const months: Record<string,number> = {};
    const now = new Date();
    for (let i=5;i>=0;i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); months[d.toLocaleString('en',{month:'short'})] = 0; }
    paidOrders.forEach(o => {
      if (!o.date) return;
      const d = o.date instanceof Date ? o.date : new Date((o.date as {seconds:number}).seconds*1000);
      const key = d.toLocaleString('en',{month:'short'});
      if (key in months) months[key] += o.totalINR||0;
    });
    const chartData = Object.entries(months).map(([month,revenue])=>({month,revenue:Math.round(revenue/1000)}));
    return { totalINR, totalUSD, avgRating, paidCount: paidOrders.length, pending: orders.filter(o=>o.status==='pending'||o.status==='ACTIVE').length, chartData };
  }, [orders, reviews]);

  const updateOrderStatus = async (id: string, status: string) => {
    await orderService.updateStatus(id, status);
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o));
  };

  const deleteReview = async (id: string) => {
    await reviewService.delete(id);
    setReviews(prev=>prev.filter(r=>r.id!==id));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await productService.delete(id);
    setProducts(prev=>prev.filter(p=>p.id!==id));
  };

  const toggleActive = async (id: string, active: boolean) => {
    await productService.update(id, { active: !active });
    setProducts(prev=>prev.map(p=>p.id===id?{...p,active:!active}:p));
  };

  const statusColor = (s: string) => ({PAID:'text-emerald-600 bg-emerald-50',ACTIVE:'text-blue-600 bg-blue-50',pending:'text-amber-600 bg-amber-50',EXPIRED:'text-zinc-500 bg-zinc-100',failed:'text-red-600 bg-red-50',Shipped:'text-purple-600 bg-purple-50',Delivered:'text-teal-600 bg-teal-50',Cancelled:'text-red-400 bg-red-50'}[s]||'text-zinc-500 bg-zinc-100');

  // ── Login gate ─────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-charcoal/80 backdrop-blur-sm">
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="bg-white w-full max-w-sm p-10 rounded-2xl shadow-2xl">
        <div className="flex justify-between mb-8"><div><p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-1">Shakya Enterprises</p><h2 className="serif text-2xl text-brand-charcoal">Admin Login</h2></div><button onClick={onClose} className="text-brand-charcoal/30 hover:text-brand-charcoal"><X size={20}/></button></div>
        {pwError && <p className="text-red-500 text-xs mb-4">{pwError}</p>}
        <div className="relative mb-6">
          <input type={showPw?'text':'password'} value={password} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Password" className="w-full border-b border-brand-charcoal/20 pb-2 pr-8 text-sm bg-transparent focus:outline-none focus:border-brand-olive transition-colors placeholder:text-brand-charcoal/25"/>
          <button onClick={()=>setShowPw(v=>!v)} className="absolute right-0 top-0 text-brand-charcoal/30 hover:text-brand-charcoal">{showPw?<EyeOff size={14}/>:<Eye size={14}/>}</button>
        </div>
        <button onClick={login} className="w-full py-4 bg-brand-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors flex items-center justify-center gap-2"><ShieldCheck size={14}/> Login</button>
      </motion.div>
    </div>
  );

  // ── Dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[300] bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-brand-charcoal text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div><p className="text-brand-gold text-[9px] uppercase tracking-widest font-bold">Shakya Enterprises</p><h1 className="serif text-xl font-bold">Admin Dashboard</h1></div>
        <div className="flex items-center gap-4">
          {loadingData && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
          <button onClick={logout} className="flex items-center gap-1.5 text-white/50 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors"><LogOut size={13}/> Logout</button>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22}/></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-brand-charcoal/10 p-1 rounded-lg w-fit overflow-x-auto">
          {([['stats',TrendingUp,'Overview'],['orders',Package,'Orders'],['products',Archive,'Products'],['reviews',Star,'Reviews']] as const).map(([key,Icon,label])=>(
            <button key={key} onClick={()=>setTab(key)} className={cn("flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap",tab===key?"bg-brand-charcoal text-white":"text-brand-charcoal/50 hover:text-brand-charcoal")}>
              <Icon size={12}/>{label}
            </button>
          ))}
        </div>

        {/* ── Stats Tab ── */}
        {tab==='stats' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Stat label="Total Revenue" value={`₹${(stats.totalINR/1000).toFixed(0)}K`} sub={`≈ $${stats.totalUSD.toFixed(0)}`} color="text-brand-olive" icon={TrendingUp}/>
              <Stat label="Paid Orders" value={stats.paidCount} sub="completed" color="text-emerald-600" icon={CheckCircle2}/>
              <Stat label="Pending" value={stats.pending} sub="awaiting payment" color="text-amber-600" icon={Package}/>
              <Stat label="Avg Rating" value={stats.avgRating?`${stats.avgRating.toFixed(1)} ★`:'—'} sub={`${reviews.length} reviews`} color="text-brand-gold" icon={Star}/>
            </div>

            {/* Revenue chart */}
            <div className="bg-white border border-brand-charcoal/8 p-6 mb-6">
              <div className="flex items-center gap-2 mb-6"><BarChart2 size={16} className="text-brand-gold"/><p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50">Monthly Revenue (₹ thousands)</p></div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.chartData} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
                  <XAxis dataKey="month" tick={{fontSize:11,fontFamily:'inherit'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fontFamily:'inherit'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{border:'1px solid #e8e3db',borderRadius:'8px',fontSize:'12px'}} formatter={(v:number)=>[`₹${v}K`,'Revenue']}/>
                  <Bar dataKey="revenue" fill="#8B7355" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-brand-charcoal/8 p-6">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-4">Recent Orders</p>
              {orders.slice(0,5).map(o=>(
                <div key={o.id} className="flex justify-between items-center py-3 border-b border-brand-charcoal/5 last:border-0">
                  <div><p className="text-xs font-mono font-bold text-brand-charcoal">{o.id}</p><p className="text-[10px] text-brand-charcoal/50">{(o.customer as {name:string})?.name}</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-brand-charcoal">₹{o.totalINR?.toLocaleString('en-IN')}</p><span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full",statusColor(o.status))}>{o.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab==='orders' && (
          <div className="space-y-3">
            {orders.length===0?<div className="text-center py-20 text-brand-charcoal/30 serif text-xl italic">No orders yet.</div>
              :orders.map(o=>(
              <div key={o.id} className="bg-white border border-brand-charcoal/8">
                <div className="p-4 flex justify-between items-center cursor-pointer" onClick={()=>setExpandedOrder(expandedOrder===o.id?null:o.id)}>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">{(o.items as {product:{image:string}}[]).slice(0,3).map((item,i)=><div key={i} className="w-8 h-8 overflow-hidden border border-white rounded-full bg-brand-sand"><img src={item.product.image} className="w-full h-full object-cover"/></div>)}</div>
                    <div><p className="text-xs font-mono font-bold text-brand-charcoal">{o.id}</p><p className="text-[10px] text-brand-charcoal/50">{(o.customer as {name:string})?.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3"><p className="font-bold text-sm text-brand-charcoal">₹{o.totalINR?.toLocaleString('en-IN')}</p><span className={cn("text-[9px] font-bold px-2 py-1 rounded-full",statusColor(o.status))}>{o.status}</span></div>
                </div>
                {expandedOrder===o.id && (
                  <motion.div initial={{height:0}} animate={{height:'auto'}} className="overflow-hidden border-t border-brand-charcoal/5">
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-sm space-y-1 text-brand-charcoal/70">
                        <p><strong>Email:</strong> {(o.customer as {email:string})?.email}</p>
                        <p><strong>Phone:</strong> {(o.customer as {phone:string})?.phone}</p>
                        <p><strong>Ship to:</strong> {(o.shipping as {city:string;state:string})?.city}, {(o.shipping as {city:string;state:string})?.state}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {['PAID','Shipped','Delivered','Cancelled'].map(s=>(
                            <button key={s} onClick={()=>updateOrderStatus(o.id,s)} className={cn("px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all",o.status===s?"bg-brand-charcoal text-white border-brand-charcoal":"border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{s}</button>
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

        {/* ── Products Tab ── */}
        {tab==='products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-brand-charcoal/50">{products.length} products in Firestore</p>
              <button onClick={()=>setProductForm({open:true})} className="flex items-center gap-2 px-5 py-3 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors">
                <Plus size={13}/> Add Product
              </button>
            </div>
            <div className="bg-white border border-brand-charcoal/8 overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-brand-charcoal/8 bg-brand-cream/50"><th className="text-left p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Product</th><th className="text-left p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 hidden sm:table-cell">Category</th><th className="text-right p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Price</th><th className="text-right p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Stock</th><th className="text-right p-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Actions</th></tr></thead>
                <tbody>
                  {products.map(p=>(
                    <tr key={p.id} className="border-b border-brand-charcoal/5 last:border-0 hover:bg-brand-cream/30 transition-colors">
                      <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 overflow-hidden bg-brand-sand shrink-0"><img src={p.image} className="w-full h-full object-cover"/></div><div><span className={cn("text-sm font-bold text-brand-charcoal",!p.active&&"opacity-40")}>{p.name}</span>{!p.active&&<span className="ml-2 text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Hidden</span>}</div></div></td>
                      <td className="p-4 text-[10px] text-brand-charcoal/50 font-bold uppercase tracking-widest hidden sm:table-cell">{p.category}</td>
                      <td className="p-4 text-sm font-bold text-brand-charcoal text-right">{p.price}</td>
                      <td className="p-4 text-right"><span className={cn("text-[10px] font-bold px-2 py-1 rounded-full",p.stock===0?"bg-red-50 text-red-500":p.stock<=5?"bg-amber-50 text-amber-600":"bg-emerald-50 text-emerald-600")}>{p.stock===0?'Out':p.stock<=5?`Low (${p.stock})`:`${p.stock}`}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={()=>toggleActive(p.id,p.active)} title={p.active?'Hide':'Show'} className="text-brand-charcoal/30 hover:text-brand-charcoal transition-colors"><Eye size={14}/></button>
                          <button onClick={()=>setProductForm({open:true,product:p})} className="text-brand-charcoal/30 hover:text-brand-charcoal transition-colors"><Edit2 size={14}/></button>
                          <button onClick={()=>deleteProduct(p.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {tab==='reviews' && (
          <div className="space-y-3">
            {reviews.length===0?<div className="text-center py-20 text-brand-charcoal/30 serif text-xl italic">No reviews yet.</div>
              :reviews.map(r=>{
                const product=products.find(p=>p.id===r.productId);
                return (
                  <div key={r.id} className="bg-white border border-brand-charcoal/8 p-5 flex gap-4">
                    {product&&<div className="w-12 h-12 overflow-hidden shrink-0 bg-brand-sand"><img src={product.image} className="w-full h-full object-cover"/></div>}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">{[1,2,3,4,5].map(i=><Star key={i} size={11} className={r.rating>=i?"text-brand-gold fill-brand-gold":"text-brand-charcoal/15"}/>)}</div>
                          <p className="text-[10px] font-bold text-brand-charcoal/50">{product?.name||r.productId}</p>
                          <p className="text-sm text-brand-charcoal/70 mt-1">{r.text}</p>
                          <p className="text-[10px] text-brand-charcoal/40 mt-2">— {r.name}</p>
                        </div>
                        <button onClick={()=>deleteReview(r.id)} className="text-red-400 hover:text-red-600 transition-colors ml-3 shrink-0"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Product form modal */}
      <AnimatePresence>
        {productForm.open && <ProductForm product={productForm.product} onClose={()=>setProductForm({open:false})} onSave={loadAllData}/>}
      </AnimatePresence>
    </div>
  );
};
