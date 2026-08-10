import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Plus, Edit2, Trash2, Save, Package, Star,
  Upload, Eye, MessageSquare, Settings, Phone, Store, Reply, CheckCircle,
  UserPlus, ShieldCheck,
} from 'lucide-react';
import { Product } from '../data/products';
import { useStore, CustomerQuestion } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ open, onClose }) => {
  const { isAdmin, currentOwner, owners, login, logout, addOwner, removeOwner, authError, loading: authLoading } = useAuth();
  const {
    products, reviews, questions, settings, loading: storeLoading, usingSupabase, syncStatus, storeError, legacyProductCount,
    addProduct, updateProduct, removeProduct, removeReview, updateQuestion,
    removeQuestion, updateSettings, uploadProductImage, importLegacyProducts, importSampleProducts,
  } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'questions' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'whatsapp' | 'store' | 'owners'>('whatsapp');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [ownerAccessMessage, setOwnerAccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');
  const [productForm, setProductForm] = useState({
    name: '', price: '', salePrice: '', discount: '', category: 'women' as Product['category'],
    size: '', description: '', image: '', imagePath: '', stock: '', isNew: false,
  });
  const [settingsForm, setSettingsForm] = useState(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setLoginError(result.message);
    } else {
      setLoginError('');
    }
  };

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gray-950 border border-orange-500/20 rounded-2xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          {loginError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              {loginError}
            </div>
          )}
          {authError && !loginError && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-yellow-300 text-sm text-center">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                placeholder="admin email"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                placeholder="password"
                required
              />
            </div>
            <button
              disabled={authLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all text-base disabled:opacity-60"
            >
              {authLoading ? 'Checking Supabase...' : 'Login'}
            </button>
          </form>
          <p className="text-gray-600 text-xs text-center mt-4">Use the store owner's credentials to access</p>
        </motion.div>
      </motion.div>
    );
  }

  const stats = {
    totalProducts: products.length,
    totalReviews: reviews.length,
    totalQuestions: questions.filter(q => q.status === 'open').length,
    avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1),
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) return;
    const sizes = productForm.size.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await addProduct({
        name: productForm.name,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : undefined,
        discount: productForm.discount ? parseInt(productForm.discount) : undefined,
        category: productForm.category,
        size: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
        description: productForm.description,
        image: productForm.image,
        imagePath: productForm.imagePath || undefined,
        stock: parseInt(productForm.stock) || 10,
        isNew: productForm.isNew,
        isPublished: true,
      });
      setShowAddForm(false);
      setOperationMessage('Product saved to Supabase successfully.');
      setProductForm({ name: '', price: '', salePrice: '', discount: '', category: 'women', size: '', description: '', image: '', imagePath: '', stock: '', isNew: false });
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not save product to Supabase.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      setOperationMessage('Product updated in Supabase successfully.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not update product in Supabase.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'editImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploaded = await uploadProductImage(file);
      if (field === 'image') {
        setProductForm(prev => ({ ...prev, image: uploaded.url, imagePath: uploaded.path }));
      } else {
        setEditingProduct(prev => prev ? { ...prev, image: uploaded.url, imagePath: uploaded.path } : prev);
      }
      setOperationMessage('Image uploaded to Supabase Storage.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleReplyQuestion = async (question: CustomerQuestion) => {
    const reply = prompt('Enter your reply:');
    if (reply) {
      try {
        await updateQuestion(question.id, { reply, status: 'replied' });
        setOperationMessage('Reply saved to Supabase.');
      } catch (error) {
        setOperationMessage(error instanceof Error ? error.message : 'Could not save reply.');
      }
    }
  };

  const handleResolveQuestion = async (id: string) => {
    try {
      await updateQuestion(id, { status: 'resolved' });
      setOperationMessage('Question marked resolved in Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not resolve question.');
    }
  };

  const handleAddOwnerAccess = async () => {
    const result = await addOwner(newOwnerEmail);
    setOwnerAccessMessage(result.message);
    if (result.success) {
      setNewOwnerEmail('');
    }
  };

  const handleRemoveOwnerAccess = async (ownerId: string) => {
    const result = await removeOwner(ownerId);
    setOwnerAccessMessage(result.message);
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      await removeProduct(id);
      setOperationMessage('Product deleted from Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not delete product.');
    }
  };

  const handleRemoveReview = async (id: string) => {
    try {
      await removeReview(id);
      setOperationMessage('Review removed from Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not remove review.');
    }
  };

  const handleRemoveQuestion = async (id: string) => {
    try {
      await removeQuestion(id);
      setOperationMessage('Customer question deleted from Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not delete question.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settingsForm);
      setOperationMessage('Store settings saved to Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not save store settings.');
    }
  };

  const handleImportLegacyProducts = async () => {
    try {
      await importLegacyProducts();
      setOperationMessage('Legacy browser products imported into Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not import legacy products.');
    }
  };

  const handleImportSampleProducts = async () => {
    try {
      await importSampleProducts();
      setOperationMessage('Sample products imported into Supabase.');
    } catch (error) {
      setOperationMessage(error instanceof Error ? error.message : 'Could not import sample products.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/90 backdrop-blur py-4 z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">EMOREV</span>
              {' '}Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your store, products, and customer support</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden md:inline-flex text-xs px-3 py-1.5 rounded-full border font-medium ${
              usingSupabase
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
            }`}>
              {usingSupabase ? 'Supabase Live Sync' : 'Local Demo Sync'}
            </span>
            <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 font-medium">
              Admin Active
            </span>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-orange-400' },
            { label: 'Reviews', value: stats.totalReviews, icon: Star, color: 'text-yellow-400' },
            { label: 'Open Questions', value: stats.totalQuestions, icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Eye, color: 'text-green-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'questions', label: 'Questions', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => { logout(); }}
            className="ml-auto px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
          usingSupabase
            ? 'border-blue-500/20 bg-blue-500/10 text-blue-200'
            : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-200'
        }`}>
          {storeLoading ? 'Loading Supabase store data...' : syncStatus}
        </div>

        {storeError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {storeError}
          </div>
        )}

        {operationMessage && (
          <div className="mb-6 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
            {operationMessage}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-lg font-bold text-white">Manage Products ({products.length})</h3>
              <div className="flex flex-wrap gap-2">
                {legacyProductCount > 0 && (
                  <button
                    onClick={handleImportLegacyProducts}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-xl text-sm font-medium hover:bg-blue-500/20 transition-colors"
                  >
                    Import Browser Products ({legacyProductCount})
                  </button>
                )}
                {products.length === 0 && (
                  <button
                    onClick={handleImportSampleProducts}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    Import Sample Products
                  </button>
                )}
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6"
              >
                <h4 className="text-white font-bold mb-4">Add New Product</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Product Name *</label>
                    <input
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Price *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Sale Price</label>
                    <input
                      type="number"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, salePrice: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Discount %</label>
                    <input
                      type="number"
                      value={productForm.discount}
                      onChange={(e) => setProductForm(prev => ({ ...prev, discount: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Sizes (comma separated)</label>
                    <input
                      value={productForm.size}
                      onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="10"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <label className="text-sm text-gray-400">Mark as New Arrival</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none"
                      rows={2}
                      placeholder="Product description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">Product Image</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white cursor-pointer transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} />
                      </label>
                      <input
                        value={productForm.image}
                        onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                        className="flex-1 min-w-[200px] px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                        placeholder="Or paste image URL"
                      />
                    </div>
                    {productForm.image && (
                      <img src={productForm.image} alt="Preview" className="mt-3 w-24 h-32 object-cover rounded-lg border border-gray-700" />
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Product
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Product List */}
            <div className="space-y-3">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
                >
                  <img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-3">
                        <input
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                        />
                        <div className="flex gap-2 flex-wrap">
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            value={editingProduct.salePrice || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="w-24 px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                            placeholder="Sale"
                          />
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="kids">Kids</option>
                          </select>
                        </div>
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none"
                          rows={2}
                        />
                        <div className="flex items-center gap-3 flex-wrap">
                          <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                            <Upload className="w-3 h-3" /> 
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'editImage')} />
                          </label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500/50"
                            placeholder="Stock"
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={handleUpdateProduct} 
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-600 transition-colors"
                          >
                            <Save className="w-3 h-3" /> Save
                          </button>
                          <button 
                            onClick={() => setEditingProduct(null)} 
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs hover:text-white hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-white font-semibold text-sm truncate">{product.name}</h4>
                          {product.isNew && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">NEW</span>}
                          {product.discount && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">-{product.discount}%</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <span className="text-orange-400 font-bold">${(product.salePrice || product.price).toFixed(2)}</span>
                          {product.salePrice && <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>}
                          <span className="text-gray-500 text-xs capitalize">• {product.category}</span>
                          <span className="text-gray-500 text-xs">• Stock: {product.stock}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {editingProduct?.id !== product.id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingProduct({ ...product })}
                        className="p-2.5 bg-gray-800 text-gray-400 rounded-lg hover:text-orange-400 hover:bg-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-2.5 bg-gray-800 text-gray-400 rounded-lg hover:text-red-400 hover:bg-gray-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Manage Reviews ({reviews.length})</h3>
            <div className="space-y-3">
              {reviews.map(review => (
                <motion.div
                  key={review.id}
                  layout
                  className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-white font-semibold text-sm">{review.name}</h4>
                      <span className="text-gray-500 text-xs">{review.date}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-orange-400 fill-orange-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{review.review}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveReview(review.id)}
                    className="p-2.5 bg-gray-800 text-gray-400 rounded-lg hover:text-red-400 hover:bg-gray-700 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Customer Questions ({questions.length})</h3>
            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50">
                  <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">No customer questions yet</p>
                </div>
              ) : (
                questions.map(question => (
                  <motion.div
                    key={question.id}
                    layout
                    className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                          {question.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{question.name}</h4>
                          <p className="text-gray-500 text-xs">{question.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                          question.status === 'replied' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {question.status}
                        </span>
                        <span className="text-gray-600 text-xs">{new Date(question.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {question.orderInfo && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Order: {question.orderInfo}
                      </p>
                    )}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                      <p className="text-gray-300 text-sm">{question.message}</p>
                    </div>
                    {question.reply && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-3">
                        <p className="text-orange-400 text-xs font-medium mb-1">Your Reply:</p>
                        <p className="text-gray-300 text-sm">{question.reply}</p>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {question.status !== 'resolved' && (
                        <>
                          <button
                            onClick={() => handleReplyQuestion(question)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                          <button
                            onClick={() => handleResolveQuestion(question.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Resolved
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-xs font-medium hover:text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSettingsTab('whatsapp')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settingsTab === 'whatsapp'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => setSettingsTab('store')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settingsTab === 'store'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                Store Info
              </button>
              <button
                onClick={() => setSettingsTab('owners')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settingsTab === 'owners'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Owner Access
              </button>
            </div>

            {settingsTab === 'whatsapp' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  WhatsApp Settings
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="+1234567890"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Include country code (e.g., +1 for US). Customers will be able to chat with you directly.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save WhatsApp Number
                  </button>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <p className="text-xs text-gray-500">
                      When customers click the WhatsApp button, they'll be directed to:
                      <br />
                      <code className="bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
                        https://wa.me/{settingsForm.whatsappNumber.replace(/\D/g, '')}?text=Hello%20EMOREV...
                      </code>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {settingsTab === 'store' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-orange-400" />
                  Store Information
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Contact Email</label>
                    <input
                      type="email"
                      value={settingsForm.storeEmail}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, storeEmail: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={settingsForm.storePhone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, storePhone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Store Address</label>
                    <textarea
                      value={settingsForm.storeAddress}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, storeAddress: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500/50 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Store Settings
                  </button>
                </div>
              </motion.div>
            )}

            {settingsTab === 'owners' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6"
              >
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Website Owner Access
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Add a buyer's Gmail or email here to authorize them as an EMOREV owner. Their password is managed in Supabase Authentication, not stored in the website code.
                </p>

                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
                  <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">New Owner Email / Gmail</label>
                      <input
                        type="email"
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        placeholder="buyer@gmail.com"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                      After adding the email here, create or invite that same email in Supabase Authentication. The buyer will log in using their Supabase Auth password.
                    </div>
                    <button
                      onClick={handleAddOwnerAccess}
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Website Owner
                    </button>
                    {ownerAccessMessage && (
                      <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-sm text-gray-300">
                        {ownerAccessMessage}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-white font-semibold">Current Owners</h4>
                      <span className="text-xs text-gray-500">Logged in: {currentOwner?.email}</span>
                    </div>
                    {owners.map(owner => (
                      <div key={owner.id} className="bg-gray-950/60 border border-gray-800 rounded-xl p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-white font-semibold text-sm">{owner.email}</p>
                              <span className={`text-[11px] px-2 py-1 rounded-full font-bold ${
                                owner.role === 'primary-owner'
                                  ? 'bg-orange-500/20 text-orange-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {owner.role === 'primary-owner' ? 'PRIMARY OWNER' : 'OWNER'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">
                              Added {new Date(owner.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {owner.role !== 'primary-owner' && (
                            <button
                              onClick={() => handleRemoveOwnerAccess(owner.id)}
                              className="px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove Access
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                  Security note: owner access is stored in Supabase. Passwords stay inside Supabase Authentication and are never saved in frontend source code.
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
