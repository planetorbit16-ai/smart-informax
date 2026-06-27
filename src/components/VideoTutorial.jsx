import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Trash2, 
  Plus, 
  Youtube, 
  Link, 
  Clock, 
  X, 
  AlertCircle, 
  Check, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export default function VideoTutorial({ currentUser, tunjukkanNotif }) {
  // 1. STATE & STORAGE MANAGEMENT
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlayingMock, setIsPlayingMock] = useState(false);
  const [mockProgress, setMockProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form input states
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Tutorial UTP');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('Sedang');
  const [formDuration, setFormDuration] = useState('10:00');
  const [formDescription, setFormDescription] = useState('');
  const [formStepsText, setFormStepsText] = useState('');

  // Fetch videos from API on mount
  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        if (data.length > 0) {
          setActiveVideo(data[0]);
        }
      })
      .catch(err => console.error("Gagal memuat video:", err));
  }, []);

  // Sync active video if list changes
  useEffect(() => {
    if (videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0]);
    } else if (videos.length === 0) {
      setActiveVideo(null);
    }
  }, [videos, activeVideo]);

  // Handle active video fallback if active video is deleted
  useEffect(() => {
    if (activeVideo && !videos.some(v => v.id === activeVideo.id)) {
      setActiveVideo(videos.length > 0 ? videos[0] : null);
    }
  }, [videos, activeVideo]);

  // Mock player simulation timer
  useEffect(() => {
    let timer;
    if (isPlayingMock && activeVideo && !getYouTubeEmbedUrl(activeVideo.videoUrl) && !isDirectVideoUrl(activeVideo.videoUrl)) {
      timer = setInterval(() => {
        setMockProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingMock(false);
            return 0;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlayingMock, activeVideo]);

  // 2. HELPER FUNCTIONS FOR URL PARSING
  function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return null;
  }

  function isDirectVideoUrl(url) {
    if (!url) return false;
    const cleaned = url.toLowerCase().split('?')[0];
    return (
      cleaned.endsWith('.mp4') || 
      cleaned.endsWith('.webm') || 
      cleaned.endsWith('.ogg')
    );
  }

  // 3. HANDLERS
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) {
      alert("Mohon lengkapi judul dan URL video tutorial!");
      return;
    }

    if (currentUser?.role !== 'admin') {
      alert("Hanya admin yang memiliki hak akses mengunggah video!");
      return;
    }

    // Determine category
    const finalCategory = formCategory === 'Kustom' ? (formCustomCategory.trim() || 'Lainnya') : formCategory;

    // Split steps by newlines
    const rawSteps = formStepsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Provide default steps if empty
    const finalSteps = rawSteps.length > 0 ? rawSteps : [
      "Langkah 1: Siapkan peralatan kerja.",
      "Langkah 2: Amati petunjuk video.",
      "Langkah 3: Lakukan uji coba langsung.",
      "Langkah 4: Tulis laporan hasil kerja."
    ];

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          video_url: formUrl.trim(),
          category: finalCategory,
          difficulty: formDifficulty,
          duration: formDuration.trim() || '10:00',
          description: formDescription.trim() || 'Tidak ada deskripsi disediakan.',
          steps: finalSteps
        })
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah video ke database server");
      }

      const newVideo = await res.json();
      setVideos(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      tunjukkanNotif("Video tutorial baru berhasil disimpan di database!");
      
      // Reset states
      setFormTitle('');
      setFormUrl('');
      setFormCategory('Tutorial UTP');
      setFormCustomCategory('');
      setFormDifficulty('Sedang');
      setFormDuration('10:00');
      setFormDescription('');
      setFormStepsText('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan video ke database!");
    }
  };

  const handleDeleteVideo = async (id, e) => {
    e.stopPropagation();
    if (currentUser?.role !== 'admin') {
      alert("Hanya admin yang dapat menghapus video!");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus video tutorial ini dari database?")) {
      try {
        const res = await fetch(`/api/videos/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          throw new Error("Gagal menghapus video dari database server");
        }

        setVideos(prev => prev.filter(v => v.id !== id));
        tunjukkanNotif("Video tutorial berhasil dihapus dari database!");
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus video dari database!");
      }
    }
  };

  // 4. COMPUTED DATA
  const categoriesList = ['semua', ...Array.from(new Set(videos.map(v => v.category)))];
  
  const filteredVideos = selectedCategory === 'semua'
    ? videos
    : videos.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());

  const ytUrl = activeVideo ? getYouTubeEmbedUrl(activeVideo.videoUrl) : null;
  const isDirect = activeVideo ? isDirectVideoUrl(activeVideo.videoUrl) : false;

  // Compute mock player step index based on current progress
  const totalSteps = activeVideo?.steps?.length || 0;
  const activeStepIndex = totalSteps > 0 
    ? Math.min(Math.floor((mockProgress / 100) * totalSteps), totalSteps - 1)
    : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in font-sans text-slate-800" id="video-tutorial-container">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#112d75] tracking-tight">E-Learning & Video Tutorial</h2>
          <p className="text-xs text-slate-400 mt-1">
            Materi video tutorial interaktif dan catat langkah kerja prosedural untuk bahan belajar siswa magang.
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#112d75] hover:bg-blue-800 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
            id="btn-tambah-video"
          >
            <Plus size={16} />
            <span>Tambah Video Tutorial</span>
          </button>
        )}
      </div>

      {videos.length === 0 ? (
        /* EMPTY STATE - NO VIDEOS */
        <div className="bg-white rounded-[32px] border border-slate-100 p-10 md:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-[#112d75] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Video size={32} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Database Video Masih Kosong</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Saat ini belum ada video tutorial yang diunggah ke database.
            </p>
          </div>
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#112d75] hover:bg-blue-800 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md inline-flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Plus size={16} />
              <span>Unggah Video Pertama</span>
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-800 text-xs font-semibold py-3 px-4 rounded-2xl border border-amber-100/50 inline-block max-w-sm">
              💡 Silakan hubungi Guru Pembimbing (Admin) Anda untuk mengunggah materi video tutorial baru ke platform ini.
            </div>
          )}
        </div>
      ) : (
        /* INTERACTIVE VIDEO CONTENT AREA */
        <div className="space-y-6">
          
          {/* VIDEO PLAYER & STEP DISPLAY */}
          {activeVideo && (
            <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-xs overflow-hidden" id="video-workspace-player">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                
                {/* 1. PLAYER CANVAS (LEFT/TOP) */}
                <div className="lg:col-span-2 bg-slate-950 aspect-video relative flex items-center justify-center text-white overflow-hidden">
                  
                  {ytUrl ? (
                    /* REAL YOUTUBE PLAYER */
                    <iframe
                      src={ytUrl}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    ></iframe>
                  ) : isDirect ? (
                    /* HTML5 DIRECT MP4 PLAYER */
                    <video 
                      src={activeVideo.videoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      id="html5-video-player"
                    />
                  ) : (
                    /* INTERACTIVE VIRTUAL / MOCK SIMULATOR (Fallback for generic URLs) */
                    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-tr from-[#0b1426] via-[#102a45] to-[#121c33] select-none text-center">
                      {/* Mock Top bar */}
                      <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-xl z-10 w-full text-left">
                        <span className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {activeVideo.category}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold">Simulator Interaktif</span>
                      </div>

                      {/* Center Play Indicator */}
                      <div className="flex flex-col items-center justify-center gap-4 z-10 my-auto">
                        {!isPlayingMock ? (
                          <button
                            onClick={() => setIsPlayingMock(true)}
                            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                          >
                            <Play size={28} className="ml-1" />
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <span className="text-xs font-mono font-bold bg-rose-600/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/20 animate-pulse">
                              SIMULASI PROSEDUR BERJALAN...
                            </span>
                            <p className="text-sm font-bold text-white max-w-md mx-auto leading-relaxed px-4">
                              {activeVideo.steps[activeStepIndex]}
                            </p>
                          </div>
                        )}
                        
                        <p className="text-[11px] text-slate-400 max-w-sm px-6">
                          Link eksternal terdeteksi. Gunakan simulator ini untuk memandu rincian praktikum secara otomatis.
                        </p>
                      </div>

                      {/* Mock Player Control Bar */}
                      <div className="bg-black/60 p-3 rounded-2xl z-10 space-y-2 text-left">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono text-slate-300">
                            {Math.floor((mockProgress / 100) * 10)}:{(Math.floor((mockProgress / 100) * 60) % 60).toString().padStart(2, '0')}
                          </span>
                          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                            <div 
                              className="absolute top-0 left-0 h-full bg-rose-500 rounded-full"
                              style={{ width: `${mockProgress}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-300">{activeVideo.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YouTube Overlay badge */}
                  {ytUrl && (
                    <div className="absolute top-3 left-3 pointer-events-none bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5 z-10">
                      <Youtube size={12} />
                      <span>YouTube</span>
                    </div>
                  )}
                </div>

                {/* 2. STEPS PROCEDURE ROADMAP (RIGHT/BOTTOM) */}
                <div className="p-4 sm:p-6 bg-slate-50/70 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between max-h-[420px] lg:max-h-none overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50">
                      <Sparkles size={16} className="text-blue-600" />
                      <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">Prosedur Kerja Praktik</h4>
                    </div>

                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {activeVideo.title}
                    </p>

                    <div className="space-y-3">
                      {activeVideo.steps.map((step, idx) => {
                        const isSimulating = !ytUrl && !isDirect;
                        const isCurrent = isSimulating && idx === activeStepIndex && isPlayingMock;
                        const isPassed = isSimulating && idx < activeStepIndex && isPlayingMock;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-2xl border transition-all text-left ${
                              isCurrent 
                                ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-200 shadow-xs scale-[1.01]' 
                                : isPassed
                                  ? 'bg-emerald-50/50 border-emerald-100'
                                  : 'bg-white border-slate-100/80 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex gap-2.5 items-start">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                isCurrent
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : isPassed
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#112d75]/10 text-[#112d75]'
                              }`}>
                                {idx + 1}
                              </span>
                              <p className={`text-[11px] leading-relaxed font-semibold ${
                                isCurrent 
                                  ? 'text-rose-950 font-bold' 
                                  : isPassed
                                    ? 'text-emerald-900/80 line-through decoration-emerald-500/15'
                                    : 'text-slate-600'
                              }`}>
                                {step}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                    <AlertCircle size={14} className="text-[#112d75]" />
                    <span>Langkah kerja ini berguna untuk memandu dokumentasi jurnal magang.</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* CATEGORY SELECTOR CHIPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pilih Kategori</span>
              <span className="text-[10px] text-slate-400 font-extrabold bg-slate-100 px-3 py-1 rounded-full">
                {filteredVideos.length} Video Terdaftar
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#112d75] text-white shadow-xs'
                      : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {cat === 'semua' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* VIDEO THUMBNAIL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map((video) => {
              const isActive = activeVideo?.id === video.id;
              const hasYt = getYouTubeEmbedUrl(video.videoUrl);

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    setIsPlayingMock(false);
                    setMockProgress(0);
                  }}
                  className={`group border rounded-2xl sm:rounded-[28px] overflow-hidden bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isActive 
                      ? 'border-blue-400 ring-2 ring-blue-50' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div>
                    {/* Mock/Real Thumbnail Image Box */}
                    <div className="aspect-video bg-[#0b1426] relative flex items-center justify-center p-4">
                      <div className="text-center space-y-2 z-10">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
                          isActive 
                            ? 'bg-blue-600 text-white scale-110' 
                            : 'bg-white/15 text-white group-hover:bg-blue-600'
                        }`}>
                          <Play size={18} className="ml-0.5" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-md inline-block">
                          {video.duration} Mins
                        </span>
                      </div>

                      {/* Video Category badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {video.category}
                        </span>
                      </div>

                      {/* Source indicator icon */}
                      <div className="absolute top-2.5 right-2.5">
                        {hasYt ? (
                          <div className="bg-red-600/90 text-white p-1 rounded-full" title="Sumber: YouTube">
                            <Youtube size={12} />
                          </div>
                        ) : (
                          <div className="bg-blue-600/90 text-white p-1 rounded-full" title="Sumber: Link Web/Direct">
                            <Link size={12} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 space-y-2 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-blue-50 text-[#112d75] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                          {video.difficulty}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2 leading-relaxed group-hover:text-[#112d75] transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom / Delete Button */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{video.duration}</span>
                    </div>

                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={(e) => handleDeleteVideo(video.id, e)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Video"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. ADD MODAL DIALOG */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" id="modal-tambah-video">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Video className="text-[#112d75] shrink-0" size={18} />
                <h3 className="font-extrabold text-xs sm:text-base text-slate-800">Unggah / Tambah Video Tutorial</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} className="shrink-0" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddVideo} className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Judul */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Judul Video Tutorial</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: Setting NAT Firewall di MikroTik"
                  />
                </div>

                {/* Link Video */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Link URL Video (YouTube atau MP4/Direct)</label>
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                    placeholder="Contoh: https://www.youtube.com/watch?v=xxx atau .mp4"
                  />
                  <p className="text-[10px] text-slate-400 flex items-start gap-1 mt-1 leading-normal">
                    <Youtube size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Mendukung link YouTube biasa, share link, maupun file video direct (.mp4).</span>
                  </p>
                </div>

                {/* Kategori */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                  >
                    <option value="Tutorial UTP">Tutorial UTP</option>
                    <option value="Fiber Optik">Fiber Optik</option>
                    <option value="Router">Konfigurasi Router</option>
                    <option value="Modem">Modem GPON</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                    <option value="Kustom">Kustom...</option>
                  </select>
                </div>

                {/* Tingkat Kesulitan */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Tingkat Kesulitan</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>

                {/* Custom Category Input if selected */}
                {formCategory === 'Kustom' && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] sm:text-xs font-bold text-slate-500">Nama Kategori Kustom Baru</label>
                    <input
                      type="text"
                      required
                      value={formCustomCategory}
                      onChange={(e) => setFormCustomCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                      placeholder="Masukkan nama kategori baru"
                    />
                  </div>
                )}

                {/* Durasi */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Durasi (MM:SS)</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                    placeholder="Contoh: 08:45"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-500">Deskripsi Ringkas</label>
                  <textarea
                    rows="2"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                    placeholder="Uraikan intisari video tutorial praktikum ini..."
                  />
                </div>

                {/* Langkah-langkah / Prosedur */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] sm:text-xs font-bold text-slate-500">Prosedur Kerja (Satu baris = Satu langkah)</label>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold shrink-0">Tekan Enter untuk baris baru</span>
                  </div>
                  <textarea
                    rows="3"
                    value={formStepsText}
                    onChange={(e) => setFormStepsText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                    placeholder="Langkah 1: Siapkan tang crimping dan konektor RJ45&#10;Langkah 2: Kupas kabel luar T568B&#10;Langkah 3: Masukkan core ke RJ45 dan press"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#112d75] hover:bg-blue-800 text-white font-extrabold text-xs py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl shadow-md transition-all cursor-pointer text-center"
                >
                  Simpan Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
