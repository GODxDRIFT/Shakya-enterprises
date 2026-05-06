export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariants {
  sizes: string[];
  colors: ProductColor[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceINR: string;
  image: string;
  images: string[];
  description: string;
  details: string[];
  materials: string;
  care: string;
  variants: ProductVariants;
  stock: number;
}

export interface CartItem {
  product: Product;
  qty: number;
  selectedSize: string;
  selectedColor: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jaipuri Hand-Block Rajai',
    category: 'Rajai',
    price: '$85',
    priceINR: '₹6,999',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Traditional cotton filled quilt with intricate hand-block prints.',
    details: ['Size as per selected option', 'Cotton fill 300 GSM', 'Reversible design', 'Azo-free natural dyes'],
    materials: '100% cotton, natural dyes',
    care: 'Dry clean or gentle machine wash cold',
    variants: {
      sizes: ['Single (60×90")', 'Double (90×90")', 'King (108×90")'],
      colors: [
        { name: 'Indigo Blue', hex: '#3B5BA5' },
        { name: 'Rust Red', hex: '#B5451B' },
        { name: 'Forest Green', hex: '#2D6A4F' },
        { name: 'Saffron', hex: '#D4A017' },
      ],
    },
    stock: 18,
  },
  {
    id: '2',
    name: 'Soft Cotton Fitted Bedsheet',
    category: 'Bedsheets',
    price: '$45',
    priceINR: '₹3,699',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
    ],
    description: '400 thread-count long-staple cotton.',
    details: ['400 thread count', 'Deep pocket 15 inch', '6 sizes available'],
    materials: '100% Giza long-staple cotton',
    care: 'Machine wash cold, tumble dry low',
    variants: {
      sizes: ['Single', 'Double', 'Queen', 'King', 'Super King'],
      colors: [
        { name: 'Ivory White', hex: '#F5F0E8' },
        { name: 'Sage Grey', hex: '#8A9BA8' },
        { name: 'Blush Pink', hex: '#D4A5A5' },
        { name: 'Midnight', hex: '#1A1A2E' },
      ],
    },
    stock: 3,
  },
  {
    id: '3',
    name: 'Quilted Cushion Cover Set',
    category: 'Cushions',
    price: '$28',
    priceINR: '₹2,299',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Set of 5 quilted covers with velvet piping.',
    details: ['Set of 5', '16×16 inch standard', 'Hidden zip closure'],
    materials: 'Cotton canvas with velvet piping',
    care: 'Spot clean or dry clean',
    variants: {
      sizes: ['16×16"', '18×18"', '20×20"'],
      colors: [
        { name: 'Terracotta', hex: '#C0622A' },
        { name: 'Olive', hex: '#3A3A28' },
        { name: 'Dusty Rose', hex: '#C9A0A0' },
        { name: 'Teal', hex: '#2A7A7A' },
      ],
    },
    stock: 0,
  },
  {
    id: '4',
    name: 'Ethnic Embroidered Shoulder Bag',
    category: 'Bags',
    price: '$32',
    priceINR: '₹2,599',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTq4xmyhVYjxBrcSUxUhbwmxzmOTrtgOzWDJUt6d30U4O9OC_tFa6Wly-wbxGpPnW9U8GETac9RcZ4x66xmGg-QRMW88zL7',
    images: [
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTq4xmyhVYjxBrcSUxUhbwmxzmOTrtgOzWDJUt6d30U4O9OC_tFa6Wly-wbxGpPnW9U8GETac9RcZ4x66xmGg-QRMW88zL7',
      
    ],
    description: 'Handcrafted bag with mirror work and embroidery.',
    details: ['Internal zip pocket', 'Adjustable strap', '14×10 inch'],
    materials: 'Cotton canvas, mirror work, silk thread',
    care: 'Wipe with damp cloth',
    variants: {
      sizes: ['One Size'],
      colors: [
        { name: 'Natural Beige', hex: '#C8B89A' },
        { name: 'Deep Red', hex: '#8B1A1A' },
        { name: 'Indigo', hex: '#2C3E7A' },
      ],
    },
    stock: 7,
  },
  {
    id: '5',
    name: 'Linen Table Runner',
    category: 'Runners',
    price: '$24',
    priceINR: '₹1,999',
    image: 'https://cdn.swadeshonline.com/v2/patient-paper-41f385/swad-p/wrkr/products/pictures/item/free/resize-w:700/swadesh/471011427/1/v0kIR37dWu-471011427001_1_LS.jpg',
    images: [
      'https://cdn.swadeshonline.com/v2/patient-paper-41f385/swad-p/wrkr/products/pictures/item/free/resize-w:700/swadesh/471011427/1/v0kIR37dWu-471011427001_1_LS.jpg',
      
    ],
    description: 'Block-print runner for modern dining.',
    details: ['14×72 inch', 'Block-print border', 'Heat resistant'],
    materials: '100% pure linen',
    care: 'Machine wash delicate cycle',
    variants: {
      sizes: ['14×48"', '14×60"', '14×72"', '14×90"'],
      colors: [
        { name: 'Natural Linen', hex: '#C8B89A' },
        { name: 'Charcoal', hex: '#2C2C2C' },
        { name: 'Sage', hex: '#7A8C6E' },
      ],
    },
    stock: 12,
  },
  {
    id: '6',
    name: 'Jaipuri Cotton Dohar',
    category: 'Home Furnishing',
    price: '$55',
    priceINR: '₹4,499',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Reversible lightweight summer AC quilt.',
    details: ['Double-bed size', 'Lightweight 150 GSM', 'Perfect for AC rooms'],
    materials: '100% mulmul cotton, azo-free dyes',
    care: 'Gentle machine wash, dry in shade',
    variants: {
      sizes: ['Single (60×90")', 'Double (90×90")', 'King (108×90")'],
      colors: [
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Mauve', hex: '#B784A7' },
        { name: 'Mustard', hex: '#D4A017' },
        { name: 'Ivory', hex: '#F5F0E8' },
      ],
    },
    stock: 2,
  },
  {
    id: '7',
    name: 'Block-Print King Duvet Cover',
    category: 'Bedsheets',
    price: '$68',
    priceINR: '₹5,599',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'King-size duvet cover in signature Jaipuri print.',
    details: ['King size 104×90 inch', 'Button closure', 'Pillowcases included'],
    materials: '200TC percale cotton',
    care: 'Machine wash 30°C',
    variants: {
      sizes: ['Double', 'King', 'Super King'],
      colors: [
        { name: 'Desert Sand', hex: '#C2956C' },
        { name: 'Ocean Blue', hex: '#1E5799' },
        { name: 'Forest', hex: '#2D6A4F' },
      ],
    },
    stock: 9,
  },
  {
    id: '8',
    name: 'Premium Fitted Bedsheet',
    category: 'Home Furnishing',
    price: '$42',
    priceINR: '₹3,499',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Soft, stretchable fitted bedsheet with snug elastic edges.',
    details: ['Fits mattresses up to 8 inch depth', '360° elastic for secure grip', 'Wrinkle-resistant & breathable fabric'],
    materials: '100% Cotton / Cotton-blend fabric',
    care: 'Machine wash cold, tumble dry low, do not bleach',
    variants: {
      sizes: ['Single', 'Double', 'Queen', 'King'],
      colors: [
        { name: 'Pure White', hex: '#FAFAFA' },
        { name: 'Cream', hex: '#F5F0E8' },
        { name: 'Stone Grey', hex: '#9E9E9E' },
        { name: 'Navy', hex: '#1A237E' },
      ],
    },
    stock: 25,
  },
  {
    id: '9',
    name: 'Kantha Stitch Bedroom Cushion',
    category: 'Cushions',
    price: '$35',
    priceINR: '₹2,899',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Luxury cushion with kantha embroidery.',
    details: ['18×18 inch with insert', 'Kantha stitch embroidery', 'Invisible zip'],
    materials: 'Velvet front, cotton back, polyester fill',
    care: 'Spot clean only',
    variants: {
      sizes: ['16×16"', '18×18"', '20×20"'],
      colors: [
        { name: 'Jewel Teal', hex: '#008080' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Midnight Blue', hex: '#191970' },
        { name: 'Champagne', hex: '#C9A96E' },
      ],
    },
    stock: 4,
  },
];

export const CATEGORIES = ['All', 'Bedsheets', 'Rajai', 'Cushions', 'Bags', 'Runners', 'Home Furnishing'];

export const TESTIMONIALS = [
  { id: 1, name: 'Sarah Jenkins', location: 'London, UK', rating: 5, text: 'The quality of the Jaipuri Rajai is unmatched. It feels incredibly premium and adds a touch of authentic luxury to my bedroom.' },
  { id: 2, name: 'Rahul Sharma', location: 'Mumbai, India', rating: 5, text: 'Stunning craftsmanship. The bedsheets are softer than anything I have bought from high-end international stores.' },
  { id: 3, name: 'Emma Clarke', location: 'New York, USA', rating: 5, text: 'Beautiful packaging and fast international shipping. The custom table runner fits my dining table perfectly.' },
  { id: 4, name: 'Priya Mehta', location: 'Dubai, UAE', rating: 5, text: 'Ordered bulk cushion covers for our boutique hotel. The quality and consistency across all pieces was remarkable.' },
];

export const FAQ_ITEMS = [
  { q: 'Do you ship internationally?', a: 'Yes! We ship to 150+ countries via DHL, FedEx and India Post. International orders typically arrive in 7–14 business days with full tracking.' },
  { q: 'Are your products made from natural materials?', a: 'Absolutely. We use 100% long-staple cotton, natural dyes derived from plants and minerals, and traditional wooden blocks carved by master craftsmen in Jaipur.' },
  { q: 'Can I place a custom bulk order?', a: 'Yes, we specialise in bulk and custom orders for hotels, boutiques, and corporate gifting worldwide. Contact us for a personalised quote.' },
  { q: 'What is your return policy?', a: 'We offer a 14-day return window for international orders and 7 days for domestic. Items must be unused and in original packaging.' },
  { q: 'Do you accept INR payments?', a: 'Yes! Indian customers can pay in INR via UPI, Net Banking, Debit/Credit Cards. International customers are billed in USD.' },
  { q: 'How long for a custom order?', a: 'Custom orders typically take 10–15 business days for production, plus shipping time. We keep you updated at every stage.' },
];

export const LOOKBOOK_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', caption: 'The Heritage Suite' },
  { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800', caption: 'Morning Light' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800', caption: 'The Linen Edit' },
  { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800', caption: 'Dohar Dreams' },
  { src: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800', caption: 'Block Print Heritage' },
];