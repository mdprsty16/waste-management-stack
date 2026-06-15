"use client";
import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KapasitasModal({ isOpen, onClose, onSuccess }: Props) {
  const [kapasitas, setKapasitas] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/pengaturan')
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data) {
            setKapasitas(res.data.kapasitas_maksimal_m3);
            setThreshold(res.data.threshold_persen);
          }
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kapasitas_maksimal_m3: Number(kapasitas), threshold_persen: Number(threshold) })
      });
      if (res.ok) {
        onSuccess();
        onClose();
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
        <h2 className="text-2xl font-black mb-1 text-gray-900">Pengaturan Kapasitas</h2>
        <p className="text-sm text-gray-500 mb-6 font-medium">Tetapkan batas maksimal daya tampung gudang.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kapasitas Maksimal (m³)</label>
            <input 
              type="number" step="0.01" 
              value={kapasitas} 
              onChange={e => setKapasitas(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all font-medium" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Threshold Peringatan (%)</label>
            <input 
              type="number" step="0.1" 
              value={threshold} 
              onChange={e => setThreshold(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all font-medium" 
              required 
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Batal</button>
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
