import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, toggleSize, toggleColor, toggleTag } from '../store/filterSlice';
import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2';

const categories = ['Casual Shirts', 'Polo T-Shirts', 'Kurtas', 'Trousers', 'Pajamas', 'Makeup', "Women's Dresses"];
const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const colorsList = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Grey', hex: '#8C8C8C' },
  { name: 'Beige', hex: '#D4C9B5' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Blue', hex: '#2E5EAA' }
];
const fitsList = ['Slim', 'Regular', 'Relaxed', 'Oversized'];
const discountsList = [
  { label: '10%+', value: 10 },
  { label: '20%+', value: 20 },
  { label: '50%+', value: 50 },
  { label: '70%+', value: 70 }
];
const tagsList = ['Best Seller', 'New Arrival', 'Summer Drop', 'Festival Pick'];

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.minPrice > 0 ||
    filters.maxPrice < 5000 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.fits.length > 0 ||
    filters.minDiscount > 0 ||
    filters.tags.length > 0 ||
    filters.category;

  const filterContent = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-[#0A0A0A] tracking-wide">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-[10px] tracking-wider text-[#D94F3D] hover:underline font-mono"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">PRICE RANGE</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={5000}
            value={filters.minPrice}
            onChange={(e) => dispatch(setFilter({ minPrice: Number(e.target.value) }))}
            className="w-full bg-[#F5F5F5]/50 border border-[#2C2C2C]/20 px-3 py-2 text-sm text-[#0A0A0A] outline-none focus:border-[#D94F3D] transition-colors"
            placeholder="Min"
          />
          <span className="text-[#2C2C2C]/40 text-xs">—</span>
          <input
            type="number"
            min={0}
            max={5000}
            value={filters.maxPrice}
            onChange={(e) => dispatch(setFilter({ maxPrice: Number(e.target.value) }))}
            className="w-full bg-[#F5F5F5]/50 border border-[#2C2C2C]/20 px-3 py-2 text-sm text-[#0A0A0A] outline-none focus:border-[#D94F3D] transition-colors"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">CATEGORY</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={() =>
                  dispatch(setFilter({ category: filters.category === cat ? '' : cat }))
                }
                className="w-4 h-4 accent-[#D94F3D]"
              />
              <span className="text-sm text-[#2C2C2C]/70 group-hover:text-[#0A0A0A] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">SIZE</h4>
        <div className="flex flex-wrap gap-2">
          {sizesList.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => dispatch(toggleSize(size))}
                className={`px-3 py-1.5 text-xs tracking-wider font-mono border transition-all duration-200 ${
                  active
                    ? 'bg-[#D94F3D] text-white border-[#D94F3D]'
                    : 'bg-transparent text-[#2C2C2C]/60 border-[#2C2C2C]/20 hover:border-[#2C2C2C]/60'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">COLOR</h4>
        <div className="flex flex-wrap gap-2.5">
          {colorsList.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => dispatch(toggleColor(color.name))}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                  active ? 'border-[#D94F3D] scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">FIT</h4>
        <div className="space-y-2">
          {fitsList.map((fit) => {
            const active = filters.fits.includes(fit);
            return (
              <label key={fit} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => {
                    const newFits = active
                      ? filters.fits.filter((f) => f !== fit)
                      : [...filters.fits, fit];
                    dispatch(setFilter({ fits: newFits }));
                  }}
                  className="w-4 h-4 accent-[#D94F3D]"
                />
                <span className="text-sm text-[#2C2C2C]/70 group-hover:text-[#0A0A0A] transition-colors">
                  {fit}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">DISCOUNT</h4>
        <div className="flex flex-wrap gap-2">
          {discountsList.map((d) => {
            const active = filters.minDiscount === d.value;
            return (
              <button
                key={d.value}
                onClick={() =>
                  dispatch(setFilter({ minDiscount: active ? 0 : d.value }))
                }
                className={`px-3 py-1.5 text-xs tracking-wider font-mono border transition-all duration-200 ${
                  active
                    ? 'bg-[#D94F3D] text-white border-[#D94F3D]'
                    : 'bg-transparent text-[#2C2C2C]/60 border-[#2C2C2C]/20 hover:border-[#2C2C2C]/60'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.15em] font-bold text-[#2C2C2C] mb-3">TAGS</h4>
        <div className="flex flex-wrap gap-2">
          {tagsList.map((tag) => {
            const active = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => dispatch(toggleTag(tag))}
                className={`px-3 py-1.5 text-xs tracking-wider font-mono border transition-all duration-200 ${
                  active
                    ? 'bg-[#D94F3D] text-[#0A0A0A] border-[#D94F3D]'
                    : 'bg-transparent text-[#2C2C2C]/60 border-[#2C2C2C]/20 hover:border-[#2C2C2C]/60'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-[#D94F3D] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
      >
        <HiAdjustmentsHorizontal className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D94F3D] rounded-full" />
        )}
      </button>

      <aside className="hidden lg:block w-64 shrink-0">
        {filterContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-[#FFFFFF] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-[#0A0A0A] tracking-wide">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="text-[#2C2C2C]/60 hover:text-[#0A0A0A]">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
