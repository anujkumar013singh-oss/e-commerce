import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const brandImages = [
  'https://images-static.nykaa.com/uploads/6d8209b6-05aa-4307-ade1-88a78912f6b2.jpg?tr=cm-pad_resize,w-1800',
  'https://images-static.nykaa.com/uploads/1a0f095d-3bba-484d-a05b-83c223c598d8.jpg?tr=cm-pad_resize,w-1800',
  'https://images-static.nykaa.com/uploads/718bdcc6-ca6d-4ce1-857f-1c9908b14905.jpg?tr=cm-pad_resize,w-1800',
  'https://images-static.nykaa.com/uploads/5a0ff83f-5e4e-404d-a056-fc4776b07b45.jpg?tr=cm-pad_resize,w-1800',
  'https://images-static.nykaa.com/uploads/61de9bb2-9072-42ae-89f5-190a50628304.jpg?tr=cm-pad_resize,w-1800',
];

export default function AutoBrandSlider() {
  const [[page, dir], setPage] = useState([0, 0]);
  const [loaded, setLoaded] = useState({});

  const paginate = useCallback((direction) => {
    setPage(([prev]) => [(prev + direction + brandImages.length) % brandImages.length, direction]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 3500);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative w-full h-[250px] overflow-hidden">
      <AnimatePresence custom={dir} mode="wait">
        <motion.img
          key={page}
          src={brandImages[page]}
          alt={`Brand ${page + 1}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: loaded[page] ? 1 : 0 }}
          onLoad={() => setLoaded((prev) => ({ ...prev, [page]: true }))}
        />
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {brandImages.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPage([i, i > page ? 1 : -1]); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === page ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
