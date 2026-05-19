import React, { useEffect, useState } from 'react';
import { ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { INDIA_STATES_AND_CITIES } from '../../data/indiaStatesCities';

interface BillingFormProps {
  billingDetails: {
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
  };
  setBillingDetails: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BillingForm({
  billingDetails,
  setBillingDetails,
  errors,
  setErrors,
  isSaved,
  setIsSaved
}: BillingFormProps) {
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cities when state changes
  useEffect(() => {
    if (billingDetails.state) {
      const match = INDIA_STATES_AND_CITIES.find(item => item.state === billingDetails.state);
      setCityOptions(match ? match.cities : []);
    } else {
      setCityOptions([]);
    }
  }, [billingDetails.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev: any) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for that field on input change
    if (errors[name]) {
      setErrors((prev: any) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    // If state changes, clear/reset city
    if (name === 'state') {
      setBillingDetails((prev: any) => ({
        ...prev,
        city: ''
      }));
    }
    setIsSaved(false); // Reset saved status on edit
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!billingDetails.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!billingDetails.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!billingDetails.premiseHouse.trim()) {
      newErrors.premiseHouse = 'Premise/House number is required';
    }

    if (!billingDetails.street.trim()) {
      newErrors.street = 'Street details are required';
    }

    if (!billingDetails.state) {
      newErrors.state = 'Please select a state';
    }

    if (!billingDetails.city) {
      newErrors.city = 'Please select a city';
    }

    if (!billingDetails.pinCode.trim()) {
      newErrors.pinCode = 'Pin Code is required';
    } else if (!/^\d{6}$/.test(billingDetails.pinCode)) {
      newErrors.pinCode = 'Pin Code must be exactly 6 digits';
    }

    if (billingDetails.gstNumber.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(billingDetails.gstNumber.toUpperCase())) {
        newErrors.gstNumber = 'Invalid GST format (e.g. 22AAAAA0000A1Z5)';
      }
    }

    if (billingDetails.panNumber.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(billingDetails.panNumber.toUpperCase())) {
        newErrors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSaved(true);
      setToastMessage('Billing details saved successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      setIsSaved(false);
    }
  };

  const handleCancel = () => {
    // Reset to defaults
    setBillingDetails({
      companyName: '',
      email: '',
      gstNumber: '',
      panNumber: '',
      premiseHouse: '',
      street: '',
      state: '',
      city: '',
      country: 'India',
      pinCode: '',
    });
    setErrors({});
    setIsSaved(false);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-figma-xl p-8 card-shadow relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-figma-lg shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {toastMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Review your details</h1>
        {isSaved && (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Details Verified
          </span>
        )}
      </div>
      <h2 className="text-sm font-semibold text-slate-500 mb-8">Billing Information</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSave}>
        {/* Company Name */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
            {errors.companyName && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.companyName}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.companyName ? 'form-input-error' : ''}`}
            placeholder="abhigyan"
            type="text"
            name="companyName"
            value={billingDetails.companyName}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
            {errors.email && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="abhigyan.pandey@getreelax.com"
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleChange}
          />
        </div>

        {/* GST Number */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              GST Number <span className="text-slate-400 font-normal normal-case ml-1">(Optional)</span>
            </label>
            {errors.gstNumber && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.gstNumber}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.gstNumber ? 'form-input-error' : ''}`}
            placeholder="GST Number"
            type="text"
            name="gstNumber"
            value={billingDetails.gstNumber}
            onChange={handleChange}
          />
        </div>

        {/* PAN Number */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              PAN Number <span className="text-slate-400 font-normal normal-case ml-1">(Optional)</span>
            </label>
            {errors.panNumber && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.panNumber}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.panNumber ? 'form-input-error' : ''}`}
            placeholder="PAN Number"
            type="text"
            name="panNumber"
            value={billingDetails.panNumber}
            onChange={handleChange}
          />
        </div>

        {/* Premise/House no. */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Premise/House no.</label>
            {errors.premiseHouse && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.premiseHouse}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.premiseHouse ? 'form-input-error' : ''}`}
            placeholder="Premise/House no."
            type="text"
            name="premiseHouse"
            value={billingDetails.premiseHouse}
            onChange={handleChange}
          />
        </div>

        {/* Street */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Street</label>
            {errors.street && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.street}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.street ? 'form-input-error' : ''}`}
            placeholder="Street"
            type="text"
            name="street"
            value={billingDetails.street}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">State</label>
            {errors.state && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.state}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              className={`form-input appearance-none bg-[#f8fafc] cursor-pointer ${errors.state ? 'form-input-error' : ''}`}
              name="state"
              value={billingDetails.state}
              onChange={handleChange}
            >
              <option value="">Select state</option>
              {INDIA_STATES_AND_CITIES.map((item) => (
                <option key={item.state} value={item.state}>{item.state}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
            {errors.city && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </span>
            )}
          </div>
          <div className="relative">
            <select
              className={`form-input appearance-none bg-[#f8fafc] cursor-pointer ${errors.city ? 'form-input-error' : ''}`}
              name="city"
              value={billingDetails.city}
              onChange={handleChange}
              disabled={!billingDetails.state}
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country</label>
          <input
            className="form-input bg-slate-100/80 cursor-not-allowed opacity-80 text-slate-500"
            value="India"
            readOnly
            type="text"
          />
        </div>

        {/* Pin Code */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pin Code</label>
            {errors.pinCode && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.pinCode}
              </span>
            )}
          </div>
          <input
            className={`form-input ${errors.pinCode ? 'form-input-error' : ''}`}
            placeholder="Pincode"
            type="text"
            name="pinCode"
            maxLength={6}
            value={billingDetails.pinCode}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-3 border border-slate-200 rounded-figma-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-primary-container text-white rounded-figma-lg text-sm font-bold shadow-md hover:bg-primary-container/90 active:scale-[0.98] transition-all duration-200"
          >
            Save Details
          </button>
        </div>
      </form>
    </div>
  );
}
