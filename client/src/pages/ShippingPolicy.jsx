import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiTruck, HiClock, HiMapPin, HiCheckCircle } from 'react-icons/hi2';

export default function ShippingPolicy() {
  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="pt-28 pb-14 max-w-3xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2C2C2C]/50 hover:text-[#D94F3D] transition-colors mb-8 font-mono tracking-wider">
          <HiArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-wide mb-2">Shipping Policy</h1>
        <p className="text-sm text-[#2C2C2C]/60 mb-8">How we deliver your orders.</p>

        <div className="space-y-8">
          <div className="flex gap-4">
            <HiTruck className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Delivery Timeline</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                Orders are processed within 1-2 business days after payment confirmation. Standard delivery takes 5-7 business days across India. Metro cities typically receive orders within 3-5 business days.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiClock className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Order Processing</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                Orders placed before 2 PM IST are processed the same day. Orders placed after 2 PM IST or on weekends/holidays are processed the next business day. You will receive a confirmation email once your order is shipped.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiMapPin className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Shipping Locations</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                We ship to all pin codes across India. International shipping is currently not available. Delivery to remote or difficult-to-access locations may take additional 2-3 business days.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiCheckCircle className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Shipping Charges</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                Free shipping on all orders above ₹999. A flat shipping fee of ₹49 is applicable on orders below ₹999. No hidden charges — all taxes and duties are included in the product price.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-[#FFFFFF] border border-[#2C2C2C]/10">
          <h2 className="font-display text-lg text-[#0A0A0A] tracking-wide mb-3">Tracking Your Order</h2>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
            Once your order is shipped, you will receive a tracking ID via email and SMS. You can track your order on our <Link to="/contact" className="text-[#D94F3D] hover:underline">Contact page</Link> or directly through the courier partner's website.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
