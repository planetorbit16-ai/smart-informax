import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  Video, 
  FileText, 
  CheckSquare, 
  Bell, 
  User, 
  Settings, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X, 
  BookOpenText,
  Wifi,
  Trophy
} from 'lucide-react';

// Import komponen-komponen modular hasil ekstraksi
import Beranda from './components/Beranda';
import JurnalDigital from './components/JurnalDigital';
import Panduan from './components/Panduan';
import K3 from './components/K3';
import EtikaProfesi from './components/EtikaProfesi';
import VideoTutorial from './components/VideoTutorial';
import MateriTeknis from './components/MateriTeknis';
import Profil from './components/Profil';
import Auth from './components/Auth';
import KompetensiPKL from './components/KompetensiPKL';

export default function App() {
  // =========================================================================
  // STATE UTAMA & AUTH (Sangat Mudah Dipahami Pemula)
  // =========================================================================
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('smart_informax_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [activeTab, setActiveTab] = useState('beranda'); // Tab aktif: 'beranda', 'panduan', 'k3', 'etika', 'jurnal', 'materi', 'video'
  const [selectedMateri, setSelectedMateri] = useState('lan'); // Sub-kategori materi teknis: 'lan', 'utp', 'fo', 'internet', 'kuis'
  const [metodeHttp, setMetodeHttp] = useState('fetch'); // Pilihan API: 'fetch' atau 'axios'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle sidebar di mobile
  const [isMateriMenuExpanded, setIsMateriMenuExpanded] = useState(true); // Toggle dropdown menu Materi Teknis

  // Profile State Siswa PKL
  const [profile, setProfile] = useState(() => {
    const savedSession = localStorage.getItem('smart_informax_session');
    if (savedSession) return JSON.parse(savedSession);
    return {
      nama: "Siswa PKL",
      nis: "22045678",
      sekolah: "SMK Negeri 1 Tanjungpinang",
      jurusan: "Teknik Komputer dan Jaringan (TKJ)",
      kelas: "XII TKJ 1",
      email: "planetorbit16@gmail.com",
      pembimbing: "",
      tempatPkl: "",
      tempat_pkl: "",
      pembimbing_industri: "",
      tanggal_mulai: "",
      tanggal_selesai: ""
    };
  });

  // Fetch journals and competency count from real backend when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // 1. Fetch Jurnals
      fetch(`/api/jurnals?user_id=${currentUser.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil jurnal");
          return res.json();
        })
        .then(data => setJurnals(data))
        .catch(err => {
          console.error("Error loading journals:", err);
        });

      // 2. Fetch Kompetensi Count
      fetch(`/api/kompetensi?user_id=${currentUser.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Gagal mengambil kompetensi");
          return res.json();
        })
        .then(data => {
          const totalKompeten = Object.values(data).filter(v => v === 'Kompeten').length;
          setKompetensi(totalKompeten);
        })
        .catch(err => {
          console.error("Error loading competency count:", err);
        });
    } else {
      setKompetensi(0);
    }
  }, [currentUser]);

  // Keep profile in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  // Handler update profil sinkron ke database MySQL via API
  const updateProfile = async (newProfile) => {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal memperbarui profil!");
        return;
      }
      setProfile(data.user);
      setCurrentUser(data.user);
      localStorage.setItem('smart_informax_session', JSON.stringify(data.user));
      tunjukkanNotif("Profil Anda berhasil diperbarui di database!");
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server untuk memperbarui profil.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smart_informax_session');
    tunjukkanNotif("Anda berhasil keluar dari sistem.");
  };
  
  // Statistik Utama (Bisa ditambah/dikurangi secara harian)
  const [hariPkl, setHariPkl] = useState(0);
  const [kuisSelesai, setKuisSelesai] = useState(0);
  const [kompetensi, setKompetensi] = useState(0);

  // Data Jurnal (Live State synced with database)
  const [jurnals, setJurnals] = useState([]);

  // Logs & Loading untuk Simulator API
  const [apiLogs, setApiLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifSukses, setNotifSukses] = useState(null);

  // Notifikasi dropdown & list
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifikasiList, setNotifikasiList] = useState([]);

  // Kuis Interaktif State
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');

  // =========================================================================
  // FUNGSI LOGGING & ALERTER
  // =========================================================================
  const tambahLog = (pesan) => {
    const waktu = new Date().toLocaleTimeString('id-ID');
    setApiLogs(prev => [`[${waktu}] ${pesan}`, ...prev]);
  };

  const tunjukkanNotif = (pesan) => {
    setNotifSukses(pesan);
    setTimeout(() => {
      setNotifSukses(null);
    }, 3500);
  };

  // =========================================================================
  // KUIS INTERAKTIF
  // =========================================================================
  const cekKuis = () => {
    if (!quizAnswer) {
      alert("Pilih satu jawaban terlebih dahulu!");
      return;
    }
    setQuizSubmitted(true);
    if (quizAnswer === 'B') {
      setQuizFeedback("BENAR! Switch bekerja pada Layer 2 (Data Link) karena menyalurkan frame berdasarkan alamat fisik (MAC Address).");
      setKuisSelesai(prev => prev + 1);
      setKompetensi(prev => Math.min(20, prev + 1));
      tunjukkanNotif("Kuis selesai! Kompetensi bertambah.");
    } else {
      setQuizFeedback("KURANG TEPAT! Switch beroperasi pada Layer 2 (Data Link). Layer 3 diisi oleh Router (Network Layer) yang bekerja dengan IP Address.");
      setKuisSelesai(prev => prev + 1);
    }
  };

  const ulangiKuis = () => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizFeedback('');
  };

  // Helper fungsi navigasi langsung ke tab materi teknis
  const arahkanMateri = (materiId) => {
    setActiveTab('materi');
    setSelectedMateri(materiId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not authenticated, render the Auth login/register screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f4f7fe] flex flex-col justify-center relative">
        {/* Toast Notifikasi Sukses */}
        {notifSukses && (
          <div 
            className="fixed bottom-6 right-6 bg-slate-900 text-white py-3 px-4 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 animate-bounce"
            style={{ maxWidth: '360px' }}
          >
            <div className="bg-emerald-500 rounded-full p-1 text-white">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="font-semibold text-xs text-slate-100">{notifSukses}</span>
          </div>
        )}
        <Auth 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setProfile(user);
            localStorage.setItem('smart_informax_session', JSON.stringify(user));
          }}
          tunjukkanNotif={tunjukkanNotif}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex flex-col lg:flex-row relative">
      
      {/* Toast Notifikasi Sukses */}
      {notifSukses && (
        <div 
          className="fixed bottom-6 right-6 bg-slate-900 text-white py-3 px-4 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 animate-bounce"
          style={{ maxWidth: '360px' }}
        >
          <div className="bg-emerald-500 rounded-full p-1 text-white">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="font-semibold text-xs text-slate-100">{notifSukses}</span>
        </div>
      )}

      {/* =========================================================================
          1. SIDEBAR NAVIGATION (Deep Royal Blue Theme - Persis Seperti Contoh)
          ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#112d75] text-slate-100 flex flex-col justify-between 
        transition-transform duration-300 transform lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Logo Header */}
          <div className="p-4 flex items-center justify-between border-b border-blue-900/40">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-xl text-sky-400 flex items-center justify-center">
                <Wifi size={24} className="animate-pulse" />
              </div>
              <div className="text-left">
                <span className="font-black text-white text-base tracking-wider block leading-tight">SMART</span>
                <span className="font-bold text-sky-300 text-[10px] uppercase tracking-wider block -mt-1">INFORMAX</span>
              </div>
            </div>
            
            {/* Close button di mobile */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
            
            {/* Beranda */}
            <button 
              onClick={() => { setActiveTab('beranda'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'beranda' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <Home size={18} />
              <span>Beranda</span>
            </button>

            {/* Panduan Magang */}
            <button 
              onClick={() => { setActiveTab('panduan'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'panduan' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen size={18} />
                <span>Panduan Magang</span>
              </div>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {/* Keselamatan Kerja (K3) */}
            <button 
              onClick={() => { setActiveTab('k3'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'k3' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={18} />
                <span>Keselamatan Kerja (K3)</span>
              </div>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {/* Etika Profesi */}
            <button 
              onClick={() => { setActiveTab('etika'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'etika' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpenText size={18} />
                <span>Etika Profesi</span>
              </div>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {/* Dropdown Menu: Materi Teknis TKJ */}
            <div>
              <button 
                onClick={() => setIsMateriMenuExpanded(!isMateriMenuExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-blue-200/85 hover:bg-[#16368a] hover:text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <Cpu size={18} />
                  <span>Materi Teknis TKJ</span>
                </div>
                {isMateriMenuExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Submenus (Tampil jika expanded) */}
              {isMateriMenuExpanded && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <button 
                    onClick={() => { setActiveTab('materi'); setSelectedMateri('lan'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold block ${
                      activeTab === 'materi' && selectedMateri === 'lan' 
                        ? 'text-white bg-[#0d1e4c]' 
                        : 'text-blue-200/70 hover:text-white hover:bg-[#16368a]'
                    }`}
                  >
                    • Jaringan LAN
                  </button>
                  <button 
                    onClick={() => { setActiveTab('materi'); setSelectedMateri('utp'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold block ${
                      activeTab === 'materi' && selectedMateri === 'utp' 
                        ? 'text-white bg-[#0d1e4c]' 
                        : 'text-blue-200/70 hover:text-white hover:bg-[#16368a]'
                    }`}
                  >
                    • Instalasi Kabel UTP
                  </button>
                  <button 
                    onClick={() => { setActiveTab('materi'); setSelectedMateri('fo'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold block ${
                      activeTab === 'materi' && selectedMateri === 'fo' 
                        ? 'text-white bg-[#0d1e4c]' 
                        : 'text-blue-200/70 hover:text-white hover:bg-[#16368a]'
                    }`}
                  >
                    • Fiber Optik
                  </button>
                  <button 
                    onClick={() => { setActiveTab('materi'); setSelectedMateri('internet'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold block ${
                      activeTab === 'materi' && selectedMateri === 'internet' 
                        ? 'text-white bg-[#0d1e4c]' 
                        : 'text-blue-200/70 hover:text-white hover:bg-[#16368a]'
                    }`}
                  >
                    • Konfigurasi Internet
                  </button>
                </div>
              )}
            </div>

            {/* Video Tutorial */}
            <button 
              onClick={() => { setActiveTab('video'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'video' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <Video size={18} />
              <span>Video Tutorial</span>
            </button>

            {/* Jurnal Magang Digital */}
            <button 
              onClick={() => { setActiveTab('jurnal'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'jurnal' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <FileText size={18} />
              <span>Jurnal Magang Digital</span>
            </button>

            {/* Evaluasi & Kuis */}
            <button 
              onClick={() => { setActiveTab('materi'); setSelectedMateri('kuis'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'materi' && selectedMateri === 'kuis'
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <CheckSquare size={18} />
              <span>Evaluasi & Kuis</span>
            </button>

            {/* Kompetensi PKL (Sesuai Gambar User) */}
            <button 
              onClick={() => { setActiveTab('kompetensi'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'kompetensi' 
                  ? 'bg-[#0d1e4c] text-white' 
                  : 'text-blue-200/85 hover:bg-[#16368a] hover:text-white'
              }`}
            >
              <Trophy size={18} />
              <span>Kompetensi PKL</span>
            </button>

          </nav>
        </div>

        {/* Profile Card Section di Bawah Sidebar */}
        <div 
          onClick={() => { setActiveTab('profil'); setIsSidebarOpen(false); }}
          className={`p-4 border-t border-blue-900/40 transition-all flex items-center justify-between cursor-pointer hover:bg-[#16368a]/50 ${
            activeTab === 'profil' ? 'bg-[#0d1e4c]' : 'bg-[#0d1e4c]/50'
          }`}
          title="Buka Profil Anda"
          id="sidebar-profile-card"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 text-sky-300 flex items-center justify-center border border-blue-400/20 text-xs font-black select-none">
              {profile.nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="max-w-[120px]">
              <span className="text-sm font-bold text-white block truncate">{profile.nama}</span>
              <span className="text-[10px] text-blue-300 block -mt-0.5 truncate">{profile.kelas}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveTab('profil'); setIsSidebarOpen(false); }}
            className="p-1.5 text-blue-200 hover:text-white rounded-xl hover:bg-blue-800/40 cursor-pointer"
            title="Ubah Profil"
          >
            <Settings size={16} />
          </button>
        </div>
      </aside>

      {/* Backdrop untuk mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* =========================================================================
          2. MAIN CONTENT AREA (Clean Dashboard Grid & Containers)
          ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR / HEADER (Beranda / Profil & Notifikasi) */}
        <header className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger Button di Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-700 capitalize tracking-tight">
              {activeTab === 'beranda' ? 'Beranda' : 
               activeTab === 'jurnal' ? 'Jurnal Magang Digital' : 
               activeTab === 'panduan' ? 'Buku Panduan Magang' : 
               activeTab === 'k3' ? 'Keselamatan Kerja (K3)' : 
               activeTab === 'etika' ? 'Etika Profesi Magang' : 
               activeTab === 'video' ? 'Video Tutorial' : 
               activeTab === 'profil' ? 'Profil Pengguna' : 
               activeTab === 'kompetensi' ? 'Kompetensi PKL' : 
               'Materi Teknis TKJ'}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={18} />
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl py-3 z-50 text-slate-800">
                    <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-700">Notifikasi</span>
                    </div>
                    <div className="py-2">
                      {notifikasiList.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs text-slate-400 font-semibold">Tidak ada notifikasi terbaru</p>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {notifikasiList.map((notif, idx) => (
                            <div key={idx} className="px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                              <p className="text-xs text-slate-600 leading-relaxed">{notif}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar */}
            <button 
              onClick={() => setActiveTab('profil')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-black transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'profil' 
                  ? 'border-blue-500 bg-[#112d75] text-white shadow-xs' 
                  : 'border-slate-200 bg-blue-50 text-[#112d75] hover:bg-blue-100'
              }`}
              title="Lihat Profil Siswa"
              id="avatar-top-btn"
            >
              <span className="text-xs font-black">
                {profile.nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </span>
            </button>
          </div>
        </header>

        {/* WORKSPACE WRAPPER */}
        <div className="p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6 flex-1">
             {/* =========================================================================
              VIEW RENDERING: MODULAR COMPONENTS
              ========================================================================= */}
          {activeTab === 'beranda' && (
            <Beranda 
              hariPkl={hariPkl}
              setHariPkl={setHariPkl}
              jurnalsLength={jurnals.length}
              kuisSelesai={kuisSelesai}
              kompetensi={kompetensi}
              setActiveTab={setActiveTab}
              arahkanMateri={arahkanMateri}
              tunjukkanNotif={tunjukkanNotif}
            />
          )}

          {activeTab === 'jurnal' && (
            <JurnalDigital
              jurnals={jurnals}
              setJurnals={setJurnals}
              tunjukkanNotif={tunjukkanNotif}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'panduan' && <Panduan />}

          {activeTab === 'k3' && <K3 />}

          {activeTab === 'etika' && <EtikaProfesi />}

          {activeTab === 'video' && (
            <VideoTutorial 
              currentUser={currentUser} 
              tunjukkanNotif={tunjukkanNotif} 
            />
          )}

          {activeTab === 'materi' && (
            <MateriTeknis
              selectedMateri={selectedMateri}
              setSelectedMateri={setSelectedMateri}
              quizAnswer={quizAnswer}
              setQuizAnswer={setQuizAnswer}
              quizSubmitted={quizSubmitted}
              setQuizSubmitted={setQuizSubmitted}
              quizFeedback={quizFeedback}
              setQuizFeedback={setQuizFeedback}
              cekKuis={cekKuis}
              ulangiKuis={ulangiKuis}
            />
          )}

          {activeTab === 'profil' && (
            <Profil 
              profile={profile}
              setProfile={updateProfile}
              tunjukkanNotif={tunjukkanNotif}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'kompetensi' && (
            <KompetensiPKL
              currentUser={currentUser}
              tunjukkanNotif={tunjukkanNotif}
              onUpdateKompetensiCount={setKompetensi}
            />
          )}

        </div>

        {/* FOOTER */}
        <footer className="text-center py-6 border-t border-slate-100 text-[11px] font-medium text-slate-400">
          © 2026 SMART INFORMAX. Platform Dashboard & Jurnal Digital PKL. Didesain dengan Bento Grid & Modern CSS.
        </footer>

      </main>

    </div>
  );
}
