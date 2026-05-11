import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Search, ChevronDown, Instagram, Facebook, Heart, Package, LayoutDashboard, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';

export const AnnouncementBar = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2.5 px-4 flex items-center justify-center gap-6 relative">
    <span>🌍 Free Shipping on Orders Above $200</span>
    <span className="hidden sm:inline text-white/40">|</span>
    <span className="hidden sm:inline">✨ New Monsoon Collection Live</span>
    <button onClick={onClose} className="absolute right-4 text-white/50 hover:text-white transition-colors"><X size={12} /></button>
  </div>
);

export const Navbar = ({
  onOpenCart, cartCount, onOpenWishlist, wishlistCount,
  onOpenOrders, ordersCount, onOpenAdmin, onOpenAuth, onOpenDashboard,
}: {
  onOpenCart: () => void; cartCount: number;
  onOpenWishlist: () => void; wishlistCount: number;
  onOpenOrders: () => void; ordersCount: number;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}) => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const sRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { if (searchOpen) sRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('shakya-search', { detail: searchVal.trim() }));
      setSearchOpen(false); setSearchVal('');
    }
    if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
  };

  const c = scrolled ? 'text-brand-charcoal' : 'text-white';

  return (
    <nav className={cn("transition-all duration-500 px-6 py-4 flex items-center justify-between", scrolled ? "bg-white/95 backdrop-blur-xl border-b border-brand-charcoal/5 shadow-sm py-3" : "bg-gradient-to-b from-black/60 to-transparent")}>
      <div className="flex items-center gap-6">
        <button onClick={() => setMobileOpen(true)} className={cn("lg:hidden", c)}><Menu size={24} /></button>
        <div className={cn("hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase", c)}>
          {[['#collections','Collections'],['#heritage','Heritage'],['#custom-made','Custom Orders'],['#faq','FAQ'],['#contact','Contact']].map(([h,l]) => (
            <a key={h} href={h} className="hover:text-brand-gold transition-colors">{l}</a>
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className={cn("serif text-2xl sm:text-3xl font-bold tracking-widest uppercase transition-colors duration-500", scrolled ? "text-brand-olive" : "text-white")}>SHAKYA</h1>
        <span className={cn("block text-[9px] tracking-[0.4em] uppercase transition-colors duration-500", scrolled ? "text-brand-charcoal/60" : "text-white/80")}>Enterprises</span>
      </div>

      <div className={cn("flex items-center gap-4", c)}>
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ width:0, opacity:0 }} animate={{ width:160, opacity:1 }} exit={{ width:0, opacity:0 }} className="overflow-hidden">
              <input ref={sRef} value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={handleSearch} placeholder="Search & press Enter" className={cn("text-[11px] w-full bg-transparent border-b outline-none pb-1", scrolled ? "border-brand-charcoal/30" : "border-white/40 placeholder:text-white/50")} />
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setSearchOpen(p => !p)} className="hover:text-brand-gold transition-colors"><Search size={18} strokeWidth={1.5} /></button>

        <button onClick={onOpenWishlist} className="relative hover:text-brand-gold transition-colors">
          <Heart size={20} strokeWidth={1.5} />
          {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
        </button>

        <button onClick={onOpenOrders} className="relative hover:text-brand-gold transition-colors hidden sm:block" title="My Orders">
          <Package size={20} strokeWidth={1.5} />
          {ordersCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{ordersCount}</span>}
        </button>

        {/* User account / login button */}
        <button
          onClick={user ? onOpenDashboard : onOpenAuth}
          title={user ? `My Account (${user.email})` : 'Sign In'}
          className={cn("relative hover:text-brand-gold transition-colors", user ? "text-brand-gold" : "")}
        >
          <User size={20} strokeWidth={1.5} />
          {user && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
        </button>

        {/* Admin — subtle */}
        <button onClick={onOpenAdmin} title="Admin" className={cn("transition-colors hover:text-brand-gold", scrolled ? "opacity-20 hover:opacity-100" : "opacity-0 pointer-events-none")}>
          <LayoutDashboard size={16} strokeWidth={1.5} />
        </button>

        <div className="hidden sm:flex items-center gap-1 group cursor-pointer relative">
          <span className="text-[11px] font-bold tracking-widest">{currency}</span><ChevronDown size={11} />
          <div className="absolute top-full right-0 mt-4 bg-white text-brand-charcoal shadow-xl rounded-lg py-2 w-24 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button onClick={() => setCurrency('USD')} className="w-full text-left px-4 py-2 text-[11px] font-bold hover:text-brand-gold">USD ($)</button>
            <button onClick={() => setCurrency('INR')} className="w-full text-left px-4 py-2 text-[11px] font-bold hover:text-brand-gold">INR (₹)</button>
          </div>
        </div>

        <button onClick={onOpenCart} className="relative hover:text-brand-gold transition-colors">
          <ShoppingBag size={22} strokeWidth={1.5} />
          {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0, x:'-100%' }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:'-100%' }} transition={{ type:'tween', duration:0.4 }} className="fixed inset-0 bg-brand-cream z-50 flex flex-col p-8">
            <button onClick={() => setMobileOpen(false)} className="self-end mb-12 text-brand-charcoal"><X size={32} strokeWidth={1} /></button>
            <div className="flex flex-col gap-8 text-4xl serif lowercase italic text-brand-olive">
              {[['#collections','collections'],['#heritage','heritage'],['#custom-made','custom orders'],['#faq','faq'],['#contact','contact']].map(([h,l]) => (
                <a key={h} href={h} onClick={() => setMobileOpen(false)} className="hover:text-brand-gold transition-colors">{l}</a>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => { onOpenWishlist(); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-brand-charcoal/60 font-bold uppercase tracking-widest"><Heart size={16}/> Wishlist</button>
              <button onClick={() => { onOpenOrders(); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-brand-charcoal/60 font-bold uppercase tracking-widest"><Package size={16}/> Orders</button>
              <button onClick={() => { user ? onOpenDashboard() : onOpenAuth(); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-brand-charcoal/60 font-bold uppercase tracking-widest">
                <User size={16}/> {user ? 'My Account' : 'Sign In'}
              </button>
            </div>
            <div className="mt-auto pt-12 border-t border-brand-charcoal/10 flex gap-6 text-brand-charcoal">
              <Instagram size={24} strokeWidth={1} className="hover:text-brand-gold cursor-pointer" />
              <Facebook size={24} strokeWidth={1} className="hover:text-brand-gold cursor-pointer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};