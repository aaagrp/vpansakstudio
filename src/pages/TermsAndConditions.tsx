import React from 'react';
import { FileText, ArrowLeft, Info, HelpCircle, AlertTriangle, Scale, CheckSquare } from 'lucide-react';

interface TermsAndConditionsProps {
  setActiveView: (view: 'home' | 'privacy' | 'terms') => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ setActiveView }) => {
  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Back navigation */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0 });
            setActiveView('home');
          }}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg px-2 py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white margin-0">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-400 mt-1">Last Updated: July 2026</p>
          </div>
        </div>

        {/* Content Details */}
        <div className="max-w-4xl space-y-8">
          
          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Info size={18} className="text-cyan-400" />
              1. Project Enquiries Only
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Form submission through this website is strictly for website project enquiries and information gathering. Submitting your details, preferred features, and budget estimate does not constitute, confirm, or secure a development order, contract, or binding agreement.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <HelpCircle size={18} className="text-cyan-400" />
              2. Scope and Negotiation
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Final pricing, specific custom features, accurate delivery timelines, support guarantees, and payment schedule structures will be discussed and agreed upon separately during the consultation phase.
            </p>
          </div>

          {/* Section 3 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <CheckSquare size={18} className="text-cyan-400" />
              3. Project Commencement
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Design, programming, and server deployment steps will begin only after mutual confirmation, receipt of initial payment (if applicable), and signing of the final design parameters or contract agreement.
            </p>
          </div>

          {/* Section 4 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-cyan-400" />
              4. Client Responsibilities
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              To complete the website project on time, customers must provide correct branding materials, high-quality images, accurate copywriting text, and proper business registration information as required. Delay in providing these assets will adjust the expected delivery date.
            </p>
          </div>

          {/* Section 5 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Scale size={18} className="text-cyan-400" />
              5. Right to Reject Requests
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              VPANSAK Studio reserves the absolute right to reject website building requests that are illegal, fraudulent, harmful, defamatory, inappropriate, or involve copyright infringement or malicious intent.
            </p>
          </div>

          {/* Section 6 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <FileText size={18} className="text-cyan-400" />
              6. Ownership & Support Terms
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Final ownership of website code, licenses, graphics, domain credentials, and ongoing backend server support parameters will depend entirely on the specific contract terms agreed upon for your website project.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
