import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';
import { HiHeart } from 'react-icons/hi2';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(product._id);
  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountPercent > 0 && product.discountPercent !== product.price;

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product._id));
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5] shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-[#D94F3D] text-white text-[10px] font-mono tracking-wider px-3 py-1 rounded-full z-10">
            NEW
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-white translate-x-2 group-hover:translate-x-0"
        >
          <HiHeart className={`w-4 h-4 ${isWishlisted ? 'text-[#D94F3D] fill-[#D94F3D]' : 'text-[#2C2C2C]'}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-[#1a1a1a]/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 z-10">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-white text-[10px] font-mono">{product.rating || '4.5'}</span>
          {product.reviewCount > 0 && (
            <>
              <span className="text-white/30 text-[10px]">|</span>
              <span className="text-white/60 text-[10px] font-mono">{product.reviewCount}</span>
            </>
          )}
        </div>
      </div>
      <div className="pt-3 px-0.5 border-b-2 border-transparent group-hover:border-[#D94F3D] transition-all duration-300">
        <p className="text-[10px] tracking-[0.2em] font-bold text-[#0A0A0A] mb-1">VELORE</p>
        <h3 className="text-sm text-[#0A0A0A] font-body truncate mb-1.5">{product.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-[#0A0A0A]">₹{displayPrice}</span>
              <span className="text-xs text-[#2C2C2C]/50 line-through">₹{product.price}</span>
              <span className="text-[10px] font-mono text-[#D94F3D]">({product.discountPercent}% OFF)</span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#0A0A0A]">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
