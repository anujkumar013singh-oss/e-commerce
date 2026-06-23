import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowUturnLeft, HiCreditCard, HiShieldCheck, HiXCircle } from 'react-icons/hi2';

export default function ReturnPolicy() {
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
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-wide mb-2">Return Policy</h1>
        <p className="text-sm text-[#2C2C2C]/60 mb-8">Hassle-free returns within 15 days.</p>

        <div className="space-y-8">
          <div className="flex gap-4">
            <HiArrowUturnLeft className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Returns & Exchanges</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                We accept returns and exchanges within 15 days of delivery. Items must be unworn, unwashed, and with all tags attached. Returns are accepted for size issues, defects, or if you simply change your mind.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiCreditCard className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Refunds</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method. In case of UPI payments, refunds are initiated to the same UPI ID.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiShieldCheck className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Defective or Wrong Items</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                If you receive a defective, damaged, or incorrect item, please contact us within 48 hours of delivery. We will arrange a free pick-up and send a replacement or issue a full refund, including any shipping charges.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <HiXCircle className="w-6 h-6 text-[#D94F3D] mt-1 shrink-0" />
            <div>
              <h2 className="font-display text-xl text-[#0A0A0A] tracking-wide mb-2">Non-Returnable Items</h2>
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                Items marked as "Final Sale" or "Non-Returnable" on the product page cannot be returned or exchanged. Innerwear, socks, and personalized items are also non-returnable for hygiene reasons.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-[#FFFFFF] border border-[#2C2C2C]/10">
          <h2 className="font-display text-lg text-[#0A0A0A] tracking-wide mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[#2C2C2C]/70">
            <li>Email us at <a href="mailto:support@velore.in" className="text-[#D94F3D] hover:underline">support@velore.in</a> with your order ID and reason for return.</li>
            <li>Our team will review your request and share a return authorization within 24 hours.</li>
            <li>Pack the item securely with all tags and original packaging.</li>
            <li>Schedule a pick-up or ship the item to the address provided by our team.</li>
            <li>Once received and inspected, your refund or exchange will be processed.</li>
          </ol>
        </div>
      </section>
    </motion.div>
  );
}
