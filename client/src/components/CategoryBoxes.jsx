import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Shirt', slug: 'Casual Shirts', image: 'https://www.aristobrat.in/cdn/shop/files/TencelShirt_Black_New5.jpg?v=1686218556&width=1080' },
  { name: 'TShirt', slug: 'Polo T-Shirts', image: 'https://static.cilory.com/793385-thickbox_default/nologo-navy-pure-cotton-polo-t-shirt.jpg.webp' },
  { name: 'Cosmetics', slug: 'Makeup', image: 'https://vivecosmetic.com/wp-content/uploads/2024/07/Top-10-Cosmetic-Companies-in-Kerala.jpeg' },
  { name: 'Kurta', slug: 'Kurtas', image: 'https://www.shasakclothing.com/cdn/shop/files/DSC06733.jpg?v=1737023883' },
  { name: 'Western Dress', slug: "Women's Dresses", image: 'https://m.media-amazon.com/images/I/716b+noAvnL._AC_UY1100_.jpg' },
  { name: 'Trousers', slug: 'Trousers', image: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_77bafd80-933d-40c4-8276-3c2162235824.jpg?v=1779820006&quality=80' }
];

export default function CategoryBoxes() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.cat-card');
    const ctx = gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
    return () => ctx.kill();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-2 md:px-4">
      <h2 className="section-heading">SHOP BY STYLE</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate(`/shop?category=${cat.slug}`)}
            className="cat-card relative aspect-[4/5] overflow-hidden cursor-pointer group"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${cat.image})` }} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-display text-white text-2xl md:text-3xl md:text-4xl tracking-wide text-center px-2 group-hover:scale-105 transition-transform duration-500">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
