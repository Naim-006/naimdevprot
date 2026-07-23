import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image, Trash2 } from 'lucide-react';
import { uploadImage, deleteImage } from '../../lib/storage';

interface Props {
  currentUrl: string;
  folder: 'avatars' | 'projects' | 'blogs' | 'covers' | 'testimonials';
  onUrlChange: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<Props> = ({ currentUrl, folder, onUrlChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setError('');
    setUploading(true);
    const result = await uploadImage(file, folder);
    setUploading(false);
    if (result) {
      // Delete old image if it was previously uploaded (starts with storage URL)
      if (currentUrl && currentUrl.includes('supabase.co/storage')) {
        const oldPath = currentUrl.split('/images/')[1];
        if (oldPath) deleteImage(oldPath);
      }
      onUrlChange(result.url);
    } else {
      setError('Upload failed. Check your connection and try again.');
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    if (currentUrl && currentUrl.includes('supabase.co/storage')) {
      const oldPath = currentUrl.split('/images/')[1];
      if (oldPath) deleteImage(oldPath);
    }
    onUrlChange('');
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-slate-400">{label}</label>}
      <div className="flex items-center gap-2">
        {currentUrl ? (
          <div className="relative group w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/10 shrink-0">
            <img src={currentUrl} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/10 shrink-0 flex items-center justify-center">
            <Image className="w-4 h-4 text-slate-500" />
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
