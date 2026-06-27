import React, { useState, useEffect } from 'react';
import { Trophy, Target, Award, Loader2 } from 'lucide-react';

// Definitions of TKJ Competencies based on the user screenshot and requirements
const COMPETENCY_GROUPS = [
  {
    id: 'jaringan_dasar',
    title: 'Jaringan Dasar',
    items: [
      { key: 'mengenal_komponen_lan', label: 'Mengenal komponen jaringan LAN' },
      { key: 'membuat_kabel_utp_straight', label: 'Membuat kabel UTP straight-through' },
      { key: 'membuat_kabel_utp_crossover', label: 'Membuat kabel UTP crossover' },
      { key: 'mengkonfigurasi_ip_statis', label: 'Mengkonfigurasi IP address statis' },
      { key: 'menggunakan_ping_tracert', label: 'Menggunakan perintah ping dan tracert' }
    ]
  },
  {
    id: 'instalasi_jaringan',
    title: 'Instalasi Jaringan',
    items: [
      { key: 'memasang_konektor_rj45', label: 'Memasang konektor RJ-45 pada kabel UTP' },
      { key: 'menguji_kabel_lan_tester', label: 'Menguji kabel dengan LAN tester' },
      { key: 'memasang_switch_perangkat', label: 'Memasang switch dan menghubungkan perangkat' },
      { key: 'menginstalasi_kabel_dinding_trunking', label: 'Menginstalasi kabel di dalam dinding/trunking' }
    ]
  },
  {
    id: 'konfigurasi_perangkat',
    title: 'Konfigurasi Perangkat',
    items: [
      { key: 'mengkonfigurasi_modem', label: 'Mengkonfigurasi modem ADSL/VDSL' },
      { key: 'mengkonfigurasi_router_wireless', label: 'Mengkonfigurasi router wireless' },
      { key: 'mengatur_dhcp_server', label: 'Mengatur DHCP server di router' },
      { key: 'mengatur_dns_gateway', label: 'Mengatur DNS dan gateway' },
      { key: 'mengkonfigurasi_ssid_keamanan_wifi', label: 'Mengkonfigurasi SSID dan keamanan WiFi' }
    ]
  },
  {
    id: 'troubleshooting_administrasi',
    title: 'Troubleshooting & Administrasi',
    items: [
      { key: 'mengkonfigurasi_mikrotik', label: 'Mengkonfigurasi MikroTik RouterOS' },
      { key: 'mengkonfigurasi_nat', label: 'Mengkonfigurasi NAT (Network Address Translation)' },
      { key: 'mengkonfigurasi_firewall', label: 'Mengkonfigurasi Firewall Filter Rules' },
      { key: 'troubleshooting_lan', label: 'Melakukan troubleshooting jaringan LAN terputus' },
      { key: 'backup_restore_router', label: 'Melakukan backup & restore konfigurasi router' },
      { key: 'mengkonfigurasi_hotspot', label: 'Mengkonfigurasi jaringan nirkabel/Hotspot' }
    ]
  }
];

export default function KompetensiPKL({ currentUser, tunjukkanNotif, onUpdateKompetensiCount }) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);

  // Fetch competencies from DB
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    fetch(`/api/kompetensi?user_id=${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        // Initialize default "Belum Dimulai" for any keys not found in response
        const fullStatuses = {};
        COMPETENCY_GROUPS.forEach(group => {
          group.items.forEach(item => {
            fullStatuses[item.key] = data[item.key] || 'Belum Dimulai';
          });
        });
        setStatuses(fullStatuses);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching competencies:', err);
        setLoading(false);
      });
  }, [currentUser]);

  // Handle status change
  const handleStatusChange = async (key, label, newStatus) => {
    if (!currentUser) return;
    setUpdatingKey(key);

    try {
      const response = await fetch('/api/kompetensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          key_kompetensi: key,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Gagal update kompetensi');
      }

      setStatuses(prev => {
        const next = { ...prev, [key]: newStatus };
        
        // Count total Kompeten to report back to parent component if needed
        const totalKompeten = Object.values(next).filter(v => v === 'Kompeten').length;
        if (onUpdateKompetensiCount) {
          onUpdateKompetensiCount(totalKompeten);
        }
        
        return next;
      });

      tunjukkanNotif(`Berhasil mengubah status "${label}" menjadi "${newStatus}"!`);
    } catch (err) {
      console.error(err);
      tunjukkanNotif('Gagal memperbarui status kompetensi.');
    } finally {
      setUpdatingKey(null);
    }
  };

  // Calculations for counters
  const totalItems = 20; // 5 + 4 + 5 + 6
  const countKompeten = Object.values(statuses).filter(v => v === 'Kompeten').length;
  const countDalamProses = Object.values(statuses).filter(v => v === 'Dalam Proses').length;
  const countBelumDimulai = totalItems - countKompeten - countDalamProses;
  const progressPercent = Math.round((countKompeten / totalItems) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-5xl mx-auto">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-sm font-semibold text-slate-500">Memuat checklist kompetensi Anda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" id="kompetensi-tab">
      
      {/* 1. HEADER CARD */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs flex items-center gap-3.5">
        <div className="bg-amber-100 text-amber-600 rounded-2xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Trophy size={24} strokeWidth={2} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Kompetensi PKL</h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">Checklist pencapaian kompetensi TKJ</p>
        </div>
      </div>

      {/* 2. SUMMARY METRICS CARD */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-xs space-y-5 sm:space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {/* Kompeten */}
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-500 block">{countKompeten}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block truncate">Kompeten</span>
          </div>
          
          {/* Dalam Proses */}
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-500 block">{countDalamProses}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block truncate">Dalam Proses</span>
          </div>

          {/* Belum Dimulai */}
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-500 block">{countBelumDimulai}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block truncate">Belum Dimulai</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2 border-t border-slate-100/70 pt-4">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span className="text-slate-400 uppercase tracking-wider">Progress Kompetensi</span>
            <span className="text-[#112d75]">{countKompeten} / {totalItems} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-[#112d75] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. COMPETENCY GROUPS */}
      <div className="space-y-6">
        {COMPETENCY_GROUPS.map((group) => {
          // Calculate completed for this group
          const groupCompleted = group.items.filter(item => statuses[item.key] === 'Kompeten').length;
          
          return (
            <div key={group.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-slate-100 shadow-xs space-y-4">
              
              {/* Group Header */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/60">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">{group.title}</h4>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-black">
                  {groupCompleted} / {group.items.length} kompeten
                </span>
              </div>

              {/* Group Items */}
              <div className="space-y-3">
                {group.items.map((item) => {
                  const currentStatus = statuses[item.key] || 'Belum Dimulai';
                  
                  // Style colors based on state
                  let statusBg = 'bg-slate-50 border-slate-200 text-slate-500';
                  let iconColor = 'text-slate-400';
                  
                  if (currentStatus === 'Dalam Proses') {
                    statusBg = 'bg-amber-50 border-amber-200 text-amber-700';
                    iconColor = 'text-amber-500';
                  } else if (currentStatus === 'Kompeten') {
                    statusBg = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                    iconColor = 'text-emerald-500';
                  }

                  return (
                    <div 
                      key={item.key} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all ${statusBg}`}
                    >
                      {/* Left Part: Icon & Text */}
                      <div className="flex items-center gap-3">
                        <div className={`${iconColor} flex-shrink-0`}>
                          <Target size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                          {item.label}
                        </span>
                      </div>

                      {/* Right Part: Dropdown Select */}
                      <div className="mt-3 sm:mt-0 flex-shrink-0 flex items-center gap-2">
                        {updatingKey === item.key && (
                          <Loader2 className="animate-spin text-slate-400" size={14} />
                        )}
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(item.key, item.label, e.target.value)}
                          disabled={updatingKey === item.key}
                          className={`text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border focus:outline-none focus:ring-1 bg-white cursor-pointer select-none ${
                            currentStatus === 'Kompeten' 
                              ? 'border-emerald-300 text-emerald-700 focus:ring-emerald-400' 
                              : currentStatus === 'Dalam Proses'
                                ? 'border-amber-300 text-amber-700 focus:ring-amber-400'
                                : 'border-slate-300 text-slate-600 focus:ring-slate-400'
                          }`}
                          style={{ minWidth: '130px' }}
                        >
                          <option value="Belum Dimulai">Belum Dimulai</option>
                          <option value="Dalam Proses">Dalam Proses</option>
                          <option value="Kompeten">Kompeten</option>
                        </select>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
