import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Shield, Calendar, DollarSign, Clock, 
  AlertTriangle, ExternalLink, Mail, Phone, MessageSquare, ArrowRight,
  Info, AlertCircle, RefreshCw
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

export const CustomerTracking: React.FC = () => {
  const [serviceId, setServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [service, setService] = useState<PublicServiceData | null>(null);
  const [supportRequests, setSupportRequests] = useState<PublicSupportRequest[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error('Error tracking project:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  // Format date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate remaining support days manually for accurate frontend display
  const getSupportRemainingDaysInfo = () => {
    if (!service || !service.support_end_date) return null;
    const end = new Date(service.support_end_date);
    const start = new Date(service.support_start_date || '');
    const today = new Date();
    
    // Set hours to 0 to compare days
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

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 pt-28 pb-16 px-4 md:px-6">
      
      {/* Decorative Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium mb-4">
            <Shield size={12} />
            <span>Secure Customer Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Track Your Website Project
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed">
            Enter your VPANSAK Studio Service ID below to check your website development status, payment updates, launch timeline, and free support validity.
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 mb-8 max-w-xl mx-auto relative z-10 shadow-lg shadow-cyan-500/5">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="Enter Service ID, e.g. VPS185359"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-900/60 hover:bg-gray-900 border border-white/10 hover:border-cyan-500/30 focus:border-cyan-500 focus:outline-none rounded-xl text-white placeholder-gray-500 transition-colors text-base font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <span>Track Service</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searched && !loading && (
          <div className="space-y-6">
            
            {/* Case: NOT FOUND */}
            {errorMsg && (
              <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                  <AlertTriangle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{errorMsg}</h3>
                  <p className="text-gray-400 text-sm">
                    Please check the Service ID and try again. Service IDs are provided only by VPANSAK Studio.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <p className="text-xs text-gray-500">Need help? Contact VPANSAK Studio directly on WhatsApp or Email.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <a
                      href="https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20need%20help%20tracking%20my%20website%20service."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      <span>Contact VPANSAK Studio</span>
                    </a>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1 text-xs text-gray-400 justify-center">
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-cyan-400" />
                      <span>WhatsApp: +91 7380869635</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-cyan-400" />
                      <span>Email: alook@outlook.in</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Case: SUCCESS FOUND */}
            {service && (
              <div className="space-y-6 animate-code-float" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
                
                {/* Privacy Warning Banner */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-400 max-w-full">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Security Notice</span>
                    <span>For privacy and security, only limited project information is displayed. Sensitive information (such as full mobile numbers, email addresses, exact address, and transaction notes) are masked or hidden.</span>
                  </div>
                </div>

                {/* Main grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  {/* Left: Project Identity & Status Card */}
                  <div className="md:col-span-2 glass-card rounded-2xl border border-white/5 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
                      <div>
                        <span className="text-xs text-cyan-400 font-mono tracking-wider font-semibold block mb-1">SERVICE ID</span>
                        <h2 className="text-2xl font-black text-white font-mono">{service.service_id}</h2>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-gray-400 block mb-1.5">Project Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(service.project_status)}`}>
                          {service.project_status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Customer Name</span>
                        <span className="text-sm font-semibold text-white">
                          {service.customer_first_name} (Masked)
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Business Name</span>
                        <span className="text-sm font-semibold text-white">{service.business_name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Website Category</span>
                        <span className="text-sm font-semibold text-cyan-400">{service.website_category}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Registered On</span>
                        <span className="text-sm font-semibold text-white">{formatDate(service.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Masked Email</span>
                        <span className="text-sm font-mono text-gray-300">{service.masked_email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Masked Mobile</span>
                        <span className="text-sm font-mono text-gray-300">{service.masked_mobile}</span>
                      </div>
                    </div>

                    {service.public_status_note && (
                      <div className="p-4 rounded-xl bg-gray-900/60 border border-white/5 space-y-2">
                        <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>Latest Public Status Note</span>
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed font-light">
                          {service.public_status_note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Payment details */}
                  <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-2">
                        <DollarSign size={18} className="text-cyan-400" />
                        <span>Payment Summary</span>
                      </h3>

                      {service.hide_payments_publicly ? (
                        <div className="py-6 text-center text-gray-400 text-sm space-y-2">
                          <LockIcon size={24} className="mx-auto text-cyan-500/60" />
                          <p>Payment amounts are hidden from public view by administrator.</p>
                          <div className="pt-2">
                            <span className="text-xs text-gray-500 block mb-1">Payment Status</span>
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(service.payment_status)}`}>
                              {service.payment_status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-gray-400">Total Project Price</span>
                            <span className="font-semibold text-white font-mono">₹{Number(service.project_price).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-gray-400">Amount Paid</span>
                            <span className="font-semibold text-emerald-400 font-mono">₹{Number(service.amount_received).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-gray-400">Remaining Balance</span>
                            <span className={`font-semibold font-mono ${service.remaining_balance > 0 ? 'text-amber-400' : 'text-gray-300'}`}>
                              ₹{Number(service.remaining_balance).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-400">Payment Status</span>
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(service.payment_status)}`}>
                              {service.payment_status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 text-[10px] text-gray-500 text-center font-light leading-relaxed border-t border-white/5 mt-6">
                      For receipts or payment issues, reach out with your Service ID.
                    </div>
                  </div>

                </div>

                {/* Support System Card */}
                <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Clock size={18} className="text-cyan-400" />
                      <span>One-Year Free Basic Support</span>
                    </h3>

                    {/* Support status Badge with countdown details */}
                    {supportInfo && (
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                        supportInfo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        supportInfo.status === 'Expiring Soon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        supportInfo.status === 'Expired' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {supportInfo.status === 'Active' && `Free Basic Support Active — ${supportInfo.days} days remaining`}
                        {supportInfo.status === 'Expiring Soon' && `Free Basic Support Expiring Soon — ${supportInfo.days} days remaining!`}
                        {supportInfo.status === 'Expired' && `Free Basic Support Expired`}
                        {supportInfo.status === 'Not Started' && `Support Period: Not Started`}
                      </span>
                    )}
                  </div>

                  {/* Launch details */}
                  <div className="grid sm:grid-cols-4 gap-6">
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Launch Status</span>
                      <span className={`text-sm font-semibold ${service.launch_status === 'Launched' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {service.launch_status}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Launch Date</span>
                      <span className="text-sm font-semibold text-white">{formatDate(service.launch_date)}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Support Start</span>
                      <span className="text-sm font-semibold text-white">{formatDate(service.support_start_date)}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
                      <span className="text-xs text-gray-400 block mb-1">Support End</span>
                      <span className="text-sm font-semibold text-white">{formatDate(service.support_end_date)}</span>
                    </div>
                  </div>

                  {service.launch_status === 'Launched' && service.live_website_url && (
                    <div className="flex justify-center pt-2">
                      <a
                        href={service.live_website_url.startsWith('http') ? service.live_website_url : `https://${service.live_website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white font-semibold text-xs transition-all flex items-center gap-2"
                      >
                        <span>Visit Live Website</span>
                        <ExternalLink size={12} className="text-cyan-400" />
                      </a>
                    </div>
                  )}

                  {/* Policy and disclaimer */}
                  <div className="p-5 rounded-xl bg-gray-900/40 border border-white/5 text-xs text-gray-400 space-y-3 leading-relaxed">
                    <span className="font-semibold text-white block">Free Support Policy Notice:</span>
                    <ul className="list-disc pl-4 space-y-1.5 font-light">
                      <li>VPANSAK Studio provides one year of free basic website support from the official website launch date.</li>
                      <li>Free basic support includes small text corrections, contact-detail updates, basic image replacements and minor content changes within the existing website structure.</li>
                      <li>Free support does not include complete redesigns, new pages, advanced new features, payment gateway additions, database restructuring, major coding changes, paid third-party services, new domain purchases or new hosting expenses.</li>
                      <li>Major updates and additional features may require a separate quotation.</li>
                      <li>Unused free support cannot be exchanged for cash or extended automatically.</li>
                    </ul>
                  </div>
                </div>

                {/* Support Requests History */}
                <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
                    <Calendar size={18} className="text-cyan-400" />
                    <span>Support Ticket History</span>
                  </h3>

                  {supportRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No support tickets have been created for this service project yet.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {supportRequests.map((req, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-900/60 border border-white/5 space-y-3">
                          <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                                {req.request_type}
                              </span>
                              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono ${
                                req.priority === 'Urgent' || req.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gray-800 text-gray-400'
                              }`}>
                                {req.priority}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(req.request_date)}</span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] text-gray-500 uppercase block">Customer Request</span>
                              <p className="text-xs text-gray-300 font-light">{req.request_text}</p>
                            </div>
                            
                            {req.admin_response && (
                              <div className="pt-2 border-t border-white/5">
                                <span className="text-[10px] text-cyan-400 uppercase block font-semibold">Studio Response</span>
                                <p className="text-xs text-gray-300 font-light italic">“{req.admin_response}”</p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-1 text-[10px]">
                            <span className="text-gray-500">
                              {req.completion_date ? `Completed on: ${formatDate(req.completion_date)}` : 'In Queue'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                              req.request_status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' :
                              req.request_status === 'Rejected' ? 'bg-red-500/15 text-red-400' :
                              req.request_status === 'In Progress' ? 'bg-blue-500/15 text-blue-400' :
                              req.request_status === 'Paid Upgrade Required' ? 'bg-purple-500/15 text-purple-400' :
                              'bg-amber-500/15 text-amber-400'
                            }`}>
                              {req.request_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

// Simple Lock SVG helper
const LockIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
