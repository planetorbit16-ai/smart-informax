import React, { useState, useEffect } from 'react';
import { User, Mail, School, BookOpen, MapPin, Shield, Edit3, Check, X, ShieldAlert, Award, Camera, Briefcase, Calendar } from 'lucide-react';

export default function Profil({ profile, setProfile, tunjukkanNotif, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nis: '',
    sekolah: '',
    jurusan: '',
    kelas: '',
    email: '',
    pembimbing: '',
    tempat_pkl: '',
    tempatPkl: '',
    pembimbing_industri: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });
  const [validationError, setValidationError] = useState('');

  // Sync formData with profile prop on load or updates
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        pembimbing: profile.pembimbing || '',
        pembimbing_industri: profile.pembimbing_industri || '',
        tanggal_mulai: profile.tanggal_mulai || '',
        tanggal_selesai: profile.tanggal_selesai || '',
        tempat_pkl: profile.tempat_pkl || profile.tempatPkl || '',
        tempatPkl: profile.tempat_pkl || profile.tempatPkl || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      setValidationError('Nama Lengkap tidak boleh kosong!');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Masukkan alamat email yang valid!');
      return;
    }

    setValidationError('');
    const updated = {
      ...formData,
      pembimbing: formData.pembimbing || '',
      tempat_pkl: formData.tempat_pkl || formData.tempatPkl || '',
      tempatPkl: formData.tempat_pkl || formData.tempatPkl || '',
      pembimbing_industri: formData.pembimbing_industri || '',
      tanggal_mulai: formData.tanggal_mulai || '',
      tanggal_selesai: formData.tanggal_selesai || ''
    };
    setProfile(updated);
    setIsEditing(false);
    tunjukkanNotif('Profil siswa berhasil diperbarui!');
  };

  const handleCancel = () => {
    setFormData({
      ...profile,
      pembimbing: profile.pembimbing || '',
      pembimbing_industri: profile.pembimbing_industri || '',
      tanggal_mulai: profile.tanggal_mulai || '',
      tanggal_selesai: profile.tanggal_selesai || '',
      tempat_pkl: profile.tempat_pkl || profile.tempatPkl || '',
      tempatPkl: profile.tempat_pkl || profile.tempatPkl || ''
    });
    setValidationError('');
    setIsEditing(false);
  };

  // Pilih preset avatar warna atau inisial
  const getInitials = (name) => {
    if (!name) return 'SP';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" id="profil-detail-section">
      
      {/* Profil Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-xs p-4 sm:p-6 md:p-8 relative overflow-hidden" id="profil-header-card">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start relative z-10">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full aspect-square border-4 border-slate-50 flex items-center justify-center bg-blue-50 text-[#112d75] text-2xl sm:text-3xl font-black shadow-md select-none">
              {getInitials(profile.nama)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#112d75] hover:bg-blue-800 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer" title="Ubah Foto">
              <Camera size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* User Basic Info / Header Teks */}
          <div className="text-center md:text-left space-y-1.5 flex-1">
            <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{profile.nama}</h3>
            <p className="text-[#112d75] text-xs sm:text-sm font-bold bg-blue-50/70 inline-block px-3 py-1 rounded-full">{profile.kelas}</p>
            <p className="text-slate-500 text-[11px] sm:text-sm font-semibold">{profile.jurusan}</p>
          </div>

          {/* Action button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#112d75] font-bold text-xs rounded-full border border-slate-100 hover:border-slate-200 transition-all cursor-pointer self-center md:self-auto"
              id="btn-edit-profil"
            >
              <Edit3 size={12} />
              <span>Edit Profil</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form/Detail Grid */}
      <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-xs p-4 sm:p-6 md:p-8" id="profil-detail-form-card">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Formulir Edit Data Siswa</h4>
              <button 
                type="button"
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
            </div>

            {validationError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
                <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Nama Lengkap</label>
                <input 
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Nama Lengkap"
                />
              </div>

              {/* NIS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Nomor Induk Siswa (NIS)</label>
                <input 
                  type="text"
                  name="nis"
                  value={formData.nis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="NIS Siswa"
                />
              </div>

              {/* Sekolah */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Sekolah Asal</label>
                <input 
                  type="text"
                  name="sekolah"
                  value={formData.sekolah}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Sekolah Asal"
                />
              </div>

              {/* Jurusan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Kompetensi Keahlian (Jurusan)</label>
                <input 
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Jurusan"
                />
              </div>

              {/* Kelas */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Kelas</label>
                <input 
                  type="text"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Kelas"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Alamat Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Alamat Email"
                />
              </div>

              {/* Pembimbing */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Guru Pembimbing PKL</label>
                <input 
                  type="text"
                  name="pembimbing"
                  value={formData.pembimbing}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Guru Pembimbing"
                />
              </div>

              {/* Tempat PKL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Nama Perusahaan / Industri PKL</label>
                <input 
                  type="text"
                  name="tempat_pkl"
                  value={formData.tempat_pkl || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Industri Mitra"
                />
              </div>

              {/* Pembimbing Industri */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Pembimbing Industri (Supervisor)</label>
                <input 
                  type="text"
                  name="pembimbing_industri"
                  value={formData.pembimbing_industri || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                  placeholder="Nama Pembimbing Lapangan"
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Tanggal Mulai Magang</label>
                <input 
                  type="date"
                  name="tanggal_mulai"
                  value={formData.tanggal_mulai || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                />
              </div>

              {/* Tanggal Selesai */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Tanggal Selesai Magang</label>
                <input 
                  type="date"
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#112d75] hover:bg-blue-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Check size={14} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 text-left">
            {/* 1. INFORMASI AKADEMIK */}
            <div>
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-5">Detail Informasi Akademik</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detail Item 1: NIS */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">NIS Siswa</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.nis}</span>
                  </div>
                </div>

                {/* Detail Item 2: Kelas */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#112d75] block uppercase tracking-wider">Kelas & Tingkat</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.kelas}</span>
                  </div>
                </div>

                {/* Detail Item 3: Asal Sekolah */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <School size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 block uppercase tracking-wider">Sekolah Asal</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.sekolah}</span>
                  </div>
                </div>

                {/* Detail Item 4: Email */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 block uppercase tracking-wider">Email Siswa</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.email}</span>
                  </div>
                </div>

                {/* Detail Item 5: Guru Pembimbing */}
                <div className="flex gap-3 items-start md:col-span-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-500 block uppercase tracking-wider">Guru Pembimbing Sekolah</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.pembimbing || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DEDICATED TEMPAT MAGANG SECTION */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-5">Informasi Tempat Magang (Dunia Industri)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {/* Perusahaan */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">Nama Perusahaan / Industri</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">{profile.tempat_pkl || profile.tempatPkl || '-'}</span>
                  </div>
                </div>

                {/* Pembimbing Industri */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#112d75]/10 text-[#112d75] flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#112d75] block uppercase tracking-wider">Pembimbing Industri (Supervisor)</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">{profile.pembimbing_industri || '-'}</span>
                  </div>
                </div>

                {/* Tanggal Mulai */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 block uppercase tracking-wider">Tanggal Mulai</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.tanggal_mulai || '-'}</span>
                  </div>
                </div>

                {/* Tanggal Selesai */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 block uppercase tracking-wider">Tanggal Selesai</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.tanggal_selesai || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Bantuan */}
            <div className="mt-8 p-4 bg-[#112d75]/5 rounded-2xl border border-[#112d75]/10 flex gap-3 text-slate-600">
              <BookOpen size={16} className="text-[#112d75] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[11px] text-[#112d75] block">Informasi Sinkronisasi Data Jurnal</span>
                <p className="text-[11px] leading-relaxed font-semibold">
                  Data profil siswa ini digunakan secara dinamis untuk melengkapi tanda tangan digital pada Jurnal Magang Digital serta Laporan Akhir PKL. Pastikan nama lengkap dan NIS Anda sudah diisi dengan benar.
                </p>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Keluar (Logout Akun)
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
