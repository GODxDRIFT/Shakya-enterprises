import { motion } from 'motion/react';
import { ArrowRight, Star, Globe, ShieldCheck, Truck, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { cn } from './lib/utils';
import { useState } from 'react';
import { TESTIMONIALS, FAQ_ITEMS, LOOKBOOK_IMAGES } from './data';

export const Hero = () => (
  <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-charcoal">
    <div className="absolute inset-0 z-0">
      <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 15 }} src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=2000" alt="Luxury Home Furnishing" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-80" />
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mt-20">
      <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} className="text-brand-gold uppercase tracking-[0.5em] text-[10px] sm:text-xs mb-8 font-bold">Authentic Jaipuri Craftsmanship</motion.p>
      <motion.h2 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }} className="serif text-5xl sm:text-7xl lg:text-9xl text-white leading-[1.1] mb-10">
        <span className="italic font-light">Elevate</span> Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-sand to-brand-gold">Sanctuary</span>
      </motion.h2>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}>
        <a href="#collections" className="group inline-flex items-center gap-3 bg-brand-gold text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-brand-charcoal transition-all">Explore Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></a>
      </motion.div>
    </div>
    <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.5, repeat:Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2">
      <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Discover</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
    </motion.div>
  </section>
);

export const HeritageSection = () => (
  <section id="heritage" className="py-32 px-6 md:px-12 bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:1 }}>
        <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-4"><span className="w-8 h-[1px] bg-brand-gold" />Our Story</p>
        <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-8 leading-tight">From Jaipur to the <span className="italic text-brand-olive">World</span></h2>
        <p className="text-brand-charcoal/70 text-base leading-relaxed mb-8">Shakya Enterprises was born from a profound respect for India's rich textile heritage. For generations, the artisans of Rajasthan have perfected the art of hand-block printing, weaving narratives into every thread.</p>
        <p className="text-brand-charcoal/70 text-base leading-relaxed mb-10">Today, we bridge the gap between traditional Indian craftsmanship and global modern luxury. Our pieces are heirloom artifacts designed for the contemporary international home.</p>
        <div className="grid grid-cols-2 gap-8 border-t border-brand-charcoal/10 pt-10">
          <div><h4 className="serif text-3xl text-brand-olive mb-2">100%</h4><p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-bold">Artisanal Cotton</p></div>
          <div><h4 className="serif text-3xl text-brand-olive mb-2">150+</h4><p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-bold">Countries Shipped</p></div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} className="relative">
        <div className="aspect-[4/5] overflow-hidden bg-brand-sand"><img src="https://thelabelhome.com/cdn/shop/files/E838AEB1-50F3-4F7A-8089-989F4E693B3B.jpg?v=1757519228&width=1100" alt="Craftsmanship" className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-olive p-8 flex items-center justify-center shadow-2xl"><p className="serif text-white italic text-xl text-center leading-relaxed">"Preserving art, one thread at a time."</p></div>
      </motion.div>
    </div>
  </section>
);

export const ProcessSection = () => (
  <section className="py-32 px-6 md:px-12 bg-brand-charcoal text-white overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
        <motion.img initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} src="https://floridadecor.in/cdn/shop/files/MILANTHREEPCSBEDCOVER_page-0003.jpg?v=1708604674&width=720" alt="Block Printing" className="w-full aspect-square object-cover" />
        <motion.img initial={{ opacity:0, y:100 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }} src="https://www.karmadori.com/cdn/shop/files/TC2a_02d66076-27bb-4c91-b3c9-7077b52fede9.jpg?v=1748605427&width=1200" alt="Dyeing" className="w-full aspect-[3/4] object-cover -translate-y-12" />
      </div>
      <div className="order-1 lg:order-2">
        <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6">The Artisans' Touch</p>
        <h2 className="serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">Crafted with <br /><span className="italic text-white/50">Precision</span> & Time</h2>
        <p className="text-white/70 text-base leading-relaxed mb-10">True luxury lies in the details. Each product undergoes a meticulous multi-step process — from carving wooden blocks to final sun-drying, it takes weeks to create a single masterpiece.</p>
        <div className="space-y-6">
          {[{t:'Sustainably Sourced',d:'100% natural dyes and premium cotton.'},{t:'Master Block Printers',d:'Artisans with 20+ years of experience.'},{t:'Ethical Practices',d:'Fair trade certified and eco-conscious.'}].map((item,i) => (
            <div key={i} className="flex gap-4 border-l border-white/20 pl-6"><div><h4 className="font-bold text-sm mb-1 uppercase tracking-wider">{item.t}</h4><p className="text-xs text-white/50">{item.d}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const CustomSection = () => (
  <section id="custom-made" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
      <div className="md:w-1/2 relative z-10">
        <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-4"><span className="w-8 h-[1px] bg-brand-gold" />Bespoke Service</p>
        <h2 className="serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-8 leading-tight">Tailored for <span className="italic text-brand-olive">You</span></h2>
        <p className="text-brand-charcoal/70 text-base leading-relaxed mb-8">Custom dimensions for a king-size bed in New York, a specific colour palette for a boutique hotel in Paris, or bulk corporate gifting — our bespoke team brings your vision to life.</p>
        <button className="bg-brand-charcoal text-white px-10 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-olive transition-colors flex items-center gap-4 group">Request a Consultation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
      </div>
      <div className="md:w-1/2 relative">
        <div className="aspect-[4/3] bg-brand-sand overflow-hidden"><img src="https://images.unsplash.com/photo-1620332372374-f108c53d2e03?auto=format&fit=crop&q=80&w=1000" alt="Custom Tailoring" className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div>
      </div>
    </div>
  </section>
);

export const LookbookSection = () => (
  <section className="py-20 px-6 md:px-12 bg-brand-sand overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div><p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Visual Diary</p><h2 className="serif text-4xl md:text-5xl text-brand-charcoal">The <span className="italic text-brand-olive">Lookbook</span></h2></div>
        <a href="#collections" className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors group">Shop All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {LOOKBOOK_IMAGES.map((img, i) => (
          <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className={cn("group relative overflow-hidden cursor-pointer", i===0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square")}>
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/40 transition-colors duration-500 flex items-end p-4"><p className="text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">{img.caption}</p></div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export const TestimonialsSection = () => (
  <section className="py-24 px-6 md:px-12 bg-brand-cream border-t border-brand-charcoal/5">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16"><h2 className="serif text-3xl md:text-4xl text-brand-charcoal mb-4">Loved <span className="italic text-brand-olive">Globally</span></h2><div className="flex justify-center gap-1 text-brand-gold">{[...Array(5)].map((_,i) => <Star key={i} size={16} fill="currentColor" />)}</div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="bg-white p-8 border border-brand-charcoal/5 hover:border-brand-gold/30 transition-colors">
            <p className="text-brand-charcoal/80 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
            <p className="font-bold text-sm uppercase tracking-wider text-brand-charcoal">{t.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-olive mt-1">{t.location}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-32 px-6 md:px-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16"><p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Support</p><h2 className="serif text-4xl md:text-5xl text-brand-charcoal">Frequently Asked <span className="italic text-brand-olive">Questions</span></h2></div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-brand-charcoal/10 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-6 text-left hover:bg-brand-cream/50 transition-colors">
                <span className="font-bold text-sm text-brand-charcoal pr-4">{item.q}</span>
                <span className={cn("text-brand-gold transition-transform shrink-0", open === i && "rotate-45")}>+</span>
              </button>
              {open === i && <motion.div initial={{ height:0 }} animate={{ height:'auto' }} className="overflow-hidden"><p className="px-6 pb-6 text-sm text-brand-charcoal/70 leading-relaxed">{item.a}</p></motion.div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact-form" className="py-32 px-6 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-4"><span className="w-8 h-[1px] bg-brand-gold" />Get in Touch</p>
          <h2 className="serif text-4xl md:text-5xl text-brand-charcoal mb-8 leading-tight">Let's Start a <span className="italic text-brand-olive">Conversation</span></h2>
          <p className="text-brand-charcoal/70 mb-10">Whether you're looking for custom orders, bulk pricing, or simply want to know more about our collections — we'd love to hear from you.</p>
          <div className="space-y-6 text-sm text-brand-charcoal/80">
            <div className="flex items-center gap-3"><MapPin size={16} className="text-brand-gold" /><span>Vikas Nagar, New Delhi, India 110059</span></div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-brand-gold" /><span>+91 87505 90574</span></div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-brand-gold" /><span>Lalshakya27@gmail.com</span></div>
          </div>
        </div>
        <div className="bg-white p-8 md:p-12 border border-brand-charcoal/5">
          {sent ? (
            <div className="text-center py-16"><p className="serif text-3xl text-brand-olive mb-4">Thank You!</p><p className="text-brand-charcoal/70">We'll get back to you within 24 hours.</p></div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 block mb-2">Name</label><input required className="w-full border-b border-brand-charcoal/20 pb-3 bg-transparent text-sm focus:outline-none focus:border-brand-olive transition-colors" /></div>
                <div><label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 block mb-2">Email</label><input type="email" required className="w-full border-b border-brand-charcoal/20 pb-3 bg-transparent text-sm focus:outline-none focus:border-brand-olive transition-colors" /></div>
              </div>
              <div><label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 block mb-2">Subject</label>
                <select className="w-full border-b border-brand-charcoal/20 pb-3 bg-transparent text-sm focus:outline-none focus:border-brand-olive">
                  <option>General Inquiry</option><option>Custom Order</option><option>Bulk / Wholesale</option><option>Shipping Question</option><option>Returns</option>
                </select>
              </div>
              <div><label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 block mb-2">Message</label><textarea rows={4} required className="w-full border-b border-brand-charcoal/20 pb-3 bg-transparent text-sm focus:outline-none focus:border-brand-olive transition-colors resize-none" /></div>
              <button type="submit" className="w-full bg-brand-charcoal text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-olive transition-colors flex items-center justify-center gap-2 group">Send Message <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer id="contact" className="bg-brand-charcoal text-white pt-24 pb-12 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 pb-16 mb-16">
        <div className="flex items-center gap-4"><Globe className="text-brand-gold" size={32} strokeWidth={1} /><div><h4 className="text-xs uppercase tracking-widest font-bold mb-1">Global Delivery</h4><p className="text-xs text-white/50">Express shipping to 150+ countries</p></div></div>
        <div className="flex items-center gap-4"><ShieldCheck className="text-brand-gold" size={32} strokeWidth={1} /><div><h4 className="text-xs uppercase tracking-widest font-bold mb-1">Secure Checkout</h4><p className="text-xs text-white/50">256-bit SSL encryption</p></div></div>
        <div className="flex items-center gap-4"><Truck className="text-brand-gold" size={32} strokeWidth={1} /><div><h4 className="text-xs uppercase tracking-widest font-bold mb-1">Easy Returns</h4><p className="text-xs text-white/50">14-day international return policy</p></div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div>
          <h3 className="serif text-3xl font-bold tracking-widest uppercase mb-2">SHAKYA</h3>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 mb-8">Enterprises</p>
          <p className="text-white/60 text-sm leading-relaxed mb-8">Redefining luxury living with authentic Indian craftsmanship.</p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-charcoal transition-all"><Instagram size={16} /></a>
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-charcoal transition-all"><Facebook size={16} /></a>
          </div>
        </div>
        <div><h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-brand-gold">Contact</h4>
          <ul className="space-y-6 text-sm text-white/80">
            <li className="flex items-start gap-3"><MapPin size={16} className="text-brand-gold shrink-0 mt-1" /><span>Vikas Nagar, New Delhi, India<br/>Pin: 110059</span></li>
            <li className="flex items-center gap-3"><Phone size={16} className="text-brand-gold shrink-0" /><span>+91 87505 90574</span></li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-brand-gold shrink-0" /><span>Lalshakya27@gmail.com</span></li>
          </ul>
        </div>
        <div><h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-brand-gold">Client Care</h4>
          <ul className="space-y-4 text-sm text-white/60">
            {['Track Order','Shipping & Returns','Care Instructions','FAQ','Privacy Policy'].map(l => <li key={l} className="hover:text-white transition-colors cursor-pointer">{l}</li>)}
          </ul>
        </div>
        <div><h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8 text-brand-gold">The Insider</h4>
          <p className="text-white/60 text-sm mb-6">Subscribe for exclusive access to new collections.</p>
          <div className="flex border-b border-white/30 pb-2">
            <input type="email" placeholder="Email Address" className="bg-transparent border-none focus:ring-0 text-sm px-0 w-full placeholder:text-white/30 outline-none" />
            <button className="text-[10px] uppercase tracking-widest font-bold hover:text-brand-gold transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-[9px] uppercase tracking-[0.2em] text-white/40">
        <p>&copy; {new Date().getFullYear()} SHAKYA ENTERPRISES. ALL RIGHTS RESERVED.</p>
        <span>Handcrafted in Jaipur, India</span>
      </div>
    </div>
  </footer>
);
