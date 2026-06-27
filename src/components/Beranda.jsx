import React from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Award, 
  BookOpen, 
  Cpu, 
  Cable, 
  ShieldAlert, 
  Video 
} from 'lucide-react';

export default function Beranda({ 
  hariPkl, 
  setHariPkl, 
  jurnalsLength, 
  kuisSelesai, 
  kompetensi, 
  setActiveTab, 
  arahkanMateri, 
  tunjukkanNotif 
}) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in" id="beranda-tab">
      
      {/* WELCOME BANNER (Solid Cobalt Blue) */}
      <div className="bg-[#143da1] rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-[10px] sm:text-[11px] font-black text-sky-200 uppercase tracking-widest block">Selamat Datang di</span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">SMART INFORMAX</h3>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-medium">
            Platform panduan PKL/Magang untuk siswa TKJ. Belajar, catat, dan raih kompetensi terbaikmu!
          </p>
          
          {/* Tips Capsule */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20 text-[10px] sm:text-xs text-sky-100">
              <Clock size={12} className="text-amber-400 shrink-0" />
              <span><strong>Tips hari ini:</strong> Selalu catat setiap aktivitas magang di jurnal harian!</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 z-10 flex-shrink-0">
          <span className="bg-white text-[#112d75] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs">
            PKL AKTIF
          </span>
          <span className="text-xs sm:text-sm font-bold text-blue-100 tracking-wide mt-1">SMK TKJ 2024/2025</span>
        </div>
      </div>

      {/* STATISTICS GRID (4 COLUMNS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" id="stats-grid">
        
        {/* Stat 1: Hari PKL */}
        <div className="bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between" id="stat-hari-pkl">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1 truncate">Hari PKL</span>
            <div className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">{hariPkl} <span className="text-[10px] sm:text-xs text-slate-400 font-bold">Hari</span></div>
          </div>
          <div 
            onClick={() => { setHariPkl(prev => prev + 1); tunjukkanNotif("Hari PKL berhasil ditambahkan!"); }}
            className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer shrink-0"
            title="Tambah Hari Log"
            id="btn-tambah-hari"
            role="button"
            tabIndex={0}
          >
            <Calendar size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 2: Jurnal Masuk */}
        <div className="bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between" id="stat-jurnal-masuk">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1 truncate">Jurnal Masuk</span>
            <div className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">{jurnalsLength} <span className="text-[10px] sm:text-xs text-slate-400 font-bold">Log</span></div>
          </div>
          <div 
            onClick={() => setActiveTab('jurnal')}
            className="w-9 h-9 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer shrink-0"
            title="Buka Jurnal"
            id="btn-buka-jurnal"
            role="button"
            tabIndex={0}
          >
            <FileText size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 3: Kuis Selesai */}
        <div className="bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between" id="stat-kuis-selesai">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1 truncate">Kuis Selesai</span>
            <div className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">{kuisSelesai} <span className="text-[10px] sm:text-xs text-slate-400 font-bold">Kali</span></div>
          </div>
          <div 
            onClick={() => arahkanMateri('kuis')}
            className="w-9 h-9 sm:w-12 sm:h-12 bg-violet-500 rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors cursor-pointer shrink-0"
            title="Mulai Kuis"
            id="btn-mulai-kuis"
            role="button"
            tabIndex={0}
          >
            <CheckSquare size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 4: Kompetensi */}
        <div 
          onClick={() => setActiveTab('kompetensi')}
          className="bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-200 transition-all" 
          id="stat-kompetensi"
          role="button"
          tabIndex={0}
        >
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 block mb-0.5 sm:mb-1 truncate">Kompetensi</span>
            <div className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">{kompetensi}/20</div>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors shrink-0">
            <Award size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: TWO COLUMNS (Akses Cepat & Pengumuman) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Left Column: Akses Cepat */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm sm:text-base font-bold text-slate-800">Akses Cepat</h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* Panduan Magang */}
            <button 
              onClick={() => setActiveTab('panduan')}
              className="bg-blue-50/70 hover:bg-blue-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-blue-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-panduan"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 sm:mb-3">
                <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-blue-900 block truncate">Panduan Magang</span>
            </button>

            {/* Materi LAN */}
            <button 
              onClick={() => arahkanMateri('lan')}
              className="bg-purple-50/70 hover:bg-purple-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-purple-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-lan"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mb-2 sm:mb-3">
                <Cpu size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-purple-900 block truncate">Materi LAN</span>
            </button>

            {/* Kabel UTP */}
            <button 
              onClick={() => arahkanMateri('utp')}
              className="bg-amber-50/70 hover:bg-amber-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-amber-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-utp"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mb-2 sm:mb-3">
                <Cable size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-amber-900 block truncate">Kabel UTP</span>
            </button>

            {/* K3 */}
            <button 
              onClick={() => setActiveTab('k3')}
              className="bg-emerald-50/70 hover:bg-emerald-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-emerald-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-k3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2 sm:mb-3">
                <ShieldAlert size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-emerald-900 block truncate">K3</span>
            </button>

            {/* Video Tutorial */}
            <button 
              onClick={() => setActiveTab('video')}
              className="bg-rose-50/70 hover:bg-rose-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-rose-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-video"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2 sm:mb-3">
                <Video size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-rose-900 block truncate">Video Tutorial</span>
            </button>

            {/* Jurnal Magang */}
            <button 
              onClick={() => setActiveTab('jurnal')}
              className="bg-teal-50/70 hover:bg-teal-50 p-3 sm:p-4 rounded-2xl sm:rounded-[28px] border border-teal-100 text-left transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-cepat-jurnal"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center mb-2 sm:mb-3">
                <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-teal-900 block truncate">Jurnal Magang</span>
            </button>
          </div>
        </div>

        {/* Right Column: Pengumuman */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-sm sm:text-base font-bold text-slate-800">Pengumuman</h4>
          
          <div className="space-y-3">
            {/* Announcement 1 */}
            <div className="bg-amber-50/40 p-4 rounded-2xl border-l-4 border-amber-400 border border-slate-100 flex flex-col justify-between animate-fade-in" id="pengumuman-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs sm:text-sm text-slate-800">Reminder: Laporan Mingguan</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">Hari ini</span>
              </div>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
                Jangan lupa mengumpulkan laporan mingguan sebelum Jumat pukul 17.00 WIB.
              </p>
            </div>

            {/* Announcement 2 */}
            <div className="bg-blue-50/40 p-4 rounded-2xl border-l-4 border-blue-500 border border-slate-100 flex flex-col justify-between animate-fade-in" id="pengumuman-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs sm:text-sm text-slate-800">Materi Baru: Fiber Optik</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">2 hari lalu</span>
              </div>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
                Materi lengkap tentang splicing fiber optik telah tersedia di menu Materi Teknis.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
