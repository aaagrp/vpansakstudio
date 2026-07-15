import React from 'react';
import { Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';

interface ContactProps {
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms') => void;
}

export const Contact: React.FC<ContactProps> = ({ setActiveView }) => {
  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Contact VPANSAK Studio
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            Whether you want to start a project immediately or have a few questions, our developer team is here to help.
          </p>
        </div>

        {/* Contact cards section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Let’s Build Your Website
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto mb-8 font-light">
              Website requests can be submitted anytime. Our team will contact you after reviewing your requirements.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10 text-center">
              {/* Calls card */}
              <div 
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 shrink-0">
                  <Phone size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Phone Calls</span>
                <a href="tel:+918738869635" className="text-base font-bold text-cyan-400 tracking-tight hover:underline mb-1 focus:outline-none">
                  +91 8738869635
                </a>
                <a href="tel:+917380869635" className="text-base font-bold text-cyan-400 tracking-tight hover:underline focus:outline-none">
                  +91 7380869635
                </a>
              </div>

              {/* WhatsApp card */}
              <a 
                href="https://wa.me/66942033973"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 shrink-0">
                  <MessageSquare size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">WhatsApp</span>
                <span className="text-base font-bold text-cyan-400 tracking-tight">
                  +66 94 203 3973
                </span>
              </a>

              {/* Email card */}
              <a 
                href="mailto:alook@outlook.in"
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 shrink-0">
                  <Mail size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Official Email</span>
                <span className="text-base font-bold text-cyan-400 tracking-tight break-all">
                  alook@outlook.in
                </span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/66942033973?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20to%20discuss%20a%20website%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-300"
              >
                <MessageSquare size={18} />
                Chat on WhatsApp
              </a>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveView('request-form');
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300 cursor-pointer focus:outline-none"
              >
                <span>Submit Requirements</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
