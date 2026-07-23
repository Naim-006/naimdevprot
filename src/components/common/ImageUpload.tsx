import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

interface Props {
  currentUrl: string;
  folder: 'avatars' | 'projects' | 'blogs' | 'covers';
  onUrlChange: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<Props> = ({ currentUrl, folder, onUrlChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadImage(file, folder);
    if (result) onUrlChange(result.url);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-slate-400">{label}</label>}
      <div className="flex items-center gap-2">
        {currentUrl && (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/10 shrink-0">
            <img src={currentUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Image URL or upload..."
          className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{uploading ? '...' : 'Upload'}</span>
        </button>
      </div>
    </div>
  );
};
