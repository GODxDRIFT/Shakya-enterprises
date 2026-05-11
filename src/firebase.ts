// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, addDoc, query, where, orderBy, serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Cloudinary upload ────────────────────────────────────────────────────
const CL_CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CL_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CL_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CL_CLOUD}/image/upload`, {
    method: 'POST', body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
};

// ── User Profile ─────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string; name: string; email: string; phone: string;
  avatar?: string; createdAt?: unknown;
  addresses: Address[];
}
export interface Address {
  id: string; label: string; line1: string; city: string;
  state: string; pincode: string; country: string; isDefault: boolean;
}

export const userService = {
  get: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() as UserProfile : null;
  },
  create: async (uid: string, data: Partial<UserProfile>) => {
    await setDoc(doc(db, 'users', uid), { uid, addresses: [], createdAt: serverTimestamp(), ...data });
  },
  update: async (uid: string, data: Partial<UserProfile>) => {
    await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
  },
};

// ── Orders ───────────────────────────────────────────────────────────────
export interface FSOrder {
  id: string; uid: string; items: unknown[]; customer: unknown;
  shipping: unknown; totalINR: number; totalUSD: string;
  status: string; date: unknown; cfOrderId?: string;
}

export const orderService = {
  save: async (order: Omit<FSOrder, 'id'>) => {
    const ref = doc(db, 'orders', (order as FSOrder & {id:string}).id || `order_${Date.now()}`);
    await setDoc(ref, { ...order, date: serverTimestamp() });
  },
  getByUser: async (uid: string): Promise<FSOrder[]> => {
    const q = query(collection(db, 'orders'), where('uid', '==', uid), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSOrder);
  },
  getAll: async (): Promise<FSOrder[]> => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSOrder);
  },
  updateStatus: async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
  },
};

// ── Products ─────────────────────────────────────────────────────────────
export interface FSProduct {
  id: string; name: string; category: string; price: string; priceINR: string;
  image: string; images: string[]; description: string; details: string[];
  materials: string; care: string;
  variants: { sizes: string[]; colors: { name: string; hex: string }[] };
  stock: number; active: boolean;
}

export const productService = {
  getAll: async (): Promise<FSProduct[]> => {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSProduct);
  },
  add: async (product: Omit<FSProduct, 'id'>): Promise<string> => {
    const ref = await addDoc(collection(db, 'products'), product);
    return ref.id;
  },
  update: async (id: string, data: Partial<FSProduct>) => {
    await updateDoc(doc(db, 'products', id), data as Record<string, unknown>);
  },
  delete: async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  },
};

// ── Reviews ──────────────────────────────────────────────────────────────
export interface FSReview {
  id: string; productId: string; uid: string; name: string;
  rating: number; title: string; text: string; date: unknown;
}

export const reviewService = {
  getByProduct: async (productId: string): Promise<FSReview[]> => {
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSReview);
  },
  getAll: async (): Promise<FSReview[]> => {
    const snap = await getDocs(collection(db, 'reviews'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSReview);
  },
  add: async (review: Omit<FSReview, 'id'>) => {
    await addDoc(collection(db, 'reviews'), { ...review, date: serverTimestamp() });
  },
  delete: async (id: string) => {
    await deleteDoc(doc(db, 'reviews', id));
  },
};

export { Timestamp };
