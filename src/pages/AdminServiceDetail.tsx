import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Edit3, Trash2, DollarSign, Clock, 
  AlertTriangle, Copy, MessageSquare, Share2, 
  FolderOpen, Plus, RefreshCw, X, Printer, Archive, Globe, 
  ExternalLink, ListChecks
} from 'lucide-react';

interface SupportRequest {
  id: string;
  request_date: string;
  request_text: string;
  request_type: string;
  priority: string;
  request_status: string;
  public_update: string | null;
  private_admin_note: string | null;
  admin_response: string | null;
  completion_date: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  previous_value: string | null;
  new_value: string | null;
  admin_email: string;
  created_at: string;
}

interface ServiceRecord {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_mobile: string;
  customer_whatsapp: string | null;
  customer_address: string | null;
  city: string;
  state: string;
  preferred_contact_method: string;
  business_name: string;
  website_category: string;
  business_description: string;
  business_location: string | null;
  existing_website_status: string;
  existing_website_url: string | null;
  existing_website_issues: string | null;
  website_requirements: string;
  required_pages: string[];
  required_features: string[];
  website_style: string;
  preferred_colours: string | null;
  domain_status: string;
  domain_name: string | null;
  hosting_status: string;
  hosting_provider: string | null;
  project_status: string;
  public_status_note: string | null;
  private_admin_note: string | null;
  project_price: number;
  advance_required: number;
  amount_received: number;
  remaining_balance: number;
  payment_status: string;
  payment_method: string;
  transaction_id: string | null;
  payment_received_date: string | null;
  payment_notes: string | null;
  launch_status: string;
  live_website_url: string | null;
  launch_date: string | null;
  support_start_date: string | null;
  support_end_date: string | null;
  support_status: string;
  checklist: Record<string, boolean>;
  documents: { title: string; url: string; is_public: boolean }[];
  created_at: string;
  updated_at: string;
}

interface AdminServiceDetailProps {
  serviceId: string;
  onBack: () => void;
  adminEmail: string;
}

export const AdminServiceDetail: React.FC<AdminServiceDetailProps> = ({ serviceId, onBack, adminEmail }) => {
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  // Support Request input states
  const [showAddSupport, setShowAddSupport] = useState(false);
  const [supportText, setSupportText] = useState('');
  const [supportType, setSupportType] = useState('Bug Fix');
  const [supportPriority, setSupportPriority] = useState('Normal');
  const [supportStatusInput, setSupportStatusInput] = useState('Received');
  const [supportAdminResponse, setSupportAdminResponse] = useState('');
  const [supportPublicUpdate, setSupportPublicUpdate] = useState('');
  const [supportPrivateNote, setSupportPrivateNote] = useState('');

  // Checklist updates state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Documents updates state
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docPublic, setDocPublic] = useState(false);

  // Delete modal double safety
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    loadAllDetails();
  }, [serviceId]);

  const loadAllDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Load service profile
      const { data: serviceData, error: sError } = await supabase
        .from('website_services')
        .select('*')
        .eq('service_id', serviceId)
        .single();

      if (sError) throw sError;
      setService(serviceData);
      setChecklist(serviceData.checklist || {});
      setEditForm({ ...serviceData });

      // 2. Load Support Tickets
      const { data: supportData, error: supError } = await supabase
        .from('website_support_requests')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (!supError && supportData) {
        setSupportRequests(supportData);
      }

      // 3. Load Audit Logs
      const { data: logsData, error: lError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (!lError && logsData) {
        setActivityLogs(logsData);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to log changes to activity logs
  const logActivity = async (action: string, prevVal: string | null, newVal: string | null) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          service_id: serviceId,
          action,
          previous_value: prevVal,
          new_value: newVal,
          admin_email: adminEmail
        });
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  // Update Project Status dropdown helper
  const handleUpdateProjectStatus = async (status: string) => {
    if (!service) return;
    setSaving(true);
    try {
      const oldStatus = service.project_status;
      const { error } = await supabase
        .from('website_services')
        .update({ project_status: status, updated_at: new Date().toISOString() })
        .eq('service_id', serviceId);

      if (error) throw error;
      
      await logActivity('Status Changed', oldStatus, status);
      await loadAllDetails();
      alert('Status updated successfully.');
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Launch triggers
  const handleMarkAsLaunched = async () => {
    if (!service) return;
    const url = prompt('Enter the Live Website URL:', service.live_website_url || 'https://');
    if (url === null) return;
    if (!url.trim()) {
      alert('URL is required to launch website.');
      return;
    }

    setSaving(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const endD = new Date(todayStr);
      endD.setFullYear(endD.getFullYear() + 1);
      const endDStr = endD.toISOString().split('T')[0];

      const { error } = await supabase
        .from('website_services')
        .update({
          launch_status: 'Launched',
          live_website_url: url,
          launch_date: todayStr,
          support_start_date: todayStr,
          support_end_date: endDStr,
          support_status: 'Active',
          project_status: 'Launched',
          updated_at: new Date().toISOString()
        })
        .eq('service_id', serviceId);

      if (error) throw error;

      await logActivity('Website Marked as Launched', 'Not Launched', `URL: ${url}, Expiry: ${endDStr}`);
      await loadAllDetails();
      alert('Website launched successfully! 1-Year Free Support started.');
    } catch (err: any) {
      alert('Failed to launch: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Record Payment
  const handleRecordPayment = async () => {
    if (!service) return;
    const amtStr = prompt('Enter Amount Received in INR:', '0');
    if (amtStr === null) return;
    const amt = Number(amtStr);
    if (isNaN(amt) || amt < 0) {
      alert('Invalid amount entered.');
      return;
    }

    setSaving(true);
    try {
      const totalRec = Number(service.amount_received) + amt;
      const price = Number(service.project_price);
      const balance = Math.max(0, price - totalRec);
      const pStatus = totalRec >= price ? 'Fully Paid' : totalRec > 0 ? 'Partially Paid' : 'Pending';

      const { error } = await supabase
        .from('website_services')
        .update({
          amount_received: totalRec,
          remaining_balance: balance,
          payment_status: pStatus,
          payment_received_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('service_id', serviceId);

      if (error) throw error;

      await logActivity('Payment Received', `Paid: ₹${service.amount_received}`, `Paid: ₹${totalRec}, Balance: ₹${balance}`);
      await loadAllDetails();
      alert('Payment recorded successfully.');
    } catch (err: any) {
      alert('Failed to record payment: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle checklist checkbox
  const handleChecklistChange = async (item: string, val: boolean) => {
    if (!service) return;
    const nextChecklist = { ...checklist, [item]: val };
    setChecklist(nextChecklist);
    
    try {
      const { error } = await supabase
        .from('website_services')
        .update({ checklist: nextChecklist, updated_at: new Date().toISOString() })
        .eq('service_id', serviceId);

      if (error) throw error;
      await logActivity('Checklist Updated', `${item}: ${!val}`, `${item}: ${val}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Add customer asset file link
  const handleAddDocumentLink = async () => {
    if (!service || !docTitle || !docUrl) return;
    const nextDocs = [...(service.documents || []), { title: docTitle, url: docUrl, is_public: docPublic }];
    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_services')
        .update({ documents: nextDocs, updated_at: new Date().toISOString() })
        .eq('service_id', serviceId);

      if (error) throw error;

      setDocTitle('');
      setDocUrl('');
      setDocPublic(false);
      await logActivity('Asset Link Added', null, docTitle);
      await loadAllDetails();
    } catch (err: any) {
      alert('Failed to add link: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Remove customer asset file link
  const handleRemoveDocLink = async (idx: number) => {
    if (!service) return;
    const docToRemove = service.documents[idx];
    const nextDocs = service.documents.filter((_, i) => i !== idx);
    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_services')
        .update({ documents: nextDocs, updated_at: new Date().toISOString() })
        .eq('service_id', serviceId);

      if (error) throw error;

      await logActivity('Asset Link Removed', docToRemove.title, null);
      await loadAllDetails();
    } catch (err: any) {
      alert('Failed to remove: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Support ticket request entry
  const handleAddSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportText.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_support_requests')
        .insert({
          service_id: serviceId,
          request_date: new Date().toISOString().split('T')[0],
          request_text: supportText,
          request_type: supportType,
          priority: supportPriority,
          request_status: supportStatusInput,
          admin_response: supportAdminResponse || null,
          public_update: supportPublicUpdate || null,
          private_admin_note: supportPrivateNote || null,
          completion_date: supportStatusInput === 'Completed' ? new Date().toISOString().split('T')[0] : null
        });

      if (error) throw error;

      await logActivity('Support Request Added', null, `${supportType} - ${supportPriority}`);
      
      // Reset inputs
      setSupportText('');
      setSupportAdminResponse('');
      setSupportPublicUpdate('');
      setSupportPrivateNote('');
      setShowAddSupport(false);
      
      await loadAllDetails();
      alert('Support ticket created successfully.');
    } catch (err: any) {
      alert('Failed to save support request: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit Service Form Save
  const handleSaveServiceEdits = async () => {
    if (!editForm) return;
    
    // Validations
    if (!editForm.customer_name.trim()) return alert('Customer Name is required.');
    if (!editForm.customer_mobile.trim()) return alert('Mobile Number is required.');
    if (!editForm.business_name.trim()) return alert('Business Brand is required.');

    setSaving(true);
    try {
      const price = Number(editForm.project_price) || 0;
      const received = Number(editForm.amount_received) || 0;
      const balance = Math.max(0, price - received);

      const { error } = await supabase
        .from('website_services')
        .update({
          customer_name: editForm.customer_name,
          customer_email: editForm.customer_email || null,
          customer_mobile: editForm.customer_mobile,
          customer_whatsapp: editForm.customer_whatsapp || null,
          customer_address: editForm.customer_address || null,
          city: editForm.city,
          state: editForm.state,
          preferred_contact_method: editForm.preferred_contact_method,
          business_name: editForm.business_name,
          website_category: editForm.website_category,
          business_description: editForm.business_description,
          business_location: editForm.business_location || null,
          existing_website_status: editForm.existing_website_status,
          existing_website_url: editForm.existing_website_url || null,
          existing_website_issues: editForm.existing_website_issues || null,
          website_requirements: editForm.website_requirements,
          website_style: editForm.website_style,
          preferred_colours: editForm.preferred_colours || null,
          domain_status: editForm.domain_status,
          domain_name: editForm.domain_name || null,
          hosting_status: editForm.hosting_status,
          hosting_provider: editForm.hosting_provider || null,
          project_price: price,
          advance_required: Number(editForm.advance_required) || 0,
          amount_received: received,
          remaining_balance: balance,
          payment_status: editForm.payment_status,
          payment_method: editForm.payment_method,
          transaction_id: editForm.transaction_id || null,
          payment_notes: editForm.payment_notes || null,
          live_website_url: editForm.live_website_url || null,
          launch_date: editForm.launch_date || null,
          public_status_note: editForm.public_status_note || null,
          private_admin_note: editForm.private_admin_note || null,
          updated_at: new Date().toISOString()
        })
        .eq('service_id', serviceId);

      if (error) throw error;

      await logActivity('Customer Details Updated', null, `Admin Edited Details`);
      await loadAllDetails();
      setIsEditMode(false);
      alert('Project saved successfully.');
    } catch (err: any) {
      alert('Failed to save service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Archive Service (soft-delete)
  const handleArchiveService = async () => {
    if (!service) return;
    const confirmArch = window.confirm(`Are you sure you want to archive this service project record? It will be hidden from the active service dashboards.`);
    if (!confirmArch) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_services')
        .update({ archived: true, updated_at: new Date().toISOString() })
        .eq('service_id', serviceId);

      if (error) throw error;
      await logActivity('Service Archived', 'Active', 'Archived');
      alert('Service archived successfully.');
      onBack();
    } catch (err: any) {
      alert('Failed to archive: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Permanent Delete Danger Zone handler
  const handlePermanentDelete = async () => {
    if (!service) return;
    if (deleteConfirmText !== 'DELETE PERMANENTLY') {
      alert('Please type the phrase correctly to verify deletion.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_services')
        .delete()
        .eq('service_id', serviceId);

      if (error) throw error;
      alert('Service record permanently deleted from database.');
      onBack();
    } catch (err: any) {
      alert('Deletion failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Share tools
  const trackingLink = `${window.location.origin}/track?serviceId=${serviceId}`;

  const getWhatsAppShareLink = (type: 'register' | 'launch') => {
    if (!service) return '';
    let msg = '';
    if (type === 'register') {
      msg = `Hello ${service.customer_name},\n\nYour website service has been registered with VPANSAK </> STUDIO.\n\nService ID: ${serviceId}\n\nProject: ${service.business_name}\nCurrent Status: ${service.project_status}\n\nYou can track your website project using the Service ID on our website:\n\n[${trackingLink}]\n\nPlease keep this Service ID safe.\n\nContact:\nWhatsApp: +91 7380869635\nEmail: alook@outlook.in\n\nThank you,\nVPANSAK </> STUDIO`;
    } else {
      msg = `Hello ${service.customer_name},\n\nYour website has been successfully launched.\n\nService ID: ${serviceId}\nWebsite URL: ${service.live_website_url}\nLaunch Date: ${service.launch_date}\n\nYour one-year free basic support is active until:\n\n${service.support_end_date}\n\nFree support includes minor text, image and contact-detail updates within the existing website structure. Major changes or new features may require a separate quotation.\n\nThank you,\nVPANSAK </> STUDIO`;
    }

    const recipient = service.customer_whatsapp || service.customer_mobile;
    const cleanNumber = recipient.replace(/\D/g, '');
    const formattedPhone = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Format Helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get project status styling
  const getBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('launched') || s.includes('completed') || s.includes('paid')) {
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

  // Calculate remaining support days
  const getSupportRemainingDays = () => {
    if (!service || !service.support_end_date) return null;
    const end = new Date(service.support_end_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    
    if (today > end) return 0;
    const diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const supportRemainingDays = getSupportRemainingDays();

  // Print view opener
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-gray-100">
        <RefreshCw className="animate-spin text-cyan-400 mb-4" size={40} />
        <p className="text-gray-400 font-mono text-xs">Querying project metadata...</p>
      </div>
    );
  }

  if (errorMsg || !service) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center text-gray-100">
        <AlertTriangle className="text-red-400 mb-4" size={40} />
        <h3 className="text-xl font-bold mb-2">Error Loading Project</h3>
        <p className="text-gray-400 text-sm max-w-md mb-6">{errorMsg || 'Project profile was not found.'}</p>
        <button onClick={onBack} className="px-5 py-2 bg-gray-900 border border-white/10 hover:bg-gray-850 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={14} />
          <span>Back to dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 p-6 lg:p-10">
      
      {/* Printable Area - styling overrides for print view in CSS */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, aside, button, .no-print {
            display: none !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .glass-card {
            background: transparent !important;
            border: 1px solid #ddd !important;
            color: black !important;
            box-shadow: none !important;
          }
          h1, h2, h3, h4, span, label, td, th {
            color: black !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8 print-container">
        
        {/* Navigation Bar (No-Print) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 no-print">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-cyan-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 size={14} />
              <span>{isEditMode ? 'Cancel Edit' : 'Edit Service'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Details</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(trackingLink);
                alert('Public Tracking URL Copied to clipboard!');
              }}
              className="px-4 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Tracking Link</span>
            </button>

            <button
              onClick={handleArchiveService}
              className="px-4 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Archive size={14} />
              <span>Archive Service</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Customer Alerts Card (No-Print) */}
        <div className="glass-card rounded-2xl border border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print bg-cyan-500/5">
          <div className="flex items-center gap-2.5 text-cyan-400 text-xs">
            <MessageSquare size={16} />
            <div>
              <span className="font-semibold block">Customer Communication Dispatcher</span>
              <span className="text-gray-400 font-light">Share Service tracking link or launch notification directly to customer WhatsApp.</span>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <a
              href={getWhatsAppShareLink('register')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <Share2 size={12} />
              <span>Share Registration URL</span>
            </a>
            {service.launch_status === 'Launched' && (
              <a
                href={getWhatsAppShareLink('launch')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <Globe size={12} />
                <span>Share Launch Support</span>
              </a>
            )}
          </div>
        </div>

        {/* Profile Details Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <span className="text-xs text-cyan-400 font-mono tracking-wider font-semibold block mb-1">SERVICE PROFILE</span>
            <h1 className="text-2xl md:text-3xl font-black text-white font-mono flex items-center gap-3">
              <span>{service.service_id}</span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClass(service.project_status)}`}>
                {service.project_status}
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Brand: <strong className="text-gray-300">{service.business_name}</strong> | Registered on: {formatDate(service.created_at)}</p>
          </div>

          {/* Quick Actions (No-Print) */}
          <div className="flex flex-wrap gap-2 no-print">
            <select
              value={service.project_status}
              onChange={(e) => handleUpdateProjectStatus(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option disabled>Change Project Status...</option>
              {["New Request", "Contact Pending", "In Discussion", "Quotation Sent", "Waiting for Advance Payment", "Payment Partially Received", "Payment Received", "Content Pending", "Design in Progress", "Development in Progress", "Customer Review", "Changes Requested", "Ready for Launch", "Launched", "On Hold", "Cancelled", "Completed"].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <button
              onClick={handleRecordPayment}
              className="px-3.5 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 hover:text-emerald-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <DollarSign size={14} />
              <span>Record Payment</span>
            </button>

            {service.launch_status !== 'Launched' && (
              <button
                onClick={handleMarkAsLaunched}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Globe size={14} />
                <span>Mark as Launched</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------- EDIT MODE FORM -------------------- */}
        {isEditMode && editForm && (
          <div className="glass-card rounded-2xl border border-cyan-500/20 p-6 md:p-8 space-y-6 no-print">
            <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono flex items-center gap-2">
              <Edit3 size={16} />
              <span>Inline Editing Mode</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Customer Full Name</label>
                <input
                  type="text"
                  value={editForm.customer_name}
                  onChange={(e) => setEditForm({...editForm, customer_name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Customer Email</label>
                <input
                  type="email"
                  value={editForm.customer_email || ''}
                  onChange={(e) => setEditForm({...editForm, customer_email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Customer Mobile Number</label>
                <input
                  type="text"
                  value={editForm.customer_mobile}
                  onChange={(e) => setEditForm({...editForm, customer_mobile: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Customer WhatsApp</label>
                <input
                  type="text"
                  value={editForm.customer_whatsapp || ''}
                  onChange={(e) => setEditForm({...editForm, customer_whatsapp: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">State</label>
                <input
                  type="text"
                  value={editForm.state}
                  onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Business or Brand Name</label>
                <input
                  type="text"
                  value={editForm.business_name}
                  onChange={(e) => setEditForm({...editForm, business_name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Website Category</label>
                <select
                  value={editForm.website_category}
                  onChange={(e) => setEditForm({...editForm, website_category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                >
                  {["Shop Website", "Business Website", "E-commerce Website", "Coaching Institute Website", "School Website", "College Website", "Restaurant Website", "Hotel Website", "Clinic or Hospital Website", "Portfolio Website", "Startup Website", "NGO or Foundation Website", "Real Estate Website", "Event Website", "Gym Website", "Salon Website", "Travel Website", "Blog or News Website", "Personal Website", "Other"].map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 block mb-1 font-semibold">Business Description</label>
                <textarea
                  rows={2}
                  value={editForm.business_description}
                  onChange={(e) => setEditForm({...editForm, business_description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 block mb-1 font-semibold">Website Requirements</label>
                <textarea
                  rows={3}
                  value={editForm.website_requirements}
                  onChange={(e) => setEditForm({...editForm, website_requirements: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Domain Name</label>
                <input
                  type="text"
                  value={editForm.domain_name || ''}
                  onChange={(e) => setEditForm({...editForm, domain_name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Hosting Provider</label>
                <input
                  type="text"
                  value={editForm.hosting_provider || ''}
                  onChange={(e) => setEditForm({...editForm, hosting_provider: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Project Price (INR)</label>
                <input
                  type="number"
                  value={editForm.project_price}
                  onChange={(e) => setEditForm({...editForm, project_price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Amount Paid (INR)</label>
                <input
                  type="number"
                  value={editForm.amount_received}
                  onChange={(e) => setEditForm({...editForm, amount_received: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Public Status Update</label>
                <input
                  type="text"
                  value={editForm.public_status_note || ''}
                  onChange={(e) => setEditForm({...editForm, public_status_note: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Private Admin Note</label>
                <input
                  type="text"
                  value={editForm.private_admin_note || ''}
                  onChange={(e) => setEditForm({...editForm, private_admin_note: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-5 py-2 bg-gray-900 border border-white/5 hover:bg-gray-850 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveServiceEdits}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
              >
                {saving && <RefreshCw className="animate-spin" size={12} />}
                <span>Save Project</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------- MAIN DISPLAY GRID -------------------- */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Project Specifications & Documents */}
          <div className="md:col-span-2 space-y-6">
            
            {/* General Card */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">Customer & Business Details</h3>
              
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Customer Name</span>
                  <span className="font-semibold text-white">{service.customer_name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Business / Brand Name</span>
                  <span className="font-semibold text-white">{service.business_name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Customer Email</span>
                  <span className="font-mono text-gray-300">{service.customer_email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Customer Mobile Number</span>
                  <span className="font-mono text-gray-300">{service.customer_mobile}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Customer WhatsApp</span>
                  <span className="font-mono text-gray-300">{service.customer_whatsapp || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">City / State</span>
                  <span className="text-gray-300">{service.city}, {service.state}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Preferred Contact Method</span>
                  <span className="text-gray-300">{service.preferred_contact_method}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Website Category</span>
                  <span className="text-cyan-400 font-semibold">{service.website_category}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-gray-500 block mb-0.5">Customer Address</span>
                  <span className="text-gray-300 font-light">{service.customer_address || 'N/A'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-gray-500 block mb-0.5">Business description</span>
                  <p className="text-gray-300 leading-relaxed font-light">{service.business_description}</p>
                </div>
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">Website Requirements</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Development Requirements Scope</span>
                  <p className="text-gray-300 leading-relaxed font-light bg-gray-900/40 p-4 rounded-xl border border-white/5 font-mono text-xs whitespace-pre-wrap">{service.website_requirements}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Domain Details</span>
                    <div className="p-3 bg-gray-900/30 rounded-lg border border-white/5">
                      <span className="text-xs block text-gray-400 font-medium">{service.domain_status}</span>
                      {service.domain_name && <span className="text-xs font-mono text-cyan-400 mt-1 block">{service.domain_name}</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Hosting Details</span>
                    <div className="p-3 bg-gray-900/30 rounded-lg border border-white/5">
                      <span className="text-xs block text-gray-400 font-medium">{service.hosting_status}</span>
                      {service.hosting_provider && <span className="text-xs font-mono text-cyan-400 mt-1 block">{service.hosting_provider}</span>}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Design Style Style</span>
                    <span className="font-semibold text-white block">{service.website_style}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Preferred Colors</span>
                    <span className="text-gray-300 block">{service.preferred_colours || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-2">Selected Pages ({service.required_pages?.length || 0})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.required_pages?.map((page, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        {page}
                      </span>
                    ))}
                    {(!service.required_pages || service.required_pages.length === 0) && (
                      <span className="text-xs text-gray-500 italic">No specific pages selected</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-2">Selected Custom Features ({service.required_features?.length || 0})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.required_features?.map((feat, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        {feat}
                      </span>
                    ))}
                    {(!service.required_features || service.required_features.length === 0) && (
                      <span className="text-xs text-gray-500 italic">No custom features selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Requests Management */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase font-mono">Support Tickets</h3>
                
                <button
                  onClick={() => setShowAddSupport(!showAddSupport)}
                  className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center gap-1 cursor-pointer no-print"
                >
                  <Plus size={12} />
                  <span>Create Ticket</span>
                </button>
              </div>

              {/* Add Ticket Form */}
              {showAddSupport && (
                <form onSubmit={handleAddSupportTicket} className="p-4 rounded-xl bg-gray-900 border border-cyan-500/10 space-y-4 no-print text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider">New Support Ticket Details</h4>
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Ticket Type</label>
                      <select
                        value={supportType}
                        onChange={(e) => setSupportType(e.target.value)}
                        className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                      >
                        {["Text Change", "Contact Update", "Image Replacement", "Basic Content Update", "Bug Fix", "Design Change", "New Page", "New Feature", "Domain Issue", "Hosting Issue", "Other"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Priority</label>
                      <select
                        value={supportPriority}
                        onChange={(e) => setSupportPriority(e.target.value)}
                        className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                      >
                        {["Low", "Normal", "High", "Urgent"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Ticket Status</label>
                      <select
                        value={supportStatusInput}
                        onChange={(e) => setSupportStatusInput(e.target.value)}
                        className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                      >
                        {["Received", "In Review", "In Progress", "Waiting for Customer", "Completed", "Rejected", "Paid Upgrade Required"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Customer Request Details *</label>
                    <textarea
                      rows={2}
                      value={supportText}
                      onChange={(e) => setSupportText(e.target.value)}
                      placeholder="Specify what text, images or bugs the customer requested to change..."
                      className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Admin Response Note (Publicly visible)</label>
                      <input
                        type="text"
                        value={supportAdminResponse}
                        onChange={(e) => setSupportAdminResponse(e.target.value)}
                        placeholder="e.g. Bug is fixed. Changes are live."
                        className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Private Internal Notes (Only admins see this)</label>
                      <input
                        type="text"
                        value={supportPrivateNote}
                        onChange={(e) => setSupportPrivateNote(e.target.value)}
                        placeholder="Internal references..."
                        className="w-full px-2.5 py-2 bg-gray-850 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSupport(false)}
                      className="px-4 py-2 bg-gray-850 hover:bg-gray-800 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold cursor-pointer"
                    >
                      <span>Submit Ticket</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tickets list */}
              <div className="space-y-4">
                {supportRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-gray-900/60 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold font-mono">
                          {req.request_type}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase ${
                          req.priority === 'Urgent' || req.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                      <span className="text-gray-500">{formatDate(req.request_date)}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Customer Request Details</span>
                        <p className="text-gray-300 font-light">{req.request_text}</p>
                      </div>

                      {req.admin_response && (
                        <div>
                          <span className="text-[10px] text-cyan-400 uppercase block font-semibold">Admin Response</span>
                          <p className="text-gray-300 font-light italic">“{req.admin_response}”</p>
                        </div>
                      )}

                      {req.private_admin_note && (
                        <div className="p-2 bg-amber-500/5 rounded border border-amber-500/10 text-amber-400/90 text-[11px] no-print">
                          <span className="font-bold block uppercase text-[8px] tracking-wider mb-0.5">Private Admin Log:</span>
                          <span>{req.private_admin_note}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[10px] border-t border-white/5">
                      <span className="text-gray-500">
                        {req.completion_date ? `Completed Date: ${formatDate(req.completion_date)}` : 'In Queue'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 no-print">
                        <select
                          value={req.request_status}
                          onChange={async (e) => {
                            const val = e.target.value;
                            const compDate = val === 'Completed' ? new Date().toISOString().split('T')[0] : null;
                            const { error } = await supabase
                              .from('website_support_requests')
                              .update({ request_status: val, completion_date: compDate })
                              .eq('id', req.id);
                            if (!error) {
                              await logActivity('Support Status Updated', req.request_status, val);
                              await loadAllDetails();
                            }
                          }}
                          className="px-2 py-1 bg-gray-900 border border-white/5 rounded text-[10px] text-white"
                        >
                          {["Received", "In Review", "In Progress", "Waiting for Customer", "Completed", "Rejected", "Paid Upgrade Required"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this support request ticket?')) return;
                            const { error } = await supabase
                              .from('website_support_requests')
                              .delete()
                              .eq('id', req.id);
                            if (!error) {
                              await logActivity('Support Request Removed', req.request_type, null);
                              await loadAllDetails();
                            }
                          }}
                          className="p-1 hover:bg-red-500/10 rounded text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full font-bold no-print-block print:block ${
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

                {supportRequests.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-xs font-light">
                    No support tickets have been created yet.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Column 3: Payment, Support Countdown, Checklists */}
          <div className="space-y-6">
            
            {/* Status & Support countdown banner */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">Launch & Support Period</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Launch Status</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${service.launch_status === 'Launched' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {service.launch_status}
                  </span>
                </div>

                {service.launch_status === 'Launched' && (
                  <div className="p-3 bg-gray-900/60 rounded-xl border border-white/5 space-y-2.5 font-light">
                    <div className="flex justify-between items-center text-xs">
                      <span>Launch Date:</span>
                      <strong className="text-white font-semibold">{formatDate(service.launch_date)}</strong>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span>Support Start:</span>
                      <strong className="text-white font-semibold">{formatDate(service.support_start_date)}</strong>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span>Support End:</span>
                      <strong className="text-white font-semibold">{formatDate(service.support_end_date)}</strong>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center font-semibold text-xs">
                      <span>Support Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        service.support_status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        service.support_status === 'Expiring Soon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        service.support_status === 'Expired' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {service.support_status === 'Active' ? `Active (${supportRemainingDays} Days)` :
                         service.support_status === 'Expiring Soon' ? `Expiring (${supportRemainingDays} Days!)` :
                         service.support_status === 'Expired' ? `Expired` : `Not Started`}
                      </span>
                    </div>
                  </div>
                )}
                
                {service.live_website_url && (
                  <div className="pt-2">
                    <a
                      href={service.live_website_url.startsWith('http') ? service.live_website_url : `https://${service.live_website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink size={12} className="text-cyan-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">Payment Summary</h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-xs text-gray-500">Project Value</span>
                  <span className="font-semibold text-white font-mono">₹{service.project_price}</span>
                </div>
                
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-xs text-gray-500">Advance Required</span>
                  <span className="font-semibold text-white font-mono">₹{service.advance_required}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-xs text-gray-500">Total Received</span>
                  <span className="font-semibold text-emerald-400 font-mono">₹{service.amount_received}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-xs text-gray-500">Remaining Balance</span>
                  <span className={`font-semibold font-mono ${service.remaining_balance > 0 ? 'text-amber-400' : 'text-gray-300'}`}>
                    ₹{service.remaining_balance}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-xs text-gray-500">Payment Status</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeClass(service.payment_status)}`}>
                    {service.payment_status}
                  </span>
                </div>

                {service.payment_notes && (
                  <div className="p-3 rounded-lg bg-gray-900 border border-white/5 text-xs text-gray-400 font-light no-print">
                    <span className="font-semibold block text-[10px] text-white mb-0.5">Internal Payment Notes:</span>
                    <span>{service.payment_notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist Card */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono flex items-center gap-1.5">
                <ListChecks size={16} />
                <span>Developer Checklist</span>
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {Object.keys(checklist).map((item) => (
                  <label key={item} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer py-0.5 hover:text-white">
                    <input
                      type="checkbox"
                      checked={checklist[item] || false}
                      onChange={(e) => handleChecklistChange(item, e.target.checked)}
                      className="accent-cyan-500 shrink-0 cursor-pointer no-print"
                    />
                    {/* Printing styling checkbox */}
                    <span className="print-only-inline">
                      {checklist[item] ? '☑' : '☐'}
                    </span>
                    <span className={`ml-1 ${checklist[item] ? 'line-through text-gray-500 font-light' : 'text-gray-300'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assets Link Folder */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono flex items-center gap-1.5">
                <FolderOpen size={16} />
                <span>Customer Assets Folder</span>
              </h3>

              {/* Add asset link */}
              <div className="space-y-2 no-print">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Link Name"
                    className="px-2 py-1.5 bg-gray-900 border border-white/5 rounded focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://..."
                    className="px-2 py-1.5 bg-gray-900 border border-white/5 rounded focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <label className="flex items-center gap-1 cursor-pointer text-gray-500">
                    <input
                      type="checkbox"
                      checked={docPublic}
                      onChange={(e) => setDocPublic(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span>Public tracking link</span>
                  </label>
                  
                  <button
                    onClick={handleAddDocumentLink}
                    className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded hover:bg-cyan-500/20 cursor-pointer font-bold"
                  >
                    Add Folder Link
                  </button>
                </div>
              </div>

              {/* Links list */}
              <div className="space-y-1.5">
                {service.documents?.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-gray-900/60 border border-white/5 rounded">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate max-w-[150px] flex items-center gap-1 font-semibold">
                      <ExternalLink size={10} />
                      <span>{doc.title}</span>
                    </a>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase px-1 rounded ${doc.is_public ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {doc.is_public ? 'Public' : 'Private'}
                      </span>
                      
                      <button
                        onClick={() => handleRemoveDocLink(idx)}
                        className="text-red-400 hover:text-red-300 no-print"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {(!service.documents || service.documents.length === 0) && (
                  <div className="text-center py-4 text-gray-500 text-xs font-light">
                    No customer asset folder links uploaded.
                  </div>
                )}
              </div>
            </div>

            {/* Audit Logs Trail */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4 no-print">
              <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono flex items-center gap-1.5">
                <Clock size={16} />
                <span>Audit Logs History</span>
              </h3>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div key={log.id} className="text-[10px] space-y-1 bg-gray-900/40 p-2 rounded border border-white/5">
                    <div className="flex justify-between text-gray-500">
                      <span className="font-semibold text-white">{log.action}</span>
                      <span>{new Date(log.created_at).toLocaleTimeString('en-IN')}</span>
                    </div>
                    {log.previous_value && log.new_value && (
                      <p className="text-gray-400 font-light truncate">
                        {log.previous_value} ➔ <strong className="text-cyan-400">{log.new_value}</strong>
                      </p>
                    )}
                    {!log.previous_value && log.new_value && (
                      <p className="text-gray-400 font-light truncate">{log.new_value}</p>
                    )}
                    <span className="text-[9px] text-gray-600 block">By: {log.admin_email} | {formatDate(log.created_at)}</span>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="text-center py-2 text-gray-500 text-xs font-light">No logs registered yet.</div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card rounded-2xl border border-red-500/20 p-6 space-y-4 bg-red-500/5 no-print">
              <h3 className="text-sm font-bold tracking-wider text-red-400 uppercase border-b border-red-500/10 pb-2 font-mono">Danger Zone</h3>
              
              {!showDeleteZone ? (
                <button
                  onClick={() => setShowDeleteZone(true)}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Configure Permanent Deletion
                </button>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="text-gray-400 leading-relaxed font-light">
                    This action is <strong className="text-red-400">permanent and irreversible</strong>. It deletes all details, activity timelines, and support request history from the Supabase database.
                  </div>
                  
                  <div>
                    <label className="text-gray-500 block mb-1">To confirm, type: <strong>DELETE PERMANENTLY</strong></label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type the confirmation phrase..."
                      className="w-full px-3 py-2 bg-gray-900 border border-red-500/20 rounded-lg text-white font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteZone(false);
                        setDeleteConfirmText('');
                      }}
                      className="w-1/2 py-2 bg-gray-900 border border-white/5 text-white rounded hover:bg-gray-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePermanentDelete}
                      className="w-1/2 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded cursor-pointer"
                    >
                      Yes, Delete Record
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
