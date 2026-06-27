import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function MateriTeknis({
  selectedMateri,
  setSelectedMateri,
  quizAnswer,
  setQuizAnswer,
  quizSubmitted,
  setQuizSubmitted,
  quizFeedback,
  setQuizFeedback,
  cekKuis,
  ulangiKuis
}) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-fade-in" id="materi-tab">
      
      {/* Sub Navigasi Kategori Materi */}
      <div className="flex gap-2 pb-4 border-b border-slate-100 overflow-x-auto scrollbar-none" id="materi-sub-nav">
        <button 
          onClick={() => setSelectedMateri('lan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedMateri === 'lan' ? 'bg-[#112d75] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
          id="btn-sub-lan"
        >
          Jaringan LAN
        </button>
        <button 
          onClick={() => setSelectedMateri('utp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedMateri === 'utp' ? 'bg-[#112d75] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
          id="btn-sub-utp"
        >
          Krimping UTP
        </button>
        <button 
          onClick={() => setSelectedMateri('fo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedMateri === 'fo' ? 'bg-[#112d75] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
          id="btn-sub-fo"
        >
          Fiber Optik
        </button>
        <button 
          onClick={() => setSelectedMateri('internet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedMateri === 'internet' ? 'bg-[#112d75] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
          id="btn-sub-internet"
        >
          Konfigurasi Internet
        </button>
        <button 
          onClick={() => setSelectedMateri('kuis')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedMateri === 'kuis' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
          }`}
          id="btn-sub-kuis"
        >
          Kuis Interaktif
        </button>
      </div>

      {/* Sub Konten 1: LAN */}
      {selectedMateri === 'lan' && (
        <div className="space-y-4 animate-fade-in" id="materi-lan-content">
          <h4 className="font-extrabold text-[#112d75] text-base">Konsep Jaringan Lokal (LAN)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Local Area Network (LAN) menghubungkan komputer di area terbatas seperti kantor, sekolah, atau lab komputer. Komponen utamanya adalah PC, Switch, Router, dan Media Transmisi (Kabel/Wireless).
          </p>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
            <span className="text-xs font-bold text-[#112d75] block">Topologi Fisik Jaringan LAN Sederhana:</span>
            <p className="text-xs text-slate-600 font-mono bg-[#0c1326] text-sky-400 p-3 rounded-xl m-0 leading-relaxed overflow-x-auto whitespace-nowrap">
              [Internet ISP] --- [Router Mikrotik] --- [Switch Utama] === [PC Server & Klien]
            </p>
          </div>
        </div>
      )}

      {/* Sub Konten 2: UTP */}
      {selectedMateri === 'utp' && (
        <div className="space-y-4 animate-fade-in" id="materi-utp-content">
          <h4 className="font-extrabold text-[#112d75] text-base">Langkah Krimping Kabel UTP Straight & Cross</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kabel UTP memiliki 8 helai kabel tembaga kecil berwarna-warni yang harus disusun rapi ke dalam konektor RJ-45 menggunakan tang krimping sebelum dihubungkan ke komputer klien dan switch utama.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Standar Penyusunan Warna Kabel Straight (T568B):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono font-bold">
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-amber-600">1. Putih-Oranye</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-amber-500">2. Oranye</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-emerald-600">3. Putih-Hijau</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-blue-600">4. Biru</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-blue-400">5. Putih-Biru</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-emerald-500">6. Hijau</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-amber-800">7. Putih-Cokelat</div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 text-center text-amber-900">8. Cokelat</div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Konten 3: Fiber Optik */}
      {selectedMateri === 'fo' && (
        <div className="space-y-4 animate-fade-in" id="materi-fo-content">
          <h4 className="font-extrabold text-[#112d75] text-base">Teknik Penyambungan Fiber Optik (Splicing)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Splicing adalah proses menyambungkan ujung core kaca fiber optik menggunakan busur api listrik dari mesin Fusion Splicer. Redaman yang dihasilkan harus sekecil mungkin (&lt; 0.02 dB) agar transmisi data lancar.
          </p>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3.5 items-start">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-amber-800 leading-relaxed m-0 font-medium">
              <strong>Tips Penggunaan:</strong> Gunakan stripper fiber optik dengan hati-hati saat mengupas bagian cladding kaca agar tidak mudah patah. Bersihkan sisa core kaca dengan alkohol berkadar 95% sebelum melakukan pemotongan dengan cleaver.
            </p>
          </div>
        </div>
      )}

      {/* Sub Konten 4: Konfigurasi Internet */}
      {selectedMateri === 'internet' && (
        <div className="space-y-4 animate-fade-in" id="materi-internet-content">
          <h4 className="font-extrabold text-[#112d75] text-base">Konfigurasi Akses Internet (Mikrotik)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Siswa magang diajarkan untuk menyalurkan akses internet dari modem ISP menuju seluruh client LAN menggunakan IP NAT (Network Address Translation) Masquerade pada routerboard Mikrotik.
          </p>
          <div className="p-4 bg-[#0c1326] text-sky-400 font-mono text-[10px] rounded-2xl leading-relaxed whitespace-pre overflow-x-auto">
{`# Baris Perintah Mikrotik NAT Masquerade
/ip firewall nat
add chain=srcnat out-interface=ether1-gateway action=masquerade`}
          </div>
        </div>
      )}

      {/* Sub Konten 5: Kuis Interaktif */}
      {selectedMateri === 'kuis' && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 animate-fade-in" id="materi-kuis-content">
          <div className="flex items-center justify-between">
            <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2.5 py-1 rounded-xl">KUIS EVALUASI MANDIRI</span>
            <span className="text-[10px] text-slate-400 font-bold">Pertanyaan 1 dari 1</span>
          </div>

          <h5 className="font-bold text-xs sm:text-sm text-slate-800 leading-relaxed">
            Perangkat jaringan komputer yang bekerja pada Layer 2 (Data Link) dari model referensi OSI dan berfungsi menyalurkan paket data berdasarkan alamat fisik (MAC Address) adalah?
          </h5>

          <div className="space-y-2">
            {/* Pilihan A */}
            <button 
              onClick={() => !quizSubmitted && setQuizAnswer('A')}
              className={`w-full text-left p-3 border rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                quizAnswer === 'A' ? 'border-[#112d75] bg-blue-50 text-[#112d75]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
              disabled={quizSubmitted}
              id="quiz-option-a"
            >
              A. Router
            </button>
            {/* Pilihan B */}
            <button 
              onClick={() => !quizSubmitted && setQuizAnswer('B')}
              className={`w-full text-left p-3 border rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                quizAnswer === 'B' ? 'border-[#112d75] bg-blue-50 text-[#112d75]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
              disabled={quizSubmitted}
              id="quiz-option-b"
            >
              B. Switch
            </button>
            {/* Pilihan C */}
            <button 
              onClick={() => !quizSubmitted && setQuizAnswer('C')}
              className={`w-full text-left p-3 border rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                quizAnswer === 'C' ? 'border-[#112d75] bg-blue-50 text-[#112d75]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
              disabled={quizSubmitted}
              id="quiz-option-c"
            >
              C. Hub Pasif
            </button>
          </div>

          {/* Feedback Jawaban */}
          {quizSubmitted && (
            <div className={`p-4 rounded-xl text-xs leading-relaxed ${
              quizAnswer === 'B' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                : 'bg-rose-50 text-rose-800 border border-rose-100'
            }`} id="quiz-feedback">
              {quizFeedback}
            </div>
          )}

          {/* Tombol Kuis */}
          <div className="flex gap-2 justify-end pt-2">
            {quizSubmitted ? (
              <button 
                onClick={ulangiKuis}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                id="btn-quiz-retry"
              >
                Coba Lagi
              </button>
            ) : (
              <button 
                onClick={cekKuis}
                className="bg-[#112d75] hover:bg-blue-800 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
                id="btn-quiz-submit"
              >
                Kirim Jawaban
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
