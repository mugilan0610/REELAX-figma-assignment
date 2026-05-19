import React from 'react';
import { Search, Sparkles, Plus, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-grid-margin py-3 bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
      {/* Left side search input */}
      <div className="flex-1 max-w-md mr-4">
        <div className="relative w-full">
          <input 
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-figma-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0d99ff] transition-all duration-200" 
            placeholder="Find influencers to collaborate with" 
            type="text"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 cursor-pointer hover:text-[#0d99ff] transition-colors" />
        </div>
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Gold Upgrade Button */}
        <button className="bg-[#f2a83b] hover:bg-[#e0982f] text-white px-4 py-2.5 rounded-figma-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-200">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Upgrade
        </button>

        {/* Blue Create Campaign Button */}
        <button className="bg-[#0d99ff] hover:bg-[#0088ee] text-white px-4 py-2.5 rounded-figma-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-200">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
        
        {/* User Account / Menu */}
        <div className="flex items-center gap-2 bg-[#f8fafc] p-1 pl-1 pr-3 rounded-full border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-all duration-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white">
             <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <Menu className="w-4 h-4 text-slate-500 hover:text-slate-800 transition-colors" />
        </div>
      </div>
    </header>
  );
}
