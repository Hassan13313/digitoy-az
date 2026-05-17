import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// ============================================================================
// 10 & 17. AZƏRBAYCAN TARİX VƏ DİL FORMATLAMASI ÜÇÜN KÖMƏKÇİ FUNKSİYA
// ============================================================================
const formatAzDate = (dateStr) => {
  if (!dateStr) return "01 Yanvar 2026, Bazar ertəsi";
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"
  ];
  const days = [
    "Bazar günü", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"
  ];

  try {
    const [day, month, year] = dateStr.split('.');
    const dateObj = new Date(`${year}-${month}-${day}`);
    if (isNaN(dateObj.getTime())) return dateStr;

    const monthName = months[dateObj.getMonth()];
    const dayName = days[dateObj.getDay()];
    return `${parseInt(day)} ${monthName} ${year}, ${dayName}`;
  } catch (e) {
    return dateStr;
  }
};

// ============================================================================
// 11. QIZIL ALYANS ÜZÜKLƏRİ (3D ANIMASIYA KOMPONENTİ)
// ============================================================================
function GoldWeddingRings() {
  const ring1 = useRef();
  const ring2 = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (ring1.current && ring2.current) {
      ring1.current.rotation.x = mouse.y * 0.4;
      ring1.current.rotation.y = mouse.x * 0.4 + 0.5;
      ring2.current.rotation.x = mouse.y * 0.3;
      ring2.current.rotation.y = -mouse.x * 0.3 + 0.8;
    }
  });

  return (
    <group>
      <mesh ref={ring1} position={[-0.35, 0, 0]}>
        <torusGeometry args={[0.55, 0.07, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh ref={ring2} position={[0.35, -0.08, 0.15]}>
        <torusGeometry args={[0.5, 0.07, 16, 100]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  );
}

// ============================================================================
// ƏSAS APPLİKASİYA KOMPONENTİ
// ============================================================================
export default function PremiumInvitationApp() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const [eventData, setEventData] = useState({
    eventType: 'Toy',
    customEventName: '',
    title: 'Leyla & Murad',
    date: '20.09.2025',
    time: '18:00',
    googleMapsUrl: 'https://maps.google.com',
    wazePlaceName: 'Mala Praga',
    dressCodeStyle: 'Elegant',
    dressCodeNote: 'Zəhmət olmasa geyimlərdə tünd rənglərdən qaçınasınız.',
    rsvpDeadline: '01.01.2026',
    photoAlbumUrl: 'https://digitoy.az/album',
    schedule: [
      { id: 1, time: '18:00', title: 'Qonaqların qarşılanması', icon: '🥂' },
      { id: 2, time: '23:00', title: 'Tortun kəsilməsi', icon: '🎂' }
    ]
  });

  const [rsvpAnalytics] = useState({ yesCount: 142, noCount: 19, totalGuests: 161 });
  const [guestSearch, setGuestSearch] = useState('');

  const availableIcons = [
    { icon: '🥂', label: 'Qonaqların qarşılanması' },
    { icon: '👰🤵', label: 'Bəy gəlinin daxil olması' },
    { icon: '🪕', label: 'Milli musiqilər' },
    { icon: '🕺', label: 'Diskoteka' },
    { icon: '🎂', label: 'Tortun kəsilməsi' },
    { icon: '🎯', label: 'Oyunların oynanılması' },
    { icon: '🎤', label: 'Karaoke' },
    { icon: '📸', label: 'Fotosessiya' },
    { icon: '🍽️', label: 'Yemək fasiləsi' },
    { icon: '🚪', label: 'Bitiş / Yola salma' }
  ];

  const dressCodeStyles = {
    Casual: { label: 'Casual (Gündəlik Rahat)', icons: '🤵 🤵‍♀️', desc: 'Sadə, rahat və dəbli gündəlik geyim.' },
    Elegant: { label: 'Elegant (Klassik Zərif)', icons: '💡 👗', desc: 'Rəsmi, zərif və klassik ziyafət geyimləri.' },
    SmartCasual: { label: 'Smart Casual (Yarı-Rəsmi)', icons: '🧥 👚', desc: 'Həm rahat, həm də yarı-rəsmi professional geyim.' },
    Cocktail: { label: 'Cocktail (Şənlik/Kokteyl)', icons: '🦺 👑', desc: 'Şənlik və kokteyl ab-havasına uyğun rəngarəng, şık geyim.' }
  };

  const seatingPlan = [
    { name: "Leyla Murad", table: "Masa 1" },
    { name: "Arif Əliyev", table: "Masa 2" },
    { name: "Aysel Məmmədova", table: "Masa 1" },
    { name: "Rəşad Həsənov", table: "Masa 3" }
  ];

  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', title: '', icon: '🥂' });
  const handleAddSchedule = () => {
    if (!newScheduleItem.time || !newScheduleItem.title) return;
    setEventData({
      ...eventData,
      schedule: [...eventData.schedule, { ...newScheduleItem, id: Date.now() }]
    });
    setNewScheduleItem({ time: '', title: '', icon: '🥂' });
  };

  const currentEventName = eventData.eventType === 'Digər' ? (eventData.customEventName || 'Özəl Tədbir') : eventData.eventType;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 font-sans antialiased">

      {/* ZƏRF ANİMASİYASI */}
      <AnimatePresence>
        {!envelopeOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100 p-4"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div
              className="relative w-full max-w-md h-[420px] bg-amber-50/90 rounded-2xl shadow-2xl cursor-pointer overflow-hidden border border-amber-200/40 flex flex-col items-center justify-center p-6 text-center"
              onClick={() => setEnvelopeOpened(true)}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-amber-100 origin-top border-b border-amber-200/60 z-30"
                animate={envelopeOpened ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                style={{ transformPerspective: 1000 }}
              />

              <motion.div
                className="bg-white w-11/12 h-5/6 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center border border-stone-200/50 z-10"
                animate={envelopeOpened ? { y: -20 } : { y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <AnimatePresence>
                  {envelopeOpened && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[10px] tracking-widest text-amber-800 uppercase font-bold mb-2">Xüsusi Dəvətnamə</span>
                      <h2 className="font-serif text-3xl font-bold text-stone-800">{eventData.title}</h2>
                      <p className="text-amber-700 text-xs italic mt-1">{currentEventName} Mərasimi</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-amber-50 border-t border-amber-100/50 z-20 flex items-center justify-center">
                <span className="text-stone-600 font-serif text-xs bg-white px-5 py-2 rounded-full shadow-sm border border-stone-100">
                  Dəvətnaməni Açın ✨
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVİQASİYA */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-serif font-bold text-xl tracking-wider">Digitoy<span className="text-amber-600">.az</span></span>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'create' ? 'bg-white shadow text-stone-950' : 'text-stone-500'}`}
            >
              Özün Yarat
            </button>
            <button
              onClick={() => setActiveTab('main')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'main' ? 'bg-white shadow text-stone-950' : 'text-stone-500'}`}
            >
              Canlı Dəvətnamə
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* PANEL 1: ÖZÜN YARAT */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-800">Rəqəmsal Dəvətnamə Qurucusu</h2>
                <p className="text-stone-500 text-xs mt-0.5">Məlumatları daxil edin, dəvətnaməniz anında hazırlansın.</p>
              </div>

              {/* MƏRASİM NÖVÜ */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Mərasim Növü</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['Toy', 'Xınayaxdı', 'Ad günü', 'Korporativ', 'Digər'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventData({ ...eventData, eventType: type })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${eventData.eventType === type ? 'bg-stone-950 text-white border-stone-950 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {eventData.eventType === 'Digər' && (
                  <input
                    type="text"
                    placeholder="Tədbirin növünü özünüz yazın (örn: Nişan, Yubiley)"
                    value={eventData.customEventName}
                    onChange={(e) => setEventData({ ...eventData, customEventName: e.target.value })}
                    className="w-full mt-2 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* ADLAR, TARİX, SAAT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600">Adlar (Gəlin & Bəy)</label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600">Tarix (GG.AA.İİİİ)</label>
                  <input
                    type="text"
                    placeholder="20.09.2025"
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600">Saat</label>
                  <input
                    type="text"
                    placeholder="18:00"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* MƏKAN VƏ NAVİQASİYA */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">📍 Məkan & Naviqasiya Məlumatları</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Google Maps Linki</label>
                    <input
                      type="text"
                      value={eventData.googleMapsUrl}
                      onChange={(e) => setEventData({ ...eventData, googleMapsUrl: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Waze üçün Məkan Adı</label>
                    <input
                      type="text"
                      placeholder="Məsələn: Mala Praga"
                      value={eventData.wazePlaceName}
                      onChange={(e) => setEventData({ ...eventData, wazePlaceName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DRESS CODE */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Dress Code Stili</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(dressCodeStyles).map((styleKey) => (
                    <button
                      key={styleKey}
                      type="button"
                      onClick={() => setEventData({ ...eventData, dressCodeStyle: styleKey })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${eventData.dressCodeStyle === styleKey ? 'bg-amber-50/70 border-amber-500 shadow-sm' : 'bg-stone-50 border-stone-200'}`}
                    >
                      <span className="text-lg mb-1">{dressCodeStyles[styleKey].icons}</span>
                      <span className="text-[11px] font-bold block text-stone-900">{styleKey}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-600 block">Qonaqlar üçün xüsusi qeyd</label>
                  <input
                    type="text"
                    value={eventData.dressCodeNote}
                    onChange={(e) => setEventData({ ...eventData, dressCodeNote: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* PROQRAM YARADICISI */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">🗓️ Mərasim Proqramı</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {eventData.schedule.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-xl border border-stone-200 text-xs">
                      <div className="flex items-center space-x-2">
                        <span>{item.icon}</span>
                        <strong className="text-amber-800">{item.time}</strong>
                        <span className="text-stone-600">— {item.title}</span>
                      </div>
                      <button
                        onClick={() => setEventData({...eventData, schedule: eventData.schedule.filter(s => s.id !== item.id)})}
                        className="text-rose-600 font-bold px-1"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Saat (20:00)"
                    value={newScheduleItem.time}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                    className="p-1.5 border border-stone-200 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Hadisə adı"
                    value={newScheduleItem.title}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                    className="p-1.5 border border-stone-200 rounded-lg focus:outline-none"
                  />
                  <select
                    value={newScheduleItem.icon}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, icon: e.target.value })}
                    className="p-1.5 border border-stone-200 rounded-lg focus:outline-none bg-stone-50"
                  >
                    {availableIcons.map(i => (
                      <option key={i.icon} value={i.icon}>{i.icon} {i.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="sm:col-span-3 py-1.5 bg-stone-900 text-white font-bold rounded-lg mt-1 text-center"
                  >
                    + Proqrama Əlavə Et
                  </button>
                </div>
              </div>

              {/* RSVP VƏ FOTO ALBOM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600">RSVP Son Tarixi</label>
                  <input
                    type="text"
                    value={eventData.rsvpDeadline}
                    onChange={(e) => setEventData({ ...eventData, rsvpDeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-600">Foto Albom Linki</label>
                  <input
                    type="text"
                    value={eventData.photoAlbumUrl}
                    onChange={(e) => setEventData({ ...eventData, photoAlbumUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SİFARİŞ XÜLASƏSİ */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-md border border-stone-800 font-serif">
                <h3 className="text-base font-bold text-amber-500 mb-3 border-b border-stone-800 pb-1.5">Sifariş Xülasəsi</h3>
                <div className="space-y-2.5 text-xs font-sans text-stone-300">
                  <p>Mərasim Növü: <strong className="text-white">{currentEventName}</strong></p>
                  <p>Adlar: <strong className="text-white">{eventData.title}</strong></p>
                  <p>Tarix: <strong className="text-amber-400">{eventData.date}</strong></p>
                  <p>Saat: <strong className="text-white">{eventData.time}</strong></p>
                  <p>Geyim Stili: <strong className="text-white">{eventData.dressCodeStyle}</strong></p>
                  <p>Proqram: <strong className="text-white">{eventData.schedule.length} addım aktivdir</strong></p>
                </div>
                <div className="mt-5 pt-4 border-t border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] block text-stone-500">PREMIUM PAKET</span>
                    <span className="text-xl font-bold text-amber-400">89 AZN</span>
                  </div>
                  <button
                    onClick={() => alert("Sifariş tamamlandı! Link telefonunuza göndəriləcək.")}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold px-4 py-2 rounded-xl shadow transition-colors"
                  >
                    Sifarişi Tamamla
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PANEL 2: CANLI DƏVƏTNAMƏ */}
        {activeTab === 'main' && (
          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden font-serif text-center pb-10">

            {/* HERO */}
            <div className="bg-gradient-to-b from-amber-50/40 via-white to-white py-10 px-4">
              <span className="text-[10px] tracking-widest text-amber-800 uppercase font-bold block mb-1">Dəvətnamə • Tədbirinizə uyğun olan geyim növü</span>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mt-1 tracking-wide">{eventData.title}</h1>
              <p className="text-amber-800 italic mt-2 text-base">{currentEventName} Mərasimi</p>

              {/* 3D ÜZÜKLƏR */}
              <div className="w-full h-44 pointer-events-none my-1">
                <Canvas camera={{ position: [0, 0, 2.4] }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[5, 5, 5]} intensity={2.5} />
                  <GoldWeddingRings />
                </Canvas>
              </div>

              {/* TARİX */}
              <div className="bg-stone-50 max-w-xs mx-auto p-3.5 rounded-xl border border-stone-200/80 shadow-sm">
                <p className="text-xs md:text-sm font-semibold text-stone-800 font-sans tracking-wide">
                  {formatAzDate(eventData.date)}
                </p>
                <span className="text-stone-400 text-[11px] font-sans mt-0.5 block">Saat {eventData.time}</span>
              </div>
            </div>

            {/* MƏKAN */}
            <div className="py-7 px-4 bg-stone-50/60 border-y border-stone-100">
              <h3 className="text-xl text-stone-800 font-serif mb-1">Mərasim Məkanı</h3>
              <p className="text-stone-600 text-xs font-sans mb-3">{eventData.wazePlaceName}</p>

              <div className="w-full h-32 bg-stone-200 rounded-xl border border-stone-300 relative overflow-hidden mb-3.5 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <span className="text-stone-400 text-xs font-sans">📍 Canlı Xəritə Baxışı</span>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <a
                  href={eventData.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 py-2.5 px-3 rounded-xl text-xs font-sans font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  🌐 <span>Google Maps</span>
                </a>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(eventData.wazePlaceName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-900 hover:bg-stone-800 text-white py-2.5 px-3 rounded-xl text-xs font-sans font-bold flex items-center justify-center space-x-1.5 shadow transition-all"
                >
                  🚗 <span>Waze ilə Get</span>
                </a>
              </div>
            </div>

            {/* DRESS CODE */}
            <div className="py-7 px-4">
              <h3 className="text-xl text-stone-800 mb-1">Geyim Tərzi (Dress Code)</h3>
              <div className="text-2xl my-2">{dressCodeStyles[eventData.dressCodeStyle]?.icons}</div>
              <h4 className="text-xs font-bold text-amber-800 font-sans tracking-wide uppercase mb-1">
                {dressCodeStyles[eventData.dressCodeStyle]?.label}
              </h4>
              <p className="text-stone-500 text-[11px] font-sans max-w-xs mx-auto leading-relaxed italic mb-3">
                "{dressCodeStyles[eventData.dressCodeStyle]?.desc}"
              </p>
              {eventData.dressCodeNote && (
                <div className="bg-amber-50/50 border border-amber-200/40 p-2.5 rounded-xl max-w-sm mx-auto text-[11px] font-sans text-stone-700">
                  <strong>Qeyd:</strong> {eventData.dressCodeNote}
                </div>
              )}
            </div>

            {/* PROQRAM */}
            <div className="py-7 px-4 bg-stone-50/40 border-t border-stone-100">
              <h3 className="text-xl text-stone-800 mb-5">Mərasim Proqramı</h3>
              <div className="relative border-l border-stone-200 ml-6 space-y-6 max-w-xs mx-auto text-left">
                {eventData.schedule.map((event) => (
                  <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-3.5 top-0 w-7 h-7 bg-white border border-amber-500 rounded-full flex items-center justify-center text-xs shadow-sm">
                      {event.icon}
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 font-sans block">{event.time}</span>
                    <h4 className="text-xs font-semibold text-stone-800 mt-0.5">{event.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* OTURMA PLANI */}
            <div className="py-7 px-4 border-t border-stone-100">
              <h3 className="text-xl text-stone-800 mb-1">Oturma Planı</h3>
              <p className="text-stone-500 text-[11px] font-sans mb-3">Adınızı yazaraq əyləşəcəyiniz masanı tapın.</p>
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Adınızı axtarın..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-sans mb-2.5 focus:outline-none"
                />
                <div className="space-y-1.5">
                  {seatingPlan
                    .filter(g => g.name.toLowerCase().includes(guestSearch.toLowerCase()))
                    .map((guest, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs font-sans">
                        <span className="text-stone-700">👤 {guest.name}</span>
                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm">{guest.table}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* FOTO QR */}
            <div className="py-7 px-4 bg-stone-50/40 border-t border-stone-100">
              <h3 className="text-xl text-stone-800 mb-1">Foto Qalereya</h3>
              <p className="text-stone-500 text-[11px] font-sans max-w-xs mx-auto mb-3">Şəkilləri QR kodu telefon kamerası ilə oxudaraq albomumuza göndərə bilərsiniz.</p>

              <div className="w-28 h-28 bg-white p-1.5 border border-stone-300 rounded-xl mx-auto shadow-sm flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(eventData.photoAlbumUrl)}`}
                  alt="Foto Albom QR Kod"
                  className="w-full h-full opacity-90"
                />
              </div>
              <a href={eventData.photoAlbumUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-700 font-sans font-bold hover:underline mt-1.5 inline-block">Albom Linki</a>
            </div>

            {/* RSVP */}
            <div className="py-7 px-4 border-t border-stone-100 max-w-xs mx-auto">
              <h3 className="text-lg text-stone-800 mb-1">İştirak edəcəksinizmi?</h3>
              <p className="text-stone-500 text-[11px] font-sans italic mb-4">
                Zəhmət olmasa {formatAzDate(eventData.rsvpDeadline).split(',')[0]} tarixinə qədər cavablandırın
              </p>

              <div className="flex gap-3 mb-6">
                <button type="button" onClick={() => alert("Təsdiqləndi!")} className="flex-1 py-2 bg-amber-600 text-white font-sans font-bold text-xs rounded-xl shadow-sm">Bəli, Gəlirəm 🎉</button>
                <button type="button" onClick={() => alert("Qeydə alındı.")} className="flex-1 py-2 bg-stone-900 text-white font-sans font-bold text-xs rounded-xl shadow-sm">Gələ bilmirəm</button>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-left font-sans text-[11px]">
                <h4 className="font-bold text-stone-500 uppercase tracking-wide text-[9px] mb-2">📊 İştirakçı Statistikası</h4>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                    <span className="text-emerald-600 font-bold text-sm block">{rsvpAnalytics.yesCount}</span>
                    <span className="text-[9px] text-stone-400">Gəlirəm</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                    <span className="text-rose-600 font-bold text-sm block">{rsvpAnalytics.noCount}</span>
                    <span className="text-[9px] text-stone-400">Gələ bilmirəm</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                    <span className="text-stone-800 font-bold text-sm block">{rsvpAnalytics.totalGuests}</span>
                    <span className="text-[9px] text-stone-400">Cəmi</span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="text-stone-400 text-[10px] font-sans mt-6 pt-3 border-t border-stone-100">
              Digitoy.az
            </footer>

          </div>
        )}

      </main>
    </div>
  );
}
