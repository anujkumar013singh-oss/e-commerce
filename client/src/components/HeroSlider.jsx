import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const slides = [
  { image: 'https://assets-jiocdn.ajio.com/v2/dry-wildflower-b77541/ajprod/original/ajio-prod/company/1/applications/6920511ba88a0b4351d486dc/theme/pictures/free/original/D-GFS-1.0-UHP-Z1-S2-MAINBANNER-P1-4080-18062026-1781709935233.jpeg', headline: 'Season\'s Best', subline: 'CURATED FOR THE MODERN WARDROBE', cta: 'SHOP NOW', link: '/shop' },
  { image: 'https://www.sugarcosmetics.com/cdn/shop/files/All-Heart-Makeup-Kit_3200-X-1600.jpg?v=1779970325&width=3200', headline: 'All Heart Kit', subline: 'COMPLETE YOUR LOOK', cta: 'EXPLORE', link: '/shop' },
  { image: 'https://assets-jiocdn.ajio.com/v2/dry-wildflower-b77541/ajprod/original/ajio-prod/company/1/applications/6920511ba88a0b4351d486dc/theme/pictures/free/original/D-GFS-1.0-UHP-Z1-S2-MAINBANNER-P6-NIKE-upto40-18062026-1781688790396.jpeg', headline: 'Nike Edit', subline: 'UP TO 40% OFF', cta: 'SHOP SPORTS', link: '/shop' },
  { image: 'https://images-static.nykaa.com/uploads/84955348-fa2f-438a-8b6e-c63a2a7c2b04.jpg?tr=cm-pad_resize,w-1800', headline: 'Beauty Drop', subline: 'FRESH ARRIVALS DAILY', cta: 'SHOP BEAUTY', link: '/shop' },
  { image: 'https://assets-jiocdn.ajio.com/v2/dry-wildflower-b77541/ajprod/original/ajio-prod/company/1/applications/6920511ba88a0b4351d486dc/theme/pictures/free/original/D-GFS-1.0-UHP-Z1-S3-Mainbanner-P12-Dnmx-Netplay-Min70-190626-1781780786646.jpeg', headline: 'Style Up', subline: 'MIN. 70% OFF — TOP BRANDS', cta: 'SHOP SALE', link: '/shop' },
  { image: 'https://www.sugarcosmetics.com/cdn/shop/files/249-sugar-store---LP-1600x400.jpg?v=1767362348&width=1600', headline: 'Sugar Store', subline: 'EXCLUSIVE DROPS', cta: 'SHOP NOW', link: '/shop' },
  { image: 'https://www.sugarcosmetics.com/cdn/shop/files/2000-off-on-4999--LP-1600x400.jpg?v=1774505308&width=1600', headline: 'Big Savings', subline: '₹2000 OFF ON ₹4999+', cta: 'SHOP OFFER', link: '/shop' },
  { image: 'https://ctfassetsprod.tatacliq.com/?url=https://images.ctfassets.net/69qx72t49ip2/5DvbhsNqwEMWvYFGKyvOpx/9d0f1762cb7ed709004fe1af409aabc5/WEB_Hero_Banner_1440x450_Lingerie_14052026.png', headline: 'Innerwear Edit', subline: 'COMFORT MEETS STYLE', cta: 'SHOP NOW', link: '/shop' },
  { image: 'https://ctfassetsprod.tatacliq.com/?url=https://images.ctfassets.net/69qx72t49ip2/7bxluRJZV78c0PNmAMg4WT/6d6ddb49cfa324bb2b5193b1dfac9455/WEB_Hero_Banner_1440x450_Sports_Shoes_14052026.png', headline: 'Sports Shoes', subline: 'GEAR UP FOR THE SEASON', cta: 'SHOP FOOTWEAR', link: '/shop' }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const textRef = useRef(null);
  const intervalRef = useRef(null);

  const animateText = useCallback((idx) => {
    const el = textRef.current;
    if (!el) return;
    const headline = el.querySelector('[data-headline]');
    const subline = el.querySelector('[data-subline]');
    const cta = el.querySelector('[data-cta]');
    const tl = gsap.timeline();
    tl.fromTo(headline, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(subline, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }, []);

  useEffect(() => { animateText(current); }, [current, animateText]);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (idx) => {
    clearInterval(intervalRef.current);
    setCurrent(idx);
    intervalRef.current = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 4000);
  };

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-[#1a1a1a]">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="absolute inset-0">
            <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover" loading={idx === 0 ? 'eager' : 'lazy'} />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      ))}
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-4 max-w-3xl">
          <h1 data-headline className="font-display text-white text-6xl md:text-8xl leading-tight mb-4">{slides[current].headline}</h1>
          <p data-subline className="text-white/80 text-sm md:text-base tracking-[0.25em] font-body mb-8">{slides[current].subline}</p>
          <div data-cta>
            <Link to={slides[current].link} className="inline-block pointer-events-auto border border-white text-white px-8 py-3 rounded-full text-sm tracking-widest font-medium transition-all duration-300 hover:bg-white hover:text-[#0A0A0A]">{slides[current].cta}</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${idx === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
