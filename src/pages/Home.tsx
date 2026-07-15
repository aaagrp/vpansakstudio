import React from 'react';
import { 
  Sparkles, Smartphone, Layers, Zap, Code, 
  Building, Globe, Send, HelpCircle,
  ArrowRight
} from 'lucide-react';

interface HomeProps {
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms') => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveView }) => {
  
  const dashboardCards = [
    {
      title: 'Our Services',
      desc: 'Browse our specialized website types designed for speed, user experience, and conversions.',
      icon: Building,
      badge: '8 Specialties',
      actionLabel: 'View Services',
      target: 'services' as const,
      color: 'from-blue-500/10 to-blue-500/0 border-blue-500/20 text-blue-400'
    },
    {
      title: 'Website Types & Mockups',
      desc: 'Select from 20 website business types and view interactive wireframe preview designs.',
      icon: Globe,
      badge: '20 Categories',
      actionLabel: 'Explore Categories',
      target: 'categories' as const,
      color: 'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20 text-cyan-400'
    },
    {
      title: 'How It Works & FAQs',
      desc: 'Learn about our simplified 4-step workflow process and read our customer help center FAQ.',
      icon: HelpCircle,
      badge: '4 Simple Steps',
      actionLabel: 'See How It Works',
      target: 'how-it-works' as const,
      color: 'from-purple-500/10 to-purple-500/0 border-purple-500/20 text-purple-400'
    },
    {
      title: 'Request A Website',
      desc: 'Configure your pages, custom features, budget, and delivery details directly in our request form.',
      icon: Send,
      badge: 'Pre-filled Options',
      actionLabel: 'Request Quote Now',
      target: 'request-form' as const,
      color: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20 text-emerald-400'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-soft-pulse-1" />
      <div className="absolute top-2/3 right-1/10 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-soft-pulse-2" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-900 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 font-medium mb-6 animate-pulse-slow">
            <Sparkles size={14} />
            <span>Modern Web Development Agency</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Need a Website for <br className="hidden md:inline" /> Your Business?
            <span className="block mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              VPANSAK Studio Will Build It For You
            </span>
          </h1>

          {/* Supporting taglines */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-4 leading-relaxed font-light">
            “Whether you own a shop, coaching institute, restaurant, startup, school, clinic or any other business, share your requirements with us and get a professional website made for your work.”
          </p>
          <p className="max-w-2xl mx-auto text-sm text-cyan-400/80 mb-10 tracking-wide font-medium uppercase">
            Professional Websites for Shops, Businesses, Startups and Personal Brands
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-8">
            <button
              onClick={() => {
                window.scrollTo({ top: 0 });
                setActiveView('request-form');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300 cursor-pointer"
            >
              Request Your Website
            </button>
            <a
              href="https://wa.me/66942033973?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20a%20website%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all duration-300"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Hero Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-3 mb-16 text-sm text-gray-400">
            <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2">
              <a href="tel:+918738869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5">
                <span>📞 Call:</span>
                <span className="font-semibold text-gray-300">+91 8738869635</span>
              </a>
              <a href="tel:+917380869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5">
                <span>📞 Call:</span>
                <span className="font-semibold text-gray-300">+91 7380869635</span>
              </a>
            </div>
            <a href="https://wa.me/66942033973" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5">
              <span>💬 WhatsApp:</span>
              <span className="font-semibold text-gray-300">+66 94 203 3973</span>
            </a>
            <a href="mailto:alook@outlook.in" className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5">
              <span>✉ Email:</span>
              <span className="font-semibold text-gray-300">alook@outlook.in</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/5">
            {[
              { label: 'Mobile-Friendly Design', icon: Smartphone },
              { label: 'Modern User Interface', icon: Layers },
              { label: 'Fast Performance', icon: Zap },
              { label: 'Custom Website Development', icon: Code }
            ].map((pt, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-400">
                <pt.icon size={16} className="text-cyan-400 shrink-0 mb-1 md:mb-0" />
                <span className="text-sm font-medium text-center md:text-left">{pt.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. DASHBOARD LINKS SECTION */}
      <section className="py-24 relative bg-gray-950/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Workspace Dashboard</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Explore Our Website Hub
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
              Use the options below to learn about our build packages, choose preselected layouts, read FAQs, or submit your specifications directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {dashboardCards.map((card, idx) => (
              <div 
                key={idx}
                className="group glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} border border-white/5 flex items-center justify-center shrink-0`}>
                      <card.icon size={22} className="text-cyan-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-medium">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {card.desc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    setActiveView(card.target);
                  }}
                  className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-white/3 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-sm font-semibold text-white transition-all cursor-pointer focus:outline-none"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Contact CTA Footer Card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 max-w-5xl mx-auto text-center mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h4 className="text-lg font-bold text-white mb-1">Direct Developer Support</h4>
                <p className="text-gray-400 text-sm">Want to skip forms and consult on phone/WhatsApp directly?</p>
              </div>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  setActiveView('contact');
                }}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors cursor-pointer focus:outline-none"
              >
                Go to Contacts
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
