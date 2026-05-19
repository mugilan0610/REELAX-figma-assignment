import React, { useState } from 'react';
import { Tag, ChevronUp, ChevronDown, Check, AlertCircle } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
}

const PREDEFINED_COUPONS: Coupon[] = [
  { id: '1', code: 'WELCOME20', description: '20% off on your first month' },
  { id: '2', code: 'ANNUAL50', description: '50% off on annual plans' },
];

interface CouponSectionProps {
  appliedCoupon: string | null;
  setAppliedCoupon: (coupon: string | null) => void;
  customCouponText: string;
  setCustomCouponText: (text: string) => void;
  couponError: string | null;
  setCouponError: (error: string | null) => void;
  onInteraction: () => void;
}

export default function CouponSection({
  appliedCoupon,
  setAppliedCoupon,
  customCouponText,
  setCustomCouponText,
  couponError,
  setCouponError,
  onInteraction
}: CouponSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSelectPredefined = (code: string) => {
    onInteraction();
    setCouponError(null);
    if (appliedCoupon === code) {
      setAppliedCoupon(null); // Toggle off if clicked again
    } else {
      setAppliedCoupon(code);
    }
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    onInteraction();
    const cleanCode = customCouponText.trim().toUpperCase();

    if (!cleanCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (cleanCode === 'WELCOME20' || cleanCode === 'ANNUAL50') {
      setAppliedCoupon(cleanCode);
      setCouponError(null);
    } else if (cleanCode === 'REELAX10') {
      setAppliedCoupon('REELAX10');
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const getCouponHighlightClass = (code: string) => {
    return appliedCoupon === code 
      ? 'border-[#0d99ff] bg-[#0d99ff]/5' 
      : 'border-[#e2e8f0] hover:border-[#0d99ff]/30 bg-white';
  };

  const getRadioCircleClass = (code: string) => {
    return appliedCoupon === code ? 'border-[#0d99ff]' : 'border-[#bfc7d5]';
  };

  return (
    <div className="border border-[#e2e8f0] rounded-figma-xl overflow-hidden mb-4">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-[#f8fafc] border-b border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors duration-200"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Tag className="w-4 h-4 text-slate-500" />
          Apply Coupon
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Custom coupon input */}
          <form onSubmit={handleCustomApply} className="space-y-1.5">
            <div className="flex gap-2">
              <input 
                className="flex-1 border border-[#e2e8f0] bg-[#f8fafc] rounded-figma-lg px-3 py-2 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#0d99ff]" 
                placeholder="Enter coupon code" 
                type="text"
                value={customCouponText}
                onChange={(e) => {
                  setCustomCouponText(e.target.value);
                  if (couponError) setCouponError(null);
                }}
              />
              <button 
                type="submit"
                className="bg-white text-[#0d99ff] font-semibold text-xs px-4 py-2 border border-[#0d99ff]/20 rounded-figma-lg hover:bg-[#0d99ff]/5 transition-all duration-200"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {couponError}
              </p>
            )}
            {appliedCoupon === 'REELAX10' && (
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                REELAX10 (10% Off) applied!
              </p>
            )}
          </form>

          {/* Predefined Coupon Options */}
          <div className="space-y-2">
            {PREDEFINED_COUPONS.map((coupon) => (
              <div 
                key={coupon.id}
                onClick={() => handleSelectPredefined(coupon.code)}
                className={`flex items-center justify-between p-3 border-2 rounded-figma-lg cursor-pointer transition-all duration-200 ${getCouponHighlightClass(coupon.code)}`}
              >
                <div>
                  <span className="text-sm font-bold text-slate-800">{coupon.code}</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">{coupon.description}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${getRadioCircleClass(coupon.code)}`}>
                  {appliedCoupon === coupon.code && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d99ff]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
