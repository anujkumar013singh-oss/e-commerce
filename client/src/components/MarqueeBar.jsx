const marqueeText = '✦ FESTIVAL SALE IS LIVE  ✦  FLAT 11% OFF SITEWIDE  ✦  FRIDAY SALE — LIMITED TIME  ✦  FREE SHIPPING ABOVE ₹999  ✦  SUMMER SPECIAL DROP  ✦  BEST SELLERS SELLING FAST  ✦  USE CODE: VELORE11  ✦';

export default function MarqueeBar() {
  return (
    <div className="w-full bg-[#D94F3D] h-10 flex items-center overflow-hidden fixed top-0 left-0 z-50">
      <div className="marquee-track flex items-center h-full gap-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="flex items-center h-full shrink-0 text-xs font-mono tracking-[0.2em] text-[#D94F3D] whitespace-nowrap px-4 leading-10">
            {marqueeText}
          </span>
        ))}
      </div>
    </div>
  );
}
