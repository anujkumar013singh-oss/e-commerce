import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  discountedPrice: { type: Number },
  colors: [{ name: String, hex: String }],
  sizes: [{ size: String, stock: Number }],
  fit: { type: String, enum: ['Slim', 'Regular', 'Relaxed', 'Oversized'], default: 'Regular' },
  tags: [{ type: String }],
  look: { type: String, enum: ['casual', 'formal', 'ethnic', 'streetwear', 'beauty', 'womenswear', ''] },
  isTrending: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
  if (this.discountPercent > 0) {
    this.discountedPrice = Math.round(this.price - (this.price * this.discountPercent / 100));
  } else {
    this.discountedPrice = this.price;
  }
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isTrending: 1, createdAt: -1 });

export default mongoose.model('Product', productSchema);
