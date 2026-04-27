"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, MapPin, BedDouble, Bath, Square, Wifi, Wind, Car, Waves, Map, Phone, X } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const allProperties = [
  { id: 1, title: "Moonsoon Villa", price: "850 000 сум", location: "Юнусабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 120, type: "В аренду", rating: 4.8, img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id: 2, title: "Navana House", price: "600 000 сум", location: "Мирзо-Улугбекский р-н, Ташкент", beds: 2, baths: 1, sqft: 85, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  { id: 3, title: "Skyline Loft", price: "1 200 000 сум", location: "Яккасарайский р-н, Ташкент", beds: 4, baths: 3, sqft: 200, type: "В аренду", rating: 5.0, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { id: 4, title: "Urban Studio", price: "450 000 сум", location: "Чиланзарский р-н, Ташкент", beds: 1, baths: 1, sqft: 45, type: "В аренду", rating: 4.7, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80" },
  { id: 5, title: "Forest Cabin", price: "500 000 сум", location: "Бектемирский р-н, Ташкент", beds: 1, baths: 1, sqft: 50, type: "В аренду", rating: 4.5, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80" },
  { id: 6, title: "Ocean View", price: "950 000 сум", location: "Мирабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 140, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80" },
  { id: 7, title: "Metro Flat", price: "350 000 сум", location: "Алмазарский р-н, Ташкент", beds: 1, baths: 1, sqft: 35, type: "В аренду", rating: 4.6, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
  { id: 8, title: "Elite Estate", price: "1 500 000 сум", location: "Шайхантахурский р-н", beds: 5, baths: 4, sqft: 300, type: "Продажа", rating: 5.0, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
];

export function PropertyModalClient() {
  const params = useParams();
  const router = useRouter();
  const { toggleLike, liked } = useAppContext();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const property = useMemo(() => {
    return allProperties.find(p => p.id === Number(params.id)) || allProperties[0];
  }, [params.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const galleryImages = [
    property.img,
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
  ];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setIsScrolled(containerRef.current.scrollTop > 50);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => router.back()} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer" />

      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 35, stiffness: 300 }}
        className="relative w-full max-w-md mx-auto h-[85vh] bg-white rounded-t-[3rem] overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.15)] flex flex-col"
      >
        <div className={`absolute top-0 left-0 right-0 z-[10001] px-5 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm pt-4 pb-4' : 'bg-transparent pt-10 pb-4'}`}>
          {!isScrolled && (
            <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
              <div className="w-12 h-1.5 bg-slate-200/50 rounded-full" />
            </div>
          )}
          <button onClick={() => router.back()} className={`h-[40px] w-[40px] rounded-full flex items-center justify-center active:scale-90 transition-all border ${isScrolled ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-white/20 backdrop-blur-md border-white/30 text-white'}`}>
            <ChevronLeft className="h-6 w-6 ml-[-2px]" strokeWidth={1} />
          </button>
          <button className={`h-[40px] w-[40px] rounded-full flex items-center justify-center active:scale-90 transition-all border ${isScrolled ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-white/20 backdrop-blur-md border-white/30 text-white'}`}>
            <Upload className="h-5 w-5" strokeWidth={1} />
          </button>
        </div>

        <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
          <div className="relative h-[380px] w-full bg-slate-100 -mt-20">
            <Image src={galleryImages[activeImageIndex]} alt={property.title} fill className="object-cover" onClick={() => setIsGalleryOpen(true)} />
            <div className="absolute bottom-14 left-0 right-0 w-full flex flex-col items-center">
              <div className="flex gap-2 mb-1 px-5 py-2 overflow-x-auto snap-x snap-mandatory no-scrollbar w-full justify-center">
                {galleryImages.map((imgUrl, idx) => (
                  <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative h-[50px] w-[50px] rounded-[12px] snap-center overflow-hidden flex-shrink-0 shadow-sm transition-all ${activeImageIndex === idx ? 'border-[2px] border-white ring-2 ring-white/50 scale-[1.08]' : 'opacity-80 hover:opacity-100'}`}>
                    <Image src={imgUrl} alt={`gallery ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {galleryImages.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative -mt-10 bg-white rounded-t-[2.5rem] px-5 pt-10 pb-32">
            <div className="flex justify-between items-start mb-6">
              <div className="pr-3">
                <h1 className="text-[22px] font-black text-slate-600 leading-tight mb-1.5">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400" strokeWidth={1} />
                  <span className="text-[14px] font-semibold">{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                 <button className="h-[44px] w-[44px] rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-900 active:scale-90 transition-transform"><Map className="h-5 w-5" strokeWidth={1} /></button>
                 <button className="h-[44px] w-[44px] rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-900 active:scale-90 transition-transform"><Phone className="h-5 w-5" strokeWidth={1} /></button>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[14px] text-slate-600 font-medium leading-relaxed">Просторная и светлая вилла с панорамным видом на город. Дизайнерский интерьер, современная техника и всё необходимое для комфортного проживания.</p>
              <button className="text-[#007AFF] text-[13px] font-bold mt-1.5">Читать далее</button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {[{ icon: BedDouble, label: "Спальни", val: property.beds }, { icon: Bath, label: "Ванные", val: property.baths }, { icon: Square, label: "Площадь", val: `${property.sqft}м²` }].map((s, i) => (
                <div key={i} className="bg-[#F8F9FB] border border-slate-50 py-3 px-1 rounded-[1.25rem] flex flex-col items-center justify-center">
                  <s.icon className="h-4 w-4 text-[#007AFF] mb-1.5" strokeWidth={1} />
                  <span className="text-[14px] font-black text-slate-600 leading-tight">{s.val}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h3 className="text-[18px] font-black text-slate-600 mb-5">Удобства</h3>
              <div className="flex flex-col gap-3">
                {[{ icon: Wifi, label: "Высокоскоростной Wi-Fi 5G" }, { icon: Wind, label: "Центральное кондиционирование" }, { icon: Car, label: "Охраняемая парковка 24/7" }, { icon: Waves, label: "Собственный бассейн" }].map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-900 flex-shrink-0"><a.icon className="h-4.5 w-4.5" strokeWidth={1} /></div>
                    <div className="flex-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0"><span className="text-[14px] font-semibold text-slate-600 leading-tight">{a.label}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-[18px] font-black text-slate-600 mb-4">Местоположение</h3>
              <div className="relative h-[200px] w-full rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-[10002] px-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-[360px] bg-white h-[70px] rounded-[2rem] px-2 pl-6 pr-2 flex items-center justify-between shadow-[0_15px_50px_rgba(0,0,0,0.12)] border border-slate-100 pointer-events-auto">
            <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Цена за ночь</span><span className="text-[18px] font-black text-slate-600 tracking-tight">{property.price}</span></div>
            <button className="h-[54px] px-8 bg-[#007AFF] text-white rounded-[1.75rem] text-[14px] font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center">Забронировать</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[20000] bg-black flex flex-col items-center justify-center">
             <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-20">
                <span className="text-white font-black text-[15px]">{activeImageIndex + 1} / {galleryImages.length}</span>
                <button onClick={() => setIsGalleryOpen(false)} className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"><X className="h-6 w-6" strokeWidth={1} /></button>
             </div>
             <div className="relative w-full h-full flex items-center justify-center px-2">
                <button onClick={prevImage} className="absolute left-4 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"><ChevronLeft className="h-6 w-6" strokeWidth={1} /></button>
                <AnimatePresence mode="wait"><motion.div key={activeImageIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, ease: "easeOut" }} className="relative w-full h-[65vh]"><Image src={galleryImages[activeImageIndex]} alt="Full Gallery" fill className="object-contain" /></motion.div></AnimatePresence>
                <button onClick={nextImage} className="absolute right-4 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"><ChevronRight className="h-6 w-6" strokeWidth={1} /></button>
             </div>
             <div className="absolute bottom-10 left-0 right-0 px-6 overflow-x-auto no-scrollbar z-20 py-4">
                <div className="flex gap-4 justify-center items-center h-20">
                   {galleryImages.map((img, idx) => (
                     <button key={idx} onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }} className={`relative h-14 w-14 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${activeImageIndex === idx ? 'border-[#007AFF] scale-110' : 'border-transparent opacity-40'}`}><Image src={img} alt="thumb" fill className="object-cover" /></button>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
