import { useState } from 'react';
import { Menu, X, MessageSquare, ArrowUp } from 'lucide-react';
import { Home } from './pages/Home';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';

type ViewState = 'home' | 'privacy' | 'terms';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to a home section helper
  const navigateToHomeSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    
    if (activeView !== 'home') {
      setActiveView('home');
      // Wait for page to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navbar Links
  const navLinks = [
    { label: 'Home', action: () => navigateToHomeSection('home') },
    { label: 'Services', action: () => navigateToHomeSection('services') },
    { label: 'How It Works', action: () => navigateToHomeSection('how-it-works') },
    { label: 'Website Types', action: () => navigateToHomeSection('categories') },
    { label: 'Request Website', action: () => navigateToHomeSection('request-form') },
    { label: 'Contact', action: () => navigateToHomeSection('contact') }
  ];

  // Helper for footer and logo clicks
  const navigateHome = () => {
    setActiveView('home');
    setMobileMenuOpen(false);
    scrollToTop();
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-navbar transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={navigateHome}
            className="flex items-center gap-2 text-xl md:text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer focus:outline-none"
          >
            VPANSAK &lt;/&gt; STUDIO
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={link.action}
                    className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigateToHomeSection('request-form')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold text-sm shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 btn-glow transition-all duration-300 focus:outline-none"
            >
              Get Your Website
            </button>
          </div>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 glass-card border-b border-white/10 p-5 space-y-4 animate-code-float" style={{ animationIterationCount: 1, animationDuration: '0.3s' }}>
            <ul className="space-y-3">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={link.action}
                    className="w-full text-left py-2 text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => navigateToHomeSection('request-form')}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/15 focus:outline-none"
              >
                Get Your Website
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main View Router */}
      <main className="flex-grow">
        {activeView === 'home' && <Home />}
        {activeView === 'privacy' && <PrivacyPolicy setActiveView={setActiveView} />}
        {activeView === 'terms' && <TermsAndConditions setActiveView={setActiveView} />}
      </main>

      {/* 11. FOOTER SECTION */}
      <footer className="bg-gray-950 border-t border-gray-900 py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Info */}
            <div className="lg:col-span-2 space-y-4">
              <button
                onClick={navigateHome}
                className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent focus:outline-none"
              >
                VPANSAK &lt;/&gt; STUDIO
              </button>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Professional Website Development for Businesses, Shops, Startups and Personal Brands. We Build Websites That Build Your Business.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-400 pt-2">
                <a href="tel:+917380869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                  <span>📞</span>
                  <span>+91 7380869635</span>
                </a>
                <a href="mailto:alook@outlook.in" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                  <span>✉</span>
                  <span>alook@outlook.in</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Navigations</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    onClick={navigateHome} 
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToHomeSection('services')} 
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToHomeSection('request-form')} 
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Request Website
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToHomeSection('contact')} 
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('privacy');
                      scrollToTop();
                    }}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('terms');
                      scrollToTop();
                    }}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    Terms and Conditions
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub-footer Copyright */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 VPANSAK &lt;/&gt; STUDIO. All Rights Reserved.</p>
            <div className="flex items-center gap-1.5 font-medium">
              <span>Powered by</span>
              <span className="text-gray-400">VPANSAK</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons: WhatsApp and Back-To-Top */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-white shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-label="Scroll to top of page"
        >
          <ArrowUp size={20} />
        </button>

        {/* WhatsApp Fixed Button */}
        <a
          href="https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20a%20website%20for%20my%20business."
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow"
          style={{ animationDuration: '4s' }}
          aria-label="Direct Chat on WhatsApp"
        >
          <MessageSquare size={24} />
        </a>
      </div>

    </div>
  );
}

export default App;
