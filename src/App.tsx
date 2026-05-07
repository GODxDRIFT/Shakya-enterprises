import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Globe, ShieldCheck, MessageCircle, ChevronUp,
  ZoomIn, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, XCircle,
  Heart, Search, SlidersHorizontal, ArrowUpDown, Clock, Ruler,
  MapPin, Truck, Package, Tag,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from './lib/utils';
import { PRODUCTS, CATEGORIES, BUNDLES, SIZE_GUIDE, getSizeGuideCategory, type Product, type CartItem, type Bundle } from './data';
import { AnnouncementBar, Navbar } from './Navbar';
import { Hero, HeritageSection, ProcessSection, CustomSection, LookbookSection, TestimonialsSection, FAQSection, ContactSection, Footer } from './Sections';

// ─── localStorage helpers ─────────────────────────────────────────────────
const LS = {
  get: <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } },
  set: (key: string, val: unknown) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ─── WhatsApp helper ──────────────────────────────────────────────────────
const buildWhatsAppUrl = (product: Product, size: string, color: string, qty = 1) => {
  const msg = `Hi Shakya Enterprises! 🙏\n\nI'd like to order:\n\n*Product:* ${product.name}\n*Size:* ${size}\n*Colour:* ${color}\n*Qty:* ${qty}\n*Price:* ${product.price} (${product.priceINR})\n\nKindly confirm availability and share payment details. Thank you!`;
  return `https://wa.me/918750590574?text=${encodeURIComponent(msg)}`;
};

// ─── Pincode Delivery Estimate ────────────────────────────────────────────
const getPincodeEstimate = (pin: string) => {
  if (!/^\d{6}$/.test(pin)) return null;
  const p = parseInt(pin.slice(0, 3));
  const metros = [110,111,112,400,401,560,600,601,700,701,500,501,380,411];
  if (metros.includes(p)) return { label: '3–5 business days', badge: 'Express', color: 'text-emerald-600 bg-emerald-50' };
  if (p >= 100 && p <= 855) return { label: '5–7 business days', badge: 'Standard', color: 'text-blue-600 bg-blue-50' };
  return { label: '7–10 business days', badge: 'Economy', color: 'text-amber-600 bg-amber-50' };
};

const PincodeEstimator = () => {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getPincodeEstimate>>(null);
  const [checked, setChecked] = useState(false);
  const check = () => { setResult(getPincodeEstimate(pin)); setChecked(true); };
  return (
    <div className="border border-brand-charcoal/10 p-4 mb-4">
      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-3 flex items-center gap-1.5"><Truck size={11} /> Check Delivery</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30" />
          <input
            value={pin} maxLength={6} onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setChecked(false); }} onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="Enter pincode"
            className="w-full pl-8 pr-3 py-2 text-sm border border-brand-charcoal/15 focus:outline-none focus:border-brand-charcoal transition-colors"
          />
        </div>
        <button onClick={check} disabled={pin.length !== 6} className="px-4 py-2 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors disabled:opacity-30">Check</button>
      </div>
      {checked && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          {result ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-brand-charcoal/70"><CheckCircle2 size={14} className="text-emerald-500" /> Delivery in <strong>{result.label}</strong></div>
              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full", result.color)}>{result.badge}</span>
            </div>
          ) : (
            <p className="text-sm text-brand-charcoal/50 flex items-center gap-1.5"><Globe size={12} /> For international orders, <a href="https://wa.me/918750590574" target="_blank" className="text-brand-gold underline">contact us on WhatsApp</a></p>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ─── Size Guide Modal ─────────────────────────────────────────────────────
const SizeGuideModal = ({ category, onClose }: { category: string; onClose: () => void }) => {
  const guideKey = getSizeGuideCategory(category);
  const guide = SIZE_GUIDE[guideKey];
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-brand-charcoal/10 flex justify-between items-center">
          <div className="flex items-center gap-2"><Ruler size={18} className="text-brand-gold" /><h3 className="serif text-xl text-brand-charcoal">Size Guide</h3></div>
          <button onClick={onClose} className="text-brand-charcoal/40 hover:text-brand-charcoal"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-x-auto">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-4">{category}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-charcoal/10">
                {guide.headers.map(h => <th key={h} className="text-left py-2 pr-4 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {guide.rows.map((row, i) => (
                <tr key={i} className={cn("border-b border-brand-charcoal/5", i % 2 === 0 ? "bg-brand-cream/50" : "")}>
                  {row.map((cell, j) => <td key={j} className={cn("py-3 pr-4", j === 0 ? "font-bold text-brand-charcoal" : "text-brand-charcoal/60")}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-brand-charcoal/40 mt-4">* All measurements are approximate. For custom sizes, contact us on WhatsApp.</p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Stock Badge ──────────────────────────────────────────────────────────
const StockBadge = ({ stock }: { stock: number }) => {
  if (stock === 0) return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500"><XCircle size={12} /> Out of Stock</span>;
  if (stock <= 5) return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-500"><AlertCircle size={12} /> Only {stock} left</span>;
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600"><CheckCircle2 size={12} /> In Stock</span>;
};

// ─── Lightbox ─────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white"><X size={28} /></button>
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/60 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full"><ChevronLeft size={24} /></button>
      <motion.img key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={images[idx]} alt="" className="max-h-[85vh] max-w-[85vw] object-contain" onClick={e => e.stopPropagation()} />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/60 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full"><ChevronRight size={24} /></button>
      <div className="absolute bottom-6 flex gap-2">
        {images.map((_, i) => <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }} className={cn("w-2 h-2 rounded-full transition-all", i === idx ? "bg-white w-6" : "bg-white/40")} />)}
      </div>
    </motion.div>
  );
};

// ─── Product Modal ────────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onAdd, isWishlisted, onToggleWishlist }: {
  product: Product; onClose: () => void;
  onAdd: (p: Product, size: string, color: string) => void;
  isWishlisted: boolean; onToggleWishlist: (id: string) => void;
}) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'materials' | 'care'>('desc');
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0].name);
  const [addedFlash, setAddedFlash] = useState(false);

  const handleAdd = () => {
    if (product.stock === 0) return;
    onAdd(product, selectedSize, selectedColor);
    setAddedFlash(true);
    setTimeout(() => { setAddedFlash(false); onClose(); }, 700);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm cursor-pointer" />
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', damping: 28 }} className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 shadow-2xl rounded-t-3xl sm:rounded-2xl">
          {/* Gallery */}
          <div className="flex flex-col gap-2 p-4 bg-brand-sand/30">
            <div className="relative aspect-square overflow-hidden bg-brand-sand group cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
              <motion.img key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={16} className="text-brand-charcoal" /></div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={cn("shrink-0 w-16 h-16 overflow-hidden border-2 transition-all", activeImg === i ? "border-brand-charcoal" : "border-transparent opacity-60 hover:opacity-100")}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col overflow-y-auto">
            <div className="flex justify-between mb-3">
              <button onClick={() => onToggleWishlist(product.id)} className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors", isWishlisted ? "text-rose-500" : "text-brand-charcoal/40 hover:text-rose-400")}>
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} /> {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button onClick={onClose} className="text-brand-charcoal/40 hover:text-brand-charcoal"><X size={20} /></button>
            </div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-brand-gold font-bold mb-1">{product.category}</p>
            <h2 className="serif text-2xl text-brand-charcoal mb-1">{product.name}</h2>
            <p className="font-bold text-xl text-brand-olive mb-2">{product.price} <span className="text-sm text-brand-charcoal/40 font-normal">/ {product.priceINR}</span></p>
            <div className="mb-4"><StockBadge stock={product.stock} /></div>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 mb-2">Colour — <span className="text-brand-charcoal normal-case tracking-normal font-normal">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.colors.map(c => (
                  <button key={c.name} title={c.name} onClick={() => setSelectedColor(c.name)} className={cn("w-8 h-8 rounded-full border-2 transition-all ring-1 ring-black/10", selectedColor === c.name ? "border-brand-charcoal scale-110 shadow-md" : "border-white/60 hover:scale-105")} style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Size</p>
                <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline flex items-center gap-1"><Ruler size={10} /> Size Guide</button>
              </div>
              <div className="flex gap-2 flex-wrap mb-5">
                {product.variants.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={cn("px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all", selectedSize === s ? "border-brand-charcoal bg-brand-charcoal text-white" : "border-brand-charcoal/20 text-brand-charcoal/70 hover:border-brand-charcoal")}>{s}</button>
                ))}
              </div>
            </div>

            {/* Pincode estimator */}
            <PincodeEstimator />

            {/* Tabs */}
            <div className="flex gap-4 border-b border-brand-charcoal/10 mb-4">
              {(['desc', 'materials', 'care'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={cn("text-[10px] uppercase tracking-widest font-bold pb-3 border-b-2 transition-colors", tab === t ? "border-brand-olive text-brand-charcoal" : "border-transparent text-brand-charcoal/40")}>{t === 'desc' ? 'Details' : t}</button>
              ))}
            </div>
            <div className="text-sm text-brand-charcoal/70 leading-relaxed mb-5 flex-1">
              {tab === 'desc' && <ul className="space-y-2">{product.details.map((d, i) => <li key={i} className="flex gap-2"><span className="text-brand-gold">•</span>{d}</li>)}</ul>}
              {tab === 'materials' && <p>{product.materials}</p>}
              {tab === 'care' && <p>{product.care}</p>}
            </div>

            {/* Add to cart */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-brand-charcoal/20">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg">−</button>
                <span className="w-9 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={product.stock === 0} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg disabled:opacity-30">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0} className={cn("flex-1 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2", addedFlash ? "bg-emerald-600 text-white" : product.stock === 0 ? "bg-brand-charcoal/20 text-brand-charcoal/40 cursor-not-allowed" : "bg-brand-charcoal text-white hover:bg-brand-olive")}>
                {addedFlash ? <><CheckCircle2 size={14} /> Added!</> : <><ShoppingBag size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</>}
              </button>
            </div>

            {/* WhatsApp Order Button */}
            <a href={buildWhatsAppUrl(product, selectedSize, selectedColor, qty)} target="_blank" rel="noopener noreferrer"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mb-4">
              <MessageCircle size={14} /> Order via WhatsApp
            </a>

            <div className="flex items-center gap-2 text-[10px] text-brand-charcoal/40 uppercase tracking-widest"><Globe size={11} />Ships worldwide from Jaipur</div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>{lightboxOpen && <Lightbox images={product.images} startIndex={activeImg} onClose={() => setLightboxOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{sizeGuideOpen && <SizeGuideModal category={product.category} onClose={() => setSizeGuideOpen(false)} />}</AnimatePresence>
    </>
  );
};

// ─── Bundle Deals Section ─────────────────────────────────────────────────
const BundleDeals = ({ onAddBundle }: { onAddBundle: (bundle: Bundle) => void }) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  const getBundlePrice = (bundle: Bundle) => {
    const products = bundle.productIds.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean);
    const total = products.reduce((s, p) => s + parseFloat(p.price.replace('$', '')), 0);
    const discounted = total * (1 - bundle.discount / 100);
    return { original: total.toFixed(0), discounted: discounted.toFixed(0) };
  };

  const handleAdd = (bundle: Bundle) => {
    onAddBundle(bundle);
    setAddedId(bundle.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-3 flex items-center gap-2"><Tag size={11} /> Bundle & Save</p>
            <h2 className="serif text-4xl md:text-5xl text-white">Curated <span className="italic text-white/50">Sets</span></h2>
          </div>
          <p className="hidden md:block text-white/40 text-sm max-w-xs text-right">Save up to 15% when you shop our handpicked bundles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.map(bundle => {
            const prices = getBundlePrice(bundle);
            const bundleProducts = bundle.productIds.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean);
            const isAdded = addedId === bundle.id;
            return (
              <motion.div key={bundle.id} whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 hover:border-brand-gold/40 transition-all overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-brand-gold text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Save {bundle.discount}%</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="serif text-xl text-white mb-1">{bundle.name}</h3>
                    <p className="text-white/60 text-xs">{bundle.tagline}</p>
                  </div>
                </div>
                <div className="p-5">
                  {/* Products in bundle */}
                  <div className="flex -space-x-3 mb-4">
                    {bundleProducts.slice(0, 3).map(p => (
                      <div key={p.id} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10"><img src={p.image} className="w-full h-full object-cover" /></div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center text-[9px] text-white/60 font-bold">{bundleProducts.length} items</div>
                  </div>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-white/40 text-xs line-through">${prices.original}</p>
                      <p className="text-brand-gold serif text-2xl font-bold">${prices.discounted}</p>
                    </div>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">incl. {bundle.discount}% off</p>
                  </div>
                  <button onClick={() => handleAdd(bundle)} className={cn("w-full py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2", isAdded ? "bg-emerald-500 text-white" : "bg-brand-gold hover:bg-white text-brand-charcoal")}>
                    {isAdded ? <><CheckCircle2 size={14} /> Added to Bag!</> : <><Package size={14} /> Add Bundle to Bag</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Wishlist Drawer ──────────────────────────────────────────────────────
const WishlistDrawer = ({ wishlist, onClose, onRemove, onSelect, onAddToCart }: {
  wishlist: Product[]; onClose: () => void;
  onRemove: (id: string) => void; onSelect: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-end">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm cursor-pointer" />
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="relative w-full max-w-md h-full bg-brand-cream shadow-2xl flex flex-col">
      <div className="p-8 border-b border-brand-charcoal/5 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3"><Heart size={20} className="text-rose-400" fill="currentColor" /><h2 className="serif text-2xl text-brand-charcoal">Wishlist ({wishlist.length})</h2></div>
        <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-charcoal"><X size={24} strokeWidth={1} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-20"><Heart size={40} className="text-brand-charcoal/10 mx-auto mb-4" /><p className="serif text-xl text-brand-charcoal/40 italic">Nothing saved yet</p><a href="#collections" onClick={onClose} className="text-[11px] uppercase tracking-widest text-brand-gold font-bold mt-4 inline-block hover:underline">Browse Collection</a></div>
        ) : wishlist.map(product => (
          <div key={product.id} className="flex gap-4 bg-white p-4 group">
            <div className="w-20 h-24 overflow-hidden shrink-0 cursor-pointer" onClick={() => { onSelect(product); onClose(); }}><img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-brand-gold font-bold mb-0.5">{product.category}</p>
                <h3 className="serif text-base text-brand-charcoal leading-tight cursor-pointer hover:text-brand-olive transition-colors" onClick={() => { onSelect(product); onClose(); }}>{product.name}</h3>
                <p className="text-sm font-bold text-brand-charcoal/70 mt-1">{product.price}</p>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button onClick={() => onAddToCart(product, product.variants.sizes[0], product.variants.colors[0].name)} disabled={product.stock === 0} className={cn("flex-1 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1", product.stock === 0 ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-brand-charcoal text-white hover:bg-brand-olive")}>
                  <ShoppingBag size={10} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
                <a href={buildWhatsAppUrl(product, product.variants.sizes[0], product.variants.colors[0].name)} target="_blank" rel="noopener noreferrer" className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"><MessageCircle size={10} /></a>
                <button onClick={() => onRemove(product.id)} className="text-[9px] text-red-400 hover:text-red-600 uppercase tracking-widest px-2">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

// ─── Recently Viewed ──────────────────────────────────────────────────────
const RecentlyViewed = ({ items, onSelect }: { items: Product[]; onSelect: (p: Product) => void }) => {
  if (items.length === 0) return null;
  return (
    <section className="py-20 px-6 md:px-12 bg-white border-t border-brand-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10"><Clock size={16} className="text-brand-gold" /><h2 className="serif text-2xl text-brand-charcoal">Recently <span className="italic text-brand-olive">Viewed</span></h2></div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {items.map(product => (
            <div key={product.id} className="shrink-0 w-44 cursor-pointer group" onClick={() => onSelect(product)}>
              <div className="aspect-[3/4] overflow-hidden bg-brand-sand mb-3"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
              <p className="text-[9px] uppercase tracking-wider text-brand-gold font-bold mb-0.5">{product.category}</p>
              <h4 className="serif text-sm text-brand-charcoal leading-tight mb-1">{product.name}</h4>
              <p className="text-xs font-bold text-brand-charcoal/60">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Product Catalog ──────────────────────────────────────────────────────
type SortType = 'default' | 'low-high' | 'high-low';
type PriceFilter = 'all' | 'under30' | '30to60' | 'over60';

const ProductCatalog = ({ onSelect, wishlist, onToggleWishlist }: { onSelect: (p: Product) => void; wishlist: string[]; onToggleWishlist: (id: string) => void }) => {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('default');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: Event) => { setSearch((e as CustomEvent).detail as string); searchRef.current?.focus(); };
    window.addEventListener('shakya-search', h); return () => window.removeEventListener('shakya-search', h);
  }, []);
  const priceNum = (p: Product) => parseFloat(p.price.replace('$', ''));
  let filtered = PRODUCTS
    .filter(p => cat === 'All' || p.category === cat)
    .filter(p => !search.trim() || [p.name, p.category, p.description].some(s => s.toLowerCase().includes(search.toLowerCase())))
    .filter(p => { const pr = priceNum(p); if (priceFilter === 'under30') return pr < 30; if (priceFilter === '30to60') return pr >= 30 && pr <= 60; if (priceFilter === 'over60') return pr > 60; return true; });
  if (sort === 'low-high') filtered = [...filtered].sort((a, b) => priceNum(a) - priceNum(b));
  if (sort === 'high-low') filtered = [...filtered].sort((a, b) => priceNum(b) - priceNum(a));
  const activeFilters = (search ? 1 : 0) + (priceFilter !== 'all' ? 1 : 0) + (sort !== 'default' ? 1 : 0) + (cat !== 'All' ? 1 : 0);
  return (
    <section id="collections" className="py-32 px-6 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Curated Pieces</p>
          <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal">The <span className="italic text-brand-olive">Signature</span> Collection</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-10 pr-4 py-3 text-sm border border-brand-charcoal/15 bg-white focus:outline-none focus:border-brand-charcoal transition-colors" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-charcoal"><X size={14} /></button>}
          </div>
          <button onClick={() => setFiltersOpen(v => !v)} className={cn("flex items-center gap-2 px-5 py-3 border text-[11px] font-bold uppercase tracking-widest transition-all", filtersOpen || activeFilters > 0 ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-charcoal")}>
            <SlidersHorizontal size={14} /> Filters {activeFilters > 0 && <span className="bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>
        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="bg-white border border-brand-charcoal/10 p-6 flex flex-col sm:flex-row gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-3">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {([['all','All'],['under30','Under $30'],['30to60','$30–$60'],['over60','$60+']] as [PriceFilter, string][]).map(([val, label]) => (
                      <button key={val} onClick={() => setPriceFilter(val)} className={cn("px-3 py-1.5 text-[10px] font-bold tracking-widest border transition-all", priceFilter === val ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-3 flex items-center gap-1"><ArrowUpDown size={11} /> Sort By</p>
                  <div className="flex flex-wrap gap-2">
                    {([['default','Default'],['low-high','Price: Low → High'],['high-low','Price: High → Low']] as [SortType, string][]).map(([val, label]) => (
                      <button key={val} onClick={() => setSort(val)} className={cn("px-3 py-1.5 text-[10px] font-bold tracking-widest border transition-all", sort === val ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{label}</button>
                    ))}
                  </div>
                </div>
                {activeFilters > 0 && <button onClick={() => { setSearch(''); setPriceFilter('all'); setSort('default'); setCat('All'); }} className="self-end text-[10px] text-red-400 hover:text-red-600 uppercase tracking-widest font-bold ml-auto">Clear All</button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all border", cat === c ? "border-brand-charcoal bg-brand-charcoal text-white" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{c}</button>)}
        </div>
        {(search || priceFilter !== 'all') && <p className="text-sm text-brand-charcoal/50 mb-8">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found{search ? ` for "${search}"` : ''}</p>}
        {filtered.length === 0 ? (
          <div className="text-center py-24"><Search size={40} className="text-brand-charcoal/10 mx-auto mb-4" /><p className="serif text-2xl text-brand-charcoal/40 italic mb-2">No products found</p><button onClick={() => { setSearch(''); setPriceFilter('all'); setSort('default'); setCat('All'); }} className="mt-4 text-[11px] uppercase tracking-widest text-brand-gold font-bold hover:underline">Clear filters</button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filtered.map(product => (
                <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group cursor-pointer" onClick={() => onSelect(product)}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {product.stock === 0 && <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-red-500">Out of Stock</div>}
                    {product.stock > 0 && product.stock <= 5 && <div className="absolute top-3 left-3 bg-amber-500 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">Only {product.stock} left</div>}
                    <button onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md", wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 text-brand-charcoal/50 hover:text-rose-400 opacity-0 group-hover:opacity-100")}>
                      <Heart size={14} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {/* WhatsApp quick button */}
                    <a href={buildWhatsAppUrl(product, product.variants.sizes[0], product.variants.colors[0].name)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="absolute bottom-16 right-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-600 shadow-md">
                      <MessageCircle size={13} />
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <button className="w-full bg-white/90 backdrop-blur-md text-brand-charcoal py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-colors flex items-center justify-center gap-2"><ShoppingBag size={14} />Quick View</button>
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold mb-1">{product.category}</p>
                    <h3 className="serif text-xl text-brand-charcoal mb-1">{product.name}</h3>
                    <p className="text-sm text-brand-charcoal/80 font-medium">{product.price} <span className="text-brand-charcoal/40">/ {product.priceINR}</span></p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── Cart Drawer ──────────────────────────────────────────────────────────
const CartDrawer = ({ items, onClose, onRemove, onUpdateQty }: { items: CartItem[]; onClose: () => void; onRemove: (id: string, size: string, color: string) => void; onUpdateQty: (id: string, size: string, color: string, qty: number) => void }) => {
  const total = items.reduce((s, i) => s + parseFloat(i.product.price.replace('$', '')) * i.qty, 0);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm cursor-pointer" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="relative w-full max-w-md h-full bg-brand-cream shadow-2xl flex flex-col">
        <div className="p-8 border-b border-brand-charcoal/5 flex items-center justify-between bg-white">
          <h2 className="serif text-2xl text-brand-charcoal">Your Bag ({items.reduce((s, i) => s + i.qty, 0)})</h2>
          <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-charcoal"><X size={24} strokeWidth={1} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-20"><p className="serif text-xl text-brand-charcoal/40 italic">Your bag is empty</p><a href="#collections" onClick={onClose} className="text-[11px] uppercase tracking-widest text-brand-gold font-bold mt-4 inline-block hover:underline">Continue Shopping</a></div>
          ) : items.map(item => (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
              <div className="w-20 h-28 bg-white overflow-hidden shrink-0"><img src={item.product.image} className="w-full h-full object-cover" /></div>
              <div className="flex-1 flex flex-col justify-between">
                <div><h3 className="serif text-base text-brand-charcoal leading-tight">{item.product.name}</h3><p className="text-[10px] text-brand-charcoal/50 mt-0.5">{item.selectedSize} · {item.selectedColor}</p></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-brand-charcoal/20">
                    <button onClick={() => onUpdateQty(item.product.id, item.selectedSize, item.selectedColor, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-brand-charcoal hover:bg-zinc-50 text-sm">−</button>
                    <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.product.id, item.selectedSize, item.selectedColor, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-brand-charcoal hover:bg-zinc-50 text-sm">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${(parseFloat(item.product.price.replace('$', '')) * item.qty).toFixed(2)}</p>
                    <button onClick={() => onRemove(item.product.id, item.selectedSize, item.selectedColor)} className="text-[9px] text-red-400 hover:text-red-600 uppercase tracking-widest">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-brand-charcoal/5">
            <div className="flex justify-between items-center mb-2"><span className="text-[10px] uppercase tracking-widest text-brand-charcoal/60 font-bold">Subtotal</span><span className="serif text-2xl text-brand-charcoal">${total.toFixed(2)}</span></div>
            <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest mb-5">Taxes & international shipping at checkout</p>
            <button className="w-full bg-brand-charcoal text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-olive transition-colors flex items-center justify-center gap-2 mb-3">Secure Checkout <ShieldCheck size={14} /></button>
            <a href={`https://wa.me/918750590574?text=${encodeURIComponent('Hi! I want to place an order for ' + items.map(i => `${i.product.name} (${i.selectedSize}, ${i.selectedColor}) x${i.qty}`).join(', ') + `. Total: $${total.toFixed(2)}`)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Order via WhatsApp
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ─── Floating Buttons ─────────────────────────────────────────────────────
const FloatingButtons = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const h = () => setShow(window.scrollY > 400); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <>
      <a href="https://wa.me/918750590574?text=Hi%20Shakya%20Enterprises!" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-[90] w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors hover:scale-110 transform"><MessageCircle size={26} /></a>
      {show && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-brand-charcoal text-white rounded-full flex items-center justify-center shadow-xl hover:bg-brand-olive transition-colors"><ChevronUp size={20} /></button>}
    </>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => LS.get('shakya_cart_v1', []));
  const [wishlist, setWishlist] = useState<string[]>(() => LS.get('shakya_wishlist_v1', []));
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => LS.get('shakya_recent_v1', []));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => { LS.set('shakya_cart_v1', cart); }, [cart]);
  useEffect(() => { LS.set('shakya_wishlist_v1', wishlist); }, [wishlist]);
  useEffect(() => { LS.set('shakya_recent_v1', recentlyViewed); }, [recentlyViewed]);

  const openProduct = useCallback((p: Product) => {
    setSelectedProduct(p);
    setRecentlyViewed(prev => [p, ...prev.filter(r => r.id !== p.id)].slice(0, 8));
  }, []);

  const addToCart = useCallback((p: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === p.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) return prev.map(i => i.product.id === p.id && i.selectedSize === size && i.selectedColor === color ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const addBundleToCart = useCallback((bundle: Bundle) => {
    bundle.productIds.forEach(id => {
      const p = PRODUCTS.find(pr => pr.id === id);
      if (p) addToCart(p, p.variants.sizes[0], p.variants.colors[0].name);
    });
  }, [addToCart]);

  const removeFromCart = useCallback((id: string, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === id && i.selectedSize === size && i.selectedColor === color)));
  }, []);

  const updateQty = useCallback((id: string, size: string, color: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id, size, color); return; }
    setCart(prev => prev.map(i => i.product.id === id && i.selectedSize === size && i.selectedColor === color ? { ...i, qty } : i));
  }, [removeFromCart]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  }, []);

  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div initial={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <Navbar onOpenCart={() => setCartOpen(true)} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onOpenWishlist={() => setWishlistOpen(true)} wishlistCount={wishlist.length} />
      </div>

      <main>
        <Hero /><HeritageSection />
        <ProductCatalog onSelect={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
        <BundleDeals onAddBundle={addBundleToCart} />
        <RecentlyViewed items={recentlyViewed} onSelect={openProduct} />
        <LookbookSection /><ProcessSection /><CustomSection /><TestimonialsSection /><FAQSection /><ContactSection />
      </main>
      <Footer />
      <FloatingButtons />

      <AnimatePresence>{cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />}</AnimatePresence>
      <AnimatePresence>{wishlistOpen && <WishlistDrawer wishlist={wishlistProducts} onClose={() => setWishlistOpen(false)} onRemove={toggleWishlist} onSelect={openProduct} onAddToCart={addToCart} />}</AnimatePresence>
      <AnimatePresence>
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} isWishlisted={wishlist.includes(selectedProduct.id)} onToggleWishlist={toggleWishlist} />}
      </AnimatePresence>
    </div>
  );
}
