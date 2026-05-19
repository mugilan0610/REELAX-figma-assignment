import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Plus, Menu, History, User, CreditCard, LogOut, Check } from 'lucide-react';

const MOCK_INFLUENCERS = [
  { name: 'Abhigyan Pandey', category: 'Tech & AI', followers: '125K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Mugilan M.', category: 'Developer Operations', followers: '85K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Sara Chen', category: 'Design & UX', followers: '240K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Alex Johnson', category: 'SaaS Marketing', followers: '92K', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80' }
];

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUpgradeClick: () => void;
  onCreateCampaignClick: () => void;
  onViewHistoryClick: () => void;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSettingsClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onUpgradeClick,
  onCreateCampaignClick,
  onViewHistoryClick,
  userProfile,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  onSettingsClick
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredInfluencers = MOCK_INFLUENCERS.filter(inf => 
    inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inf.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectInfluencer = (name: string) => {
    setToastMessage(`Selected influencer: ${name} to collaborate!`);
    setIsSearchFocused(false);
    setSearchQuery('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <header className="flex justify-between items-center w-full px-grid-margin py-3 bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
      
      {/* Toast Notification for Influencer selection */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0d99ff] text-white text-xs font-bold px-4 py-2.5 rounded-figma-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Check className="w-4 h-4 text-white stroke-[3]" />
          {toastMessage}
        </div>
      )}

      {/* Left side search input with dynamic results popup */}
      <div className="flex-1 max-w-md mr-4 relative" ref={searchRef}>
        <div className="relative w-full">
          <input 
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-figma-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0d99ff] transition-all duration-200" 
            placeholder="Find influencers to collaborate with" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            disabled={!isLoggedIn}
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 cursor-pointer hover:text-[#0d99ff] transition-colors" />
        </div>

        {/* Search Results Dropdown */}
        {isLoggedIn && isSearchFocused && (searchQuery.length > 0 || filteredInfluencers.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e2e8f0] rounded-figma-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 bg-[#f8fafc] border-b border-[#e2e8f0] text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Matching Influencers
            </div>
            {filteredInfluencers.length > 0 ? (
              filteredInfluencers.map((inf) => (
                <div 
                  key={inf.name}
                  onClick={() => handleSelectInfluencer(inf.name)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-[#e2e8f0]/40 transition-colors"
                >
                  <img src={inf.avatar} alt={inf.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{inf.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{inf.category} • {inf.followers} followers</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                No influencers match your search query.
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Gold Upgrade Button */}
        <button 
          type="button"
          onClick={onUpgradeClick}
          className="bg-[#f2a83b] hover:bg-[#e0982f] text-white px-4 py-2.5 rounded-figma-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-200"
          disabled={!isLoggedIn}
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Upgrade
        </button>

        {/* Blue Create Campaign Button */}
        <button 
          type="button"
          onClick={onCreateCampaignClick}
          className="bg-[#0d99ff] hover:bg-[#0088ee] text-white px-4 py-2.5 rounded-figma-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-200"
          disabled={!isLoggedIn}
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
        
        {/* User Account / Menu Dropdown / Log In Button */}
        {!isLoggedIn ? (
          <button 
            type="button"
            onClick={onLoginClick}
            className="bg-[#0d99ff] hover:bg-[#0088ee] text-white px-5 py-2.5 rounded-figma-xl text-xs font-bold shadow-sm active:scale-95 transition-all duration-200"
          >
            Log In
          </button>
        ) : (
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border transition-all duration-200 cursor-pointer ${isProfileMenuOpen ? 'bg-[#f1f5f9] border-[#0d99ff]' : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'}`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white">
                 <img 
                  src={userProfile.avatar} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Menu className="w-4 h-4 text-slate-500" />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e2e8f0] rounded-figma-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <p className="text-xs font-bold text-slate-800 leading-none">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{userProfile.email}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => { onViewHistoryClick(); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-figma-lg flex items-center gap-2 transition-colors"
                  >
                    <History className="w-4 h-4 text-slate-400" />
                    Billing History
                  </button>
                  <button 
                    onClick={() => { onUpgradeClick(); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-figma-lg flex items-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    Manage Plans
                  </button>
                  <button 
                    onClick={() => { onSettingsClick(); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-figma-lg flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Account Settings
                  </button>
                </div>
                <div className="p-1 border-t border-[#e2e8f0]">
                  <button 
                    onClick={() => { onLogoutClick(); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-figma-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
