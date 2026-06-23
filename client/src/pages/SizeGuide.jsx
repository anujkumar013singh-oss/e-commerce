import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi2';

const sizes = [
  { size: 'XS', chest: '34-36', chestCm: '86-91', waist: '28-30', waistCm: '71-76', hip: '34-36', hipCm: '86-91', shoulder: '16-17', shoulderCm: '41-43' },
  { size: 'S', chest: '36-38', chestCm: '91-96', waist: '30-32', waistCm: '76-81', hip: '36-38', hipCm: '91-96', shoulder: '17-18', shoulderCm: '43-46' },
  { size: 'M', chest: '38-40', chestCm: '96-102', waist: '32-34', waistCm: '81-86', hip: '38-40', hipCm: '96-102', shoulder: '18-19', shoulderCm: '46-48' },
  { size: 'L', chest: '40-42', chestCm: '102-107', waist: '34-36', waistCm: '86-91', hip: '40-42', hipCm: '102-107', shoulder: '19-20', shoulderCm: '48-51' },
  { size: 'XL', chest: '42-44', chestCm: '107-112', waist: '36-38', waistCm: '91-96', hip: '42-44', hipCm: '107-112', shoulder: '20-21', shoulderCm: '51-53' },
  { size: 'XXL', chest: '44-46', chestCm: '112-117', waist: '38-40', waistCm: '96-102', hip: '44-46', hipCm: '112-117', shoulder: '21-22', shoulderCm: '53-56' },
  { size: 'XXXL', chest: '46-48', chestCm: '117-122', waist: '40-42', waistCm: '102-107', hip: '46-48', hipCm: '117-122', shoulder: '22-23', shoulderCm: '56-58' }
];

export default function SizeGuide() {
  return (
    <motion.div
      className="bg-[#FFFFFF] min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="pt-28 pb-14 max-w-4xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2C2C2C]/50 hover:text-[#D94F3D] transition-colors mb-8 font-mono tracking-wider">
          <HiArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-wide mb-2">Size Guide</h1>
        <p className="text-sm text-[#2C2C2C]/60 mb-8">Find your perfect fit with our detailed sizing chart.</p>

        <p className="text-sm text-[#2C2C2C] mb-6">All measurements are in inches and centimeters. For the best fit, measure your body and compare with the chart below.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#2C2C2C]/10">
            <thead>
              <tr className="bg-[#D94F3D] text-white">
                <th className="p-3 text-left font-medium">Size</th>
                <th className="p-3 text-left font-medium">Chest (in)</th>
                <th className="p-3 text-left font-medium">Chest (cm)</th>
                <th className="p-3 text-left font-medium">Waist (in)</th>
                <th className="p-3 text-left font-medium">Waist (cm)</th>
                <th className="p-3 text-left font-medium">Hip (in)</th>
                <th className="p-3 text-left font-medium">Hip (cm)</th>
                <th className="p-3 text-left font-medium">Shoulder (in)</th>
                <th className="p-3 text-left font-medium">Shoulder (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s, i) => (
                <tr key={s.size} className={i % 2 === 0 ? 'bg-[#FFFFFF]/50' : 'bg-white'}>
                  <td className="p-3 font-bold text-[#D94F3D] border border-[#2C2C2C]/5">{s.size}</td>
                  <td className="p-3 border border-[#2C2C2C]/5">{s.chest}</td>
                  <td className="p-3 text-[#2C2C2C]/70 border border-[#2C2C2C]/5">{s.chestCm}</td>
                  <td className="p-3 border border-[#2C2C2C]/5">{s.waist}</td>
                  <td className="p-3 text-[#2C2C2C]/70 border border-[#2C2C2C]/5">{s.waistCm}</td>
                  <td className="p-3 border border-[#2C2C2C]/5">{s.hip}</td>
                  <td className="p-3 text-[#2C2C2C]/70 border border-[#2C2C2C]/5">{s.hipCm}</td>
                  <td className="p-3 border border-[#2C2C2C]/5">{s.shoulder}</td>
                  <td className="p-3 text-[#2C2C2C]/70 border border-[#2C2C2C]/5">{s.shoulderCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-[#FFFFFF] border border-[#2C2C2C]/10">
          <h3 className="font-display text-lg text-[#0A0A0A] mb-3 tracking-wide">How to Measure</h3>
          <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
            <li><strong className="text-[#0A0A0A]">Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
            <li><strong className="text-[#0A0A0A]">Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
            <li><strong className="text-[#0A0A0A]">Hip:</strong> Measure around the fullest part of your hips.</li>
            <li><strong className="text-[#0A0A0A]">Shoulder:</strong> Measure from the edge of one shoulder to the other.</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-[#FFFFFF] border border-[#2C2C2C]/10">
          <h3 className="font-display text-lg text-[#0A0A0A] mb-3 tracking-wide">Fit Guide</h3>
          <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
            <li><strong className="text-[#0A0A0A]">Slim Fit:</strong> Closer to the body, tailored silhouette.</li>
            <li><strong className="text-[#0A0A0A]">Regular Fit:</strong> Classic fit with room through chest and waist.</li>
            <li><strong className="text-[#0A0A0A]">Relaxed Fit:</strong> Extra room for comfort and ease of movement.</li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
}
