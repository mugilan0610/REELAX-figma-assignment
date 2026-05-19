import React from 'react';
import { Wallet, ArrowUpCircle, RefreshCw } from 'lucide-react';
import CouponSection from './CouponSection';

interface OrderSummaryProps {
  selectedPlan: 'startup' | 'growth';
  setSelectedPlan: (plan: 'startup' | 'growth') => void;
  walletApplied: boolean;
  setWalletApplied: (applied: boolean) => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (coupon: string | null) => void;
  customCouponText: string;
  setCustomCouponText: (text: string) => void;
  couponError: string | null;
  setCouponError: (error: string | null) => void;
  subtotal: number;
  couponDiscount: number;
  walletDiscount: number;
  tax: number;
  total: number;
  onInteraction: () => void;
  onProceedToPayment: () => void;
  isFigmaMode: boolean;
}

export default function OrderSummary({
  selectedPlan,
  setSelectedPlan,
  walletApplied,
  setWalletApplied,
  appliedCoupon,
  setAppliedCoupon,
  customCouponText,
  setCustomCouponText,
  couponError,
  setCouponError,
  subtotal,
  couponDiscount,
  walletDiscount,
  tax,
  total,
  onInteraction,
  onProceedToPayment,
  isFigmaMode
}: OrderSummaryProps) {

  const handlePlanToggle = () => {
    onInteraction();
    if (selectedPlan === 'startup') {
      setSelectedPlan('growth');
    } else {
      setSelectedPlan('startup');
    }
  };

  const handleWalletToggle = () => {
    onInteraction();
    setWalletApplied(!walletApplied);
  };

  // Format currency with commas
  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-5">
      {/* Subscription Plan details block */}
      <div className="bg-white border border-[#e2e8f0] rounded-figma-xl p-4 card-shadow">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Summary</h1>
          <span className="text-[10px] text-[#0d99ff] bg-[#0d99ff]/10 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Selected
          </span>
        </div>

        <div className="bg-white border border-[#0d99ff]/15 rounded-figma-xl p-4 shadow-sm bg-gradient-to-tr from-white to-[#0d99ff]/5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-2xl font-bold text-slate-900">
                {selectedPlan === 'startup' ? '₹4,999' : '₹9,999'}
              </span>
              <span className="text-sm text-slate-400 font-medium ml-1">/month</span>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                {selectedPlan === 'startup' ? 'Includes 5,000 credits/mo.' : 'Includes 12,000 credits/mo.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#0d99ff] uppercase font-bold tracking-wider block">Billing Tier</span>
              <p className="text-xl font-bold text-slate-900 capitalize">
                {selectedPlan}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlanToggle}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-[#0d99ff]/25 text-[#0d99ff] font-semibold text-xs py-2.5 rounded-figma-xl hover:bg-[#0d99ff]/5 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            {selectedPlan === 'startup' ? (
              <>
                <ArrowUpCircle className="w-4 h-4" />
                Upgrade to Growth Plan
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Switch to Startup Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Calculations Summary card */}
      <div className="bg-white border border-[#e2e8f0] rounded-figma-xl p-4 card-shadow">


        <div className="space-y-4">
          {/* Wallet Balance */}
          <div className={`flex items-center justify-between p-3 rounded-figma-lg border transition-all duration-200 ${walletApplied ? 'border-[#0d99ff] bg-[#0d99ff]/5' : 'border-[#e2e8f0] bg-[#f8fafc]'}`}>
            <div className="flex items-center gap-3">
              <Wallet className={`w-5 h-5 ${walletApplied ? 'text-[#0d99ff]' : 'text-slate-400'}`} />
              <div>
                <p className="text-xs font-semibold text-slate-800">Wallet Balance</p>
                <p className="text-[10px] text-slate-400 font-medium">₹500.00 available</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleWalletToggle}
              className={`font-semibold text-xs px-4 py-1.5 border rounded-figma-lg active:scale-95 transition-all duration-200 cursor-pointer ${walletApplied ? 'bg-[#0d99ff] border-[#0d99ff] text-white' : 'bg-white border-[#0d99ff]/25 text-[#0d99ff] hover:bg-[#0d99ff]/5'}`}
            >
              {walletApplied ? 'Applied' : 'Apply'}
            </button>
          </div>

          {/* Coupon Code Section */}
          <CouponSection
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            customCouponText={customCouponText}
            setCustomCouponText={setCustomCouponText}
            couponError={couponError}
            setCouponError={setCouponError}
            onInteraction={onInteraction}
          />

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-[#e2e8f0] space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-800 font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            {/* Discounts */}
            {!isFigmaMode && couponDiscount > 0 && (
              <div className="flex justify-between text-sm font-medium text-emerald-600">
                <span>Coupon Discount ({appliedCoupon})</span>
                <span className="font-semibold">-{formatCurrency(couponDiscount)}</span>
              </div>
            )}

            {!isFigmaMode && walletDiscount > 0 && (
              <div className="flex justify-between text-sm font-medium text-emerald-600">
                <span>Wallet Applied</span>
                <span className="font-semibold">-{formatCurrency(walletDiscount)}</span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Tax (18% GST)</span>
              <span className="text-slate-800 font-semibold">{formatCurrency(tax)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end pt-4 mb-4 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-800">Total due today</p>
              <p className="text-3xl font-extrabold text-[#0d99ff] tracking-tight">
                {total.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={onProceedToPayment}
              className="w-full bg-[#0d99ff] text-white py-4 rounded-figma-xl font-bold text-base shadow-md hover:bg-[#0088ee] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
