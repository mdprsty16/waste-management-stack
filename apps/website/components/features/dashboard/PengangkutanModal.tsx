"use client";
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PengangkutanModal({ isOpen, onClose, onSuccess }: Props) {
  const [volume, setVolume] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/pengangkutan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volume_m3_diangkut: Number(volume), keterangan })
      });
      if (res.ok) {
        onSuccess();
        onClose();
        setVolume("");
        setKeterangan("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-fade-in-up">
        <h2 className="text-2xl font-black mb-1 text-gray-900">Catat Pengangkutan</h2>
        <p className="text-sm text-gray-500 mb-6 font-medium">Kurangi volume terpakai di gudang setelah sampah diangkut mitra.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Volume Diangkut (m³)</label>
            <input 
              type="number" step="0.01" 
              value={volume} 
              onChange={e => setVolume(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan (Opsional)</label>
            <input 
              type="text" 
              value={keterangan} 
              onChange={e => setKeterangan(e.target.value)} 
              placeholder="Contoh: Diambil oleh truk DLH" 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" 
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Batal</button>
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Catat Pengangkutan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
