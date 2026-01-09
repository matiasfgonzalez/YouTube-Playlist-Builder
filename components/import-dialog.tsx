'use client';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onAppend: () => void;
  videoCount: number;
}

export default function ImportDialog({ 
  isOpen, 
  onClose, 
  onReplace, 
  onAppend,
  videoCount 
}: ImportDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-2">Import Playlist</h2>
        <p className="text-muted-foreground mb-6">
          You are about to import {videoCount} videos. Since your playlist is not empty, how would you like to proceed?
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onAppend}
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Append to existing list
          </button>
          
          <button 
            onClick={onReplace}
            className="w-full py-2.5 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Replace existing list
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-2.5 px-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium rounded-lg transition-colors mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
