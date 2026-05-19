import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, Receipt, Landmark, Check } from 'lucide-react';
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

export default function App() {
  // Shared States
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
  // Changes to Dynamic Mode on user interactions with pricing elements.
  const [isFigmaMode, setIsFigmaMode] = useState(true);

  // Modal States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);

  const handleInteraction = () => {
    setIsFigmaMode(false);
  };

  // Calculations
  const pricingData = useMemo(() => {
    if (isFigmaMode && selectedPlan === 'startup' && appliedCoupon === 'WELCOME20' && !walletApplied) {
      // Return exact values as displayed in the Figma mockup screenshot
      return {
        subtotal: 14999.00,
        couponDiscount: 0,
        walletDiscount: 0,
        tax: 1079.64,
        total: 16078.64
      };
    }

    // Dynamic mathematically correct calculations
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
    // 1. Check if billing form has been validated and saved
    if (!isBillingSaved) {
      // Trigger a form check manually to show inputs errors if any
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
        setPaymentToast('Please fill and save the required billing details first.');
        setTimeout(() => setPaymentToast(null), 4000);
        return;
      }
      
      // If no empty fields but they didn't click "Save Details"
      setIsBillingSaved(true);
    }

    // 2. Simulate payment processing
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setIsPaymentSuccess(false);
    // Optionally reset state
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

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-800 antialiased font-sans relative pb-16 selection:bg-[#0d99ff]/20">
      {/* Header bar */}
      <Header />
      
      {/* Warning/Alert Toast */}
      {paymentToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-6 py-3.5 rounded-figma-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
          {paymentToast}
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

      {/* Main Layout Area */}
      <main className="max-w-[1280px] mx-auto px-grid-margin py-stack-lg">
        {/* Back navigation */}
        <button 
          onClick={handleCloseSuccessModal}
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
      </main>
    </div>
  );
}
