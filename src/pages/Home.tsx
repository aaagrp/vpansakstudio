import React, { useState, useRef } from 'react';
import { 
  Building, ShoppingBag, ShoppingCart, GraduationCap, Utensils, 
  Briefcase, Rocket, Code, ChevronDown, ChevronUp, Check, 
  Sparkles, CheckCircle2, ShieldCheck, Zap, Headphones, 
  Layers, Smile, RefreshCw, Send, Smartphone, Globe, Info, MessageSquare
} from 'lucide-react';
import { Modal } from '../components/Modal';

// Categories mapping to form dropdown option
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

const CATEGORIES = Object.keys(CATEGORY_MAP);

export const Home: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);

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
  const handleConfirmSubmit = () => {
    setIsModalOpen(false);

    // Format WhatsApp Message
    const msg = `Hello VPANSAK </> STUDIO,

I want to request a website.

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
VPANSAK </> STUDIO`;

    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/917380869635?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  // Category selection handler (from Category Grid Cards)
  const handleCategorySelect = (category: string) => {
    const formOption = CATEGORY_MAP[category];
    setFormData(prev => ({ ...prev, websiteCategory: formOption }));
    setErrors(prev => ({ ...prev, websiteCategory: '' }));
    
    // Smooth scroll to request form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I request a website?",
      a: "Fill out the website requirement form and send the details through WhatsApp."
    },
    {
      q: "What happens after I submit the form?",
      a: "VPANSAK Studio will contact you to discuss your website requirements, pricing and timeline."
    },
    {
      q: "Can you build a website for a small shop?",
      a: "Yes. Websites can be created for shops, coaching institutes, restaurants, businesses, professionals and other work."
    },
    {
      q: "Can you create an online shopping website?",
      a: "Yes. E-commerce websites with products, cart, orders and payment features can be developed."
    },
    {
      q: "Do I need a domain and hosting?",
      a: "No. If you do not have them, VPANSAK Studio can guide you during the consultation."
    },
    {
      q: "Can I request a custom feature?",
      a: "Yes. Mention the required custom functionality in the additional requirements field."
    },
    {
      q: "Is the price fixed?",
      a: "No. The final cost will depend on the pages, design and features required."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      
      {/* Subtle Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-soft-pulse-1" />
      <div className="absolute top-2/3 right-1/10 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-soft-pulse-2" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-36 border-b border-gray-900 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 font-medium mb-6 animate-pulse-slow">
            <Sparkles size={14} />
            <span>Modern Web Development Agency</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Need a Website for <br className="hidden md:inline" /> Your Business?
            <span className="block mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              VPANSAK Studio Will Build It For You
            </span>
          </h1>

          {/* Supporting taglines */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-4 leading-relaxed font-light">
            “Whether you own a shop, coaching institute, restaurant, startup, school, clinic or any other business, share your requirements with us and get a professional website made for your work.”
          </p>
          <p className="max-w-2xl mx-auto text-sm text-cyan-400/80 mb-10 tracking-wide font-medium uppercase">
            Professional Websites for Shops, Businesses, Startups and Personal Brands
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300"
            >
              Request Your Website
            </button>
            <a
              href="https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20a%20website%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all duration-300"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/5">
            {[
              { label: 'Mobile-Friendly Design', icon: Smartphone },
              { label: 'Modern User Interface', icon: Layers },
              { label: 'Fast Performance', icon: Zap },
              { label: 'Custom Website Development', icon: Code }
            ].map((pt, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-400">
                <pt.icon size={16} className="text-cyan-400 shrink-0 mb-1 md:mb-0" />
                <span className="text-sm font-medium text-center md:text-left">{pt.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Our Website Development Services
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              We design and build bespoke digital solutions tailored to your business model. Every site is custom crafted for speed, UX, and conversion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Business Website',
                desc: 'Professional websites for businesses, companies and service providers.',
                icon: Building,
                color: 'from-blue-500/20 to-blue-500/0 border-blue-500/30'
              },
              {
                title: 'Shop Website',
                desc: 'Digital presence for local shops, stores and sellers.',
                icon: ShoppingBag,
                color: 'from-cyan-500/20 to-cyan-500/0 border-cyan-500/30'
              },
              {
                title: 'E-commerce Website',
                desc: 'Online shopping website with products, cart and order management.',
                icon: ShoppingCart,
                color: 'from-purple-500/20 to-purple-500/0 border-purple-500/30'
              },
              {
                title: 'Coaching and School Website',
                desc: 'Websites for coaching institutes, schools, teachers and educational organizations.',
                icon: GraduationCap,
                color: 'from-teal-500/20 to-teal-500/0 border-teal-500/30'
              },
              {
                title: 'Restaurant Website',
                desc: 'Menu, location, contact, booking and food showcase website.',
                icon: Utensils,
                color: 'from-orange-500/20 to-orange-500/0 border-orange-500/30'
              },
              {
                title: 'Portfolio Website',
                desc: 'Personal portfolio websites for students, developers, designers and professionals.',
                icon: Briefcase,
                color: 'from-pink-500/20 to-pink-500/0 border-pink-500/30'
              },
              {
                title: 'Startup Website',
                desc: 'Modern landing pages and complete websites for startups.',
                icon: Rocket,
                color: 'from-indigo-500/20 to-indigo-500/0 border-indigo-500/30'
              },
              {
                title: 'Custom Website',
                desc: 'A fully customized website based on the customer’s requirements.',
                icon: Code,
                color: 'from-emerald-500/20 to-emerald-500/0 border-emerald-500/30'
              }
            ].map((srv, idx) => (
              <div 
                key={idx} 
                className="group glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} border flex items-center justify-center text-gray-100 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <srv.icon size={22} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{srv.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{srv.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Explore Features</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WEBSITE CATEGORIES SECTION */}
      <section id="categories" className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              What Type of Website Do You Need?
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Select a category below to automatically configure the request form and speed up your submission.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((category, idx) => (
              <button
                key={idx}
                onClick={() => handleCategorySelect(category)}
                className="group relative p-4 text-left rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 flex flex-col justify-between h-28 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  <Globe size={16} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate w-full">
                  {category}
                </span>
                <span className="absolute bottom-3 right-3 text-xs text-gray-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Get Your Website in Simple Steps
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              We have simplified the development process. From initial idea submission to full production launch in 4 easy steps.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line Connector */}
            <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/40 via-cyan-500/40 to-purple-500/40 -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: 'Step 1',
                  title: 'Fill the Form',
                  desc: 'Enter your name, business details and website requirements.',
                  color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30'
                },
                {
                  step: 'Step 2',
                  title: 'Send on WhatsApp',
                  desc: 'Your complete requirements will be sent directly to VPANSAK Studio on WhatsApp.',
                  color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30'
                },
                {
                  step: 'Step 3',
                  title: 'Consultation',
                  desc: 'Our team will contact you to discuss design, features, price and delivery time.',
                  color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30'
                },
                {
                  step: 'Step 4',
                  title: 'Website Development',
                  desc: 'After confirmation, we will design and develop your professional website.',
                  color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30'
                }
              ].map((step, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 text-center border relative">
                  {/* Step Bubble */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} border text-cyan-400 font-bold flex items-center justify-center mx-auto mb-6 shadow-md shadow-black/40`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2">{step.step}</span>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEBSITE REQUEST FORM SECTION */}
      <section id="request-form" ref={formRef} className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Tell Us About Your Website
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Fill in your details below. After submitting, your complete website requirements will be sent to VPANSAK Studio through WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 space-y-10 shadow-2xl relative">
              
              {/* Form Sub-Header: Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Personal Details</h3>
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
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.fullName ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your WhatsApp number"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 font-light">
                      Email Address <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  {/* City or Location */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                      City or Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city or business location"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.city ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>

              {/* Form Sub-Header: Business Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Building size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Business Details</h3>
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

                  {/* Website Category Dropdown */}
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
                      {Object.values(CATEGORY_MAP).filter((v, i, a) => a.indexOf(v) === i).map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.websiteCategory && <p className="text-red-500 text-xs mt-1">{errors.websiteCategory}</p>}
                  </div>
                </div>

                {/* Business Description */}
                <div className="space-y-2">
                  <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-300">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    rows={3}
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Tell us about your business, shop, organization or work"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.businessDescription ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                  />
                  {errors.businessDescription && <p className="text-red-500 text-xs mt-1">{errors.businessDescription}</p>}
                </div>

                {/* Do You Already Have a Website? */}
                <div className="space-y-3">
                  <span className="block text-sm font-medium text-gray-300">Do You Already Have a Website?</span>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      'No, I need a new website',
                      'Yes, I need a redesign',
                      'Yes, I need additional features'
                    ].map((opt, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleRadioChange('hasWebsite', opt)}
                        className={`px-4 py-3 rounded-xl text-sm border font-medium transition-all ${formData.hasWebsite === opt ? 'bg-cyan-500/10 border-cyan-400 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Existing Website URL (conditional) */}
                {formData.hasWebsite !== 'No, I need a new website' && (
                  <div className="space-y-2 animate-code-float" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
                    <label htmlFor="existingUrl" className="block text-sm font-medium text-gray-300">
                      Existing Website URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="existingUrl"
                      name="existingUrl"
                      value={formData.existingUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://mybusiness.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.existingUrl ? 'border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:ring-cyan-500/30'} focus:border-cyan-400 focus:outline-none focus:ring-4 text-white placeholder-gray-500 transition-all`}
                    />
                    {errors.existingUrl && <p className="text-red-500 text-xs mt-1">{errors.existingUrl}</p>}
                  </div>
                )}
              </div>

              {/* Form Sub-Header: Website Requirements */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
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
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${selectedPages.includes(page) ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${selectedPages.includes(page) ? 'bg-purple-500 text-white' : 'border border-gray-600'}`}>
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
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${selectedFeatures.includes(feat) ? 'bg-cyan-500 text-white' : 'border border-gray-600'}`}>
                          {selectedFeatures.includes(feat) && <Check size={12} />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    ))}
                  </div>
                </div>

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
                      <option>Modern and Professional</option>
                      <option>Premium and Luxury</option>
                      <option>Simple and Clean</option>
                      <option>Colourful and Creative</option>
                      <option>Dark Developer Style</option>
                      <option>Corporate Style</option>
                      <option>Traditional Business Style</option>
                      <option>Not Sure – Suggest a Design</option>
                    </select>
                  </div>

                  {/* Colours Field */}
                  <div className="space-y-2">
                    <label htmlFor="preferredColours" className="block text-sm font-medium text-gray-300">
                      Preferred Colours <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="preferredColours"
                      name="preferredColours"
                      value={formData.preferredColours}
                      onChange={handleInputChange}
                      placeholder="Example: Blue and white, black and gold, etc."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Logo Status Radio */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do You Have a Logo?</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Yes', 'No', 'Need Logo Design'].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('logoStatus', opt)}
                          className={`px-3 py-2 rounded-xl text-xs sm:text-sm border font-medium transition-all ${formData.logoStatus === opt ? 'bg-cyan-500/10 border-cyan-400 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Status Radio */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Do You Have Website Content?</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Yes, ready', value: 'Yes, everything is ready' },
                        { label: 'Some ready', value: 'Some content is ready' },
                        { label: 'No, need help', value: 'No, I need help' }
                      ].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('contentStatus', opt.value)}
                          className={`px-2 py-2 rounded-xl text-xs sm:text-sm border font-medium transition-all ${formData.contentStatus === opt.value ? 'bg-cyan-500/10 border-cyan-400 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Domain Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="domainStatus" className="block text-sm font-medium text-gray-300">
                      Domain Status
                    </label>
                    <select
                      id="domainStatus"
                      name="domainStatus"
                      value={formData.domainStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      <option>I already have a domain</option>
                      <option>I need a new domain</option>
                      <option>I do not know about domains</option>
                    </select>
                  </div>

                  {/* Hosting Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="hostingStatus" className="block text-sm font-medium text-gray-300">
                      Hosting Status
                    </label>
                    <select
                      id="hostingStatus"
                      name="hostingStatus"
                      value={formData.hostingStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      <option>I already have hosting</option>
                      <option>I need hosting</option>
                      <option>I do not know about hosting</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Sub-Header: Project Details */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Project Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Budget Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="approximateBudget" className="block text-sm font-medium text-gray-300">
                      Approximate Budget <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="approximateBudget"
                      name="approximateBudget"
                      value={formData.approximateBudget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      <option>Below ₹5,000</option>
                      <option>₹5,000 – ₹10,000</option>
                      <option>₹10,000 – ₹20,000</option>
                      <option>₹20,000 – ₹50,000</option>
                      <option>Above ₹50,000</option>
                      <option>Need a quotation first</option>
                    </select>
                    <p className="text-gray-500 text-xs mt-1.5">No fixed pricing is promised. Costs are finalised on consultation.</p>
                  </div>

                  {/* Delivery Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="expectedDelivery" className="block text-sm font-medium text-gray-300">
                      Expected Delivery
                    </label>
                    <select
                      id="expectedDelivery"
                      name="expectedDelivery"
                      value={formData.expectedDelivery}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      <option>As soon as possible</option>
                      <option>Within 7 days</option>
                      <option>Within 15 days</option>
                      <option>Within 30 days</option>
                      <option>No fixed deadline</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Preference Checkbox / Radio */}
                  <div className="space-y-3">
                    <span className="block text-sm font-medium text-gray-300">Preferred Contact Method</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['WhatsApp', 'Phone Call', 'Email'].map((opt, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleRadioChange('preferredContact', opt)}
                          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm border font-medium transition-all ${formData.preferredContact === opt ? 'bg-emerald-500/10 border-emerald-400 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Time Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="contactTime" className="block text-sm font-medium text-gray-300">
                      Preferred Contact Time
                    </label>
                    <select
                      id="contactTime"
                      name="contactTime"
                      value={formData.contactTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white transition-all"
                    >
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                      <option>Anytime</option>
                    </select>
                  </div>
                </div>

                {/* Additional Requirements Textarea */}
                <div className="space-y-2">
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-300">
                    Additional Requirements <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                    placeholder="Describe any special design, feature, page or functionality you need"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-white placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Form Agreement Checkbox */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group">
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
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${formData.agreed ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-gray-600 bg-white/3 group-hover:border-gray-400'}`}>
                    {formData.agreed && <Check size={14} />}
                  </div>
                  <span className="text-sm text-gray-300 select-none">
                    I confirm that the information provided is correct and I agree to be contacted by VPANSAK Studio regarding my website request. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 btn-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <Send size={18} />
                  Send Requirements on WhatsApp
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE VPANSAK STUDIO */}
      <section className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Why Choose VPANSAK &lt;/&gt; STUDIO?
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              We stand for premium work. No copy-paste templates, just tailor-made high-performance websites built around your business goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Custom Website Design', desc: 'Unique visual styling tailored to your business, layout, typography and goals.', icon: Sparkles },
              { title: 'Mobile Responsive Development', desc: 'Flawless design integration across all screen sizes (mobile, tablet, desktop).', icon: Smartphone },
              { title: 'Fast and Secure Websites', desc: 'Built using highly optimized technologies to guarantee lightning fast page speed.', icon: ShieldCheck },
              { title: 'Modern User Interface', desc: 'Clean aesthetics, glassmorphism cards, micro-interactions, and premium layouts.', icon: Layers },
              { title: 'SEO-Friendly Structure', desc: 'Proper semantic coding, optimized meta tags, titles, headings to rank better.', icon: Globe },
              { title: 'Affordable Solutions', desc: 'Honest consultation and flexible budgets aligned with your specific business size.', icon: Zap },
              { title: 'Complete Website Support', desc: 'Continuous guidance on configuration, editing, adding features, or maintenance.', icon: Headphones },
              { title: 'Direct Communication', desc: 'Chat directly with developers. No communication gaps, fast and straightforward.', icon: Smile },
              { title: 'No Generic Copy-Paste Design', desc: 'Every website has its own unique, modern codebase structured from scratch.', icon: RefreshCw },
              { title: 'Business-Focused Development', desc: 'We build websites designed to get you more orders, bookings, enquiries, or leads.', icon: CheckCircle2 }
            ].map((feat, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <feat.icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PORTFOLIO PREVIEW SECTION */}
      <section id="portfolio" className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Websites We Can Build
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Explore interactive mocks of the digital layouts and premium user experiences we can implement for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                type: 'E-commerce Store',
                gradient: 'from-blue-600 via-indigo-600 to-purple-600',
                details: 'Products Grid, Cart Drawer, Checkout, Payments integration'
              },
              {
                type: 'Coaching Institute Website',
                gradient: 'from-teal-600 via-cyan-600 to-blue-600',
                details: 'Courses catalog, Batch Schedule, Student Enquiry, Portal link'
              },
              {
                type: 'Restaurant Website',
                gradient: 'from-orange-500 via-red-500 to-pink-500',
                details: 'Menu Showcase, Reservation Booking, Google Maps, Reviews'
              },
              {
                type: 'Business Landing Page',
                gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
                details: 'Hero Showcase, Key features, Lead intake form, testimonials'
              },
              {
                type: 'Portfolio Website',
                gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
                details: 'Interactive resume, projects listing, dynamic skills tags'
              },
              {
                type: 'Service Booking Website',
                gradient: 'from-yellow-600 via-amber-600 to-orange-600',
                details: 'Calendar select, Service category, Checkout, Confirmation SMS/Email'
              }
            ].map((proj, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/5 aspect-video flex flex-col justify-end p-6 glass-card-hover"
              >
                {/* Simulated Web UI background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)]" />
                
                {/* Mini UI elements mockup wireframe overlay */}
                <div className="absolute top-4 left-4 right-4 flex gap-2 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 bg-white/10 rounded-full flex-grow ml-2" />
                </div>
                
                <div className="relative z-10">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-1">Layout Preview</span>
                  <h3 className="text-xl font-bold text-white mb-2">{proj.type}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {proj.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 btn-glow transition-all duration-300"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Everything you need to know about starting your website project with VPANSAK Studio.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-medium text-white hover:bg-white/3 transition-colors focus:outline-none"
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
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="py-24 border-b border-gray-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Let’s Build Your Website
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto mb-8 font-light">
              Website requests can be submitted anytime. Our team will contact you after reviewing your requirements.
            </p>

            <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5 mb-8">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Direct Support</span>
              <span className="text-2xl md:text-3xl font-extrabold text-cyan-400 tracking-tight select-all">
                +91 7380869635
              </span>
            </div>

            <div>
              <a
                href="https://wa.me/917380869635?text=Hello%20VPANSAK%20Studio%2C%20I%20want%20a%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-300"
              >
                <MessageSquare size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSubmit} 
      />

    </div>
  );
};
