import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function K3() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-fade-in" id="k3-tab">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Keselamatan & Kesehatan Kerja (K3)</h3>
        <p className="text-xs text-slate-400 mt-1">Sebagai teknisi infrastruktur jaringan komputer, keselamatan kerja fisik dan sistem adalah prioritas utama.</p>
      </div>

      <div className="space-y-4">
        {/* List 1 */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex gap-4" id="k3-list-1">
          <div className="bg-rose-500 text-white rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-0.5">K3 Kelistrikan & Perakitan PC/Server</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wajib memastikan kabel daya listrik dicabut penuh sebelum menyentuh bagian dalam motherboard server. Gunakan gelang anti-statis (wrist-strap) untuk menghindari lonjakan listrik statis tubuh yang merusak chip RAM.
            </p>
          </div>
        </div>

        {/* List 2 */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex gap-4" id="k3-list-2">
          <div className="bg-amber-500 text-white rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-0.5">K3 Penanganan Kabel Fiber Optik (FO)</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Serpihan sisa kupasan core fiber optik terbuat dari kaca tipis transparan yang sangat berbahaya jika menusuk kulit atau mata. Gunakan tisu khusus beralkohol 95% untuk membuang core kaca, dan jangan pernah menatap lubang laser aktif konektor FO.
            </p>
          </div>
        </div>

        {/* List 3 */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4" id="k3-list-3">
          <div className="bg-blue-500 text-white rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-0.5">K3 Pekerjaan Ketinggian / Panjat Tower</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saat memasang radio link antenna outdoor di tower wireless, pastikan memakai sabuk keselamatan pengaman (full body safety harness), helm pelindung kepala, dan sepatu safety bergerigi kasar anti-slip demi meredam resiko tergelincir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
