import React from 'react';
import { Shield, ArrowLeft, Info, Mail, Phone, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  setActiveView: (view: 'home' | 'privacy' | 'terms') => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setActiveView }) => {
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
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white margin-0">
              Privacy Policy
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
              1. Information Collection
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              VPANSAK &lt;/&gt; STUDIO collects customer-provided details entered during the website requirement enquiry process. This information includes your full name, WhatsApp number, email address, city/location, business/brand name, category, and preferred specifications for your project.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Shield size={18} className="text-cyan-400" />
              2. How Information is Used
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              The project details and contact credentials you provide are used strictly to communicate with you and discuss the structure, pricing, scope, design, and timeline of your custom website development.
            </p>
          </div>

          {/* Section 3 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Phone size={18} className="text-cyan-400" />
              3. WhatsApp Integration
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              This website does not store project entries in an external database. The form formatting triggers a pre-filled client redirect to open a secure direct chat session with VPANSAK Studio via official WhatsApp APIs.
            </p>
          </div>

          {/* Warning Section */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border-l-4 border-l-red-500 border border-white/5 bg-red-500/5 space-y-3">
            <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2.5">
              <Lock size={18} />
              Important Warning for Users
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              VPANSAK Studio will never ask you to submit account passwords, verification OTPs, credit/debit card numbers, banking PINs, or any other sensitive financial details on this platform. Please do not input, share, or submit any financial or credentials details.
            </p>
          </div>

          {/* Section 4 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Shield size={18} className="text-cyan-400" />
              4. Data Sharing and Third Parties
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your data privacy is important to us. VPANSAK Studio does not share, rent, trade, or knowingly sell customer contact lists or enquiry details to any marketing networks or third parties.
            </p>
          </div>

          {/* Section 5 */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
              <Mail size={18} className="text-cyan-400" />
              5. Customer Contact
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Customers can reach out to VPANSAK Studio at any point regarding submitted enquiry details or to withdraw their details from follow-up lists. If you have any questions or require modifications to the submitted details, contact us directly:
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-gray-300 pt-1">
              <a href="tel:+917380869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                <span>📞 WhatsApp:</span>
                <span className="font-semibold text-gray-200">+91 7380869635</span>
              </a>
              <a href="mailto:alook@outlook.in" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                <span>✉ Email:</span>
                <span className="font-semibold text-cyan-400 hover:underline">alook@outlook.in</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
