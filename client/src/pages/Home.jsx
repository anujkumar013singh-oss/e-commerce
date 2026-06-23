import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import HeroSlider from '../components/HeroSlider';
import CategoryBoxes from '../components/CategoryBoxes';
import AutoBrandSlider from '../components/AutoBrandSlider';

const marqueeImages = [
  'https://ctfassetsprod.tatacliq.com/?url=https://images.ctfassets.net/69qx72t49ip2/RfbYn7Sv7dUpxalnUKoz2/b933a754f1bb1f93134ce9baa0a1396c/WEB_Hero_Banner_1440x450_Ethnic_Wear_14052026.png',
  'https://ctfassetsprod.tatacliq.com/?url=https://images.ctfassets.net/69qx72t49ip2/3jEpSdr2MAEPCVTvpNvPSp/5b29a94388276c7af96e499054e02f9d/WEB_Hero_Banner_1440x450_Westernwear_14052026.png',
  'https://images-static.nykaa.com/creatives/3d9e13e6-9a14-461a-938a-80b5c72ccba4/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/bcbf66e5-5b59-4b42-96d4-63f3d2c5238e/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/44a70e43-4c33-4ec2-a9d8-637a036a4d5b/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/8f6b1f82-59bf-422d-8ed5-26b0caa39263/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/756a32bb-2c41-4620-ba2b-71307e891622/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/779624f5-e56b-4ff6-b646-028a354f39b1/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/d9f71f02-a1bb-4815-85a0-2274e614c81f/default.png?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/bcbf66e5-5b59-4b42-96d4-63f3d2c5238e/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/c0e1393e-8cb0-4df3-828b-becd3e41b09d/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/2fc47383-1013-4108-b75d-1cb52d5e3d35/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/1137231a-a6ff-49a6-8cb7-e8d1c58203fe/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/495003cf-11f2-4147-8509-d6a213ba2e97/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/uploads/85a38044-88fa-4a77-8584-5eeca92e2074.jpg?tr=cm-pad_resize,w-900'
];

const marqueeImages2 = [
  'https://images-static.nykaa.com/creatives/df4174a0-a108-4207-806c-6a49b4470f94/default.png?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/ed5fdd25-7f93-4a28-9984-a889c0e76d30/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/0236db62-8a7d-41c1-af98-9ce11572a156/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/92995669-3729-4fc5-9172-786344e3dace/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/44e32624-a533-449e-bbd7-a1d01f41e696/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/656c94b4-a871-469e-99da-b8a4248fa860/default.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/creatives/583e71f0-423d-4ace-bb54-cee35d9f52e0/default.jpeg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/uploads/dea80cc9-d717-41b0-97b2-41a00ee72474.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/20d84e37-3124-4691-b982-abb4cac64c86.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/bb043650-8513-4d5b-a55d-b81f266e7234.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/5b420a49-0940-4115-9615-67adf85720ea.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/39bcf169-7eb4-40e3-b6fc-1fb1f9f4fd03.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/11fdfc0e-bfa6-450c-b2de-1f66352e5f27.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/5da28406-8800-4d95-b64b-6bfa4750a6a3.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/3390b40f-7c07-403e-90b7-aa76de95b5b4.jpg?tr=cm-pad_resize,w-450',
  'https://images-static.nykaa.com/uploads/5aa8ba8b-8a32-497f-aabc-941581c1cc8a.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/uploads/f3ba4add-4f2a-4c51-856d-363dade8d435.jpg?tr=cm-pad_resize,w-900',
  'https://images-static.nykaa.com/uploads/35a2e613-ed77-474d-bd02-feba4b50406e.jpg?tr=cm-pad_resize,w-1800'
];

export default function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean);
    if (sections.length) {
      gsap.fromTo(
        sections,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sections,
            start: 'top 80%'
          }
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <motion.div
      className="bg-[#FFFFFF] overflow-x-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner */}
      <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-[#1a1a1a]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://ik.imagekit.io/vxqem8zrj/M&S%20Men%20s%20Style_%20The%20Art%20of%20Tailoring%20-%20TV%20AD%202016_1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-[#1a1a1a]/20" />
      </section>

      {/* Marquee */}
      <div className="w-full bg-white h-14 flex items-center overflow-hidden border-y border-red-200">
        <div className="marquee-track flex items-center h-full gap-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="flex items-center h-full shrink-0 text-base font-mono tracking-[0.2em] text-red-600 font-bold whitespace-nowrap px-8">
              ✦ FESTIVAL SALE IS LIVE  ✦  FLAT 11% OFF SITEWIDE  ✦  FREE SHIPPING ABOVE ₹999  ✦  USE CODE: VELORE11  ✦
            </span>
          ))}
        </div>
      </div>

      <HeroSlider />

      <div ref={(el) => (sectionsRef.current[0] = el)} className="reveal-section">
        <CategoryBoxes />
      </div>

      {/* CURATED SELECTION - IMAGE MARQUEE */}
      <section className="pt-0 pb-6 md:pt-0 md:pb-8 overflow-hidden bg-[#FFFFFF]">
        {/* Brand Logo Slider */}
        <div className="w-full px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <p className="text-[#D94F3D] text-xs font-mono tracking-[0.25em] mb-2">SAVE BIG TODAY</p>
            <h2 className="font-display text-2xl md:text-3xl text-[#0A0A0A] tracking-wide">DISCOUNTS OFF NOW</h2>
            <div className="w-8 h-px bg-[#D94F3D] mx-auto mt-2" />
          </motion.div>
          <AutoBrandSlider />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 px-4"
        >
          <p className="text-[#D94F3D] text-xs font-mono tracking-[0.25em] mb-3">SHOP BY BRAND</p>
          <h2 className="font-display text-4xl md:text-5xl text-[#0A0A0A] tracking-wide">AVAILABLE BRANDS</h2>
          <div className="w-12 h-px bg-[#D94F3D] mx-auto mt-4" />
        </motion.div>

        <div className="relative">
          {/* Row 1 - sliding left */}

          <div className="marquee-row flex mb-4">
            <div className="marquee-track-left flex shrink-0">
              {[...Array(3)].flatMap((_, dupIdx) =>
                marqueeImages.map((img, i) => (
                  <Link key={`r1-${dupIdx}-${i}`} to="/shop" className="relative block shrink-0 w-[280px] md:w-[380px] h-[200px] md:h-[260px] overflow-hidden group mx-3">
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-all duration-500" />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Row 2 - sliding right */}

          <div className="marquee-row flex">
            <div className="marquee-track-right flex shrink-0">
              {[...Array(3)].flatMap((_, dupIdx) =>
                [...marqueeImages2].reverse().map((img, i) => (
                  <Link key={`r2-${dupIdx}-${i}`} to="/shop" className="relative block shrink-0 w-[280px] md:w-[380px] h-[200px] md:h-[260px] overflow-hidden group mx-3">
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-all duration-500" />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#FFFFFF] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#FFFFFF] to-transparent z-10" />
        </div>
      </section>

    </motion.div>
  );
}
