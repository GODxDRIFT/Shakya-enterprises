import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Globe, ShieldCheck, MessageCircle, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import { PRODUCTS, CATEGORIES, type Product, type CartItem } from './data';
import { AnnouncementBar, Navbar } from './Navbar';
import { Hero, HeritageSection, ProcessSection, CustomSection, LookbookSection, TestimonialsSection, FAQSection, ContactSection, Footer } from './Sections';

// --- Product Detail Modal ---
const ProductModal = ({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (p: Product) => void }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc'|'materials'|'care'>('desc');
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm cursor-pointer" />
      <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:80, opacity:0 }} transition={{ type:'spring', damping:28 }} className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 shadow-2xl rounded-t-3xl sm:rounded-2xl">
        <div className="aspect-square sm:aspect-auto overflow-hidden bg-brand-sand"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div>
        <div className="p-8 flex flex-col">
          <button onClick={onClose} className="self-end text-brand-charcoal/40 hover:text-brand-charcoal mb-4"><X size={20} /></button>
          <p className="text-[9px] uppercase tracking-[0.25em] text-brand-gold font-bold mb-2">{product.category}</p>
          <h2 className="serif text-2xl text-brand-charcoal mb-1">{product.name}</h2>
          <p className="font-bold text-xl text-brand-olive mb-6">{product.price} <span className="text-sm text-brand-charcoal/40 font-normal">/ {product.priceINR}</span></p>
          <div className="flex gap-4 border-b border-brand-charcoal/10 mb-4">
            {(['desc','materials','care'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={cn("text-[10px] uppercase tracking-widest font-bold pb-3 border-b-2 transition-colors", tab===t ? "border-brand-olive text-brand-charcoal" : "border-transparent text-brand-charcoal/40")}>{t==='desc'?'Details':t}</button>
            ))}
          </div>
          <div className="text-sm text-brand-charcoal/70 leading-relaxed mb-6 flex-1">
            {tab==='desc' && <ul className="space-y-2">{product.details.map((d,i) => <li key={i} className="flex gap-2"><span className="text-brand-gold">•</span>{d}</li>)}</ul>}
            {tab==='materials' && <p>{product.materials}</p>}
            {tab==='care' && <p>{product.care}</p>}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-brand-charcoal/20">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg">−</button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 text-brand-charcoal text-lg">+</button>
            </div>
            <button onClick={() => { onAdd(product); onClose(); }} className="flex-1 bg-brand-charcoal text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-brand-olive transition-colors flex items-center justify-center gap-2"><ShoppingBag size={14} /> Add to Bag</button>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-brand-charcoal/40 uppercase tracking-widest"><Globe size={11} />Ships worldwide from Jaipur</div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Product Catalog ---
const ProductCatalog = ({ onSelect }: { onSelect: (p: Product) => void }) => {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  return (
    <section id="collections" className="py-32 px-6 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Curated Pieces</p>
          <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-12">The <span className="italic text-brand-olive">Signature</span> Collection</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={cn("px-5 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all border", cat===c ? "border-brand-charcoal bg-brand-charcoal text-white" : "border-brand-charcoal/20 text-brand-charcoal/60 hover:border-brand-charcoal")}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filtered.map(product => (
              <motion.div layout key={product.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} className="group cursor-pointer" onClick={() => onSelect(product)}>
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-white">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button className="w-full bg-white/90 backdrop-blur-md text-brand-charcoal py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-colors flex items-center justify-center gap-2"><ShoppingBag size={14} />Quick View</button>
                  </div>
                </div>
                <div className="text-center px-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold mb-2">{product.category}</p>
                  <h3 className="serif text-xl text-brand-charcoal mb-2">{product.name}</h3>
                  <p className="text-sm text-brand-charcoal/80 font-medium">{product.price} <span className="text-brand-charcoal/40">/ {product.priceINR}</span></p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// --- Cart Drawer ---
const CartDrawer = ({ items, onClose, onRemove }: { items: CartItem[]; onClose: () => void; onRemove: (id: string) => void }) => {
  const total = items.reduce((s, i) => s + parseFloat(i.product.price.replace('$','')) * i.qty, 0);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm cursor-pointer" />
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'tween', duration:0.4 }} className="relative w-full max-w-md h-full bg-brand-cream shadow-2xl flex flex-col">
        <div className="p-8 border-b border-brand-charcoal/5 flex items-center justify-between bg-white">
          <h2 className="serif text-2xl text-brand-charcoal">Your Bag ({items.reduce((s,i) => s+i.qty, 0)})</h2>
          <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-charcoal"><X size={24} strokeWidth={1} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-20"><p className="serif text-xl text-brand-charcoal/40 italic">Your bag is empty</p><a href="#collections" onClick={onClose} className="text-[11px] uppercase tracking-widest text-brand-gold font-bold mt-4 inline-block hover:underline">Continue Shopping</a></div>
          ) : items.map(item => (
            <div key={item.product.id} className="flex gap-6 group">
              <div className="w-24 h-32 bg-white overflow-hidden shrink-0"><img src={item.product.image} className="w-full h-full object-cover" /></div>
              <div className="flex-1 flex flex-col justify-between">
                <div><h3 className="serif text-lg text-brand-charcoal mb-1 leading-tight">{item.product.name}</h3><p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50">{item.product.category}</p></div>
                <div className="flex justify-between items-end"><p className="text-xs text-brand-charcoal/60">Qty: {item.qty}</p><div className="flex items-center gap-3"><p className="font-bold text-sm">{item.product.price}</p><button onClick={() => onRemove(item.product.id)} className="text-[10px] text-red-400 hover:text-red-600 uppercase tracking-widest">Remove</button></div></div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-brand-charcoal/5">
            <div className="flex justify-between items-center mb-4"><span className="text-[10px] uppercase tracking-widest text-brand-charcoal/60 font-bold">Subtotal</span><span className="serif text-2xl text-brand-charcoal">${total.toFixed(2)}</span></div>
            <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest mb-6">Taxes & international shipping at checkout</p>
            <button className="w-full bg-brand-charcoal text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-olive transition-colors flex items-center justify-center gap-2">Secure Checkout <ShieldCheck size={14} /></button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- Floating Buttons (WhatsApp + Back to Top) ---
const FloatingButtons = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <>
      <a href="https://wa.me/919876543210?text=Hi%20Shakya%20Enterprises!" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-[90] w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors hover:scale-110 transform"><MessageCircle size={26} /></a>
      {show && <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} className="fixed bottom-6 right-6 z-[90] w-12 h-12 bg-brand-charcoal text-white rounded-full flex items-center justify-center shadow-xl hover:bg-brand-olive transition-colors"><ChevronUp size={20} /></button>}
    </>
  );
};

// --- Main App ---
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === p.id);
      if (existing) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));

  return (
    <div className="relative min-h-screen">
      <AnnouncementBar />
      <Navbar onOpenCart={() => setCartOpen(true)} cartCount={cart.reduce((s,i) => s+i.qty, 0)} />
      <main>
        <Hero />
        <HeritageSection />
        <ProductCatalog onSelect={setSelectedProduct} />
        <LookbookSection />
        <ProcessSection />
        <CustomSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
      <AnimatePresence>{cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />}</AnimatePresence>
      <AnimatePresence>{selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}</AnimatePresence>
    </div>
  );
}
