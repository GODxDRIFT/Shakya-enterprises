import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Globe, ShieldCheck, MessageCircle, ChevronUp,
  ZoomIn, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, XCircle,
  Heart, Search, SlidersHorizontal, ArrowUpDown, Clock,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from './lib/utils';
import { PRODUCTS, CATEGORIES, type Product, type CartItem } from './data';
import { AnnouncementBar, Navbar } from './Navbar';
import { Hero, HeritageSection, ProcessSection, CustomSection, LookbookSection, TestimonialsSection, FAQSection, ContactSection, Footer } from './Sections';

// ─── localStorage helpers ─────────────────────────────────────────────────
const LS = {
  get: <T,>(key: string, fallback: T): T => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
    catch { return fallback; }
  },
  set: (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
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
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
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
const ProductModal = ({
  product, onClose, onAdd, isWishlisted, onToggleWishlist,
}: {
  product: Product; onClose: () => void;
  onAdd: (p: Product, size: string, color: string) => void;
  isWishlisted: boolean; onToggleWishlist: (id: string) => void;
}) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'materials' | 'care'>('desc');
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={cn("px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all", selectedSize === s ? "border-brand-charcoal bg-brand-charcoal text-white" : "border-brand-charcoal/20 text-brand-charcoal/70 hover:border-brand-charcoal")}>{s}</button>
                ))}
              </div>
            </div>

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
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-brand-charcoal/20">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg">−</button>
                <span className="w-9 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={product.stock === 0} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg disabled:opacity-30">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0} className={cn("flex-1 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2", addedFlash ? "bg-emerald-600 text-white" : product.stock === 0 ? "bg-brand-charcoal/20 text-brand-charcoal/40 cursor-not-allowed" : "bg-brand-charcoal text-white hover:bg-brand-olive")}>
                {addedFlash ? <><CheckCircle2 size={14} /> Added!</> : <><ShoppingBag size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</>}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-brand-charcoal/40 uppercase tracking-widest"><Globe size={11} />Ships worldwide from Jaipur</div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>{lightboxOpen && <Lightbox images={product.images} startIndex={activeImg} onClose={() => setLightboxOpen(false)} />}</AnimatePresence>
    </>
  );
};

// ─── Wishlist Drawer ──────────────────────────────────────────────────────
const WishlistDrawer = ({
  wishlist, onClose, onRemove, onSelect, onAddToCart,
}: {
  wishlist: Product[]; onClose: () => void;
  onRemove: (id: string) => void;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-end">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm cursor-pointer" />
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="relative w-full max-w-md h-full bg-brand-cream shadow-2xl flex flex-col">
      <div className="p-8 border-b border-brand-charcoal/5 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-rose-400" fill="currentColor" />
          <h2 className="serif text-2xl text-brand-charcoal">Wishlist ({wishlist.length})</h2>
        </div>
        <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-charcoal"><X size={24} strokeWidth={1} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} className="text-brand-charcoal/10 mx-auto mb-4" />
            <p className="serif text-xl text-brand-charcoal/40 italic">Nothing saved yet</p>
            <a href="#collections" onClick={onClose} className="text-[11px] uppercase tracking-widest text-brand-gold font-bold mt-4 inline-block hover:underline">Browse Collection</a>
          </div>
        ) : wishlist.map(product => (
          <div key={product.id} className="flex gap-4 bg-white p-4 group">
            <div className="w-20 h-24 overflow-hidden shrink-0 cursor-pointer" onClick={() => { onSelect(product); onClose(); }}>
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-brand-gold font-bold mb-0.5">{product.category}</p>
                <h3 className="serif text-base text-brand-charcoal leading-tight cursor-pointer hover:text-brand-olive transition-colors" onClick={() => { onSelect(product); onClose(); }}>{product.name}</h3>
                <p className="text-sm font-bold text-brand-charcoal/70 mt-1">{product.price}</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => onAddToCart(product, product.variants.sizes[0], product.variants.colors[0].name)}
                  disabled={product.stock === 0}
                  className={cn("flex-1 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1", product.stock === 0 ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-brand-charcoal text-white hover:bg-brand-olive")}
                >
                  <ShoppingBag size={10} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
                <button onClick={() => onRemove(product.id)} className="text-[9px] text-red-400 hover:text-red-600 uppercase tracking-widest px-2">Remove</button>
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
        <div className="flex items-center gap-3 mb-10">
          <Clock size={16} className="text-brand-gold" />
          <h2 className="serif text-2xl text-brand-charcoal">Recently <span className="italic text-brand-olive">Viewed</span></h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
          {items.map(product => (
            <div key={product.id} className="shrink-0 w-44 cursor-pointer group" onClick={() => onSelect(product)}>
              <div className="aspect-[3/4] overflow-hidden bg-brand-sand mb-3">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
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

// ─── Product Catalog (with search + filters) ──────────────────────────────
type SortType = 'default' | 'low-high' | 'high-low';
type PriceFilter = 'all' | 'under30' | '30to60' | 'over60';

const ProductCatalog = ({
  onSelect, wishlist, onToggleWishlist,
}: {
  onSelect: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) => {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('default');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Listen for navbar search events
  useEffect(() => {
    const h = (e: Event) => {
      const val = (e as CustomEvent).detail as string;
      setSearch(val);
      searchRef.current?.focus();
    };
    window.addEventListener('shakya-search', h);
    return () => window.removeEventListener('shakya-search', h);
  }, []);

  const priceNum = (p: Product) => parseFloat(p.price.replace('$', ''));

  let filtered = PRODUCTS
    .filter(p => cat === 'All' || p.category === cat)
    .filter(p => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    })
    .filter(p => {
      if (priceFilter === 'all') return true;
      const price = priceNum(p);
      if (priceFilter === 'under30') return price < 30;
      if (priceFilter === '30to60') return price >= 30 && price <= 60;
      return price > 60;
    });

  if (sort === 'low-high') filtered = [...filtered].sort((a, b) => priceNum(a) - priceNum(b));
  if (sort === 'high-low') filtered = [...filtered].sort((a, b) => priceNum(b) - priceNum(a));

  const activeFilters = (search ? 1 : 0) + (priceFilter !== 'all' ? 1 : 0) + (sort !== 'default' ? 1 : 0) + (cat !== 'All' ? 1 : 0);

  return (
    <section id="collections" className="py-32 px-6 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Curated Pieces</p>
          <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-0">The <span className="italic text-brand-olive">Signature</span> Collection</h2>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-3 text-sm border border-brand-charcoal/15 bg-white focus:outline-none focus:border-brand-charcoal transition-colors"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-charcoal"><X size={14} /></button>}
          </div>
          <button onClick={() => setFiltersOpen(v => !v)} className={cn("flex items-center gap-2 px-5 py-3 border text-[11px] font-bold uppercase tracking-widest transition-all", filtersOpen || activeFilters > 0 ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-charcoal")}>
            <SlidersHorizontal size={14} /> Filters {activeFilters > 0 && <span className="bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="bg-white border border-brand-charcoal/10 p-6 flex flex-col sm:flex-row gap-8">
                {/* Price */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-3">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {([['all','All'],['under30','Under $30'],['30to60','$30–$60'],['over60','$60+']] as [PriceFilter, string][]).map(([val, label]) => (
                      <button key={val} onClick={() => setPriceFilter(val)} className={cn("px-3 py-1.5 text-[10px] font-bold tracking-widest border transition-all", priceFilter === val ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{label}</button>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/50 mb-3 flex items-center gap-1"><ArrowUpDown size={11} /> Sort By</p>
                  <div className="flex flex-wrap gap-2">
                    {([['default','Default'],['low-high','Price: Low → High'],['high-low','Price: High → Low']] as [SortType, string][]).map(([val, label]) => (
                      <button key={val} onClick={() => setSort(val)} className={cn("px-3 py-1.5 text-[10px] font-bold tracking-widest border transition-all", sort === val ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{label}</button>
                    ))}
                  </div>
                </div>
                {/* Reset */}
                {activeFilters > 0 && (
                  <button onClick={() => { setSearch(''); setPriceFilter('all'); setSort('default'); setCat('All'); }} className="self-end text-[10px] text-red-400 hover:text-red-600 uppercase tracking-widest font-bold ml-auto">Clear All</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all border", cat === c ? "border-brand-charcoal bg-brand-charcoal text-white" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{c}</button>
          ))}
        </div>

        {/* Results count */}
        {(search || priceFilter !== 'all') && (
          <p className="text-sm text-brand-charcoal/50 mb-8">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found{search ? ` for "${search}"` : ''}</p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Search size={40} className="text-brand-charcoal/10 mx-auto mb-4" />
            <p className="serif text-2xl text-brand-charcoal/40 italic mb-2">No products found</p>
            <p className="text-sm text-brand-charcoal/30">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setPriceFilter('all'); setSort('default'); setCat('All'); }} className="mt-6 text-[11px] uppercase tracking-widest text-brand-gold font-bold hover:underline">Clear filters</button>
          </div>
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
                    {/* Wishlist button */}
                    <button
                      onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
                      className={cn("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md", wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 text-brand-charcoal/50 hover:text-rose-400 opacity-0 group-hover:opacity-100")}
                    >
                      <Heart size={14} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {/* Color dots */}
                    <div className="absolute bottom-16 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {product.variants.colors.slice(0, 4).map(c => <span key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-white/80 shadow-sm" style={{ backgroundColor: c.hex }} />)}
                    </div>
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
                <div>
                  <h3 className="serif text-base text-brand-charcoal leading-tight">{item.product.name}</h3>
                  <p className="text-[10px] text-brand-charcoal/50 mt-0.5">{item.selectedSize} · {item.selectedColor}</p>
                </div>
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
            <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest mb-6">Taxes & international shipping at checkout</p>
            <button className="w-full bg-brand-charcoal text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-olive transition-colors flex items-center justify-center gap-2">Secure Checkout <ShieldCheck size={14} /></button>
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

  // Open product + track recently viewed
  const openProduct = useCallback((p: Product) => {
    setSelectedProduct(p);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(r => r.id !== p.id);
      return [p, ...filtered].slice(0, 8);
    });
  }, []);

  const addToCart = useCallback((p: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === p.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) return prev.map(i => i.product.id === p.id && i.selectedSize === size && i.selectedColor === color ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

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
        <Navbar
          onOpenCart={() => setCartOpen(true)} cartCount={cart.reduce((s, i) => s + i.qty, 0)}
          onOpenWishlist={() => setWishlistOpen(true)} wishlistCount={wishlist.length}
        />
      </div>

      <main>
        <Hero /><HeritageSection />
        <ProductCatalog onSelect={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
        <RecentlyViewed items={recentlyViewed} onSelect={openProduct} />
        <LookbookSection /><ProcessSection /><CustomSection /><TestimonialsSection /><FAQSection /><ContactSection />
      </main>
      <Footer />
      <FloatingButtons />

      <AnimatePresence>{cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />}</AnimatePresence>
      <AnimatePresence>{wishlistOpen && <WishlistDrawer wishlist={wishlistProducts} onClose={() => setWishlistOpen(false)} onRemove={toggleWishlist} onSelect={openProduct} onAddToCart={addToCart} />}</AnimatePresence>
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart}
            isWishlisted={wishlist.includes(selectedProduct.id)} onToggleWishlist={toggleWishlist}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
