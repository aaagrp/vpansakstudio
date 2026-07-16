import { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, ArrowUp, Lock } from 'lucide-react';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Categories } from './pages/Categories';
import { HowItWorks } from './pages/HowItWorks';
import { RequestForm } from './pages/RequestForm';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { AdminPortal } from './pages/AdminPortal';
import { AdminServiceDetail } from './pages/AdminServiceDetail';
import { CustomerTracking } from './pages/CustomerTracking';

type ViewState = 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms' | 'admin' | 'admin-service-detail' | 'track';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string>('');

  // Routing synchronization on load / popstate
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get('serviceId');

      if (path === '/admin') {
        setActiveView('admin');
      } else if (path.startsWith('/admin/services/')) {
        const parts = path.split('/');
        const sId = parts[parts.length - 1];
        if (sId) {
          setSelectedServiceId(sId);
          setActiveView('admin-service-detail');
        } else {
          setActiveView('admin');
        }
      } else if (path === '/track' || serviceId) {
        setActiveView('track');
      } else if (path === '/services') {
        setActiveView('services');
      } else if (path === '/categories') {
        setActiveView('categories');
      } else if (path === '/how-it-works') {
        setActiveView('how-it-works');
      } else if (path === '/request-form') {
        setActiveView('request-form');
      } else if (path === '/contact') {
        setActiveView('contact');
      } else if (path === '/privacy') {
        setActiveView('privacy');
      } else if (path === '/terms') {
        setActiveView('terms');
      } else {
        setActiveView('home');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch pages view and scroll to top
  const navigateView = (view: ViewState, searchParams?: string) => {
    setMobileMenuOpen(false);
    setActiveView(view);
    
    let path = '/';
    if (view === 'admin') {
      path = '/admin';
    } else if (view === 'admin-service-detail' && selectedServiceId) {
      path = `/admin/services/${selectedServiceId}`;
    } else if (view === 'track') {
      path = '/track';
    } else if (view === 'services') {
      path = '/services';
    } else if (view === 'categories') {
      path = '/categories';
    } else if (view === 'how-it-works') {
      path = '/how-it-works';
    } else if (view === 'request-form') {
      path = '/request-form';
    } else if (view === 'contact') {
      path = '/contact';
    } else if (view === 'privacy') {
      path = '/privacy';
    } else if (view === 'terms') {
      path = '/terms';
    }
    
    const newUrl = path + (searchParams ? `?${searchParams}` : '');
    window.history.pushState({}, '', newUrl);

    // Scroll immediately to top on page transition
    window.scrollTo({ top: 0 });
  };

  // Navbar Links
  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Services', view: 'services' as const },
    { label: 'Website Types', view: 'categories' as const },
    { label: 'How It Works', view: 'how-it-works' as const },
    { label: 'Request Website', view: 'request-form' as const },
    { label: 'Track Project', view: 'track' as const },
    { label: 'Contact', view: 'contact' as const }
  ];

  // Desktop Link CSS Class
  const getLinkClass = (view: ViewState) => {
    const base = "text-sm font-medium transition-colors cursor-pointer focus:outline-none py-1.5 relative";
    if (activeView === view) {
      return `${base} text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full`;
    }
    return `${base} text-gray-300 hover:text-cyan-400`;
  };

  // Mobile Link CSS Class
  const getMobileLinkClass = (view: ViewState) => {
    const base = "w-full text-left py-2.5 px-3 rounded-lg text-base font-medium transition-colors focus:outline-none flex items-center justify-between";
    if (activeView === view) {
      return `${base} bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400`;
    }
    return `${base} text-gray-300 hover:text-cyan-400 hover:bg-white/5`;
  };

  const isAdminView = activeView === 'admin' || activeView === 'admin-service-detail';

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. NAVIGATION BAR */}
      {!isAdminView && (
        <nav className="fixed top-0 left-0 right-0 z-40 glass-navbar transition-all duration-300">
          <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigateView('home')}
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
                      onClick={() => navigateView(link.view)}
                      className={getLinkClass(link.view)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigateView('request-form')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold text-sm shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 btn-glow transition-all duration-300 focus:outline-none cursor-pointer"
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
              <ul className="space-y-2">
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => navigateView(link.view)}
                      className={getMobileLinkClass(link.view)}
                    >
                      <span>{link.label}</span>
                      {activeView === link.view && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => navigateView('request-form')}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/15 focus:outline-none cursor-pointer"
                >
                  Get Your Website
                </button>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {activeView === 'home' && <Home setActiveView={navigateView} />}
        {activeView === 'services' && <Services setActiveView={navigateView} />}
        {activeView === 'categories' && <Categories setActiveView={navigateView} setPreselectedCategory={setPreselectedCategory} />}
        {activeView === 'how-it-works' && <HowItWorks setActiveView={navigateView} />}
        {activeView === 'request-form' && (
          <RequestForm 
            preselectedCategory={preselectedCategory} 
            setPreselectedCategory={setPreselectedCategory} 
            setActiveView={navigateView}
          />
        )}
        {activeView === 'contact' && <Contact setActiveView={navigateView} />}
        {activeView === 'privacy' && <PrivacyPolicy setActiveView={navigateView} />}
        {activeView === 'terms' && <TermsAndConditions setActiveView={navigateView} />}
        
        {activeView === 'admin' && (
          <AdminPortal 
            onNavigateToService={(id) => {
              setSelectedServiceId(id);
              navigateView('admin-service-detail');
            }} 
          />
        )}
        {activeView === 'admin-service-detail' && (
          <AdminServiceDetail 
            serviceId={selectedServiceId}
            onBack={() => navigateView('admin')}
            adminEmail="aloksingh84959@gmail.com"
          />
        )}
        {activeView === 'track' && <CustomerTracking />}
      </main>

      {/* 11. FOOTER SECTION */}
      {!isAdminView && (
        <footer className="bg-gray-950 border-t border-gray-900 py-16 relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              
              {/* Column 1: Info */}
              <div className="lg:col-span-2 space-y-4">
                <button
                  onClick={() => navigateView('home')}
                  className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer focus:outline-none"
                >
                  VPANSAK &lt;/&gt; STUDIO
                </button>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                  Professional Website Development for Businesses, Shops, Startups and Personal Brands. We Build Websites That Build Your Business.
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-400 pt-2">
                  <a href="tel:+918738869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                    <span>📞 Call:</span>
                    <span>+91 8738869635</span>
                  </a>
                  <a href="tel:+917380869635" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                    <span>📞 Call:</span>
                    <span>+91 7380869635</span>
                  </a>
                  <a href="https://wa.me/66942033973" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                    <span>💬 WhatsApp:</span>
                    <span>+66 94 203 3973</span>
                  </a>
                  <a href="mailto:alook@outlook.in" className="flex items-center gap-2 hover:text-cyan-400 transition-colors w-fit focus:outline-none">
                    <span>✉ Email:</span>
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
                      onClick={() => navigateView('home')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('services')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('categories')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Website Types
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('how-it-works')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      How It Works
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('request-form')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Request Website
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('track')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Track Project
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateView('contact')} 
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
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
                      onClick={() => navigateView('privacy')}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateView('terms')}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
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
              <div className="flex items-center gap-1 font-medium text-xs text-gray-500">
                <span>Powered</span>
                <button
                  onClick={() => navigateView('admin')}
                  className="text-gray-500 hover:text-cyan-400 transition-colors p-0.5 focus:outline-none cursor-pointer"
                  title="Portal Login"
                >
                  <Lock size={10} />
                </button>
                <span>by</span>
                <span className="text-gray-400">VPANSAK</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Action Buttons: WhatsApp and Back-To-Top */}
      {!isAdminView && (
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
            href="https://wa.me/66942033973?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20a%20website%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow"
            style={{ animationDuration: '4s' }}
            aria-label="Direct Chat on WhatsApp"
          >
            <MessageSquare size={24} />
          </a>
        </div>
      )}

    </div>
  );
}

export default App;
