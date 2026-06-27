import React from 'react';

export default function EtikaProfesi() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-fade-in" id="etika-tab">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Etika Profesi Magang</h3>
        <p className="text-xs text-slate-400 mt-1">Sikap (Attitude) merupakan cerminan utama integritas siswa dalam menyerap ilmu profesional di tempat magang.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2" id="etika-card-1">
          <div className="w-8 h-8 rounded-xl bg-[#112d75]/10 text-[#112d75] flex items-center justify-center font-bold text-sm">01</div>
          <h4 className="font-bold text-xs text-slate-800">Integritas & Kejujuran</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">Selalu laporkan hasil setup jaringan apa adanya tanpa manipulasi data ping test. Kerjakan tugas harian dengan bertanggung jawab penuh.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2" id="etika-card-2">
          <div className="w-8 h-8 rounded-xl bg-[#112d75]/10 text-[#112d75] flex items-center justify-center font-bold text-sm">02</div>
          <h4 className="font-bold text-xs text-slate-800">Komunikasi Efektif</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">Gunakan tutur kata sopan dan santun saat berinteraksi dengan karyawan pembimbing industri. Ajukan pertanyaan teknis di waktu yang tepat.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2" id="etika-card-3">
          <div className="w-8 h-8 rounded-xl bg-[#112d75]/10 text-[#112d75] flex items-center justify-center font-bold text-sm">03</div>
          <h4 className="font-bold text-xs text-slate-800">Menghargai Hak Cipta</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">Jangan menyalin mentah-mentah file konfigurasi router atau backup milik instansi tanpa izin supervisor magang setempat.</p>
        </div>
      </div>
    </div>
  );
}
