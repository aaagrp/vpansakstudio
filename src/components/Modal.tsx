import React from 'react';
import { Send, X, ExternalLink } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 z-10 animate-code-float">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close confirmation dialog"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 mx-auto">
          <Send size={24} className="ml-0.5" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white text-center mb-2">
          Submit Website Requirements
        </h3>
        <p className="text-gray-300 text-center text-sm leading-relaxed mb-6">
          Your website request is ready. WhatsApp will now open so you can send the details to VPANSAK Studio.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/20 transition-colors"
          >
            Open WhatsApp
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
