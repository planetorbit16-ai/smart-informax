import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Calendar, 
  Database,
  CheckCircle2
} from 'lucide-react';

export default function JurnalDigital({
  jurnals,
  setJurnals,
  tunjukkanNotif,
  currentUser
}) {
  // Form Input State
  const [inputJudul, setInputJudul] = useState('');
  const [inputIsi, setInputIsi] = useState('');
  const [inputKategori, setInputKategori] = useState('Jaringan LAN');

  // Tambah jurnal baru langsung ke database via API
  const simpanJurnalKeDatabase = async (e) => {
    e.preventDefault();
    if (!inputJudul.trim() || !inputIsi.trim()) {
      alert("Judul dan isi jurnal wajib diisi!");
      return;
    }

    const hariIni = new Date();
    const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
    const tanggalFormat = hariIni.toLocaleDateString('id-ID', opsiTanggal);

    try {
      const res = await fetch('/api/jurnals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || 1,
          judul: inputJudul.trim(),
          isi: inputIsi.trim(),
          tanggal: tanggalFormat,
          kategori: inputKategori
        })
      });
      
      if (!res.ok) {
        throw new Error("Gagal menyimpan ke database");
      }
      
      const savedJurnal = await res.json();
      setJurnals(prev => [savedJurnal, ...prev]);
      
      // Reset form
      setInputJudul('');
      setInputIsi('');
      
      tunjukkanNotif("Log jurnal harian berhasil disimpan ke database!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan jurnal ke database server!");
    }
  };

  // Hapus jurnal dari database via API
  const hapusJurnalDariDatabase = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus log jurnal ini dari database?")) {
      try {
        const res = await fetch(`/api/jurnals/${id}`, {
          method: 'DELETE'
        });
        
        if (!res.ok) {
          throw new Error("Gagal menghapus dari database");
        }
        
        setJurnals(prev => prev.filter(j => j.id !== id));
        tunjukkanNotif("Log jurnal berhasil dihapus dari database!");
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus jurnal dari database server!");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="jurnal-tab">
      
      {/* Kolom Kiri: Form Input Jurnal */}
      <div className="lg:col-span-5 space-y-5 sm:space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <Database className="text-[#112d75] shrink-0" size={18} />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Tulis Jurnal Magang Baru</h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mb-4 sm:mb-5">
            Setiap data yang diisi akan disimpan secara langsung ke dalam database internal.
          </p>
          
          <form onSubmit={simpanJurnalKeDatabase} className="space-y-4">
            {/* Judul */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Judul Kegiatan</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold" 
                placeholder="Contoh: Setting IP Address LAN"
                value={inputJudul}
                onChange={(e) => setInputJudul(e.target.value)}
                required
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Kategori Materi</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                value={inputKategori}
                onChange={(e) => setInputKategori(e.target.value)}
              >
                <option value="Jaringan LAN">Jaringan LAN</option>
                <option value="Instalasi Kabel UTP">Instalasi Kabel UTP</option>
                <option value="Fiber Optik">Fiber Optik</option>
                <option value="Konfigurasi Internet">Konfigurasi Internet</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Deskripsi Kegiatan Teknik</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold" 
                rows="5" 
                placeholder="Uraikan detail pekerjaan, alat yang digunakan, serta kendala teknis yang dihadapi secara runut..."
                value={inputIsi}
                onChange={(e) => setInputIsi(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                <CheckCircle2 size={14} />
                <span>DB Terkoneksi</span>
              </div>

              <button 
                type="submit" 
                className="bg-[#112d75] hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Simpan ke Database</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Kolom Kanan: List Jurnal */}
      <div className="lg:col-span-7 space-y-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs h-fit">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">Daftar Log Jurnal Terdaftar</h3>
          <p className="text-[11px] sm:text-xs text-slate-400">Total data: {jurnals.length} log harian siswa disimpan</p>
        </div>

        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 font-sans">
          {jurnals.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
              Belum ada data jurnal. Masukkan aktivitas di kiri!
            </div>
          ) : (
            jurnals.map((j) => (
              <div key={j.id} className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors relative group">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-[#112d75] font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {j.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar size={10} />
                      {j.tanggal}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => hapusJurnalDariDatabase(j.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Log Jurnal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-800 mb-1 flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-400" />
                  {j.judul}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium pl-5">{j.isi}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
