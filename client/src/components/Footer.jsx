import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from 'react-icons/fa6';
import { useState } from 'react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Trending', path: '/shop?sort=trending' },
  { label: 'Shop', path: '/shop' },
  { label: 'Contact', path: '/contact' },
  { label: 'Size Guide', path: '/size-guide' },
  { label: 'Shipping Policy', path: '/shipping-policy' },
  { label: 'Return Policy', path: '/return-policy' }
];

const socialLinks = [
  { icon: FaInstagram, href: 'https://instagram.com/velore' },
  { icon: FaFacebookF, href: 'https://facebook.com/velore' },
  { icon: FaPinterestP, href: 'https://pinterest.com/velore' },
  { icon: FaTwitter, href: 'https://twitter.com/velore' }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="text-white font-display text-2xl tracking-[0.3em]">VELORE</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mt-3">
              Redefining modern menswear with timeless elegance. Crafted for the discerning gentleman who values quality, fit, and style.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D94F3D] hover:border-[#D94F3D] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-display text-base tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-[#D94F3D] text-sm tracking-wide transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display text-base tracking-wider mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:alonesurvivor03@gmail.com" className="text-white/50 hover:text-[#D94F3D] transition-colors duration-300">
alonesurvivor03@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919654673316" className="text-white/50 hover:text-[#D94F3D] transition-colors duration-300">
                  +91 96546 73316
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919654673316"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-[#D94F3D] transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </li>
              <li className="pt-2 text-white/30 text-xs tracking-wide">
                Mon–Sat, 10 AM – 7 PM IST
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display text-base tracking-wider mb-5">Newsletter</h4>
            <p className="text-white/40 text-sm mb-4 leading-relaxed">
              Subscribe for exclusive drops, early access, and 10% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#D94F3D] transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-[#D94F3D] text-white px-5 py-3 text-sm font-bold tracking-wider hover:bg-[#b33d2e] transition-colors duration-300 shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
            {subscribed && (
              <p className="text-[#D94F3D] text-xs mt-2 tracking-wide">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs tracking-wide">
            &copy; 2025 Velore. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-white/30 text-xs tracking-wide">
            <Link to="/privacy-policy" className="hover:text-[#D94F3D] transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D94F3D] transition-colors duration-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
