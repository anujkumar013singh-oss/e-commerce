import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  HiCube, HiChartBar, HiClipboardDocumentList, HiArrowLeftOnRectangle,
  HiPencil, HiTrash, HiPlus, HiXMark, HiPhoto, HiMagnifyingGlass
} from 'react-icons/hi2';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiChartBar, exact: true },
  { to: '/admin/products', label: 'Products', icon: HiCube, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: HiClipboardDocumentList, exact: false },
];

const categories = ['Kurtis', 'Sarees', 'Lehengas', 'Gowns', 'Co-ord Sets', 'Tops', 'Bottoms', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const initialForm = {
  name: '', category: '', description: '', price: '', discountPercent: '', tags: [],
  colors: [], sizes: sizes.map((s) => ({ size: s, stock: 0 })), images: [], existingImages: []
};

export default function AdminProducts() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState({ name: '', hex: '#D94F3D' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?redirect=/admin/products', { replace: true });
      return;
    }
  }, [user, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') fetchProducts();
  }, [user, fetchProducts]);

  const resetForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setTagInput('');
    setColorInput({ name: '', hex: '#D94F3D' });
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      discount: product.discountPercent?.toString() || '',
      tags: product.tags || [],
      colors: product.colors || [],
      sizes: sizes.map((s) => {
        const existing = (product.sizes || []).find((sz) => sz.size === s);
        return { size: s, stock: existing?.stock ?? 0 };
      }),
      images: [],
      existingImages: product.images || [],
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addColor = () => {
    if (colorInput.name.trim() && colorInput.hex.trim()) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, { name: colorInput.name.trim(), hex: colorInput.hex.trim() }]
      }));
      setColorInput({ name: '', hex: '#D94F3D' });
    }
  };

  const removeColor = (idx) => {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }));
  };

  const handleSizeStock = (sizeName, value) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => s.size === sizeName ? { ...s, stock: Math.max(0, Number(value) || 0) } : s)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    try {
      const { data } = await axios.post('/api/admin/upload', formData);
      const urls = data.urls || data.images || [];
      setForm((prev) => ({ ...prev, existingImages: [...prev.existingImages, ...urls] }));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category || !form.price) {
      setError('Name, category, and price are required');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      discountPercent: form.discountPercent ? Number(form.discountPercent) : 0,
      tags: form.tags,
      colors: form.colors,
      sizes: form.sizes.filter((s) => s.stock > 0),
      images: form.existingImages,
    };
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      await fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setConfirmDelete(null);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleToggle = async (id, field) => {
    try {
      const product = products.find((p) => p._id === id);
      if (!product) return;
      await axios.put(`/api/products/${id}`, {
        [field]: !product[field],
        name: product.name,
        price: product.price,
        category: product.category,
      });
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
    }
  };

  const filtered = products.filter((p) =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || user.role !== 'admin') return null;

  return (
    <motion.div
      className="min-h-screen bg-[#FFFFFF] flex font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <aside className="w-64 bg-white border-r border-[#F5F5F5] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#F5F5F5]">
          <Link to="/" className="font-display text-2xl text-[#0A0A0A] tracking-[0.1em]">VELORE</Link>
          <p className="text-[#D94F3D] text-xs tracking-widest mt-0.5">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const active = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#D94F3D]/10 text-[#D94F3D] font-medium'
                    : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C] hover:bg-[#FFFFFF]'
                }`}
              >
                <link.icon className="text-lg" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#F5F5F5]">
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors">
            <HiArrowLeftOnRectangle className="text-lg" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#F5F5F5] px-8 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-[#0A0A0A]">Products</h1>
          <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-xs !px-5 !py-2.5">
            <HiPlus className="text-sm" />
            ADD PRODUCT
          </button>
        </header>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-4">
                <HiXMark />
              </button>
            </div>
          )}

          <div className="relative mb-6 max-w-xs">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D94F3D] text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-[#F5F5F5] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 outline-none focus:border-[#D94F3D] transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-[#D94F3D]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#F5F5F5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#2C2C2C]/50 text-xs tracking-widest uppercase">
                      <th className="px-5 py-3 font-medium">Image</th>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Stock</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F5]">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-[#2C2C2C]/40">No products found</td>
                      </tr>
                    ) : (
                      filtered.map((product) => (
                        <tr key={product._id} className="text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors">
                          <td className="px-5 py-3">
                            <div className="w-12 h-16 rounded bg-[#FFFFFF] overflow-hidden">
                              <img
                                src={product.images?.[0] || 'https://via.placeholder.com/48x64'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium">{product.name}</td>
                          <td className="px-5 py-3 text-[#2C2C2C]/70">{product.category}</td>
                          <td className="px-5 py-3">₹{Number(product.price).toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3">
                            <span className={product.totalStock > 0 ? 'text-green-600' : 'text-red-500'}>
                              {product.totalStock ?? '-'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggle(product._id, 'trending')}
                                className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                                  product.trending ? 'bg-[#D94F3D]/20 text-[#D94F3D]' : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                TRENDING
                              </button>
                              <button
                                onClick={() => handleToggle(product._id, 'new')}
                                className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                                  product.new ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                NEW
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(product)}
                                className="p-1.5 text-[#2C2C2C]/40 hover:text-[#D94F3D] transition-colors"
                                title="Edit"
                              >
                                <HiPencil className="text-lg" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(product._id)}
                                className="p-1.5 text-[#2C2C2C]/40 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <HiTrash className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="font-display text-lg text-[#0A0A0A] mb-2">Delete Product</h3>
              <p className="text-sm text-[#2C2C2C]/70 mb-6">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2 rounded-full border border-[#F5F5F5] text-sm text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-5 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-3xl mx-auto my-8 bg-white rounded-xl shadow-2xl"
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F5F5]">
                <h2 className="font-display text-xl text-[#0A0A0A]">
                  {editingId ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-1.5 text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors"
                >
                  <HiXMark className="text-xl" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2.5 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className="w-full bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2.5 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      className="w-full bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2.5 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Discount %</label>
                    <input
                      type="number"
                      name="discountPercent"
                      value={form.discountPercent}
                      onChange={handleFormChange}
                      className="w-full bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2.5 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2.5 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Tags</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Type and press Enter"
                      className="flex-1 bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 rounded-lg bg-[#D94F3D] text-white text-sm hover:bg-[#B89850] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#D94F3D]/10 text-[#D94F3D] rounded-full text-xs">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                          <HiXMark className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Color Options</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={colorInput.name}
                      onChange={(e) => setColorInput((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Color name"
                      className="flex-1 bg-[#FFFFFF] border border-[#F5F5F5] rounded-lg py-2 px-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                    />
                    <input
                      type="color"
                      value={colorInput.hex}
                      onChange={(e) => setColorInput((prev) => ({ ...prev, hex: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-[#F5F5F5] cursor-pointer bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 rounded-lg bg-[#D94F3D] text-white text-sm hover:bg-[#B89850] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.colors.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#F5F5F5] rounded-full text-xs">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                        {c.name}
                        <button onClick={() => removeColor(i)} className="text-[#2C2C2C]/40 hover:text-red-500 transition-colors">
                          <HiXMark className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Size &amp; Stock</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {form.sizes.map((s) => (
                      <div key={s.size} className="bg-[#FFFFFF] rounded-lg p-2 text-center">
                        <span className="text-xs font-medium text-[#2C2C2C] block mb-1">{s.size}</span>
                        <input
                          type="number"
                          min="0"
                          value={s.stock}
                          onChange={(e) => handleSizeStock(s.size, e.target.value)}
                          className="w-full bg-white border border-[#F5F5F5] rounded py-1.5 text-center text-xs text-[#2C2C2C] outline-none focus:border-[#D94F3D] transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#2C2C2C]/60 uppercase mb-1.5">Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.existingImages.map((url, i) => (
                      <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#FFFFFF] group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-24 rounded-lg border-2 border-dashed border-[#F5F5F5] flex flex-col items-center justify-center cursor-pointer hover:border-[#D94F3D] transition-colors bg-white">
                      {uploading ? (
                        <svg className="animate-spin h-5 w-5 text-[#D94F3D]" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>
                          <HiPhoto className="text-xl text-[#2C2C2C]/30" />
                          <span className="text-[10px] text-[#2C2C2C]/30 mt-1">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5F5F5]">
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2.5 rounded-full border border-[#F5F5F5] text-sm text-[#2C2C2C] hover:bg-[#FFFFFF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-gold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24" />
                  )}
                  {editingId ? 'UPDATE' : 'SAVE'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
