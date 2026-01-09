'use client';

import { useState } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
}

export default function ExportDialog({ isOpen, onClose, onConfirm }: ExportDialogProps) {
  const [filename, setFilename] = useState('playlist');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(filename || 'playlist');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-sm p-6 rounded-xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4">Export Playlist</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="filename" className="block text-sm font-medium mb-1 text-muted-foreground">
              Filename
            </label>
            <div className="flex items-center gap-2">
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="playlist"
                autoFocus
              />
              <span className="text-muted-foreground text-sm font-medium">.json</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
