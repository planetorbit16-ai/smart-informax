import React, { useState, useEffect } from 'react';
import { Wifi, Mail, Lock, User, School, BookOpen, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, Database, Check, AlertTriangle } from 'lucide-react';

export default function Auth({ onLoginSuccess, tunjukkanNotif }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regNama, setRegNama] = useState('');
  const [regNis, setRegNis] = useState('');
  const [regSekolah, setRegSekolah] = useState('');
  const [regKelas, setRegKelas] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Fetch Database connection status on load
  useEffect(() => {
    fetch('/api/db-status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => console.error("Gagal mengambil status DB:", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Email atau password salah!");
        return;
      }
      
      tunjukkanNotif(`Selamat Datang Kembali, ${data.user.nama}!`);
      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungi server backend! Pastikan server berjalan.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regNama.trim() || !regNis.trim() || !regEmail.trim() || !regPassword) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: regNama.trim(),
          nis: regNis.trim(),
          sekolah: regSekolah.trim(),
          kelas: regKelas,
          email: regEmail.toLowerCase().trim(),
          password: regPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registrasi gagal!");
        return;
      }

      tunjukkanNotif("Registrasi berhasil! Silakan login.");
      
      // Auto fill and transition to login
      setIsLogin(true);
      setLoginEmail(data.user.email);
      setLoginPassword(data.user.password);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan registrasi ke server!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans" id="auth-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Brand Logo Header */}
        <div className="inline-flex items-center gap-3 bg-[#112d75] text-white px-5 py-2.5 rounded-2xl shadow-lg border border-blue-900/20">
          <div className="bg-blue-500/20 p-1.5 rounded-xl text-sky-400 flex items-center justify-center">
            <Wifi size={24} className="animate-pulse" />
          </div>
          <div className="text-left">
            <span className="font-black text-white text-base tracking-wider block leading-tight">SMART</span>
            <span className="font-bold text-sky-300 text-[10px] uppercase tracking-wider block -mt-1">INFORMAX</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-[#112d75] tracking-tight">
          {isLogin ? 'Masuk ke Platform PKL' : 'Pendaftaran Akun Baru'}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {isLogin 
            ? 'Gunakan akun Anda untuk masuk ke dashboard panduan dan jurnal harian digital.' 
            : 'Isi biodata secara lengkap untuk mendaftarkan jurnal digital magang Anda.'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-xl space-y-5 sm:space-y-6">
          
          {/* Tabs switch */}
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isLogin 
                  ? 'bg-[#112d75] text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !isLogin 
                  ? 'bg-[#112d75] text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Daftar (Register)
            </button>
          </div>

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500">Kata Sandi (Password)</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#112d75] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.01]"
                >
                  <span>Masuk Ke Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Nama Lengkap Siswa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: Rian Pratama"
                  />
                </div>
              </div>

              {/* NIS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Nomor Induk Siswa (NIS)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regNis}
                    onChange={(e) => setRegNis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: 22045678"
                  />
                </div>
              </div>

              {/* Asal Sekolah */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Asal Sekolah</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <School size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regSekolah}
                    onChange={(e) => setRegSekolah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: SMK Negeri 1 Tanjungpinang"
                  />
                </div>
              </div>

              {/* Kelas */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Kelas & Rombel</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={regKelas}
                    onChange={(e) => setRegKelas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: XII TKJ 1"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Ulangi Sandi</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#112d75] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.01]"
                >
                  <ShieldCheck size={18} />
                  <span>Daftarkan Akun PKL</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
