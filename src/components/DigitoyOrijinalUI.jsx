import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Premium3DRings({ scrollProgress }) {
  const rotationY = useTransform(scrollProgress, [0, 1], [0, Math.PI * 4]);
  const ringScale = useTransform(scrollProgress, [0, 0.4, 1], [1.1, 0.85, 0.6]);

  return (
    <motion.group scale={ringScale} rotation-y={rotationY}>
      <mesh position={[-0.25, 0, 0]}>
        <torusGeometry args={[0.5, 0.07, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, -0.08, 0.15]} rotation={[0.4, 0.4, 0]}>
        <torusGeometry args={[0.45, 0.07, 16, 100]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
      </mesh>
    </motion.group>
  );
}

export default function DigitoyOrijinalUI() {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedPackage, setSelectedPackage] = useState('Premium');

  const { scrollYProgress } = useScroll();

  const ringsWidth = useTransform(scrollYProgress, [0, 0.35], ["100%", "45%"]);
  const ringsHeight = useTransform(scrollYProgress, [0, 0.35], ["40vh", "22vh"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.93]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.15, 0.35], [60, 0]);

  return (
    <div className="min-h-[170vh] bg-stone-50 text-stone-950 font-sans antialiased">

      <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 px-6 py-4 shadow-sm flex justify-between items-center">
        <span className="font-serif font-bold text-2xl tracking-wider">Digitoy<span className="text-amber-600">.az</span></span>
        <div className="flex items-center space-x-6 text-xs font-semibold text-stone-600">
          <div className="space-x-2">
            <button className="text-amber-700 font-bold border-b-2 border-amber-700">AZ</button>
            <button className="hover:text-stone-950">EN</button>
            <button className="hover:text-stone-950">RU</button>
          </div>
          <button className="bg-stone-100 hover:bg-stone-200 text-stone-950 px-4 py-2 rounded-xl transition-all">DEMO GÖR</button>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl shadow transition-all">ÖZÜN YARAT</button>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none mix-blend-multiply"
        >
          <source src="/rings-bg.mp4" type="video/mp4" />
        </video>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-4xl mx-auto text-center pt-16 pb-6 px-4 flex flex-col items-center justify-center"
        >
          <span className="text-[11px] tracking-widest text-amber-800 font-bold uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
            PREMIUM DIGITAL INVITATION
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-5 tracking-wide leading-tight max-w-2xl">
            Rəqəmsal Dəvətnamənizi <br /><span className="text-amber-700 italic">Özünüz Yaradın</span>
          </h1>
          <p className="text-stone-500 text-xs md:text-sm mt-4 max-w-sm font-medium">
            Toyunuz üçün premium rəqəmsal dəvətnamə. Qonaqlarınıza unudulmaz, zərif bir təcrübə bağışlayın.
          </p>
          <div className="flex space-x-3 mt-6">
            <button className="bg-stone-950 hover:bg-stone-900 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all">
              İNDİ BAŞLA
            </button>
            <button className="bg-white hover:bg-stone-50 text-stone-950 text-xs font-bold px-6 py-3 rounded-xl border border-stone-300 shadow-sm transition-all">
              NÜMUNƏYƏ BAX
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="sticky top-20 left-0 right-0 mx-auto z-30 pointer-events-none"
        style={{ width: ringsWidth, height: ringsHeight }}
      >
        <Canvas camera={{ position: [0, 0, 2.3], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1.5} />
          <Premium3DRings scrollProgress={scrollYProgress} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="max-w-6xl mx-auto px-4 mt-4 relative z-20"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-stone-200 p-1 rounded-xl shadow-sm flex space-x-1">
            <button onClick={() => setActiveTab('create')} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'create' ? 'bg-stone-950 text-white' : 'text-stone-500'}`}>
              Özün Yarat
            </button>
            <button onClick={() => setActiveTab('main')} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'main' ? 'bg-stone-950 text-white' : 'text-stone-500'}`}>
              Canlı Dəvətnamə
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <h2 className="text-xl font-serif font-bold text-stone-900">Məlumatları Daxil Edin</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">ADLAR</label>
                  <input type="text" defaultValue="Leyla & Murad" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-600 block mb-1">TARİX</label>
                    <input type="text" defaultValue="20.09.2025" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-bold text-stone-600 block mb-1">SAAT</label>
                    <input type="text" defaultValue="18:00" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl border border-stone-800">
                <h3 className="font-serif text-base font-bold text-amber-500 mb-3 border-b border-stone-800 pb-2">Sifariş Xülasəsi</h3>
                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="flex justify-between"><span>Mərasim:</span><span className="text-white">Toy Mərasimi</span></div>
                  <div className="flex justify-between"><span>Adlar:</span><span className="text-white">Leyla & Murad</span></div>
                  <div className="flex justify-between"><span>Tarix:</span><span className="text-amber-400">20.09.2025</span></div>
                  <div className="flex justify-between"><span>Paket:</span><span className="text-white">{selectedPackage} Paket</span></div>
                </div>
                <div className="mt-5 pt-4 border-t border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] block text-stone-500 font-bold uppercase">Məbləğ</span>
                    <span className="text-xl font-bold text-amber-400">
                      {selectedPackage === 'VIP' ? '149' : selectedPackage === 'Premium' ? '89' : '49'} AZN
                    </span>
                  </div>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                    Davam Et
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-serif font-bold text-stone-900">Toyunuza Uyğun Paketi Seçin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto text-xs">
            {['ƏSAS', 'PREMIUM', 'VIP'].map((pkg, idx) => (
              <div
                key={pkg}
                onClick={() => setSelectedPackage(pkg === 'ƏSAS' ? 'Əsas' : pkg === 'PREMIUM' ? 'Premium' : 'VIP')}
                className={`bg-white border p-5 rounded-xl text-center cursor-pointer transition-all ${selectedPackage.toUpperCase() === pkg ? 'border-amber-600 ring-2 ring-amber-100' : 'border-stone-200'}`}
              >
                <h4 className="font-serif font-bold text-sm text-stone-800">{pkg}</h4>
                <span className="text-xl font-bold text-stone-900 block mt-1">{idx === 0 ? '49' : idx === 1 ? '89' : '149'} AZN</span>
                <div className="text-left space-y-1.5 mt-3 text-stone-500 border-t pt-3 text-[11px]">
                  <p>✔ Geri sayım saatı</p>
                  <p>✔ Google Maps & Waze</p>
                  {idx >= 1 && <p>✔ Foto Qalereya</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-stone-400 text-[11px] py-10 border-t border-stone-200 mt-16">
          2026 Digitoy.az — Bütün hüquqlar qorunur.
        </footer>

      </motion.div>
    </div>
  );
}
