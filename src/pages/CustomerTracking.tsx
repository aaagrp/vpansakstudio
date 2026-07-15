import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Shield, Clock, 
  AlertTriangle, ExternalLink, Mail, Phone, MessageSquare, ArrowRight,
  AlertCircle, RefreshCw, Sun, Moon, CheckCircle2, 
  Globe, FileText, Download, MessageCircle, Star, 
  MapPin, Tag, Truck, ShoppingCart, CreditCard, Smartphone, Zap, 
  Award, Flame, Percent, Home, Users, 
  ShieldCheck, Plus
} from 'lucide-react';

interface PublicServiceData {
  service_id: string;
  customer_first_name: string;
  masked_email: string;
  masked_mobile: string;
  business_name: string;
  website_category: string;
  project_status: string;
  public_status_note: string | null;
  created_at: string;
  updated_at: string;
  launch_status: string;
  live_website_url: string | null;
  launch_date: string | null;
  support_start_date: string | null;
  support_end_date: string | null;
  support_status: string;
  payment_status: string;
  project_price: number;
  amount_received: number;
  remaining_balance: number;
  hide_payments_publicly: boolean;
  
  // New fields from updated database function
  business_location?: string | null;
  required_pages?: string[];
  required_features?: string[];
  domain_status?: string;
  domain_name?: string | null;
  hosting_status?: string;
  hosting_provider?: string | null;
  advance_required?: number;
  checklist?: Record<string, boolean>;
  documents?: { title: string; url: string; is_public: boolean }[];
}

interface PublicSupportRequest {
  request_date: string;
  request_text: string;
  request_type: string;
  priority: string;
  request_status: string;
  admin_response: string | null;
  completion_date: string | null;
  created_at: string;
}

interface PublicActivityLog {
  action: string;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
}

export const CustomerTracking: React.FC = () => {
  const [serviceId, setServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [service, setService] = useState<PublicServiceData | null>(null);
  const [supportRequests, setSupportRequests] = useState<PublicSupportRequest[]>([]);
  const [activityLogs, setActivityLogs] = useState<PublicActivityLog[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Design Theme state (Default to dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Client rating/review state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('serviceId');
    if (idParam) {
      const cleanId = idParam.replace(/\s+/g, '').toUpperCase();
      setServiceId(cleanId);
      performSearch(cleanId);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = serviceId.replace(/\s+/g, '').toUpperCase();
    if (!cleanId) return;
    performSearch(cleanId);
  };

  const performSearch = async (searchId: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSearched(true);
    setReviewSubmitted(false);
    setReviewText('');

    try {
      // 1. Fetch service details via secure RPC
      const { data: serviceData, error: serviceError } = await supabase
        .rpc('get_public_service_tracking', { p_service_id: searchId });

      if (serviceError) {
        throw serviceError;
      }

      if (!serviceData || serviceData.length === 0) {
        setService(null);
        setSupportRequests([]);
        setActivityLogs([]);
        setErrorMsg('No service record was found with this ID.');
        setLoading(false);
        return;
      }

      setService(serviceData[0]);

      // Update URL search parameter without page reload
      const newUrl = `${window.location.pathname}?serviceId=${searchId}`;
      window.history.replaceState({}, '', newUrl);

      // 2. Fetch support requests via secure RPC
      const { data: supportData, error: supportError } = await supabase
        .rpc('get_public_support_requests', { p_service_id: searchId });

      if (!supportError && supportData) {
        setSupportRequests(supportData);
      } else {
        setSupportRequests([]);
      }

      // 3. Fetch activity logs via secure RPC
      const { data: logsData, error: logsError } = await supabase
        .rpc('get_public_activity_logs', { p_service_id: searchId });

      if (!logsError && logsData) {
        setActivityLogs(logsData);
      } else {
        setActivityLogs([]);
      }
    } catch (err: any) {
      console.error('Error tracking project:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Theme-based class helpers
  const cardClass = isDarkMode 
    ? 'bg-gray-900/60 backdrop-blur-xl border border-white/5 shadow-xl shadow-black/30' 
    : 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-md shadow-slate-100/50';
  
  const labelClass = isDarkMode ? 'text-gray-400' : 'text-slate-500';
  const valClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const headingClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const dividerClass = isDarkMode ? 'border-white/5' : 'border-slate-200';

  // Helper to get project status badge styling
  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('launched') || s.includes('completed') || s.includes('received')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s.includes('discuss') || s.includes('progress') || s.includes('review') || s.includes('design')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
    if (s.includes('waiting') || s.includes('pending') || s.includes('hold') || s.includes('quotation')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    if (s.includes('cancelled') || s.includes('rejected')) {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  // Helper to get payment status badge styling
  const getPaymentBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'paid' || s === 'completed' || s.includes('received')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s === 'partial' || s.includes('partially') || s.includes('advance')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  // Format date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate remaining support days
  const getSupportRemainingDaysInfo = () => {
    if (!service || !service.support_end_date) return null;
    const end = new Date(service.support_end_date);
    const start = new Date(service.support_start_date || '');
    const today = new Date();
    
    today.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    start.setHours(0,0,0,0);

    if (service.launch_status !== 'Launched') {
      return { status: 'Not Started', days: 0 };
    }

    if (today > end) {
      return { status: 'Expired', days: 0 };
    }

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return { status: 'Expiring Soon', days: diffDays };
    }
    return { status: 'Active', days: diffDays };
  };

  const supportInfo = getSupportRemainingDaysInfo();

  // Progress mapping based on status
  const getProgressAndStage = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('new request')) return { percent: 5, stage: 'Planning & Requirement Analysis' };
    if (s.includes('contact pending')) return { percent: 10, stage: 'Planning & Requirement Analysis' };
    if (s.includes('discuss')) return { percent: 15, stage: 'Planning & Requirement Analysis' };
    if (s.includes('quotation sent')) return { percent: 25, stage: 'Planning & Requirement Analysis' };
    if (s.includes('waiting for advance')) return { percent: 35, stage: 'Project Setup & Advance Payment' };
    if (s.includes('payment partially')) return { percent: 40, stage: 'Project Setup & Design Preparation' };
    if (s.includes('payment received')) return { percent: 45, stage: 'Project Setup & Design Preparation' };
    if (s.includes('content pending')) return { percent: 50, stage: 'UI/UX Design Stage' };
    if (s.includes('design in progress')) return { percent: 60, stage: 'UI/UX Design Stage' };
    if (s.includes('development in progress')) return { percent: 75, stage: 'Development & Coding Stage' };
    if (s.includes('customer review')) return { percent: 85, stage: 'Client Testing & Feedback' };
    if (s.includes('changes requested')) return { percent: 80, stage: 'Revisions & Modifications' };
    if (s.includes('ready for launch')) return { percent: 95, stage: 'Final Review & Launch Preparation' };
    if (s.includes('launch')) return { percent: 100, stage: 'Website Live & Free Support' };
    if (s.includes('complete')) return { percent: 100, stage: 'Completed & Live' };
    if (s.includes('hold')) return { percent: 20, stage: 'On Hold' };
    return { percent: 10, stage: 'Discussion' };
  };

  // Get milestone states for timeline
  const getMilestoneState = (milestoneKey: string, currentStatus: string) => {
    const order = [
      "new request", 
      "contact pending", 
      "in discussion", 
      "quotation sent", 
      "waiting for advance payment", 
      "payment partially received", 
      "payment received", 
      "content pending", 
      "design in progress", 
      "development in progress", 
      "customer review", 
      "changes requested", 
      "ready for launch", 
      "launched", 
      "completed"
    ];
    const s = currentStatus ? currentStatus.toLowerCase() : '';
    const currentIdx = order.indexOf(s);

    switch (milestoneKey) {
      case 'discussion':
        if (currentIdx > 2) return 'completed';
        if (currentIdx === 2) return 'active';
        return 'pending';
      case 'analysis':
        if (currentIdx > 3) return 'completed';
        if (currentIdx === 3) return 'active';
        return 'pending';
      case 'quotation':
        if (currentIdx > 4) return 'completed';
        if (currentIdx === 4) return 'active';
        return 'pending';
      case 'advance':
        if (currentIdx >= 6) return 'completed';
        if (currentIdx === 5 || currentIdx === 4) return 'active';
        return 'pending';
      case 'design':
        if (currentIdx >= 9) return 'completed';
        if (currentIdx === 7 || currentIdx === 8) return 'active';
        return 'pending';
      case 'homepage':
      case 'menu_integration':
      case 'customer_dashboard':
      case 'admin_dashboard':
      case 'order_system':
      case 'payment_gateway':
        if (currentIdx >= 10) return 'completed';
        if (currentIdx === 9) return 'active';
        return 'pending';
      case 'testing':
      case 'approval':
        if (currentIdx >= 13) return 'completed';
        if (currentIdx === 10 || currentIdx === 11 || currentIdx === 12) return 'active';
        return 'pending';
      case 'launch':
        if (currentIdx >= 13) return 'completed';
        if (currentIdx === 12) return 'active';
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Design Stage checklist items
  const getDesignStageActive = (stageName: string, currentStatus: string) => {
    const s = currentStatus ? currentStatus.toLowerCase() : '';
    const stages = {
      'Planning': ['new request', 'contact pending'],
      'Requirement': ['in discussion', 'quotation sent'],
      'Wireframe': ['waiting for advance payment', 'payment partially received'],
      'UI Design': ['content pending', 'design in progress'],
      'Development': ['development in progress', 'changes requested'],
      'Testing': ['customer review', 'ready for launch'],
      'Live': ['launched', 'completed']
    };
    
    // Check if current status is exactly in this stage
    const matches = stages[stageName as keyof typeof stages] || [];
    if (matches.includes(s)) return 'active';

    // Check if completed (has passed this stage)
    const stageNames = Object.keys(stages);
    const currentStageName = stageNames.find(k => stages[k as keyof typeof stages].includes(s));
    if (currentStageName) {
      const currentIdx = stageNames.indexOf(currentStageName);
      const thisIdx = stageNames.indexOf(stageName);
      if (thisIdx < currentIdx) return 'completed';
    } else if (s === 'completed' || s === 'launched') {
      return 'completed';
    }
    
    return 'pending';
  };

  // Estimated start and completion dates calculation
  const getEstimatedDates = () => {
    if (!service) return { start: '', end: '', days: '' };
    
    // If not confirmed (status is before payment received)
    const order = [
      "new request", "contact pending", "in discussion", 
      "quotation sent", "waiting for advance payment"
    ];
    const s = service.project_status ? service.project_status.toLowerCase() : '';
    if (order.includes(s) && service.payment_status === 'Pending') {
      return null;
    }

    // Default: Start date is created_at + 1 day
    const startDate = new Date(service.created_at);
    startDate.setDate(startDate.getDate() + 1);

    // Completion date is created_at + 15 days
    const endDate = new Date(service.created_at);
    endDate.setDate(endDate.getDate() + 15);

    return {
      start: startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      end: endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      days: 'Within 14 Days'
    };
  };

  const estDates = getEstimatedDates();

  // Resolve status of logo, photos, menu details etc. based on checklist database mapping
  const getAssetStatus = (assetName: string) => {
    if (!service || !service.checklist) return 'Pending';
    const keys = Object.keys(service.checklist);
    // Find key containing the assetName (case-insensitive)
    const matchedKey = keys.find(k => k.toLowerCase().includes(assetName.toLowerCase()));
    if (matchedKey) {
      return service.checklist[matchedKey] ? 'Received' : 'Pending';
    }
    return 'Pending';
  };

  // Lucide icon mapping for features
  const getFeatureIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('delivery')) return <Truck size={16} />;
    if (f.includes('ordering')) return <ShoppingCart size={16} />;
    if (f.includes('cart')) return <ShoppingCart size={16} />;
    if (f.includes('payment') || f.includes('secure')) return <CreditCard size={16} />;
    if (f.includes('whatsapp')) return <MessageSquare size={16} />;
    if (f.includes('maps') || f.includes('location')) return <MapPin size={16} />;
    if (f.includes('search')) return <Search size={16} />;
    if (f.includes('otp') || f.includes('login')) return <ShieldCheck size={16} />;
    if (f.includes('customer dashboard')) return <Users size={16} />;
    if (f.includes('admin dashboard')) return <Shield size={16} />;
    if (f.includes('tracking')) return <Globe size={16} />;
    if (f.includes('reviews') || f.includes('rating')) return <Star size={16} />;
    if (f.includes('email') || f.includes('notification')) return <Mail size={16} />;
    if (f.includes('ai') || f.includes('chat')) return <MessageCircle size={16} />;
    if (f.includes('gallery')) return <Globe size={16} />;
    if (f.includes('responsive') || f.includes('mobile')) return <Smartphone size={16} />;
    if (f.includes('seo')) return <Globe size={16} />;
    if (f.includes('loading') || f.includes('fast')) return <Zap size={16} />;
    if (f.includes('language')) return <Globe size={16} />;
    if (f.includes('coupon') || f.includes('offers')) return <Tag size={16} />;
    if (f.includes('special')) return <Award size={16} />;
    if (f.includes('seller') || f.includes('best')) return <Flame size={16} />;
    if (f.includes('timings') || f.includes('clock')) return <Clock size={16} />;
    if (f.includes('discount')) return <Percent size={16} />;
    if (f.includes('address') || f.includes('saved')) return <Home size={16} />;
    return <CheckCircle2 size={16} />;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !reviewText.trim()) return;

    // Send review directly to VPANSAK Studio WhatsApp support
    const textMsg = `Hello VPANSAK Studio,\n\nI have rated my website project (${service.service_id}) with ${rating} stars! ⭐\n\nReview Details:\n"${reviewText.trim()}"\n\nThank you,\n${service.customer_first_name}`;
    const waUrl = `https://wa.me/917380869635?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank');
    setReviewSubmitted(true);
  };

  // Fallbacks for default values if none in DB
  const resolvedPages = service?.required_pages && service.required_pages.length > 0 
    ? service.required_pages 
    : ["Home", "About", "Menu", "Gallery", "Contact", "Privacy Policy", "Terms & Conditions"];

  const resolvedFeatures = service?.required_features && service.required_features.length > 0 
    ? service.required_features 
    : ["Mobile Responsive", "SEO Ready", "Fast Loading", "WhatsApp Ordering", "Google Maps", "Secure Payment"];

  // Filter public documents
  const publicDocs = service?.documents ? service.documents.filter(doc => doc.is_public) : [];

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-slate-50 text-slate-800'
    } pt-28 pb-16 px-4 md:px-6`}>
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-soft-pulse-1" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-[150px] pointer-events-none animate-soft-pulse-1" style={{ animationDelay: '3s' }} />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header Options */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-600'
            }`}>
              <Shield size={12} className="text-cyan-500" />
              <span>Public Tracking Portal</span>
            </span>
          </div>

          {/* Dark / Light Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-900 border-white/10 text-amber-400 hover:bg-gray-850' 
                : 'bg-white border-slate-200 text-purple-600 hover:bg-slate-50 shadow-sm'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Brand Banner */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${headingClass}`}>
            VPANSAK <span className="text-cyan-500 font-light">&lt;/&gt;</span> STUDIO
          </h1>
          <p className={`text-sm md:text-base max-w-xl mx-auto leading-relaxed ${labelClass}`}>
            Track your website project design, development, payment milestones, and support history in real time.
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className={`flex items-start gap-3.5 p-4 rounded-xl border transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-cyan-950/20 border-cyan-500/10 text-cyan-400/90' 
            : 'bg-cyan-50/50 border-cyan-100 text-cyan-800'
        }`}>
          <ShieldCheck size={20} className="shrink-0 mt-0.5 text-cyan-500" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">Security Notice</span>
            <p className={isDarkMode ? 'text-gray-400/90' : 'text-slate-600'}>
              For privacy and security, only limited project information is displayed. Sensitive details (such as full mobile numbers, email addresses, exact addresses, payment transaction IDs, developer notes, credentials, and admin logs) are masked or completely hidden.
            </p>
          </div>
        </div>

        {/* Project Search Box */}
        <div className={`${cardClass} p-6 max-w-2xl mx-auto rounded-2xl`}>
          <h3 className={`text-sm font-bold tracking-wider font-mono mb-4 uppercase ${labelClass}`}>
            Find Your Project
          </h3>
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-3.5 ${labelClass}`}>
                <Search size={18} />
              </span>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="Enter Service ID (e.g. VPS578562)"
                className={`w-full pl-11 pr-4 py-3.5 border transition-all rounded-xl text-base font-mono uppercase focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-gray-900/60 border-white/10 hover:border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500/20 text-white placeholder-gray-500' 
                    : 'bg-white border-slate-200 hover:border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500/10 text-slate-900 placeholder-slate-400 shadow-sm'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 hover:opacity-90 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className={labelClass}>Example Service ID: <strong className="font-mono text-cyan-500">VPS578562</strong></span>
            {searched && (
              <button 
                type="button" 
                onClick={() => {
                  setService(null);
                  setSearched(false);
                  setServiceId('');
                  setErrorMsg(null);
                  // clear URL param
                  window.history.replaceState({}, '', window.location.pathname);
                }} 
                className="text-cyan-500 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="animate-spin text-cyan-500" size={36} />
            <p className={`text-sm ${labelClass}`}>Fetching real-time project statistics...</p>
          </div>
        )}

        {/* Not Found Error Card */}
        {searched && !loading && errorMsg && (
          <div className={`${cardClass} p-8 max-w-xl mx-auto text-center space-y-6 rounded-2xl`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
              isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className={`text-xl font-bold ${headingClass}`}>Record Not Found</h3>
              <p className={`text-sm ${labelClass}`}>
                We couldn't find any registered project with the Service ID <strong className="font-mono text-cyan-500">{serviceId}</strong>.
              </p>
            </div>
            
            <div className={`pt-6 border-t ${dividerClass} space-y-4`}>
              <p className="text-xs text-gray-500">Have questions about your project registration? Reach out to support:</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href={`https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%27m%20having%20issues%20tracking%20my%20service%20ID%20${serviceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Chat Support</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS FOUND SCREEN */}
        {searched && !loading && service && (
          <div className="space-y-8 animate-code-float" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
            
            {/* Live Status Widget (If launched) */}
            {service.launch_status === 'Launched' && service.live_website_url && (
              <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">Website Live</span>
                  <h2 className="text-2xl font-black font-mono">{service.business_name}</h2>
                  <p className="text-xs text-emerald-100 font-light">
                    Launch Date: {formatDate(service.launch_date)} | Free Support Period is Active.
                  </p>
                </div>
                <a
                  href={service.live_website_url.startsWith('http') ? service.live_website_url : `https://${service.live_website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-transform duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/20"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Design Stage Horizontal Nodes */}
            <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-bold tracking-wider font-mono uppercase ${labelClass}`}>
                Current Design & Dev Stage
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {['Planning', 'Requirement', 'Wireframe', 'UI Design', 'Development', 'Testing', 'Live'].map((stage, idx) => {
                  const stageState = getDesignStageActive(stage, service.project_status);
                  const isActive = stageState === 'active';
                  const isCompleted = stageState === 'completed';
                  
                  return (
                    <div 
                      key={stage} 
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isActive 
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold shadow-lg shadow-cyan-500/10 scale-102' 
                          : isCompleted 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                            : isDarkMode 
                              ? 'bg-gray-900/40 border-white/5 text-gray-500' 
                              : 'bg-slate-100/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-mono block mb-1">STAGE 0{idx + 1}</div>
                      <span className="text-xs block font-semibold truncate">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Left Details Panel */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Project Summary Card */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-6`}>
                  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b ${dividerClass}`}>
                    <div>
                      <span className={`text-[10px] font-mono tracking-wider block font-bold ${labelClass}`}>SERVICE ID</span>
                      <h2 className={`text-2xl font-black font-mono ${headingClass}`}>{service.service_id}</h2>
                    </div>
                    <div>
                      <span className={`text-[10px] font-mono tracking-wider block text-left sm:text-right font-bold mb-1.5 ${labelClass}`}>Project Status</span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(service.project_status)}`}>
                        {service.project_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs md:text-sm">
                    <div className="space-y-1">
                      <span className={labelClass}>Customer Name</span>
                      <span className={`font-semibold block ${valClass}`}>{service.customer_first_name} (Masked)</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Business Name</span>
                      <span className={`font-semibold block ${valClass}`}>{service.business_name}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Website Category</span>
                      <span className={`font-semibold block text-cyan-500`}>{service.website_category}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Registered On</span>
                      <span className={`font-semibold block ${valClass}`}>{formatDate(service.created_at)}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Masked Email</span>
                      <span className={`font-mono block ${valClass}`}>{service.masked_email || 'N/A'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Masked Mobile</span>
                      <span className={`font-mono block ${valClass}`}>{service.masked_mobile}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Assigned Company</span>
                      <span className={`font-semibold block ${valClass}`}>VPANSAK Studio</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Project Priority</span>
                      <span className="font-semibold block text-emerald-400">Normal</span>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className={labelClass}>Last Updated</span>
                      <span className={`font-semibold block ${valClass}`}>
                        {formatDate(service.updated_at)} {formatTime(service.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Public Project Note */}
                  {service.public_status_note && (
                    <div className={`p-4 rounded-xl border ${
                      isDarkMode ? 'bg-gray-950/60 border-white/5' : 'bg-slate-100/60 border-slate-200'
                    } space-y-2`}>
                      <span className="text-xs font-semibold text-cyan-500 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        <span>Latest Public Status Note</span>
                      </span>
                      <p className={`text-xs md:text-sm font-light leading-relaxed leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        {service.public_status_note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Card */}
                {(() => {
                  const { percent, stage } = getProgressAndStage(service.project_status);
                  return (
                    <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                      <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-bold tracking-wider font-mono uppercase ${labelClass}`}>
                          Overall Progress
                        </h3>
                        <span className="text-xl font-black font-mono text-cyan-500">{percent}%</span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className={`w-full h-3.5 rounded-full overflow-hidden relative ${
                        isDarkMode ? 'bg-gray-900' : 'bg-slate-200'
                      }`}>
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 transition-all duration-1000 ease-out shadow-inner"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs items-center pt-1">
                        <span className={labelClass}>Current Stage:</span>
                        <span className="font-bold text-cyan-500">{stage}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Milestones Timeline */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-5`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                    Project Timeline
                  </h3>

                  <div className="relative pl-6 border-l border-white/10 space-y-5 ml-2.5">
                    {[
                      { key: 'discussion', title: 'Requirement Discussion Completed' },
                      { key: 'analysis', title: 'Requirement Analysis Completed' },
                      { key: 'quotation', title: 'Quotation Shared' },
                      { key: 'advance', title: 'Waiting For Advance Payment' },
                      { key: 'design', title: 'UI Design' },
                      { key: 'homepage', title: 'Homepage Development' },
                      { key: 'menu_integration', title: 'Menu Integration' },
                      { key: 'customer_dashboard', title: 'Customer Dashboard' },
                      { key: 'admin_dashboard', title: 'Admin Dashboard' },
                      { key: 'order_system', title: 'Order System' },
                      { key: 'payment_gateway', title: 'Payment Gateway' },
                      { key: 'testing', title: 'Testing' },
                      { key: 'approval', title: 'Client Approval' },
                      { key: 'launch', title: 'Website Launch' }
                    ].map((step) => {
                      const stepState = getMilestoneState(step.key, service.project_status);
                      const isDone = stepState === 'completed';
                      const isActive = stepState === 'active';
                      
                      return (
                        <div key={step.key} className="relative flex items-center gap-3">
                          {/* Timeline node circle */}
                          <div className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all ${
                            isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : isActive 
                                ? 'bg-amber-500 border-amber-500 text-white ring-4 ring-amber-500/20' 
                                : isDarkMode 
                                  ? 'bg-gray-950 border-white/20' 
                                  : 'bg-white border-slate-300'
                          }`}>
                            {isDone && <span className="text-[10px]">✓</span>}
                            {isActive && <span className="text-[10px] animate-pulse">●</span>}
                          </div>

                          <span className={`text-xs md:text-sm font-medium ${
                            isDone 
                              ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600' 
                              : isActive 
                                ? 'text-amber-500 font-bold' 
                                : isDarkMode ? 'text-gray-600' : 'text-slate-400'
                          }`}>
                            {step.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Business Information Card */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                    <div className="space-y-1">
                      <span className={labelClass}>Business Name</span>
                      <span className={`font-semibold block ${valClass}`}>{service.business_name}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Business Category</span>
                      <span className={`font-semibold block ${valClass}`}>{service.website_category}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Business Location</span>
                      <span className={`font-semibold block ${valClass}`}>{service.business_location || 'Kaudiram, Gorakhpur'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Service Area</span>
                      <span className={`font-semibold block ${valClass}`}>Kaudiram, Gorakhpur, Nearby Areas</span>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className={labelClass}>Restaurant Type</span>
                      <span className={`font-semibold block ${valClass}`}>Veg & Non-Veg</span>
                    </div>
                  </div>
                </div>

                {/* Included Pages Badge Section */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                    Pages Included
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resolvedPages.map((page) => (
                      <span 
                        key={page} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          isDarkMode 
                            ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' 
                            : 'bg-cyan-50 border-cyan-100 text-cyan-700'
                        }`}
                      >
                        {page}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Included Features Card Section */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                    Features Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resolvedFeatures.map((feat) => (
                      <div 
                        key={feat} 
                        className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                          isDarkMode ? 'bg-gray-900/40 border-white/5 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="text-cyan-500 shrink-0">
                          {getFeatureIcon(feat)}
                        </span>
                        <span className="text-xs font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Requests Tickets Table */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                    Support Ticket History
                  </h3>

                  {supportRequests.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No support tickets have been created for this project.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${dividerClass} ${labelClass}`}>
                            <th className="pb-2 font-mono">TICKET ID</th>
                            <th className="pb-2">TYPE</th>
                            <th className="pb-2">PRIORITY</th>
                            <th className="pb-2">STATUS</th>
                            <th className="pb-2 text-right">DATE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {supportRequests.map((req, idx) => (
                            <tr key={idx} className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                              <td className="py-2.5 font-mono text-cyan-500 font-bold">#TKT-{String(idx+1).padStart(2, '0')}</td>
                              <td className="py-2.5 font-semibold">{req.request_type}</td>
                              <td className="py-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  req.priority === 'Urgent' || req.priority === 'High' 
                                    ? 'bg-red-500/10 text-red-400' 
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                  {req.priority}
                                </span>
                              </td>
                              <td className="py-2.5">
                                <span className={`font-bold ${
                                  req.request_status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'
                                }`}>
                                  {req.request_status}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-mono text-gray-500">{formatDate(req.request_date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Policy Notice Panel */}
                <div className={`${cardClass} p-5 rounded-2xl text-xs space-y-3 leading-relaxed`}>
                  <span className={`font-bold block ${headingClass}`}>Support & Maintenance Policy Notice:</span>
                  <ul className={`list-disc pl-4 space-y-1.5 font-light ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    <li>VPANSAK Studio provides one year of free basic website support from the official website launch date.</li>
                    <li>Free support includes text changes, contact details updates, basic image replacement, small content edits, and minor bug fixes.</li>
                    <li>Free support does NOT include a complete redesign, new pages, new modules, payment gateway changes, database schema additions, hosting renewals, domain renewals, or advanced feature development.</li>
                    <li>Major modifications or new features require a separate quotation.</li>
                  </ul>
                </div>
              </div>

              {/* Right Side Info Cards (Estimated delivery, payment, assets, etc.) */}
              <div className="space-y-6">
                
                {/* Estimated Delivery */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} ${labelClass}`}>
                    Estimated Delivery
                  </h3>
                  
                  {estDates ? (
                    <div className="space-y-4 text-xs md:text-sm">
                      <div>
                        <span className={`${labelClass} block mb-0.5`}>Estimated Start</span>
                        <strong className={valClass}>{estDates.start}</strong>
                      </div>
                      <div>
                        <span className={`${labelClass} block mb-0.5`}>Estimated Completion</span>
                        <strong className={valClass}>{estDates.end}</strong>
                      </div>
                      <div>
                        <span className={`${labelClass} block mb-0.5`}>Estimated Delivery</span>
                        <strong className="text-cyan-500 font-bold">{estDates.days}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 text-center text-xs text-amber-500 font-medium">
                      Will be updated after project confirmation.
                    </div>
                  )}
                </div>

                {/* Project Assets checklist */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} ${labelClass}`}>
                    Project Assets Status
                  </h3>

                  <div className="space-y-3 text-xs md:text-sm">
                    {[
                      { key: 'Logo', label: 'Brand Logo' },
                      { key: 'Photos', label: 'Restaurant Photos' },
                      { key: 'Food', label: 'Food Images' },
                      { key: 'Menu', label: 'Menu Details' },
                      { key: 'Info', label: 'Business Details' },
                      { key: 'Content', label: 'Website Content' }
                    ].map((asset) => {
                      const status = getAssetStatus(asset.key);
                      const isRec = status === 'Received';
                      
                      return (
                        <div key={asset.key} className="flex justify-between items-center">
                          <span className={labelClass}>{asset.label}</span>
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            isRec ? 'text-emerald-400' : 'text-amber-500'
                          }`}>
                            <span>{isRec ? '✔' : '⏳'}</span>
                            <span>{status}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Domain & Hosting Status */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} ${labelClass}`}>
                    Server & Domain Info
                  </h3>

                  <div className="space-y-4 text-xs md:text-sm">
                    {/* Domain */}
                    <div>
                      <span className={`${labelClass} block mb-0.5`}>Domain Status</span>
                      {service.domain_status && (service.domain_status.toLowerCase().includes('connect') || service.domain_status.toLowerCase().includes('purchase')) ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-emerald-400 block">Connected</span>
                          <span className="font-mono text-xs text-cyan-500 underline break-all block">{service.domain_name || 'N/A'}</span>
                        </div>
                      ) : (
                        <strong className="text-amber-500 block">{service.domain_status || 'Domain Not Purchased'}</strong>
                      )}
                    </div>

                    {/* Hosting */}
                    <div>
                      <span className={`${labelClass} block mb-0.5`}>Hosting Status</span>
                      <strong className={`${
                        service.hosting_status && service.hosting_status.toLowerCase().includes('active') 
                          ? 'text-emerald-400' : 'text-amber-500'
                      } block`}>
                        {service.hosting_status || 'Pending'}
                      </strong>
                      {service.hosting_provider && (
                        <span className="text-[10px] text-gray-500 font-mono">Provider: {service.hosting_provider}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment summary */}
                <div className={`${cardClass} p-6 rounded-2xl flex flex-col justify-between`}>
                  <div>
                    <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} mb-4 ${labelClass}`}>
                      Payment Summary
                    </h3>

                    {service.hide_payments_publicly ? (
                      <div className="py-6 text-center text-xs text-gray-400 space-y-2">
                        <Clock size={20} className="mx-auto text-cyan-500/60" />
                        <p>Financial detail display is restricted on this tracking ID.</p>
                        <div className="pt-2">
                          <span className={`${labelClass} block mb-1 text-[10px]`}>Payment Status</span>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPaymentBadgeClass(service.payment_status)}`}>
                            {service.payment_status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5 text-xs md:text-sm">
                        <div className={`flex justify-between items-center py-1.5 border-b ${dividerClass}`}>
                          <span className={labelClass}>Total Project Price</span>
                          <strong className={valClass}>₹{Number(service.project_price).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className={`flex justify-between items-center py-1.5 border-b ${dividerClass}`}>
                          <span className={labelClass}>Advance Required</span>
                          <strong className={valClass}>₹{Number(service.advance_required || (service.project_price / 2)).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className={`flex justify-between items-center py-1.5 border-b ${dividerClass}`}>
                          <span className={labelClass}>Amount Paid</span>
                          <strong className="text-emerald-400">₹{Number(service.amount_received).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className={`flex justify-between items-center py-1.5 border-b ${dividerClass}`}>
                          <span className={labelClass}>Remaining Balance</span>
                          <strong className={service.remaining_balance > 0 ? 'text-amber-500 font-bold' : valClass}>
                            ₹{Number(service.remaining_balance).toLocaleString('en-IN')}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className={labelClass}>Payment Status</span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getPaymentBadgeClass(service.payment_status)}`}>
                            {service.payment_status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Support info card */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} ${labelClass}`}>
                    Support Information
                  </h3>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className={`${labelClass} block mb-0.5`}>One Year Free Basic Support</span>
                      <strong className={valClass}>{service.launch_status === 'Launched' ? 'Active' : 'Not Started'}</strong>
                    </div>
                    {supportInfo && (
                      <div>
                        <span className={`${labelClass} block mb-0.5`}>Support Status</span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          supportInfo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          supportInfo.status === 'Expiring Soon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          supportInfo.status === 'Expired' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {supportInfo.status} {supportInfo.days > 0 && `(${supportInfo.days} days left)`}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className={`${labelClass} block mb-0.5`}>Support Starts</span>
                      <span className={valClass}>{formatDate(service.support_start_date)}</span>
                    </div>
                    <div>
                      <span className={`${labelClass} block mb-0.5`}>Support Ends</span>
                      <span className={valClass}>{formatDate(service.support_end_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Downloadable Documents */}
                <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                  <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-2 border-b ${dividerClass} ${labelClass}`}>
                    Shared Documents
                  </h3>
                  
                  {publicDocs.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-500">
                      No documents are shared publicly yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {publicDocs.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-950/40 border-white/5 text-cyan-400 hover:bg-gray-900/60' 
                              : 'bg-slate-100/50 border-slate-200 text-cyan-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={14} className="shrink-0" />
                            <span className="text-xs font-semibold truncate">{doc.title}</span>
                          </div>
                          <Download size={12} className="shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Latest updates list */}
            <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-bold tracking-wider font-mono uppercase border-b ${dividerClass} pb-3 ${labelClass}`}>
                Latest Project Updates
              </h3>

              {activityLogs.length === 0 ? (
                // Fallback timeline
                <div className="relative pl-6 border-l border-white/10 space-y-4 ml-2.5 text-xs md:text-sm">
                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-emerald-500 border border-emerald-500" />
                    <div className="space-y-0.5">
                      <span className="text-gray-500 font-mono text-[10px] block">{formatDate(service.created_at)}</span>
                      <strong className={valClass}>Project Created</strong>
                      <p className="text-gray-500 text-xs">Website project record initialized successfully.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-emerald-500 border border-emerald-500" />
                    <div className="space-y-0.5">
                      <span className="text-gray-500 font-mono text-[10px] block">{formatDate(service.created_at)}</span>
                      <strong className={valClass}>Requirement Discussion Completed</strong>
                      <p className="text-gray-500 text-xs">Features and details of the website requirements aligned.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-cyan-500 border border-cyan-500" />
                    <div className="space-y-0.5">
                      <span className="text-gray-500 font-mono text-[10px] block">{formatDate(service.created_at)}</span>
                      <strong className={valClass}>Planning Started</strong>
                      <p className="text-gray-500 text-xs">Website blueprint and design preparations underway.</p>
                    </div>
                  </div>
                  {service.payment_status === 'Pending' && (
                    <div className="relative">
                      <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-amber-500 border border-amber-500" />
                      <div className="space-y-0.5">
                        <span className="text-gray-500 font-mono text-[10px] block">{formatDate(service.updated_at)}</span>
                        <strong className={valClass}>Waiting For Advance Payment</strong>
                        <p className="text-gray-500 text-xs">Advance confirmation deposit required to kickstart deployment.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative pl-6 border-l border-white/10 space-y-5 ml-2.5 text-xs md:text-sm">
                  {activityLogs.map((log, index) => {
                    // Safe formatting of public update logs
                    let logTitle = log.action;
                    let logDesc = '';
                    
                    if (log.action === 'Status Changed') {
                      logTitle = `Status updated to: ${log.new_value}`;
                      logDesc = `Project status transitioned from "${log.previous_value}" to "${log.new_value}".`;
                    } else if (log.action === 'Payment Received') {
                      logTitle = `Deposit Milestone Updated`;
                      logDesc = `A payment change has been updated on the service.`;
                    } else if (log.action === 'Checklist Updated') {
                      logTitle = `Milestone Checklist Checked`;
                      logDesc = `Developer checklist item updated: ${log.new_value}`;
                    } else if (log.action === 'Website Marked as Launched') {
                      logTitle = `Website Launched!`;
                      logDesc = `The website is live. Support cycle has started.`;
                    } else if (log.action === 'Customer Details Updated') {
                      logTitle = `Project Details Updated`;
                      logDesc = `Administrative edits applied.`;
                    }
                    
                    return (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[30px] w-4 h-4 rounded-full border ${
                          index === 0 
                            ? 'bg-cyan-500 border-cyan-500 ring-2 ring-cyan-500/20' 
                            : 'bg-emerald-500 border-emerald-500'
                        }`} />
                        <div className="space-y-0.5">
                          <span className="text-gray-500 font-mono text-[10px] block">
                            {formatDate(log.created_at)} {formatTime(log.created_at)}
                          </span>
                          <strong className={valClass}>{logTitle}</strong>
                          {logDesc && <p className="text-gray-500 text-xs font-light mt-0.5">{logDesc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Rating Section (Show only if launched) */}
            {service.launch_status === 'Launched' && (
              <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
                <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-3 border-b ${dividerClass} ${labelClass}`}>
                  Rate Our Service
                </h3>

                {reviewSubmitted ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-3xl">🎉</div>
                    <h4 className={`text-base font-bold ${headingClass}`}>Review Opened in WhatsApp!</h4>
                    <p className={`text-xs ${labelClass}`}>Thank you for sharing your feedback. We appreciate your rating of {rating} Stars!</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-gray-500 font-medium">Select Star Rating:</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-amber-400 hover:scale-115 active:scale-95 transition-transform text-2xl cursor-pointer"
                          >
                            {star <= rating ? '★' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium block">Write Your Review:</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience working with VPANSAK Studio..."
                        rows={3}
                        className={`w-full p-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-950 border-white/10 text-white placeholder-gray-600' 
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!reviewText.trim()}
                      className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-transform duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Submit Review via WhatsApp
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Actions Panel */}
            <div className={`${cardClass} p-6 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-bold tracking-wider font-mono uppercase pb-3 border-b ${dividerClass} ${labelClass}`}>
                Contact VPANSAK Support
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <a
                  href={`https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20have%20questions%20regarding%20my%20service%20ID%20${service.service_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href="tel:+917380869635"
                  className={`p-3 border font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                      : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Phone size={14} />
                  <span>Call Studio</span>
                </a>

                <a
                  href={`mailto:alook@outlook.in?subject=Question%20regarding%20Service%20ID%20${service.service_id}`}
                  className={`p-3 border font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                      : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Mail size={14} />
                  <span>Email Support</span>
                </a>

                <a
                  href={`https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20to%20raise%20a%20support%20ticket%20for%20Service%20ID%20${service.service_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus size={14} />
                  <span>Raise Ticket</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* FOOTER */}
        <div className="pt-8 border-t border-white/5 text-center space-y-2">
          <p className="text-xs text-gray-500">
            Powered by <strong className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>VPANSAK Studio</strong>
          </p>
          <p className="text-[10px] text-gray-600 font-light">
            Professional Website Design & Development | Gorakhpur, India
          </p>
        </div>

      </div>
    </div>
  );
};
