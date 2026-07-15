import React from 'react';
import { 
  Building, ShoppingBag, ShoppingCart, GraduationCap, Utensils, 
  Briefcase, Rocket, Code, Sparkles, Smartphone, ShieldCheck, 
  Layers, Globe, Zap, Headphones, Smile, RefreshCw, CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface ServicesProps {
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms') => void;
}

export const Services: React.FC<ServicesProps> = ({ setActiveView }) => {
  const services = [
    {
      title: 'Business Website',
      desc: 'Professional websites for businesses, companies and service providers.',
      icon: Building,
      color: 'from-blue-500/20 to-blue-500/0 border-blue-500/30'
    },
    {
      title: 'Shop Website',
      desc: 'Digital presence for local shops, stores and sellers.',
      icon: ShoppingBag,
      color: 'from-cyan-500/20 to-cyan-500/0 border-cyan-500/30'
    },
    {
      title: 'E-commerce Website',
      desc: 'Online shopping website with products, cart and order management.',
      icon: ShoppingCart,
      color: 'from-purple-500/20 to-purple-500/0 border-purple-500/30'
    },
    {
      title: 'Coaching and School Website',
      desc: 'Websites for coaching institutes, schools, teachers and educational organizations.',
      icon: GraduationCap,
      color: 'from-teal-500/20 to-teal-500/0 border-teal-500/30'
    },
    {
      title: 'Restaurant Website',
      desc: 'Menu, location, contact, booking and food showcase website.',
      icon: Utensils,
      color: 'from-orange-500/20 to-orange-500/0 border-orange-500/30'
    },
    {
      title: 'Portfolio Website',
      desc: 'Personal portfolio websites for students, developers, designers and professionals.',
      icon: Briefcase,
      color: 'from-pink-500/20 to-pink-500/0 border-pink-500/30'
    },
    {
      title: 'Startup Website',
      desc: 'Modern landing pages and complete websites for startups.',
      icon: Rocket,
      color: 'from-indigo-500/20 to-indigo-500/0 border-indigo-500/30'
    },
    {
      title: 'Custom Website',
      desc: 'A fully customized website based on the customer’s requirements.',
      icon: Code,
      color: 'from-emerald-500/20 to-emerald-500/0 border-emerald-500/30'
    }
  ];

  const features = [
    { title: 'Custom Website Design', desc: 'Unique visual styling tailored to your business, layout, typography and goals.', icon: Sparkles },
    { title: 'Mobile Responsive Development', desc: 'Flawless design integration across all screen sizes (mobile, tablet, desktop).', icon: Smartphone },
    { title: 'Fast and Secure Websites', desc: 'Built using highly optimized technologies to guarantee lightning fast page speed.', icon: ShieldCheck },
    { title: 'Modern User Interface', desc: 'Clean aesthetics, glassmorphism cards, micro-interactions, and premium layouts.', icon: Layers },
    { title: 'SEO-Friendly Structure', desc: 'Proper semantic coding, optimized meta tags, titles, headings to rank better.', icon: Globe },
    { title: 'Affordable Solutions', desc: 'Honest consultation and flexible budgets aligned with your specific business size.', icon: Zap },
    { title: 'Complete Website Support', desc: 'Continuous guidance on configuration, editing, adding features, or maintenance.', icon: Headphones },
    { title: 'Direct Communication', desc: 'Chat directly with developers. No communication gaps, fast and straightforward.', icon: Smile },
    { title: 'No Generic Copy-Paste Design', desc: 'Every website has its own unique, modern codebase structured from scratch.', icon: RefreshCw },
    { title: 'Business-Focused Development', desc: 'We build websites designed to get you more orders, bookings, enquiries, or leads.', icon: CheckCircle2 }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Our Offerings</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Website Development Services
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            We design and build bespoke digital solutions tailored to your business model. Every site is custom crafted for speed, UX, and conversion.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {services.map((srv, idx) => (
            <div 
              key={idx} 
              className="group glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} border flex items-center justify-center text-gray-100 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <srv.icon size={22} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{srv.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{srv.desc}</p>
              </div>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  setActiveView('request-form');
                }}
                className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform cursor-pointer focus:outline-none"
              >
                <span>Request Custom Build</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Why Choose Us Header */}
        <div className="text-center mb-16 pt-8 border-t border-gray-900">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Core Strengths</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Why Choose VPANSAK &lt;/&gt; STUDIO?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
            We stand for premium work. No copy-paste templates, just tailor-made high-performance websites built around your business goals.
          </p>
        </div>

        {/* Why Choose Us Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {features.map((feat, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <feat.icon size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 max-w-4xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Your Website?</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Submit your requirements today and get a personalized call from our developers to finalize design and price.
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0 });
              setActiveView('request-form');
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300 cursor-pointer focus:outline-none"
          >
            <span>Request Quote Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
