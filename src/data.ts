export interface Product {
  id: string; name: string; category: string; price: string; priceINR: string;
  image: string; description: string; details: string[]; materials: string; care: string;
}

export const PRODUCTS: Product[] = [
  { id:'1', name:'Jaipuri Hand-Block Rajai', category:'Rajai', price:'$85', priceINR:'₹6,999', image:'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800', description:'Traditional cotton filled quilt with intricate hand-block prints.', details:['Double-bed size 90×90 inch','Cotton fill 300 GSM','Reversible design'], materials:'100% cotton, natural dyes', care:'Dry clean or gentle machine wash cold' },
  { id:'2', name:'Soft Cotton Fitted Bedsheet', category:'Bedsheets', price:'$45', priceINR:'₹3,699', image:'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800', description:'400 thread-count long-staple cotton.', details:['400 thread count','Deep pocket 15 inch','6 sizes available'], materials:'100% Giza long-staple cotton', care:'Machine wash cold, tumble dry low' },
  { id:'3', name:'Quilted Cushion Cover Set', category:'Cushions', price:'$28', priceINR:'₹2,299', image:'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800', description:'Set of 5 quilted covers with velvet piping.', details:['Set of 5','16×16 inch standard','Hidden zip closure'], materials:'Cotton canvas with velvet piping', care:'Spot clean or dry clean' },
  { id:'4', name:'Ethnic Embroidered Shoulder Bag', category:'Bags', price:'$32', priceINR:'₹2,599', image:'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800', description:'Handcrafted bag with mirror work and embroidery.', details:['Internal zip pocket','Adjustable strap','14×10 inch'], materials:'Cotton canvas, mirror work, silk thread', care:'Wipe with damp cloth' },
  { id:'5', name:'Linen Table Runner', category:'Runners', price:'$24', priceINR:'₹1,999', image:'https://images.unsplash.com/photo-1603512803657-f9d6ea4e4122?auto=format&fit=crop&q=80&w=800', description:'Block-print runner for modern dining.', details:['14×72 inch','Block-print border','Heat resistant'], materials:'100% pure linen', care:'Machine wash delicate cycle' },
  { id:'6', name:'Jaipuri Cotton Dohar', category:'Home Furnishing', price:'$55', priceINR:'₹4,499', image:'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800', description:'Reversible lightweight summer AC quilt.', details:['Double-bed size','Lightweight 150 GSM','Perfect for AC rooms'], materials:'100% mulmul cotton, azo-free dyes', care:'Gentle machine wash, dry in shade' },
  { id:'7', name:'Block-Print King Duvet Cover', category:'Bedsheets', price:'$68', priceINR:'₹5,599', image:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800', description:'King-size duvet cover in signature Jaipuri print.', details:['King size 104×90 inch','Button closure','Pillowcases included'], materials:'200TC percale cotton', care:'Machine wash 30°C' },
  { id:'8', name:'Rajasthani Wall Tapestry', category:'Home Furnishing', price:'$72', priceINR:'₹5,899', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800', description:'Statement tapestry with hand-stitched motifs.', details:['60×90 inch display','Hanging rod included','Unique numbered piece'], materials:'Cotton canvas, natural dye pigments', care:'Dry clean or hand wash cold' },
  { id:'9', name:'Kantha Stitch Bedroom Cushion', category:'Cushions', price:'$35', priceINR:'₹2,899', image:'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800', description:'Luxury cushion with kantha embroidery.', details:['18×18 inch with insert','Kantha stitch embroidery','Invisible zip'], materials:'Velvet front, cotton back, polyester fill', care:'Spot clean only' },
];

export const CATEGORIES = ['All', 'Bedsheets', 'Rajai', 'Cushions', 'Bags', 'Runners', 'Home Furnishing'];

export const TESTIMONIALS = [
  { id:1, name:'Sarah Jenkins', location:'London, UK', rating:5, text:'The quality of the Jaipuri Rajai is unmatched. It feels incredibly premium and adds a touch of authentic luxury to my bedroom.' },
  { id:2, name:'Rahul Sharma', location:'Mumbai, India', rating:5, text:'Stunning craftsmanship. The bedsheets are softer than anything I have bought from high-end international stores.' },
  { id:3, name:'Emma Clarke', location:'New York, USA', rating:5, text:'Beautiful packaging and fast international shipping. The custom table runner fits my dining table perfectly.' },
  { id:4, name:'Priya Mehta', location:'Dubai, UAE', rating:5, text:'Ordered bulk cushion covers for our boutique hotel. The quality and consistency across all pieces was remarkable.' },
];

export const FAQ_ITEMS = [
  { q:'Do you ship internationally?', a:'Yes! We ship to 150+ countries via DHL, FedEx and India Post. International orders typically arrive in 7–14 business days with full tracking.' },
  { q:'Are your products made from natural materials?', a:'Absolutely. We use 100% long-staple cotton, natural dyes derived from plants and minerals, and traditional wooden blocks carved by master craftsmen in Jaipur.' },
  { q:'Can I place a custom bulk order?', a:'Yes, we specialise in bulk and custom orders for hotels, boutiques, and corporate gifting worldwide. Contact us for a personalised quote.' },
  { q:'What is your return policy?', a:'We offer a 14-day return window for international orders and 7 days for domestic. Items must be unused and in original packaging.' },
  { q:'Do you accept INR payments?', a:'Yes! Indian customers can pay in INR via UPI, Net Banking, Debit/Credit Cards. International customers are billed in USD.' },
  { q:'How long for a custom order?', a:'Custom orders typically take 10–15 business days for production, plus shipping time. We keep you updated at every stage.' },
];

export const LOOKBOOK_IMAGES = [
  { src:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', caption:'The Heritage Suite' },
  { src:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800', caption:'Morning Light' },
  { src:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800', caption:'The Linen Edit' },
  { src:'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800', caption:'Dohar Dreams' },
  { src:'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800', caption:'Block Print Heritage' },
];

export interface CartItem { product: Product; qty: number; }
