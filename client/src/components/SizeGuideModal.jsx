import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const sizes = [
  { size: 'XS', chest: '34-36', chestCm: '86-91', waist: '28-30', waistCm: '71-76', hip: '34-36', hipCm: '86-91', shoulder: '16-17', shoulderCm: '41-43' },
  { size: 'S', chest: '36-38', chestCm: '91-96', waist: '30-32', waistCm: '76-81', hip: '36-38', hipCm: '91-96', shoulder: '17-18', shoulderCm: '43-46' },
  { size: 'M', chest: '38-40', chestCm: '96-102', waist: '32-34', waistCm: '81-86', hip: '38-40', hipCm: '96-102', shoulder: '18-19', shoulderCm: '46-48' },
  { size: 'L', chest: '40-42', chestCm: '102-107', waist: '34-36', waistCm: '86-91', hip: '40-42', hipCm: '102-107', shoulder: '19-20', shoulderCm: '48-51' },
  { size: 'XL', chest: '42-44', chestCm: '107-112', waist: '36-38', waistCm: '91-96', hip: '42-44', hipCm: '107-112', shoulder: '20-21', shoulderCm: '51-53' },
  { size: 'XXL', chest: '44-46', chestCm: '112-117', waist: '38-40', waistCm: '96-102', hip: '44-46', hipCm: '112-117', shoulder: '21-22', shoulderCm: '53-56' },
  { size: 'XXXL', chest: '46-48', chestCm: '117-122', waist: '40-42', waistCm: '102-107', hip: '46-48', hipCm: '117-122', shoulder: '22-23', shoulderCm: '56-58' }
];

export default function SizeGuideModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-[#F5F5F5]">
              <h2 className="font-display text-2xl text-[#0A0A0A]">Size Guide</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#FFFFFF] rounded-full transition-colors">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#2C2C2C] mb-6">All measurements are in inches and centimeters. For the best fit, measure your body and compare with the chart below.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                        <td className="p-3 font-bold text-[#D94F3D]">{s.size}</td>
                        <td className="p-3">{s.chest}</td>
                        <td className="p-3 text-[#2C2C2C]/70">{s.chestCm}</td>
                        <td className="p-3">{s.waist}</td>
                        <td className="p-3 text-[#2C2C2C]/70">{s.waistCm}</td>
                        <td className="p-3">{s.hip}</td>
                        <td className="p-3 text-[#2C2C2C]/70">{s.hipCm}</td>
                        <td className="p-3">{s.shoulder}</td>
                        <td className="p-3 text-[#2C2C2C]/70">{s.shoulderCm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-[#FFFFFF] rounded-lg">
                <h3 className="font-medium text-sm mb-2">How to Measure</h3>
                <ul className="text-xs text-[#2C2C2C]/70 space-y-1">
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
                  <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
                  <li><strong>Shoulder:</strong> Measure from the edge of one shoulder to the other.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
