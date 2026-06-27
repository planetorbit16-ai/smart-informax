import React from 'react';
import { Info } from 'lucide-react';

export default function Panduan() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-fade-in" id="panduan-tab">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Buku Panduan Magang & PKL</h3>
        <p className="text-xs text-slate-400 mt-1">Panduan lengkap persiapan administratif, kedisiplinan industri, serta kriteria penilaian.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Berkas */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100" id="panduan-berkas">
          <h4 className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Tahap Persiapan Berkas (Administratif)
          </h4>
          <ul className="space-y-3.5 text-xs text-amber-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Mengurus <strong>Surat Pengantar PKL</strong> dari Hubungan Industri (Hubin) Sekolah.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Mengisi <strong>Formulir Kesediaan Industri</strong> yang ditandatangani & dicap basah oleh perusahaan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Menyusun <strong>Rencana Program Kerja Magang</strong> bersama guru pembimbing jurusan.</span>
            </li>
          </ul>
        </div>

        {/* Kolom Tata Tertib */}
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100" id="panduan-tata-tertib">
          <h4 className="font-bold text-sm text-blue-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Tata Tertib Siswa PKL di Industri
          </h4>
          <ul className="space-y-3.5 text-xs text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span><strong>Disiplin Kehadiran:</strong> Tiba di industri minimal 15 menit sebelum jam kerja resmi dimulai.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span><strong>Etika Berpakaian:</strong> Wajib mengenakan pakaian sopan rapi atau seragam wearpack sekolah lengkap.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span><strong>Kerahasiaan Data:</strong> Menjaga privasi data perusahaan, dilarang mengambil dokumentasi di area terlarang server.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-start gap-3.5" id="panduan-nilai-info">
        <Info className="text-sky-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <span className="font-bold text-xs text-sky-900 block">Bagaimana Penilaian PKL Ditentukan?</span>
          <p className="text-[11px] text-sky-700 leading-relaxed">
            Nilai akhir magang kamu diakumulasikan dari: <strong>60% Nilai dari Instruktur Industri</strong> (mencakup aspek kinerja teknis, kerajinan, dan sikap kerja), serta <strong>40% Nilai dari Guru Penguji</strong> melalui ujian presentasi laporan akhir sekolah.
          </p>
        </div>
      </div>
    </div>
  );
}
