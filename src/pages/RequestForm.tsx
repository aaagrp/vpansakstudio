import React, { useState, useEffect } from 'react';
import { Send, Check, Globe, Smile, Layers, HelpCircle, Loader2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';

interface RequestFormProps {
  preselectedCategory: string;
  setPreselectedCategory: (category: string) => void;
  setActiveView: (view: 'home' | 'services' | 'categories' | 'how-it-works' | 'request-form' | 'contact' | 'privacy' | 'terms' | 'admin' | 'admin-service-detail' | 'track', searchParams?: string) => void;
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

export const RequestForm: React.FC<RequestFormProps> = ({ 
  preselectedCategory, 
  setPreselectedCategory,
  setActiveView
}) => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    businessName: '',
    websiteCategory: '',
    businessDescription: '',
    hasWebsite: 'No, I need a new website',
    existingUrl: '',
    preferredStyle: 'Modern and Professional',
    preferredColours: '',
    logoStatus: 'No',
    contentStatus: 'No, I need help',
    domainStatus: 'I do not know about domains',
    hostingStatus: 'I do not know about hosting',
    approximateBudget: '₹5,000 – ₹10,000',
    expectedDelivery: 'Within 15 days',
    preferredContact: 'WhatsApp',
    contactTime: 'Anytime',
    additionalRequirements: '',
    agreed: false
  });

  // Selected Pages (Multi-select)
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home', 'About Us', 'Services', 'Contact Us']);
  // Selected Features (Multi-select)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['WhatsApp Contact Button', 'Contact Form', 'Social Media Links']);

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Apply preselected category on load
  useEffect(() => {
    if (preselectedCategory) {
      setFormData(prev => ({ ...prev, websiteCategory: preselectedCategory }));
      setPreselectedCategory('');
    }
  }, [preselectedCategory, setPreselectedCategory]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Radio Changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle pages selection
  const handlePageToggle = (page: string) => {
    setSelectedPages(prev => 
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  // Toggle features selection
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  // Indian Mobile Number Validation Check
  const validateMobile = (num: string) => {
    const cleaned = num.replace(/\s+/g, '').replace(/-/g, '');
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    return mobileRegex.test(cleaned);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian WhatsApp number';
    }
    if (!formData.city.trim()) newErrors.city = 'City/Location is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business or Brand Name is required';
    if (!formData.websiteCategory) newErrors.websiteCategory = 'Please select a website category';
    if (!formData.businessDescription.trim()) newErrors.businessDescription = 'Please describe your business';
    
    if (formData.hasWebsite !== 'No, I need a new website' && !formData.existingUrl.trim()) {
      newErrors.existingUrl = 'Please enter your existing website URL';
    }
    if (!formData.agreed) {
      newErrors.agreed = 'You must agree to the terms to proceed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Find first error and scroll to it
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    // No errors, open WhatsApp confirmation Modal
    setIsModalOpen(true);
  };

  // Form Confirmation -> WhatsApp Redirect
  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    setSubmitting(true);

    let generatedServiceId = '';

    try {
      const checklist = {
        "Logo": formData.logoStatus === 'Yes, I have it',
        "Photos": false,
        "Food": false,
        "Menu": false,
        "Info": true,
        "Content": formData.contentStatus === 'Yes, I have it'
      };

      const websiteRequirements = `
Preferred Style: ${formData.preferredStyle}
Preferred Colors: ${formData.preferredColours}
Approximate Budget: ${formData.approximateBudget}
Expected Delivery: ${formData.expectedDelivery}
Logo Status: ${formData.logoStatus}
Content Status: ${formData.contentStatus}
Domain Status: ${formData.domainStatus}
Hosting Status: ${formData.hostingStatus}
      `.trim();

      const privateAdminNote = `
Budget: ${formData.approximateBudget}
Expected Delivery: ${formData.expectedDelivery}
Preferred Contact Method: ${formData.preferredContact}
Preferred Contact Time: ${formData.contactTime}
      `.trim();

      const { data, error } = await supabase.rpc('submit_public_website_request', {
        p_customer_name: formData.fullName.trim(),
        p_customer_mobile: formData.mobileNumber.trim(),
        p_customer_email: formData.email.trim() || null,
        p_city: formData.city.trim(),
        p_business_name: formData.businessName.trim(),
        p_website_category: formData.websiteCategory,
        p_business_description: formData.businessDescription.trim(),
        p_existing_website_status: formData.hasWebsite,
        p_existing_website_url: formData.hasWebsite !== 'No, I need a new website' ? formData.existingUrl.trim() : null,
        p_required_pages: selectedPages,
        p_required_features: selectedFeatures,
        p_website_style: formData.preferredStyle,
        p_preferred_colours: formData.preferredColours.trim() || null,
        p_domain_status: formData.domainStatus,
        p_hosting_status: formData.hostingStatus,
        p_preferred_contact_method: formData.preferredContact,
        p_website_requirements: websiteRequirements,
        p_private_admin_note: privateAdminNote,
        p_checklist: checklist
      });

      if (error) {
        throw error;
      }

      if (data) {
        generatedServiceId = data;
      }
    } catch (dbErr) {
      console.error('Failed to save request to Supabase:', dbErr);
      // Fallback is silent so WhatsApp redirect still functions even if database fails
    }

    const msg = `Hello VPANSAK </> STUDIO,

I want to request a website.

${generatedServiceId ? `🆔 PROJECT TRACKING ID: ${generatedServiceId}\n(You can track this project directly at vps.vpansak.studio/track?serviceId=${generatedServiceId})\n` : ''}
👤 CUSTOMER DETAILS

Name: ${formData.fullName.trim()}
Mobile Number: ${formData.mobileNumber.trim()}
Email: ${formData.email.trim() || 'Not Provided'}
City/Location: ${formData.city.trim()}

🏢 BUSINESS DETAILS

Business/Brand Name: ${formData.businessName.trim()}
Website Category: ${formData.websiteCategory}
Business Description: ${formData.businessDescription.trim()}
Existing Website Status: ${formData.hasWebsite}
Existing Website URL: ${formData.hasWebsite !== 'No, I need a new website' ? formData.existingUrl.trim() : 'Not Provided'}

🌐 WEBSITE REQUIREMENTS

Required Pages: ${selectedPages.join(', ') || 'None selected'}
Required Features: ${selectedFeatures.join(', ') || 'None selected'}
Preferred Style: ${formData.preferredStyle}
Preferred Colours: ${formData.preferredColours.trim() || 'Not Specified'}
Logo Status: ${formData.logoStatus}
Content Status: ${formData.contentStatus}
Domain Status: ${formData.domainStatus}
Hosting Status: ${formData.hostingStatus}

💰 PROJECT DETAILS

Approximate Budget: ${formData.approximateBudget}
Expected Delivery: ${formData.expectedDelivery}
Preferred Contact Method: ${formData.preferredContact}
Preferred Contact Time: ${formData.contactTime}

📝 ADDITIONAL REQUIREMENTS

${formData.additionalRequirements.trim() || 'No additional requirements'}

Please contact me to discuss the website project.

Website Request Submitted Through:
VPANSAK </> STUDIO

━━━━━━━━━━━━━━━━━━━━━━

VPANSAK </> STUDIO

📞 +91 8738869635 / +91 7380869635
💬 +66 94 203 3973
✉ alook@outlook.in

Thank you for your website enquiry.
We will contact you shortly.`;

    setSubmitting(false);
    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/66942033973?text=${encodedMsg}`;
    window.open(waUrl, '_blank');

    if (generatedServiceId) {
      setActiveView('track', `serviceId=${generatedServiceId}`);
    }
  };

  // Unique categories list
  const uniqueCategories = Object.values(CATEGORY_MAP).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-gray-950 text-gray-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-soft-pulse-1" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none animate-soft-pulse-2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">Project Planner</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Website Request Form
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
            Configure your website requirements, budget, pages, and delivery schedule. Submit the details directly to our developers on WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Form Sub-Header: Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Smile size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Your Contact Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.fullName ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300">
                      WhatsApp Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-cyan-500/30 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  {/* City/Location */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                      City/Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city/state"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.city ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>

              {/* Form Sub-Header: Business Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Layers size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Business Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-300">
                      Business or Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Enter your shop, business or brand name"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.businessName ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                  </div>

                  {/* Website Category */}
                  <div className="space-y-2">
                    <label htmlFor="websiteCategory" className="block text-sm font-medium text-gray-300">
                      Website Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="websiteCategory"
                      name="websiteCategory"
                      value={formData.websiteCategory}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-900 border ${errors.websiteCategory ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white transition-all`}
                    >
                      <option value="" disabled>-- Select Category --</option>
                      {uniqueCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.websiteCategory && <p className="text-red-500 text-xs mt-1">{errors.websiteCategory}</p>}
                  </div>
                </div>

                {/* Business Description */}
                <div className="space-y-2">
                  <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-300">
                    What does your business/shop do? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly describe your services, products or work..."
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.businessDescription ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all resize-none`}
                  />
                  {errors.businessDescription && <p className="text-red-500 text-xs mt-1">{errors.businessDescription}</p>}
                </div>

                {/* Has Website status */}
                <div className="space-y-3">
                  <span className="block text-sm font-medium text-gray-300">Do you currently have a website?</span>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {[
                      'No, I need a new website',
                      'Yes, I want to redesign my website'
                    ].map((opt, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleRadioChange('hasWebsite', opt)}
                        className={`flex-1 flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all ${formData.hasWebsite === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-4 ${formData.hasWebsite === opt ? 'border-cyan-500' : 'border-gray-600'}`}>
                          {formData.hasWebsite === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Existing Website URL (conditional) */}
                {formData.hasWebsite !== 'No, I need a new website' && (
                  <div className="space-y-2 animate-code-float" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
                    <label htmlFor="existingUrl" className="block text-sm font-medium text-gray-300">
                      Existing Website Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="existingUrl"
                      name="existingUrl"
                      value={formData.existingUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. www.mybusiness.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.existingUrl ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.existingUrl && <p className="text-red-500 text-xs mt-1">{errors.existingUrl}</p>}
                  </div>
                )}
              </div>

              {/* Form Sub-Header: Website Requirements */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Globe size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Website Requirements</h3>
                </div>

                {/* Required Pages checkboxes */}
                <div className="space-y-3">
                  <span className="block text-sm font-medium text-gray-300">Required Pages (Select all that apply)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      'Home', 'About Us', 'Services', 'Products', 'Gallery', 'Contact Us',
                      'Login and Signup', 'User Dashboard', 'Admin Dashboard', 'Seller Dashboard',
                      'Online Payment', 'Order Tracking', 'Booking System', 'Blog or News',
                      'Testimonials', 'FAQ', 'Privacy Policy', 'Terms and Conditions', 'Other'
                    ].map((page, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handlePageToggle(page)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${selectedPages.includes(page) ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${selectedPages.includes(page) ? 'bg-cyan-500 text-white' : 'border border-gray-600'}`}>
                          {selectedPages.includes(page) && <Check size={12} />}
                        </div>
                        <span className="truncate">{page}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Required Features checkboxes */}
                <div className="space-y-3">
                  <span className="block text-sm font-medium text-gray-300">Required Features (Select all that apply)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      'WhatsApp Contact Button', 'Contact Form', 'Google Maps', 'Online Payment',
                      'Product Management', 'Shopping Cart', 'Order Management', 'User Login',
                      'Admin Panel', 'Appointment Booking', 'Photo Gallery', 'Video Gallery',
                      'Customer Reviews', 'Social Media Links', 'Email Notifications', 'OTP Verification',
                      'AI Chat Support', 'Multi-language Support', 'Search Feature', 'Other Custom Feature'
                    ].map((feat, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleFeatureToggle(feat)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${selectedFeatures.includes(feat) ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${selectedFeatures.includes(feat) ? 'bg-cyan-500 text-white' : 'border border-gray-600'}`}>
                          {selectedFeatures.includes(feat) && <Check size={12} />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design and Layout selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Style Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="preferredStyle" className="block text-sm font-medium text-gray-300">
                      Preferred Website Style
                    </label>
                    <select
                      id="preferredStyle"
                      name="preferredStyle"
                      value={formData.preferredStyle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      {['Modern and Professional', 'Creative and Colorful', 'Minimalist and Clean', 'Bold and Energetic'].map((sty, i) => (
                        <option key={i} value={sty}>{sty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Colours */}
                  <div className="space-y-2">
                    <label htmlFor="preferredColours" className="block text-sm font-medium text-gray-300">
                      Preferred Color Scheme (Optional)
                    </label>
                    <input
                      type="text"
                      id="preferredColours"
                      name="preferredColours"
                      value={formData.preferredColours}
                      onChange={handleInputChange}
                      placeholder="e.g. Dark Navy & Gold, White & Blue"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-cyan-500/30 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                {/* Logo & Content status */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Logo status */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do you have a Logo ready?</span>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('logoStatus', opt)}
                          className={`flex-1 flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all ${formData.logoStatus === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                          <span>{opt === 'Yes' ? 'Yes, I have a logo' : 'No, I need a logo'}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${formData.logoStatus === opt ? 'border-cyan-500' : 'border-gray-600'}`}>
                            {formData.logoStatus === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content status */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do you have website content (text/images) ready?</span>
                    <div className="flex gap-4">
                      {['Yes', 'No, I need help'].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('contentStatus', opt)}
                          className={`flex-1 flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all ${formData.contentStatus === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                          <span>{opt === 'Yes' ? 'Yes, ready' : 'No, I need help'}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${formData.contentStatus === opt ? 'border-cyan-500' : 'border-gray-600'}`}>
                            {formData.contentStatus === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Domain & Hosting status */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Domain status */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do you have a domain name?</span>
                    <div className="flex flex-col gap-2">
                      {[
                        'Yes, I already purchased a domain',
                        'No, I need a domain name purchase',
                        'I do not know about domains'
                      ].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('domainStatus', opt)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${formData.domainStatus === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-4 ${formData.domainStatus === opt ? 'border-cyan-500' : 'border-gray-600'}`}>
                            {formData.domainStatus === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hosting status */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do you have server hosting?</span>
                    <div className="flex flex-col gap-2">
                      {[
                        'Yes, I already purchased hosting',
                        'No, I need hosting configuration',
                        'I do not know about hosting'
                      ].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('hostingStatus', opt)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${formData.hostingStatus === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-4 ${formData.hostingStatus === opt ? 'border-cyan-500' : 'border-gray-600'}`}>
                            {formData.hostingStatus === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Sub-Header: Project Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <HelpCircle size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Project Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Budget Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="approximateBudget" className="block text-sm font-medium text-gray-300">
                      Approximate Budget (INR)
                    </label>
                    <select
                      id="approximateBudget"
                      name="approximateBudget"
                      value={formData.approximateBudget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      {['₹5,000 – ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹40,000', '₹40,000+'].map((bd, i) => (
                        <option key={i} value={bd}>{bd}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Timeline Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="expectedDelivery" className="block text-sm font-medium text-gray-300">
                      Expected Project Delivery Time
                    </label>
                    <select
                      id="expectedDelivery"
                      name="expectedDelivery"
                      value={formData.expectedDelivery}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      {['Within 7 days (Fast-track)', 'Within 15 days', 'Within 30 days', 'No specific rush'].map((del, i) => (
                        <option key={i} value={del}>{del}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Preferred Contact Method */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Preferred contact method?</span>
                    <div className="flex gap-3">
                      {['WhatsApp', 'Phone Call', 'Email'].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('preferredContact', opt)}
                          className={`flex-1 flex items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${formData.preferredContact === opt ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Best time to contact */}
                  <div className="space-y-2">
                    <label htmlFor="contactTime" className="block text-sm font-medium text-gray-300">
                      Best Time to Contact
                    </label>
                    <select
                      id="contactTime"
                      name="contactTime"
                      value={formData.contactTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      {['Anytime', 'Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 8 PM)'].map((ct, i) => (
                        <option key={i} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div className="space-y-2">
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-300">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter any other specific features, references, pages, or layout needs..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-cyan-500/30 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      id="agreed"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, agreed: e.target.checked }));
                        if (errors.agreed) setErrors(prev => ({ ...prev, agreed: '' }));
                      }}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.agreed ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white/3 border-white/10 group-hover:border-cyan-400/50'}`}>
                      {formData.agreed && <Check size={14} />}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    I agree that VPANSAK Studio will review my website requirements to provide pricing, and I understand this submission will launch WhatsApp to send the details.
                  </span>
                </label>
                {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 btn-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Creating Tracking Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Requirements on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSubmit} 
      />
    </div>
  );
};
