import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, Receipt, Sparkles, Check, Download, ClipboardList, Briefcase, IndianRupee } from 'lucide-react';
import Header from './components/layout/Header';
import BillingForm from './components/checkout/BillingForm';
import OrderSummary from './components/checkout/OrderSummary';

interface BillingDetails {
  companyName: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  premiseHouse: string;
  street: string;
  state: string;
  city: string;
  country: string;
  pinCode: string;
}

interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: string;
  method: string;
}

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'checkout' | 'plans'>('checkout');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Shared Billing States
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    companyName: 'abhigyan',
    email: 'abhigyan.pandey@getreelax.com',
    gstNumber: '',
    panNumber: '',
    premiseHouse: '',
    street: '',
    state: '',
    city: '',
    country: 'India',
    pinCode: '',
  });

  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [isBillingSaved, setIsBillingSaved] = useState(false);

  // Pricing & Checkout States
  const [selectedPlan, setSelectedPlan] = useState<'startup' | 'growth'>('startup');
  const [walletApplied, setWalletApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('WELCOME20');
  const [customCouponText, setCustomCouponText] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Interaction flag: Starts in Figma Mode to show mockup values exactly.
  const [isFigmaMode, setIsFigmaMode] = useState(true);

  // Modal & Overlay States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Campaign Form State
  const [campaignName, setCampaignName] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('');
  const [campaignNiche, setCampaignNiche] = useState('');
  const [campaignErrors, setCampaignErrors] = useState<Record<string, string>>({});
  const [campaignToast, setCampaignToast] = useState<string | null>(null);

  // Billing History state
  const [billingHistory, setBillingHistory] = useState<Invoice[]>([
    { id: 'INV-2026-003', date: '2026-05-19', plan: 'Startup Plan (Quarterly)', amount: '₹16,078.64', status: 'Paid', method: 'UPI' },
    { id: 'INV-2026-002', date: '2026-02-19', plan: 'Startup Plan (Quarterly)', amount: '₹16,078.64', status: 'Paid', method: 'Credit Card' },
    { id: 'INV-2026-001', date: '2025-11-19', plan: 'Startup Plan (Quarterly)', amount: '₹16,078.64', status: 'Paid', method: 'Credit Card' }
  ]);

  const handleInteraction = () => {
    setIsFigmaMode(false);
  };

  // Calculations
  const pricingData = useMemo(() => {
    if (isFigmaMode && selectedPlan === 'startup' && appliedCoupon === 'WELCOME20' && !walletApplied) {
      return {
        subtotal: 14999.00,
        couponDiscount: 0,
        walletDiscount: 0,
        tax: 1079.64,
        total: 16078.64
      };
    }

    const subtotal = selectedPlan === 'startup' ? 14999.00 : 29997.00;
    
    let couponDiscount = 0;
    if (appliedCoupon === 'WELCOME20') {
      couponDiscount = subtotal * 0.20; // 20% off
    } else if (appliedCoupon === 'ANNUAL50') {
      couponDiscount = subtotal * 0.50; // 50% off
    } else if (appliedCoupon === 'REELAX10') {
      couponDiscount = subtotal * 0.10; // 10% off
    }

    let walletDiscount = 0;
    if (walletApplied) {
      const remainingBeforeWallet = subtotal - couponDiscount;
      walletDiscount = Math.min(500.00, remainingBeforeWallet);
    }

    const taxableAmount = Math.max(0, subtotal - couponDiscount - walletDiscount);
    const tax = taxableAmount * 0.18; // 18% GST
    const total = taxableAmount + tax;

    return {
      subtotal,
      couponDiscount,
      walletDiscount,
      tax,
      total
    };
  }, [selectedPlan, walletApplied, appliedCoupon, isFigmaMode]);

  // Submit/Proceed to Payment Handler
  const handleProceedToPayment = () => {
    if (!isBillingSaved) {
      const errorsList: Record<string, string> = {};
      if (!billingDetails.companyName.trim()) errorsList.companyName = 'Company name is required';
      if (!billingDetails.email.trim()) errorsList.email = 'Email address is required';
      if (!billingDetails.premiseHouse.trim()) errorsList.premiseHouse = 'Premise/House number is required';
      if (!billingDetails.street.trim()) errorsList.street = 'Street details are required';
      if (!billingDetails.state) errorsList.state = 'Please select a state';
      if (!billingDetails.city) errorsList.city = 'Please select a city';
      if (!billingDetails.pinCode.trim()) errorsList.pinCode = 'Pin Code is required';

      if (Object.keys(errorsList).length > 0) {
        setBillingErrors(errorsList);
        setPaymentToast('Please fill and save required billing details first.');
        setTimeout(() => setPaymentToast(null), 4000);
        return;
      }
      setIsBillingSaved(true);
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
      
      // Add successful transaction to invoice list
      const newInvoice: Invoice = {
        id: `INV-2026-00${billingHistory.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        plan: `${selectedPlan === 'startup' ? 'Startup' : 'Growth'} Plan (Quarterly)`,
        amount: `₹${pricingData.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        status: 'Paid',
        method: 'UPI'
      };
      setBillingHistory(prev => [newInvoice, ...prev]);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setIsPaymentSuccess(false);
    setIsBillingSaved(false);
    setBillingDetails({
      companyName: 'abhigyan',
      email: 'abhigyan.pandey@getreelax.com',
      gstNumber: '',
      panNumber: '',
      premiseHouse: '',
      street: '',
      state: '',
      city: '',
      country: 'India',
      pinCode: '',
    });
    setBillingErrors({});
    setIsFigmaMode(true);
    setSelectedPlan('startup');
    setWalletApplied(false);
    setAppliedCoupon('WELCOME20');
    setCustomCouponText('');
    setCouponError(null);
  };

  // Create Campaign Submitter
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!campaignName.trim()) errors.name = 'Campaign name is required';
    if (!campaignBudget.trim() || isNaN(Number(campaignBudget))) errors.budget = 'Enter a valid numeric budget';
    if (!campaignNiche) errors.niche = 'Select a target niche';

    if (Object.keys(errors).length > 0) {
      setCampaignErrors(errors);
      return;
    }

    setIsCreateCampaignOpen(false);
    setCampaignToast(`Campaign "${campaignName}" created successfully!`);
    
    // Reset Form
    setCampaignName('');
    setCampaignBudget('');
    setCampaignNiche('');
    setCampaignErrors({});
    setTimeout(() => setCampaignToast(null), 3000);
  };

  const handleDownloadInvoice = (id: string) => {
    setCampaignToast(`Downloading invoice ${id} as PDF...`);
    setTimeout(() => setCampaignToast(null), 2500);
  };

  const handleSelectPlanFromList = (plan: 'startup' | 'growth') => {
    setSelectedPlan(plan);
    setIsFigmaMode(false);
    setActiveView('checkout');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-800 antialiased font-sans relative pb-16 selection:bg-[#0d99ff]/20">
      {/* Header bar */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onUpgradeClick={() => setActiveView('plans')}
        onCreateCampaignClick={() => setIsCreateCampaignOpen(true)}
        onViewHistoryClick={() => setIsHistoryOpen(true)}
      />
      
      {/* Warning/Alert Toast */}
      {paymentToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-6 py-3.5 rounded-figma-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
          {paymentToast}
        </div>
      )}

      {/* Campaign Toast Notifications */}
      {campaignToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-6 py-3.5 rounded-figma-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="w-4 h-4 text-white stroke-[3]" />
          {campaignToast}
        </div>
      )}

      {/* Payment Processing Spinner Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-[#0d99ff] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold tracking-wide">Processing Secure Payment...</p>
          <p className="text-sm text-slate-300 mt-1">Please do not refresh or close this window.</p>
        </div>
      )}

      {/* Success Modal */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-in scale-in duration-300 max-h-[90vh] overflow-y-auto">
            
            {/* Top Green Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-inner">
                <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful!</h2>
              <p className="text-sm text-slate-500 mt-1">Your subscription has been activated successfully.</p>
            </div>

            {/* Receipt Summary */}
            <div className="border border-slate-100 bg-[#f8fafc] rounded-figma-xl p-5 space-y-4 text-xs font-medium">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 text-slate-800">
                <Receipt className="w-4 h-4 text-slate-500" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Transaction Receipt</span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Subscriber</span>
                  <span className="text-slate-800 font-bold text-sm block leading-none mb-0.5">{billingDetails.companyName}</span>
                  <span className="text-[10px] text-slate-400 lowercase font-medium">{billingDetails.email}</span>
                </div>
                
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Plan Activated</span>
                  <span className="text-slate-800 font-bold text-sm block leading-none capitalize mb-0.5">{selectedPlan} Plan</span>
                  <span className="text-[10px] text-[#0d99ff] font-bold">Includes {selectedPlan === 'startup' ? '5,000' : '12,000'} credits/mo</span>
                </div>
                
                <div className="col-span-2 pt-2 border-t border-slate-200/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Billing Address</span>
                  <span className="text-slate-700 block leading-tight">
                    {billingDetails.premiseHouse}, {billingDetails.street}, {billingDetails.city}, {billingDetails.state} - {billingDetails.pinCode}
                  </span>
                </div>

                {billingDetails.gstNumber && (
                  <div className="pt-2 border-t border-slate-200/40">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">GST Registration</span>
                    <span className="text-slate-700 font-bold uppercase">{billingDetails.gstNumber}</span>
                  </div>
                )}

                {billingDetails.panNumber && (
                  <div className="pt-2 border-t border-slate-200/40">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">PAN Identification</span>
                    <span className="text-slate-700 font-bold uppercase">{billingDetails.panNumber}</span>
                  </div>
                )}
                
                <div className="col-span-2 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Amount Charged</span>
                  </div>
                  <span className="text-lg font-extrabold text-[#0d99ff]">
                    ₹{pricingData.total.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button 
                type="button"
                onClick={handleCloseSuccessModal}
                className="w-full bg-[#0d99ff] text-white py-3.5 rounded-figma-xl font-bold text-sm shadow-md hover:bg-[#0088ee] active:scale-[0.99] transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing History Dialog Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in scale-in duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0d99ff]" />
                <h3 className="text-lg font-bold text-slate-900">Billing History</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsHistoryOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-50 p-2 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                    <th className="p-3 font-bold uppercase tracking-wider">Invoice ID</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Date</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Plan</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Amount</th>
                    <th className="p-3 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billingHistory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/55 transition-colors font-medium">
                      <td className="p-3 text-slate-800 font-bold">{inv.id}</td>
                      <td className="p-3 text-slate-500">{inv.date}</td>
                      <td className="p-3 text-slate-700 capitalize">{inv.plan}</td>
                      <td className="p-3 text-slate-900 font-bold">{inv.amount}</td>
                      <td className="p-3">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleDownloadInvoice(inv.id)}
                          className="text-[#0d99ff] hover:text-[#0088ee] hover:bg-[#0d99ff]/5 p-1.5 rounded-lg border border-[#0d99ff]/10 bg-white transition-all flex items-center gap-1 mx-auto"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Dialog Modal */}
      {isCreateCampaignOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in scale-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0d99ff]" />
                <h3 className="text-lg font-bold text-slate-900">Create Campaign</h3>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsCreateCampaignOpen(false); setCampaignErrors({}); }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-50 p-2 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="mt-4 space-y-4">
              {/* Campaign Name */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Campaign Name</label>
                  {campaignErrors.name && <span className="text-[10px] text-red-500 font-bold">{campaignErrors.name}</span>}
                </div>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className={`form-input ${campaignErrors.name ? 'form-input-error' : ''}`}
                  placeholder="e.g. Summer Influencer Launch 2026"
                />
              </div>

              {/* Target Niche */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Niche</label>
                  {campaignErrors.niche && <span className="text-[10px] text-red-500 font-bold">{campaignErrors.niche}</span>}
                </div>
                <select 
                  value={campaignNiche}
                  onChange={(e) => setCampaignNiche(e.target.value)}
                  className={`form-input bg-[#f8fafc] appearance-none cursor-pointer ${campaignErrors.niche ? 'form-input-error' : ''}`}
                >
                  <option value="">Select Niche</option>
                  <option value="tech">Tech & AI</option>
                  <option value="lifestyle">Lifestyle & Fashion</option>
                  <option value="fitness">Fitness & Health</option>
                  <option value="business">Business & SaaS</option>
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Budget (INR)</label>
                  {campaignErrors.budget && <span className="text-[10px] text-red-500 font-bold">{campaignErrors.budget}</span>}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(e.target.value)}
                    className={`form-input pl-8 ${campaignErrors.budget ? 'form-input-error' : ''}`}
                    placeholder="e.g. 50000"
                  />
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setIsCreateCampaignOpen(false); setCampaignErrors({}); }}
                  className="flex-1 py-3 border border-slate-200 rounded-figma-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#0d99ff] text-white rounded-figma-lg text-xs font-bold shadow-md hover:bg-[#0088ee] transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-grid-margin py-stack-lg">
        
        {/* Render Views dynamically */}
        {activeView === 'plans' ? (
          // PLANS SELECTION VIEW
          <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <button 
              onClick={() => setActiveView('checkout')}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0d99ff] transition-colors mb-6 font-bold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to checkout
            </button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Choose the Perfect Plan for your Business</h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">Select a subscription cycle. Save up to 20% on quarterly billing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Startup plan card */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:border-[#0d99ff]/50 transition-all duration-300 hover:shadow-md relative">
                {selectedPlan === 'startup' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d99ff] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Currently Selected
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Startup</h3>
                  <p className="text-xs text-slate-400 mt-1">Perfect for growing brands starting out.</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">₹4,999</span>
                    <span className="text-slate-400 text-sm ml-1">/ month</span>
                    <p className="text-[10px] text-slate-500 font-bold mt-1.5">Billed quarterly (₹14,999.00 total)</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> 5,000 influencer credits / mo</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Basic campaign tracking</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Email support channels</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPlanFromList('startup')}
                  className={`w-full mt-8 py-3.5 rounded-figma-xl text-xs font-bold transition-all duration-200 ${selectedPlan === 'startup' ? 'bg-[#0d99ff]/10 text-[#0d99ff]' : 'bg-[#0d99ff] text-white hover:bg-[#0088ee]'}`}
                >
                  {selectedPlan === 'startup' ? 'Selected' : 'Select Plan'}
                </button>
              </div>

              {/* Growth plan card */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:border-[#0d99ff]/50 transition-all duration-300 hover:shadow-md relative bg-gradient-to-tr from-white to-[#0d99ff]/5">
                <span className="absolute -top-3 right-4 bg-[#f2a83b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Popular
                </span>
                {selectedPlan === 'growth' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d99ff] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Currently Selected
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Growth</h3>
                  <p className="text-xs text-slate-400 mt-1">For active marketers seeking higher reach.</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">₹9,999</span>
                    <span className="text-slate-400 text-sm ml-1">/ month</span>
                    <p className="text-[10px] text-slate-500 font-bold mt-1.5">Billed quarterly (₹29,997.00 total)</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> 12,000 influencer credits / mo</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Advanced conversions analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> 24/7 Priority support channels</li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPlanFromList('growth')}
                  className={`w-full mt-8 py-3.5 rounded-figma-xl text-xs font-bold transition-all duration-200 ${selectedPlan === 'growth' ? 'bg-[#0d99ff]/10 text-[#0d99ff]' : 'bg-[#0d99ff] text-white hover:bg-[#0088ee]'}`}
                >
                  {selectedPlan === 'growth' ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // CHECKOUT VIEW
          <div>
            {/* Back navigation */}
            <button 
              onClick={() => setActiveView('plans')}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0d99ff] transition-colors mb-stack-lg group font-bold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to plans
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <BillingForm 
                  billingDetails={billingDetails}
                  setBillingDetails={setBillingDetails}
                  errors={billingErrors}
                  setErrors={setBillingErrors}
                  isSaved={isBillingSaved}
                  setIsSaved={setIsBillingSaved}
                />
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-4 sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <OrderSummary 
                  selectedPlan={selectedPlan}
                  setSelectedPlan={setSelectedPlan}
                  walletApplied={walletApplied}
                  setWalletApplied={setWalletApplied}
                  appliedCoupon={appliedCoupon}
                  setAppliedCoupon={setAppliedCoupon}
                  customCouponText={customCouponText}
                  setCustomCouponText={setCustomCouponText}
                  couponError={couponError}
                  setCouponError={setCouponError}
                  subtotal={pricingData.subtotal}
                  couponDiscount={pricingData.couponDiscount}
                  walletDiscount={pricingData.walletDiscount}
                  tax={pricingData.tax}
                  total={pricingData.total}
                  onInteraction={handleInteraction}
                  onProceedToPayment={handleProceedToPayment}
                  isFigmaMode={isFigmaMode}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
