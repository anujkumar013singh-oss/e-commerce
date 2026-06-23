import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sizes, colors, tags, fits, minDiscount, search, ids, sort, page = 1, limit = 20, look } = req.query;
    const filter = {};
    const nameConditions = [];

    if (ids) filter._id = { $in: ids.split(',') };
    if (category) filter.category = category;
    if (look) filter.look = look;
    if (search) nameConditions.push({ name: { $regex: search.replace(/\+/g, ' '), $options: 'i' } });
    if (nameConditions.length > 0) filter.$and = nameConditions;
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice);
    }
    if (sizes) filter['sizes.size'] = { $in: sizes.split(',') };
    if (fits) filter.fit = { $in: fits.split(',') };
    if (tags) filter.tags = { $in: tags.split(',') };
    if (colors) filter['colors.name'] = { $in: colors.split(',') };
    if (minDiscount) filter.discountPercent = { $gte: Number(minDiscount) };

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low' || sort === 'price_asc') sortOption = { discountedPrice: 1 };
    else if (sort === 'price-high' || sort === 'price_desc') sortOption = { discountedPrice: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'trending') sortOption = { isTrending: -1, createdAt: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrending = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).sort({ createdAt: -1 }).limit(200);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
