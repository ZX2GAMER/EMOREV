import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Review, sampleProducts } from '../data/products';
import { isSupabaseConfigured, PRODUCT_IMAGE_BUCKET, supabase } from '../lib/supabase';

export interface CustomerQuestion {
  id: string;
  name: string;
  email: string;
  message: string;
  orderInfo?: string;
  date: string;
  status: 'open' | 'replied' | 'resolved';
  reply?: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
}

interface UploadedImage {
  url: string;
  path: string;
}

interface StoreContextType {
  products: Product[];
  reviews: Review[];
  questions: CustomerQuestion[];
  settings: StoreSettings;
  loading: boolean;
  usingSupabase: boolean;
  syncStatus: string;
  storeError: string;
  legacyProductCount: number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  removeReview: (id: string) => Promise<void>;
  addQuestion: (question: Omit<CustomerQuestion, 'id' | 'date' | 'status'>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<CustomerQuestion>) => Promise<void>;
  removeQuestion: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  uploadProductImage: (file: File) => Promise<UploadedImage>;
  refreshStore: () => Promise<void>;
  importLegacyProducts: () => Promise<void>;
  importSampleProducts: () => Promise<void>;
}

type DbRow = Record<string, unknown>;

const defaultSettings: StoreSettings = {
  whatsappNumber: '+1234567890',
  storeName: 'EMOREV Fashion',
  storeEmail: 'support@emorev.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Fashion Avenue, New York, NY 10001',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const getLegacyProductCount = () => {
  try {
    const saved = window.localStorage.getItem('emorev-products');
    const parsed = saved ? JSON.parse(saved) as Product[] : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

const getLegacyProducts = () => {
  try {
    const saved = window.localStorage.getItem('emorev-products');
    const parsed = saved ? JSON.parse(saved) as Product[] : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const validCategory = (category: unknown): Product['category'] => {
  return category === 'women' || category === 'men' || category === 'kids' ? category : 'women';
};

const toSizeArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(size => size.trim()).filter(Boolean);
  return ['S', 'M', 'L'];
};

const resolveImageUrl = (imageUrl: string, imagePath?: string) => {
  if (imageUrl) return imageUrl;
  if (!imagePath || !supabase) return '';
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
};

const rowToProduct = (row: DbRow): Product => {
  const imagePath = row.image_path ? String(row.image_path) : undefined;
  return {
    id: String(row.id || 'p' + Date.now()),
    name: String(row.name || ''),
    price: toNumber(row.price),
    salePrice: toOptionalNumber(row.sale_price),
    discount: toOptionalNumber(row.discount),
    category: validCategory(row.category),
    size: toSizeArray(row.size),
    description: String(row.description || ''),
    image: resolveImageUrl(String(row.image_url || row.image || ''), imagePath),
    imagePath,
    stock: toNumber(row.stock, 0),
    isNew: Boolean(row.is_new),
    isPublished: row.is_published !== false,
  };
};

const productToRow = (product: Product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  sale_price: product.salePrice ?? null,
  discount: product.discount ?? null,
  category: product.category,
  size: product.size,
  description: product.description,
  image_url: product.image,
  image_path: product.imagePath ?? null,
  stock: product.stock,
  is_new: Boolean(product.isNew),
  is_published: product.isPublished !== false,
});

const rowToReview = (row: DbRow): Review => ({
  id: String(row.id || 'rv' + Date.now()),
  name: String(row.name || ''),
  rating: toNumber(row.rating, 5),
  review: String(row.review || ''),
  date: String(row.date || new Date().toISOString().split('T')[0]),
  avatar: row.avatar ? String(row.avatar) : undefined,
});

const reviewToRow = (review: Review, approved = false) => ({
  id: review.id,
  name: review.name,
  rating: review.rating,
  review: review.review,
  date: review.date,
  avatar: review.avatar ?? null,
  is_approved: approved,
});

const rowToQuestion = (row: DbRow): CustomerQuestion => ({
  id: String(row.id || 'q' + Date.now()),
  name: String(row.name || ''),
  email: String(row.email || ''),
  message: String(row.message || ''),
  orderInfo: row.order_info ? String(row.order_info) : undefined,
  date: String(row.date || new Date().toISOString()),
  status: row.status === 'replied' || row.status === 'resolved' ? row.status : 'open',
  reply: row.reply ? String(row.reply) : undefined,
});

const questionToRow = (question: CustomerQuestion) => ({
  id: question.id,
  name: question.name,
  email: question.email,
  message: question.message,
  order_info: question.orderInfo ?? null,
  date: question.date,
  status: question.status,
  reply: question.reply ?? null,
});

const rowToSettings = (row: DbRow): StoreSettings => ({
  whatsappNumber: String(row.whatsapp_number || defaultSettings.whatsappNumber),
  storeName: String(row.store_name || defaultSettings.storeName),
  storeEmail: String(row.store_email || defaultSettings.storeEmail),
  storePhone: String(row.store_phone || defaultSettings.storePhone),
  storeAddress: String(row.store_address || defaultSettings.storeAddress),
});

const settingsToRow = (settings: StoreSettings) => ({
  id: 'main',
  whatsapp_number: settings.whatsappNumber,
  store_name: settings.storeName,
  store_email: settings.storeEmail,
  store_phone: settings.storePhone,
  store_address: settings.storeAddress,
});

const upsertById = <T extends { id: string }>(items: T[], nextItem: T) => {
  const exists = items.some(item => item.id === nextItem.id);
  return exists ? items.map(item => item.id === nextItem.id ? nextItem : item) : [nextItem, ...items];
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<CustomerQuestion[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [storeError, setStoreError] = useState('');
  const [syncStatus, setSyncStatus] = useState('Connecting to Supabase...');
  const [legacyProductCount, setLegacyProductCount] = useState(0);

  const requireSupabase = useCallback(() => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
    }
    return supabase;
  }, []);

  const refreshStore = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setStoreError('Supabase is not configured. Store data is not connected to an online database yet.');
      setSyncStatus('Supabase configuration required.');
      return;
    }

    setLoading(true);
    setStoreError('');

    const [productsResult, reviewsResult, questionsResult, settingsResult] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('date', { ascending: false }),
      supabase.from('customer_questions').select('*').order('date', { ascending: false }),
      supabase.from('store_settings').select('*').eq('id', 'main').maybeSingle(),
    ]);

    if (productsResult.error) {
      setStoreError(`Could not load products from Supabase: ${productsResult.error.message}`);
    } else {
      setProducts((productsResult.data || []).map(row => rowToProduct(row as DbRow)));
    }

    if (!reviewsResult.error) {
      setReviews((reviewsResult.data || []).map(row => rowToReview(row as DbRow)));
    }

    if (!questionsResult.error) {
      setQuestions((questionsResult.data || []).map(row => rowToQuestion(row as DbRow)));
    }

    if (!settingsResult.error && settingsResult.data) {
      setSettings(rowToSettings(settingsResult.data as DbRow));
    }

    setSyncStatus('Supabase connected. Online store data is active.');
    setLoading(false);
  }, []);

  useEffect(() => {
    setLegacyProductCount(getLegacyProductCount());
    refreshStore().catch(error => {
      setLoading(false);
      setStoreError(String(error));
      setSyncStatus('Supabase load failed.');
    });

    const client = supabase;
    if (!client) return undefined;

    const authSubscription = client.auth.onAuthStateChange(() => {
      refreshStore().catch(error => setStoreError(String(error)));
    });

    const productsChannel = client
      .channel('emorev-products-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        if (payload.eventType === 'DELETE') {
          const oldRow = payload.old as DbRow;
          setProducts(prev => prev.filter(product => product.id !== String(oldRow.id)));
          return;
        }
        setProducts(prev => upsertById(prev, rowToProduct(payload.new as DbRow)));
      })
      .subscribe();

    const settingsChannel = client
      .channel('emorev-settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, payload => {
        if (payload.eventType !== 'DELETE' && payload.new) {
          setSettings(rowToSettings(payload.new as DbRow));
        }
      })
      .subscribe();

    return () => {
      authSubscription.data.subscription.unsubscribe();
      client.removeChannel(productsChannel);
      client.removeChannel(settingsChannel);
    };
  }, [refreshStore]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const client = requireSupabase();
    const newProduct: Product = { ...product, id: crypto.randomUUID(), isPublished: product.isPublished !== false };
    const { data, error } = await client.from('products').insert(productToRow(newProduct)).select('*').single();
    if (error) throw new Error(error.message);
    setProducts(prev => upsertById(prev, rowToProduct(data as DbRow)));
  }, [requireSupabase]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const client = requireSupabase();
    const currentProduct = products.find(product => product.id === id);
    if (!currentProduct) throw new Error('Product was not found. Refresh the page and try again.');
    const mergedProduct = { ...currentProduct, ...updates };
    const { data, error } = await client.from('products').update(productToRow(mergedProduct)).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    setProducts(prev => upsertById(prev, rowToProduct(data as DbRow)));
  }, [products, requireSupabase]);

  const removeProduct = useCallback(async (id: string) => {
    const client = requireSupabase();
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setProducts(prev => prev.filter(product => product.id !== id));
  }, [requireSupabase]);

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'date'>) => {
    const client = requireSupabase();
    const newReview: Review = { ...review, id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] };
    const { error } = await client.from('reviews').insert(reviewToRow(newReview, false));
    if (error) throw new Error(error.message);
  }, [requireSupabase]);

  const removeReview = useCallback(async (id: string) => {
    const client = requireSupabase();
    const { error } = await client.from('reviews').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setReviews(prev => prev.filter(review => review.id !== id));
  }, [requireSupabase]);

  const addQuestion = useCallback(async (question: Omit<CustomerQuestion, 'id' | 'date' | 'status'>) => {
    const client = requireSupabase();
    const newQuestion: CustomerQuestion = { ...question, id: crypto.randomUUID(), date: new Date().toISOString(), status: 'open' };
    const { error } = await client.from('customer_questions').insert(questionToRow(newQuestion));
    if (error) throw new Error(error.message);
  }, [requireSupabase]);

  const updateQuestion = useCallback(async (id: string, updates: Partial<CustomerQuestion>) => {
    const client = requireSupabase();
    const currentQuestion = questions.find(question => question.id === id);
    if (!currentQuestion) throw new Error('Question was not found. Refresh the page and try again.');
    const mergedQuestion = { ...currentQuestion, ...updates };
    const { data, error } = await client.from('customer_questions').update(questionToRow(mergedQuestion)).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    setQuestions(prev => upsertById(prev, rowToQuestion(data as DbRow)));
  }, [questions, requireSupabase]);

  const removeQuestion = useCallback(async (id: string) => {
    const client = requireSupabase();
    const { error } = await client.from('customer_questions').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setQuestions(prev => prev.filter(question => question.id !== id));
  }, [requireSupabase]);

  const updateSettings = useCallback(async (newSettings: Partial<StoreSettings>) => {
    const client = requireSupabase();
    const mergedSettings = { ...settings, ...newSettings };
    const { data, error } = await client
      .from('store_settings')
      .upsert(settingsToRow(mergedSettings), { onConflict: 'id' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    setSettings(rowToSettings(data as DbRow));
  }, [settings, requireSupabase]);

  const uploadProductImage = useCallback(async (file: File) => {
    const client = requireSupabase();
    const extension = file.name.split('.').pop() || 'jpg';
    const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '-');
    const path = `products/${crypto.randomUUID()}-${safeName}.${extension}`;

    const { error } = await client.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data } = client.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }, [requireSupabase]);

  const importLegacyProducts = useCallback(async () => {
    const client = requireSupabase();
    const legacyProducts = getLegacyProducts();
    if (legacyProducts.length === 0) throw new Error('No legacy browser products were found to import.');
    const rows = legacyProducts.map(product => productToRow({ ...product, id: product.id || crypto.randomUUID() }));
    const { error } = await client.from('products').upsert(rows, { onConflict: 'id' });
    if (error) throw new Error(error.message);
    await refreshStore();
    setLegacyProductCount(getLegacyProductCount());
  }, [refreshStore, requireSupabase]);

  const importSampleProducts = useCallback(async () => {
    const client = requireSupabase();
    const rows = sampleProducts.map(product => productToRow({ ...product, isPublished: true }));
    const { error } = await client.from('products').upsert(rows, { onConflict: 'id' });
    if (error) throw new Error(error.message);
    await refreshStore();
  }, [refreshStore, requireSupabase]);

  return (
    <StoreContext.Provider value={{
      products,
      reviews,
      questions,
      settings,
      loading,
      usingSupabase: isSupabaseConfigured,
      syncStatus,
      storeError,
      legacyProductCount,
      addProduct,
      updateProduct,
      removeProduct,
      addReview,
      removeReview,
      addQuestion,
      updateQuestion,
      removeQuestion,
      updateSettings,
      uploadProductImage,
      refreshStore,
      importLegacyProducts,
      importSampleProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};