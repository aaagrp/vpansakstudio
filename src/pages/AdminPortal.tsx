import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Lock, Eye, EyeOff, LayoutDashboard, FilePlus2, ListFilter, Play, CheckCircle, 
  AlertTriangle, DollarSign, Users, Globe, LogOut, Search, Settings, Copy, 
  MessageSquare, RefreshCw, X, Download, FileText, Sparkles, Clock, CheckCircle2, 
  AlertCircle, FolderOpen, Plus
} from 'lucide-react';

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
  archived: boolean;
  is_draft: boolean;
  checklist: Record<string, boolean>;
  documents: { title: string; url: string; is_public: boolean }[];
  created_at: string;
  updated_at: string;
}

interface AdminPortalProps {
  onNavigateToService: (serviceId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateToService }) => {
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // App layouts & UI states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create-service' | 'all-services' | 'settings'>('dashboard');
  const [servicesList, setServicesList] = useState<ServiceRecord[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Global search & filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProjectStatus, setFilterProjectStatus] = useState('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLaunchStatus, setFilterLaunchStatus] = useState('All');
  const [filterSupportStatus, setFilterSupportStatus] = useState('All');
  const [filterCity, setFilterCity] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'launch_date' | 'support_end_date' | 'project_price' | 'remaining_balance'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Stats numbers
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRequests: 0,
    newRequests: 0,
    inDiscussion: 0,
    devInProgress: 0,
    waitingForCustomer: 0,
    readyForLaunch: 0,
    launchedWebsites: 0,
    activeSupport: 0,
    expiredSupport: 0,
    pendingPayments: 0,
    receivedPayments: 0
  });

  // Settings state
  const [hidePaymentsSetting, setHidePaymentsSetting] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_mobile: '',
    customer_whatsapp: '',
    sameAsMobile: false,
    customer_address: '',
    city: '',
    state: 'Uttar Pradesh',
    preferred_contact_method: 'WhatsApp',
    business_name: '',
    website_category: 'Business Website',
    business_description: '',
    business_location: '',
    existing_website_status: 'No existing website',
    existing_website_url: '',
    existing_website_issues: '',
    website_requirements: '',
    required_pages: [] as string[],
    required_features: [] as string[],
    website_style: 'Not Decided',
    preferred_colours: '',
    domain_status: 'Domain not decided',
    domain_name: '',
    hosting_status: 'Hosting not decided',
    hosting_provider: '',
    project_status: 'New Request',
    public_status_note: '',
    private_admin_note: '',
    project_price: '',
    advance_required: '',
    amount_received: '',
    payment_status: 'Pending',
    payment_method: 'Not Decided',
    transaction_id: '',
    payment_received_date: '',
    payment_notes: '',
    launch_status: 'Not Launched',
    live_website_url: '',
    launch_date: '',
    is_draft: false,
    checklist: {
      "Customer Requirements Confirmed": false,
      "Quotation Sent": false,
      "Advance Received": false,
      "Logo Received": false,
      "Content Received": false,
      "Domain Connected": false,
      "Website Design Completed": false,
      "Mobile Testing Completed": false,
      "Forms Tested": false,
      "SEO Added": false,
      "Customer Approval Received": false,
      "Website Launched": false,
      "Tracking ID Shared": false,
      "Support Policy Shared": false
    } as Record<string, boolean>,
    documents: [] as { title: string; url: string; is_public: boolean }[]
  });

  const [documentTitle, setDocumentTitle] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentPublic, setDocumentPublic] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Check Supabase Session
  useEffect(() => {
    supabase.auth.getSession().then((result: any) => {
      const session = result?.data?.session;
      handleUserSession(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      handleUserSession(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (currUser: any) => {
    if (currUser) {
      if (currUser.email !== 'aloksingh84959@gmail.com') {
        setAuthError('Access denied. This account is not authorized to access the VPANSAK Studio Admin Portal.');
        await supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(currUser);
        fetchStudioSettings();
        fetchServices();
      }
    } else {
      setUser(null);
    }
    setAuthChecking(false);
  };

  // Fetch Global Settings
  const fetchStudioSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) {
        setHidePaymentsSetting(data.hide_payments_publicly);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const saveStudioSettings = async () => {
    setSettingsLoading(true);
    try {
      const { error } = await supabase
        .from('studio_settings')
        .upsert({ id: 1, hide_payments_publicly: hidePaymentsSetting, updated_at: new Date().toISOString() });
      if (error) throw error;
      alert('Settings updated successfully.');
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Fetch Services & Update Stats
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('website_services')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setServicesList(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const calculateStats = (records: ServiceRecord[]) => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const s = {
      totalCustomers: new Set(records.map(r => r.customer_name)).size,
      totalRequests: records.length,
      newRequests: records.filter(r => r.project_status === 'New Request').length,
      inDiscussion: records.filter(r => r.project_status === 'In Discussion').length,
      devInProgress: records.filter(r => r.project_status === 'Development in Progress').length,
      waitingForCustomer: records.filter(r => 
        ['Waiting for Advance Payment', 'Content Pending', 'Customer Review', 'Changes Requested'].includes(r.project_status)
      ).length,
      readyForLaunch: records.filter(r => r.project_status === 'Ready for Launch').length,
      launchedWebsites: records.filter(r => r.launch_status === 'Launched').length,
      activeSupport: 0,
      expiredSupport: 0,
      pendingPayments: records.filter(r => r.remaining_balance > 0).length,
      receivedPayments: records.filter(r => r.payment_status === 'Fully Paid' || r.amount_received > 0 && r.remaining_balance === 0).length
    };

    records.forEach(r => {
      if (r.launch_status === 'Launched' && r.support_end_date) {
        const end = new Date(r.support_end_date);
        end.setHours(0,0,0,0);
        if (today > end) {
          s.expiredSupport += 1;
        } else {
          s.activeSupport += 1;
        }
      }
    });

    setStats(s);
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user && data.user.email !== 'aloksingh84959@gmail.com') {
        setAuthError('Access denied. This account is not authorized to access the VPANSAK Studio Admin Portal.');
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Indian Mobile regex validation
  const validateMobileNum = (num: string) => {
    const clean = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  };

  // Check Duplicate customer warnings
  useEffect(() => {
    if (activeTab !== 'create-service') return;
    const checkDuplicate = async () => {
      if (!formData.customer_mobile && !formData.customer_email && !formData.business_name) {
        setDuplicateWarning(null);
        return;
      }

      let orClauses: string[] = [];
      if (formData.customer_mobile) orClauses.push(`customer_mobile.eq.${formData.customer_mobile}`);
      if (formData.customer_email) orClauses.push(`customer_email.eq.${formData.customer_email}`);
      if (formData.business_name) orClauses.push(`business_name.eq.${formData.business_name}`);

      if (orClauses.length === 0) return;

      const { data, error } = await supabase
        .from('website_services')
        .select('service_id, customer_name, business_name')
        .or(orClauses.join(','))
        .eq('archived', false)
        .limit(1);

      if (!error && data && data.length > 0) {
        setDuplicateWarning(`A similar customer or project already exists (${data[0].customer_name} - ${data[0].business_name}, ID: ${data[0].service_id}). Please review before creating a duplicate.`);
      } else {
        setDuplicateWarning(null);
      }
    };

    const delayDebounce = setTimeout(() => {
      checkDuplicate();
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [formData.customer_mobile, formData.customer_email, formData.business_name, activeTab]);

  // Handle WhatsApp same as mobile checkbox
  const handleSameAsMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsMobile: checked,
      customer_whatsapp: checked ? prev.customer_mobile : prev.customer_whatsapp
    }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      customer_mobile: val,
      customer_whatsapp: prev.sameAsMobile ? val : prev.customer_whatsapp
    }));
  };

  // Add Document
  const addDocumentToForm = () => {
    if (!documentTitle || !documentUrl) return;
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { title: documentTitle, url: documentUrl, is_public: documentPublic }]
    }));
    setDocumentTitle('');
    setDocumentUrl('');
    setDocumentPublic(false);
  };

  const removeDocumentFromForm = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== idx)
    }));
  };

  // Generate Unique Service ID "VPSxxxxxx"
  const generateServiceId = async (): Promise<string> => {
    let serviceId = '';
    let unique = false;

    while (!unique) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      serviceId = `VPS${rand}`;

      const { data, error } = await supabase
        .from('website_services')
        .select('service_id')
        .eq('service_id', serviceId);

      if (error) {
        throw new Error(`Database connection failed: ${error.message}. Did you run the SQL schema in the Supabase SQL editor?`);
      }

      if (!data || data.length === 0) {
        unique = true;
      }
    }
    return serviceId;
  };

  // Save Service handler
  const handleSaveService = async (saveAsDraft: boolean) => {
    setSubmitError(null);
    setSubmitSuccessMsg(null);
    setCreatedServiceId(null);

    // Basic Validation if NOT Draft
    if (!saveAsDraft) {
      if (!formData.customer_name.trim()) return setSubmitError('Customer Full Name is required.');
      if (!formData.customer_mobile.trim()) return setSubmitError('Customer Mobile Number is required.');
      if (!validateMobileNum(formData.customer_mobile)) return setSubmitError('Customer Mobile Number must be a valid 10-digit Indian number.');
      if (formData.customer_email && !/\S+@\S+\.\S+/.test(formData.customer_email)) return setSubmitError('Customer Email must be a valid email address.');
      if (!formData.city.trim()) return setSubmitError('City is required.');
      if (!formData.business_name.trim()) return setSubmitError('Business or Brand Name is required.');
      if (!formData.business_description.trim()) return setSubmitError('Business Description is required.');
      if (!formData.website_requirements.trim()) return setSubmitError('Website Requirements are required.');
      if (formData.launch_status === 'Launched' && !formData.live_website_url.trim()) return setSubmitError('Live Website URL is required when launch status is Launched.');
    } else {
      // For draft, only require Customer Name or Brand Name to save
      if (!formData.customer_name.trim() && !formData.business_name.trim()) {
        return setSubmitError('Customer Name or Brand Name is required to save a draft.');
      }
    }

    setLoginLoading(true);

    try {
      const uniqueId = await generateServiceId();
      
      // Calculate payment balance
      const price = Number(formData.project_price) || 0;
      const received = Number(formData.amount_received) || 0;
      const remaining = Math.max(0, price - received);

      // Support end calculation if launched
      let launchDateVal = null;
      let supportStart = null;
      let supportEnd = null;
      let supportStatVal = 'Not Started';

      if (formData.launch_status === 'Launched') {
        const todayStr = formData.launch_date || new Date().toISOString().split('T')[0];
        launchDateVal = todayStr;
        supportStart = todayStr;
        
        // Calculate exactly one year later
        const endD = new Date(todayStr);
        endD.setFullYear(endD.getFullYear() + 1);
        supportEnd = endD.toISOString().split('T')[0];

        const todayObj = new Date();
        todayObj.setHours(0,0,0,0);
        const endDObj = new Date(supportEnd);
        endDObj.setHours(0,0,0,0);

        if (todayObj > endDObj) {
          supportStatVal = 'Expired';
        } else {
          const diffT = endDObj.getTime() - todayObj.getTime();
          const diffD = Math.ceil(diffT / (1000 * 60 * 60 * 24));
          supportStatVal = diffD <= 30 ? 'Expiring Soon' : 'Active';
        }
      }

      const payload = {
        service_id: uniqueId,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || null,
        customer_mobile: formData.customer_mobile,
        customer_whatsapp: formData.customer_whatsapp || null,
        customer_address: formData.customer_address || null,
        city: formData.city,
        state: formData.state,
        preferred_contact_method: formData.preferred_contact_method,
        business_name: formData.business_name,
        website_category: formData.website_category,
        business_description: formData.business_description,
        business_location: formData.business_location || null,
        existing_website_status: formData.existing_website_status,
        existing_website_url: formData.existing_website_url || null,
        existing_website_issues: formData.existing_website_issues || null,
        website_requirements: formData.website_requirements,
        required_pages: formData.required_pages,
        required_features: formData.required_features,
        website_style: formData.website_style,
        preferred_colours: formData.preferred_colours || null,
        domain_status: formData.domain_status,
        domain_name: formData.domain_name || null,
        hosting_status: formData.hosting_status,
        hosting_provider: formData.hosting_provider || null,
        project_status: saveAsDraft ? 'New Request' : formData.project_status,
        public_status_note: formData.public_status_note || null,
        private_admin_note: formData.private_admin_note || null,
        project_price: price,
        advance_required: Number(formData.advance_required) || 0,
        amount_received: received,
        remaining_balance: remaining,
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id || null,
        payment_received_date: formData.payment_received_date || null,
        payment_notes: formData.payment_notes || null,
        launch_status: formData.launch_status,
        live_website_url: formData.live_website_url || null,
        launch_date: launchDateVal,
        support_start_date: supportStart,
        support_end_date: supportEnd,
        support_status: supportStatVal,
        is_draft: saveAsDraft,
        checklist: formData.checklist,
        documents: formData.documents,
        created_by: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('website_services')
        .insert(payload);

      if (error) throw error;

      // Add default activity log
      await supabase
        .from('activity_logs')
        .insert({
          service_id: uniqueId,
          action: saveAsDraft ? 'Draft Created' : 'Service Created',
          new_value: `Created by ${user.email}`,
          admin_email: user.email
        });

      setCreatedServiceId(uniqueId);
      setSubmitSuccessMsg(saveAsDraft ? 'Draft successfully saved.' : 'Website service successfully created.');
      
      // Reset form
      resetCreateForm();
      fetchServices();
      
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit service.');
    } finally {
      setLoginLoading(false);
    }
  };

  const resetCreateForm = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      customer_mobile: '',
      customer_whatsapp: '',
      sameAsMobile: false,
      customer_address: '',
      city: '',
      state: 'Uttar Pradesh',
      preferred_contact_method: 'WhatsApp',
      business_name: '',
      website_category: 'Business Website',
      business_description: '',
      business_location: '',
      existing_website_status: 'No existing website',
      existing_website_url: '',
      existing_website_issues: '',
      website_requirements: '',
      required_pages: [],
      required_features: [],
      website_style: 'Not Decided',
      preferred_colours: '',
      domain_status: 'Domain not decided',
      domain_name: '',
      hosting_status: 'Hosting not decided',
      hosting_provider: '',
      project_status: 'New Request',
      public_status_note: '',
      private_admin_note: '',
      project_price: '',
      advance_required: '',
      amount_received: '',
      payment_status: 'Pending',
      payment_method: 'Not Decided',
      transaction_id: '',
      payment_received_date: '',
      payment_notes: '',
      launch_status: 'Not Launched',
      live_website_url: '',
      launch_date: '',
      is_draft: false,
      checklist: {
        "Customer Requirements Confirmed": false,
        "Quotation Sent": false,
        "Advance Received": false,
        "Logo Received": false,
        "Content Received": false,
        "Domain Connected": false,
        "Website Design Completed": false,
        "Mobile Testing Completed": false,
        "Forms Tested": false,
        "SEO Added": false,
        "Customer Approval Received": false,
        "Website Launched": false,
        "Tracking ID Shared": false,
        "Support Policy Shared": false
      },
      documents: []
    });
    setDuplicateWarning(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (servicesList.length === 0) return;
    
    // Prepare header
    const headers = [
      'Service ID', 'Customer Name', 'Email', 'Mobile', 'WhatsApp', 'City', 'Business Name', 
      'Category', 'Project Status', 'Price (INR)', 'Received (INR)', 'Balance (INR)', 
      'Payment Status', 'Launch Status', 'Support Status', 'Created Date'
    ];

    const rows = servicesList.map(s => [
      s.service_id,
      `"${s.customer_name.replace(/"/g, '""')}"`,
      s.customer_email || '',
      s.customer_mobile,
      s.customer_whatsapp || '',
      s.city,
      `"${s.business_name.replace(/"/g, '""')}"`,
      s.website_category,
      s.project_status,
      s.project_price,
      s.amount_received,
      s.remaining_balance,
      s.payment_status,
      s.launch_status,
      s.support_status,
      s.created_at.split('T')[0]
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VPANSAK_services_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Search logic for services list
  const getFilteredServices = () => {
    let list = [...servicesList];

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.service_id.toLowerCase().includes(q) ||
        s.customer_name.toLowerCase().includes(q) ||
        (s.customer_email && s.customer_email.toLowerCase().includes(q)) ||
        s.customer_mobile.includes(q) ||
        (s.customer_whatsapp && s.customer_whatsapp.includes(q)) ||
        s.business_name.toLowerCase().includes(q) ||
        (s.live_website_url && s.live_website_url.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filterProjectStatus !== 'All') {
      list = list.filter(s => s.project_status === filterProjectStatus);
    }

    // Payment status filter
    if (filterPaymentStatus !== 'All') {
      list = list.filter(s => s.payment_status === filterPaymentStatus);
    }

    // Category filter
    if (filterCategory !== 'All') {
      list = list.filter(s => s.website_category === filterCategory);
    }

    // Launch status filter
    if (filterLaunchStatus !== 'All') {
      list = list.filter(s => s.launch_status === filterLaunchStatus);
    }

    // Support status filter
    if (filterSupportStatus !== 'All') {
      list = list.filter(s => s.support_status === filterSupportStatus);
    }

    // City filter
    if (filterCity.trim()) {
      list = list.filter(s => s.city.toLowerCase().includes(filterCity.toLowerCase()));
    }

    // Sorting
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Handle nulls
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortDirection === 'asc' 
          ? valA - valB 
          : valB - valA;
      }
    });

    return list;
  };

  const filteredServices = getFilteredServices();

  // Categories list
  const websiteCategories = [
    "Shop Website", "Business Website", "E-commerce Website", "Coaching Institute Website", 
    "School Website", "College Website", "Restaurant Website", "Hotel Website", 
    "Clinic or Hospital Website", "Portfolio Website", "Startup Website", "NGO or Foundation Website", 
    "Real Estate Website", "Event Website", "Gym Website", "Salon Website", 
    "Travel Website", "Blog or News Website", "Personal Website", "Other"
  ];

  const projectStatuses = [
    "New Request", "Contact Pending", "In Discussion", "Quotation Sent", "Waiting for Advance Payment",
    "Payment Partially Received", "Payment Received", "Content Pending", "Design in Progress",
    "Development in Progress", "Customer Review", "Changes Requested", "Ready for Launch",
    "Launched", "On Hold", "Cancelled", "Completed"
  ];

  const paymentStatuses = ["Not Decided", "Pending", "Advance Received", "Partially Paid", "Fully Paid", "Refunded", "Cancelled"];
  const paymentMethods = ["Cash", "UPI", "Bank Transfer", "Razorpay", "Other"];

  // Pages Checkbox list
  const requiredPagesList = [
    "Home", "About", "Services", "Products", "Gallery", "Contact", "Login", "Signup", 
    "User Dashboard", "Admin Dashboard", "Seller Dashboard", "Booking", "Online Payment", 
    "Order Tracking", "Blog", "Testimonials", "FAQ", "Privacy Policy", "Terms and Conditions", "Other"
  ];

  // Features Checkbox list
  const requiredFeaturesList = [
    "WhatsApp Integration", "Contact Form", "Google Maps", "Product Management", "Shopping Cart", 
    "Online Payment", "User Authentication", "Admin Panel", "Booking System", "Gallery", 
    "Reviews", "OTP Verification", "Email Notifications", "AI Chat", "Search", 
    "Multi-language Support", "Other"
  ];

  // View state auth checking loading state
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-gray-100">
        <RefreshCw className="animate-spin text-cyan-400 mb-4" size={40} />
        <p className="text-gray-400 font-mono text-sm">Authenticating admin session...</p>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 pt-10">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              VPANSAK &lt;/&gt; STUDIO
            </h2>
            <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">Admin Control Portal</p>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto">
              <Lock size={20} />
            </div>
            
            <h3 className="text-xl font-bold text-center text-white">Owner Secure Login</h3>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 leading-relaxed text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Authorized Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="xyz@abc.com"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm placeholder-gray-600 transition-colors text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm placeholder-gray-600 transition-colors text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 btn-glow transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <span>Secure Login</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row pt-20">
      
      {/* Sidebar Dashboard Navigation */}
      <aside className="w-full lg:w-64 bg-gray-950/80 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between shrink-0 p-5 space-y-8">
        <div className="space-y-6">
          <div className="pb-4 border-b border-white/5 hidden lg:block">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase font-mono block">Signed In As:</span>
            <span className="text-xs text-gray-300 font-mono truncate block max-w-full">{user.email}</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('create-service')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'create-service' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FilePlus2 size={18} />
              <span>Create Service</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('all-services');
                setFilterProjectStatus('All');
                setFilterLaunchStatus('All');
                setFilterSupportStatus('All');
                setFilterPaymentStatus('All');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'all-services' && filterProjectStatus === 'All' && filterLaunchStatus === 'All' && filterSupportStatus === 'All' && filterPaymentStatus === 'All'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListFilter size={18} />
              <span>All Services</span>
            </button>

            <div className="pt-2 pb-1 text-[10px] uppercase font-bold tracking-widest font-mono text-gray-500 pl-4">Filters</div>

            <button
              onClick={() => {
                setActiveTab('all-services');
                setFilterProjectStatus('All');
                setFilterLaunchStatus('All');
                setFilterSupportStatus('Active');
                setFilterPaymentStatus('All');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'all-services' && filterSupportStatus === 'Active' ? 'bg-cyan-500/5 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Support Period</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('all-services');
                setFilterProjectStatus('All');
                setFilterLaunchStatus('All');
                setFilterSupportStatus('Expired');
                setFilterPaymentStatus('All');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'all-services' && filterSupportStatus === 'Expired' ? 'bg-cyan-500/5 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Expired Support</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('all-services');
                setFilterProjectStatus('All');
                setFilterLaunchStatus('Launched');
                setFilterSupportStatus('All');
                setFilterPaymentStatus('All');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'all-services' && filterLaunchStatus === 'Launched' ? 'bg-cyan-500/5 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Launched Websites</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('all-services');
                setFilterProjectStatus('All');
                setFilterLaunchStatus('All');
                setFilterSupportStatus('All');
                setFilterPaymentStatus('Pending');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'all-services' && filterPaymentStatus === 'Pending' ? 'bg-cyan-500/5 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer mt-4 ${
                activeTab === 'settings' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout Portal</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto">

        {/* Global Search Bar (Only shown in dashboard / all-services) */}
        {activeTab !== 'create-service' && activeTab !== 'settings' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, Customer, Business, Mobile, URL..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-900/60 border border-white/5 hover:border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm placeholder-gray-500 text-white"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchServices}
                className="px-3.5 py-2.5 bg-gray-900 border border-white/5 hover:bg-gray-850 text-white rounded-xl text-xs flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                title="Reload Live Database"
              >
                <RefreshCw size={14} className={loadingServices ? "animate-spin text-cyan-400" : ""} />
                <span>Reload</span>
              </button>
              
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-gray-900 border border-white/5 hover:bg-gray-850 text-white rounded-xl text-xs flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Studio Admin Dashboard</h2>
              <p className="text-xs text-gray-400 mt-1">Live studio metadata statistics overview of customer project databases.</p>
            </div>

            {/* Live Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Total Customers', val: stats.totalCustomers, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
                { title: 'Total Service Requests', val: stats.totalRequests, icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
                { title: 'New Requests', val: stats.newRequests, icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10' },
                { title: 'In Discussion', val: stats.inDiscussion, icon: MessageSquare, color: 'text-cyan-400 bg-cyan-500/10' },
                { title: 'Dev in Progress', val: stats.devInProgress, icon: Play, color: 'text-cyan-400 bg-cyan-500/10' },
                { title: 'Waiting for Customer', val: stats.waitingForCustomer, icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
                { title: 'Ready for Launch', val: stats.readyForLaunch, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
                { title: 'Launched Websites', val: stats.launchedWebsites, icon: Globe, color: 'text-emerald-400 bg-emerald-500/10' },
                { title: 'Active Free Support', val: stats.activeSupport, icon: Clock, color: 'text-emerald-400 bg-emerald-500/10' },
                { title: 'Expired Support', val: stats.expiredSupport, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10' },
                { title: 'Pending Payments', val: stats.pendingPayments, icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10' },
                { title: 'Received Payments', val: stats.receivedPayments, icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' }
              ].map((card, idx) => (
                <div key={idx} className="glass-card rounded-2xl border border-white/5 p-5 space-y-4 hover:border-cyan-500/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{card.title}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                      <card.icon size={16} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{card.val}</div>
                </div>
              ))}
            </div>

            {/* Quick list of recent items */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
                <RefreshCw size={16} className="text-cyan-400" />
                <span>Recent Projects Queue</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 font-bold">
                      <th className="py-3 px-2">Service ID</th>
                      <th className="py-3 px-2">Customer</th>
                      <th className="py-3 px-2">Brand / Business</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Created On</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {filteredServices.slice(0, 10).map((srv) => (
                      <tr key={srv.id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-cyan-400">{srv.service_id}</td>
                        <td className="py-3 px-2 font-semibold text-white">{srv.customer_name}</td>
                        <td className="py-3 px-2">{srv.business_name}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            srv.project_status === 'Launched' || srv.project_status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}>
                            {srv.project_status}
                          </span>
                        </td>
                        <td className="py-3 px-2">{new Date(srv.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => onNavigateToService(srv.service_id)}
                            className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded hover:bg-cyan-500/20 transition-all font-semibold cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredServices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-gray-500">No service records found. Try reload or adding a new record.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE SERVICE */}
        {activeTab === 'create-service' && (
          <div className="space-y-10 max-w-4xl">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Create Website Service Record</h2>
              <p className="text-xs text-gray-400 mt-1">Submit custom business requirements discussed over phone, WhatsApp or in person to generate tracking keys.</p>
            </div>

            {/* Notifications */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccessMsg && (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle size={18} />
                  <span>{submitSuccessMsg}</span>
                </div>
                {createdServiceId && (
                  <div className="p-3 bg-gray-900 border border-white/5 rounded-xl font-mono text-sm space-y-2 text-white">
                    <div className="flex justify-between items-center">
                      <span>Service ID Generated: <strong>{createdServiceId}</strong></span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdServiceId);
                          alert('Service ID Copied!');
                        }}
                        className="p-1.5 hover:bg-white/5 rounded text-cyan-400 cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {duplicateWarning && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 flex items-start gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            {/* Input Form */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 space-y-8">
              
              {/* Section 1: Customer Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">1. Customer General Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Customer Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      placeholder="e.g. Alok Singh"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Customer Email</label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                      placeholder="e.g. customer@email.com"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Customer Mobile Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.customer_mobile}
                      onChange={handleMobileChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-gray-400 font-semibold">WhatsApp Number</label>
                      <label className="text-[10px] text-gray-400 flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sameAsMobile}
                          onChange={handleSameAsMobileChange}
                          className="accent-cyan-500"
                        />
                        <span>Same as mobile</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={formData.sameAsMobile}
                      value={formData.customer_whatsapp}
                      onChange={(e) => setFormData({...formData, customer_whatsapp: e.target.value})}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 bg-gray-900/60 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Preferred Contact Method</label>
                    <select
                      value={formData.preferred_contact_method}
                      onChange={(e) => setFormData({...formData, preferred_contact_method: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g. Lucknow"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="Uttar Pradesh"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Customer Address</label>
                    <input
                      type="text"
                      value={formData.customer_address}
                      onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                      placeholder="Full postal address"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Business details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">2. Brand & Business Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Business or Brand Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                      placeholder="e.g. Acme Corporation"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Website Category <span className="text-red-500">*</span></label>
                    <select
                      value={formData.website_category}
                      onChange={(e) => setFormData({...formData, website_category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      {websiteCategories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Business Description <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      value={formData.business_description}
                      onChange={(e) => setFormData({...formData, business_description: e.target.value})}
                      placeholder="Describe what the company or startup does, who their customers are..."
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Business Location</label>
                    <input
                      type="text"
                      value={formData.business_location}
                      onChange={(e) => setFormData({...formData, business_location: e.target.value})}
                      placeholder="e.g. Lucknow, UP"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Existing Website Status</label>
                    <select
                      value={formData.existing_website_status}
                      onChange={(e) => setFormData({...formData, existing_website_status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      <option value="No existing website">No existing website</option>
                      <option value="Existing website needs redesign">Existing website needs redesign</option>
                      <option value="Existing website needs new features">Existing website needs new features</option>
                    </select>
                  </div>

                  {formData.existing_website_status !== 'No existing website' && (
                    <>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Existing Website URL</label>
                        <input
                          type="text"
                          value={formData.existing_website_url}
                          onChange={(e) => setFormData({...formData, existing_website_url: e.target.value})}
                          placeholder="e.g. www.existingwebsite.com"
                          className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Existing Website Issues</label>
                        <textarea
                          rows={2}
                          value={formData.existing_website_issues}
                          onChange={(e) => setFormData({...formData, existing_website_issues: e.target.value})}
                          placeholder="Describe bugs, design failures, loading speeds in the existing structure..."
                          className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 3: Project Requirements */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">3. Website Specifications</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Website Detailed Requirements <span className="text-red-500">*</span></label>
                    <textarea
                      rows={4}
                      value={formData.website_requirements}
                      onChange={(e) => setFormData({...formData, website_requirements: e.target.value})}
                      placeholder="Detailed features scope, custom workflow designs..."
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  {/* Required Pages */}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Required Website Pages (Multi-select)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {requiredPagesList.map((p, i) => (
                        <label key={i} className="flex items-center gap-2 p-2 rounded bg-gray-900 border border-white/5 text-xs text-gray-300 cursor-pointer hover:border-cyan-500/30">
                          <input
                            type="checkbox"
                            checked={formData.required_pages.includes(p)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                required_pages: checked 
                                  ? [...prev.required_pages, p] 
                                  : prev.required_pages.filter(x => x !== p)
                              }));
                            }}
                            className="accent-cyan-500"
                          />
                          <span>{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Required Features */}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-2">Required Custom Features (Multi-select)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {requiredFeaturesList.map((f, i) => (
                        <label key={i} className="flex items-center gap-2 p-2 rounded bg-gray-900 border border-white/5 text-xs text-gray-300 cursor-pointer hover:border-cyan-500/30">
                          <input
                            type="checkbox"
                            checked={formData.required_features.includes(f)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                required_features: checked 
                                  ? [...prev.required_features, f] 
                                  : prev.required_features.filter(x => x !== f)
                              }));
                            }}
                            className="accent-cyan-500"
                          />
                          <span>{f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Website Design Style</label>
                      <select
                        value={formData.website_style}
                        onChange={(e) => setFormData({...formData, website_style: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                      >
                        <option value="Not Decided">Not Decided</option>
                        <option value="Modern Professional">Modern Professional</option>
                        <option value="Premium Luxury">Premium Luxury</option>
                        <option value="Simple Clean">Simple Clean</option>
                        <option value="Dark Developer Theme">Dark Developer Theme</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Colourful Creative">Colourful Creative</option>
                        <option value="Traditional Business">Traditional Business</option>
                        <option value="Custom Design">Custom Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Preferred Colours (Optional)</label>
                      <input
                        type="text"
                        value={formData.preferred_colours}
                        onChange={(e) => setFormData({...formData, preferred_colours: e.target.value})}
                        placeholder="e.g. Royal Blue & Gold, #FF5733"
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Domain Status</label>
                      <select
                        value={formData.domain_status}
                        onChange={(e) => setFormData({...formData, domain_status: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                      >
                        <option value="Domain not decided">Domain not decided</option>
                        <option value="Customer already has a domain">Customer already has a domain</option>
                        <option value="VPANSAK Studio will arrange domain">VPANSAK Studio will arrange domain</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Hosting Status</label>
                      <select
                        value={formData.hosting_status}
                        onChange={(e) => setFormData({...formData, hosting_status: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                      >
                        <option value="Hosting not decided">Hosting not decided</option>
                        <option value="Customer already has hosting">Customer already has hosting</option>
                        <option value="Free hosting setup">Free hosting setup</option>
                        <option value="Paid hosting required">Paid hosting required</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Domain Name (Optional)</label>
                      <input
                        type="text"
                        value={formData.domain_name}
                        onChange={(e) => setFormData({...formData, domain_name: e.target.value})}
                        placeholder="e.g. example.com"
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Hosting Provider (Optional)</label>
                      <input
                        type="text"
                        value={formData.hosting_provider}
                        onChange={(e) => setFormData({...formData, hosting_provider: e.target.value})}
                        placeholder="e.g. Hostinger, AWS, Vercel"
                        className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Project Management & Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">4. Project Status & Notes</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Project Status</label>
                    <select
                      value={formData.project_status}
                      onChange={(e) => setFormData({...formData, project_status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      {projectStatuses.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Website Launch Status</label>
                    <select
                      value={formData.launch_status}
                      onChange={(e) => setFormData({...formData, launch_status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      <option value="Not Launched">Not Launched</option>
                      <option value="Launched">Launched</option>
                    </select>
                  </div>

                  {formData.launch_status === 'Launched' && (
                    <>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Live Website URL <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.live_website_url}
                          onChange={(e) => setFormData({...formData, live_website_url: e.target.value})}
                          placeholder="e.g. https://www.yourdomain.com"
                          className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Launch Date (Optional, defaults to today)</label>
                        <input
                          type="date"
                          value={formData.launch_date}
                          onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
                          className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Public Status Note (Customers see this publicly)</label>
                    <textarea
                      rows={2}
                      value={formData.public_status_note}
                      onChange={(e) => setFormData({...formData, public_status_note: e.target.value})}
                      placeholder="e.g. Homepage design is complete. Product details are awaited from the customer."
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Private Admin Note (Customers NEVER see this)</label>
                    <textarea
                      rows={2}
                      value={formData.private_admin_note}
                      onChange={(e) => setFormData({...formData, private_admin_note: e.target.value})}
                      placeholder="Internal progress updates, developer references..."
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm transition-colors text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Payments details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">5. Payment Management</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Project Price (INR)</label>
                    <input
                      type="number"
                      value={formData.project_price}
                      onChange={(e) => setFormData({...formData, project_price: e.target.value})}
                      placeholder="e.g. 15000"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Advance Required (INR)</label>
                    <input
                      type="number"
                      value={formData.advance_required}
                      onChange={(e) => setFormData({...formData, advance_required: e.target.value})}
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Amount Received (INR)</label>
                    <input
                      type="number"
                      value={formData.amount_received}
                      onChange={(e) => setFormData({...formData, amount_received: e.target.value})}
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Payment Status</label>
                    <select
                      value={formData.payment_status}
                      onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      {paymentStatuses.map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Payment Method</label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    >
                      {paymentMethods.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Transaction ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.transaction_id}
                      onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                      placeholder="e.g. TXN9823412"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Payment Received Date</label>
                    <input
                      type="date"
                      value={formData.payment_received_date}
                      onChange={(e) => setFormData({...formData, payment_received_date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Payment Notes (Private internal logs)</label>
                    <input
                      type="text"
                      value={formData.payment_notes}
                      onChange={(e) => setFormData({...formData, payment_notes: e.target.value})}
                      placeholder="e.g. advance received via Google Pay UPI, pending launch remaining balance"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Assets folder & checklists */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-2 font-mono">6. Assets & Internal Checklist</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Checklist */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-400 font-semibold block">Internal Developer Checklist</label>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto p-3 rounded-xl bg-gray-900/60 border border-white/5">
                      {Object.keys(formData.checklist).map((item) => (
                        <label key={item} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={formData.checklist[item]}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                checklist: {
                                  ...prev.checklist,
                                  [item]: checked
                                }
                              }));
                            }}
                            className="accent-cyan-500 shrink-0"
                          />
                          <span className={formData.checklist[item] ? 'line-through text-gray-500' : ''}>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Customer files & assets */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-400 font-semibold block">Store Customer Documents / Folder Links</label>
                    
                    <div className="space-y-2 p-3 rounded-xl bg-gray-900/60 border border-white/5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          placeholder="Link Title (e.g. Logo, Drive)"
                          className="px-3 py-1.5 bg-gray-850 border border-white/10 rounded focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          value={documentUrl}
                          onChange={(e) => setDocumentUrl(e.target.value)}
                          placeholder="URL (https://...)"
                          className="px-3 py-1.5 bg-gray-850 border border-white/10 rounded focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-gray-400">
                          <input
                            type="checkbox"
                            checked={documentPublic}
                            onChange={(e) => setDocumentPublic(e.target.checked)}
                            className="accent-cyan-500"
                          />
                          <span>Visible to customer publicly</span>
                        </label>
                        
                        <button
                          type="button"
                          onClick={addDocumentToForm}
                          className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded hover:bg-cyan-500/25 transition-colors font-bold flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Add Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Links logs */}
                    {formData.documents.length > 0 && (
                      <div className="space-y-1 bg-gray-900/30 p-2.5 rounded-lg border border-white/5 max-h-32 overflow-y-auto">
                        {formData.documents.map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-1 bg-white/3 rounded hover:bg-white/5">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate max-w-[200px] flex items-center gap-1">
                              <FolderOpen size={10} />
                              <span>{doc.title}</span>
                            </a>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] uppercase px-1 rounded ${doc.is_public ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {doc.is_public ? 'Public' : 'Private'}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDocumentFromForm(idx)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={loginLoading}
                  onClick={() => handleSaveService(true)}
                  className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loginLoading ? "animate-spin text-cyan-400" : ""} />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  disabled={loginLoading}
                  onClick={() => handleSaveService(false)}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/30 btn-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Create Website Service</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: ALL SERVICES LIST */}
        {activeTab === 'all-services' && (
          <div className="space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">All Website Projects</h2>
              <p className="text-xs text-gray-400 mt-1">Search, sort, filter and edit website service logs in Supabase database.</p>
            </div>

            {/* Filter Drawer */}
            <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-sm font-bold text-white uppercase tracking-wider font-mono">
                <ListFilter size={16} className="text-cyan-400" />
                <span>Filters & Sorting</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Project Status</label>
                  <select
                    value={filterProjectStatus}
                    onChange={(e) => setFilterProjectStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="All">All</option>
                    {projectStatuses.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Payment Status</label>
                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="All">All</option>
                    {paymentStatuses.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Website Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="All">All</option>
                    {websiteCategories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Launch Status</label>
                  <select
                    value={filterLaunchStatus}
                    onChange={(e) => setFilterLaunchStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="All">All</option>
                    <option value="Not Launched">Not Launched</option>
                    <option value="Launched">Launched</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Support Period</label>
                  <select
                    value={filterSupportStatus}
                    onChange={(e) => setFilterSupportStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">City Filter</label>
                  <input
                    type="text"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white font-light"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Sort By</label>
                  <select
                    value={sortField}
                    onChange={(e: any) => setSortField(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="created_at">Creation Date</option>
                    <option value="launch_date">Launch Date</option>
                    <option value="support_end_date">Support Expiry Date</option>
                    <option value="project_price">Project Price</option>
                    <option value="remaining_balance">Remaining Balance</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Order</label>
                  <select
                    value={sortDirection}
                    onChange={(e: any) => setSortDirection(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-white/5 rounded-lg text-white"
                  >
                    <option value="desc">Newest / Highest</option>
                    <option value="asc">Oldest / Lowest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Results Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="glass-card rounded-2xl border border-white/5 p-5 hover:border-cyan-500/20 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                          {service.service_id}
                        </span>
                        {service.is_draft && (
                          <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded ml-1.5 font-bold">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        service.project_status === 'Launched' || service.project_status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {service.project_status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-white">{service.business_name}</h4>
                      <p className="text-xs text-gray-400">Customer: <strong className="text-gray-300">{service.customer_name}</strong></p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 font-light bg-gray-900/40 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span>Contact: </span>
                        <span className="text-gray-300 font-mono block">{service.customer_mobile}</span>
                      </div>
                      <div>
                        <span>Price / Balance: </span>
                        <span className="text-gray-300 font-mono block">₹{service.project_price} / <strong className="text-amber-400">₹{service.remaining_balance}</strong></span>
                      </div>
                      <div>
                        <span>Launch: </span>
                        <span className={`block font-semibold ${service.launch_status === 'Launched' ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {service.launch_status === 'Launched' ? service.launch_date : 'Not Launched'}
                        </span>
                      </div>
                      <div>
                        <span>Support: </span>
                        <span className={`block font-semibold ${
                          service.support_status === 'Active' ? 'text-emerald-400' : 
                          service.support_status === 'Expired' ? 'text-red-400' : 'text-gray-500'
                        }`}>
                          {service.support_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 font-light">Created: {new Date(service.created_at).toLocaleDateString('en-IN')}</span>
                    
                    <button
                      onClick={() => onNavigateToService(service.service_id)}
                      className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Manage Project
                    </button>
                  </div>
                </div>
              ))}

              {filteredServices.length === 0 && (
                <div className="col-span-2 text-center py-16 text-gray-500 text-sm glass-card border-dashed border-white/10 rounded-2xl">
                  No matching services or customer profiles found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-xl">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Studio Admin Settings</h2>
              <p className="text-xs text-gray-400 mt-1">Configure global parameters and security privacy flags for the customer tracking portals.</p>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Customer Portal Settings</h3>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hidePaymentsSetting}
                    onChange={(e) => setHidePaymentsSetting(e.target.checked)}
                    className="accent-cyan-500 mt-1 shrink-0"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">Hide all payments from Public Customer Tracking</span>
                    <span className="text-xs text-gray-400 font-light leading-relaxed">
                      If enabled, customers tracking their project will not see the project price, amount received, or remaining balance amounts. Only their payment status (e.g. "Pending", "Fully Paid") will be visible.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="button"
                  disabled={settingsLoading}
                  onClick={saveStudioSettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {settingsLoading ? <RefreshCw className="animate-spin" size={14} /> : null}
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
