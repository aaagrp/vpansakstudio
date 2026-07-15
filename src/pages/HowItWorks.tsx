import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HowItWorksProps {
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ setActiveView }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const steps = [
    {
      step: 'Step 1',
      title: 'Fill the Form',
      desc: 'Enter your name, business details and website requirements on our request form.',
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30'
    },
    {
      step: 'Step 2',
      title: 'Send on WhatsApp',
      desc: 'Your complete requirements will be automatically compiled and sent directly to VPANSAK Studio via WhatsApp.',
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30'
    },
    {
      step: 'Step 3',
      title: 'Consultation Call',
      desc: 'Our developer team will contact you to discuss final design styles, custom features, precise pricing, and timeline.',
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30'
    },
    {
      step: 'Step 4',
      title: 'Development & Launch',
      desc: 'After confirmation, we will build, test, and publish your professional website to the production server.',
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30'
    }
  ];

  const faqs = [
    {
      q: "How do I request a website?",
      a: "Fill out the website requirement form on our Request page and send the details through WhatsApp. Our developers will check it and reach out."
    },
    {
      q: "What happens after I submit the form?",
      a: "VPANSAK Studio will review your specifications and contact you via your preferred contact method (WhatsApp/Call) to discuss pricing and timeline."
    },
    {
      q: "Can you build a website for a small shop?",
      a: "Yes. We create customized websites for local shops, coaching institutes, restaurants, businesses, professionals, and startups of all sizes."
    },
    {
      q: "Can you create an online shopping website?",
      a: "Yes. E-commerce websites with product catalogs, shopping carts, order checkouts, and custom payment button integrations can be developed."
    },
    {
      q: "Do I need a domain and hosting?",
      a: "No, you do not need to buy them beforehand. If you do not have them, VPANSAK Studio will guide you during the consultation on the best options."
    },
    {
      q: "Can I request a custom feature?",
      a: "Yes. Mention the required custom functionality in the additional requirements field of the form, and we will integrate it."
    },
    {
      q: "Is the price fixed?",
      a: "No. The final cost will depend on the number of pages, custom features, and complexity. We offer flexible budgets starting from ₹5,000."
    }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Our Process</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Get Your Website in Simple Steps
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            We have simplified the development process. From initial idea submission to full production launch in 4 easy steps.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative max-w-5xl mx-auto mb-28">
          {/* Timeline Line Connector */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/40 via-cyan-500/40 to-purple-500/40 -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 text-center border border-white/5 relative">
                {/* Step Bubble */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} border border-white/10 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-black/40`}>
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2">{step.step}</span>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Header */}
        <div className="text-center mb-16 pt-8 border-t border-gray-900">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Help Center</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
            Everything you need to know about starting your website project with VPANSAK Studio.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto mb-20 space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-medium text-white hover:bg-white/3 transition-colors focus:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp size={18} className="text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              <div 
                className={`faq-content ${openFaqIndex === idx ? 'open' : ''}`}
              >
                <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact/Request CTA */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 max-w-4xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Still Have Questions?</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Get in touch with us directly. We are happy to clear up any doubts about website requirements, hosting, or cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('request-form');
              }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Request A Website
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('contact');
              }}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
