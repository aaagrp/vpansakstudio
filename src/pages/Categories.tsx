import React from 'react';
import { Globe } from 'lucide-react';

interface CategoriesProps {
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms') => void;
  setPreselectedCategory: (category: string) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  'Shop': 'Shop Website',
  'Business': 'Business Website',
  'Coaching Institute': 'Coaching Institute Website',
  'School': 'School Website',
  'College': 'Other',
  'Restaurant': 'Restaurant Website',
  'Hotel': 'Hotel Website',
  'Hospital or Clinic': 'Clinic or Hospital Website',
  'Portfolio': 'Portfolio Website',
  'E-commerce Store': 'E-commerce Website',
  'NGO or Foundation': 'NGO or Foundation Website',
  'Real Estate': 'Real Estate Website',
  'Event Management': 'Event Website',
  'Gym or Fitness': 'Gym or Fitness Website',
  'Salon or Beauty Parlour': 'Salon Website',
  'Travel Agency': 'Travel Website',
  'Personal Website': 'Personal Website',
  'Blog or News Website': 'Blog or News Website',
  'Other Custom Website': 'Other'
};

const CATEGORIES = Object.keys(CATEGORY_MAP);

export const Categories: React.FC<CategoriesProps> = ({ setActiveView, setPreselectedCategory }) => {
  
  const handleCategorySelect = (category: string) => {
    const formOption = CATEGORY_MAP[category];
    setPreselectedCategory(formOption);
    window.scrollTo({ top: 0 });
    setActiveView('request-form');
  };

  const mockups = [
    {
      type: 'E-commerce Store',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      details: 'Products Grid, Cart Drawer, Checkout, Payments integration',
      formOption: 'E-commerce Website'
    },
    {
      type: 'Coaching Institute Website',
      gradient: 'from-teal-600 via-cyan-600 to-blue-600',
      details: 'Courses catalog, Batch Schedule, Student Enquiry, Portal link',
      formOption: 'Coaching Institute Website'
    },
    {
      type: 'Restaurant Website',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      details: 'Menu Showcase, Reservation Booking, Google Maps, Reviews',
      formOption: 'Restaurant Website'
    },
    {
      type: 'Business Landing Page',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      details: 'Hero Showcase, Key features, Lead intake form, testimonials',
      formOption: 'Business Website'
    },
    {
      type: 'Portfolio Website',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      details: 'Interactive resume, projects listing, dynamic skills tags',
      formOption: 'Portfolio Website'
    },
    {
      type: 'Service Booking Website',
      gradient: 'from-yellow-600 via-amber-600 to-orange-600',
      details: 'Calendar select, Service category, Checkout, Confirmation SMS/Email',
      formOption: 'Other'
    }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Website Categories</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            What Type of Website Do You Need?
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            Select a category below to automatically configure the request form and speed up your submission.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-28">
          {CATEGORIES.map((category, idx) => (
            <button
              key={idx}
              onClick={() => handleCategorySelect(category)}
              className="group relative p-4 text-left rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 flex flex-col justify-between h-28 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                <Globe size={16} />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate w-full">
                {category}
              </span>
              <span className="absolute bottom-3 right-3 text-xs text-gray-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Select
              </span>
            </button>
          ))}
        </div>

        {/* Portfolio Previews Header */}
        <div className="text-center mb-16 pt-8 border-t border-gray-900">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Layouts & UX Mocks</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Websites We Can Build
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
            Explore interactive concepts of the digital layouts and premium user experiences we can implement for your business.
          </p>
        </div>

        {/* Mockups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mockups.map((proj, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                setPreselectedCategory(proj.formOption);
                window.scrollTo({ top: 0 });
                setActiveView('request-form');
              }}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/5 aspect-video flex flex-col justify-end p-6 glass-card-hover cursor-pointer"
            >
              {/* Simulated Web UI background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)]" />
              
              {/* Mini UI elements mockup wireframe overlay */}
              <div className="absolute top-4 left-4 right-4 flex gap-2 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="h-2.5 bg-white/10 rounded-full flex-grow ml-2" />
              </div>
              
              <div className="relative z-10">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-1">Layout Preview</span>
                <h3 className="text-xl font-bold text-white mb-2">{proj.type}</h3>
                <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {proj.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Start Project CTA Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setPreselectedCategory('');
              window.scrollTo({ top: 0 });
              setActiveView('request-form');
            }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300 cursor-pointer focus:outline-none"
          >
            Start Your Custom Project
          </button>
        </div>

      </div>
    </div>
  );
};
