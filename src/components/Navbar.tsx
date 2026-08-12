import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  targetRole: string;
  onSelectRole: (roleId: string) => void;
  onOpenAnalyzer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  targetRole,
  onSelectRole,
  onOpenAnalyzer,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const navItems = [
    'Dashboard',
    'Skill Analysis',
    'Learning Roadmap',
    'Quiz',
    'Projects',
    'Interview Practice',
  ];

  const roles = [
    { id: 'data-scientist', label: 'Data Scientist' },
    { id: 'data-analyst', label: 'Data Analyst' },
    { id: 'ai-engineer', label: 'AI Engineer' },
    { id: 'aiml-engineer', label: 'Machine Learning Engineer' },
    { id: 'software-dev', label: 'Software Developer' },
    { id: 'data-engineer', label: 'Data Engineer' },
    { id: 'nlp-engineer', label: 'NLP Engineer' },
    { id: 'computer-vision-engineer', label: 'Computer Vision Engineer' },
    { id: 'cloud-engineer', label: 'Cloud Engineer' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => setActiveTab('Dashboard')}
            className="flex cursor-pointer items-center space-x-2.5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/30">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                SkillGap<span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">.AI</span>
              </span>
              <span className="ml-2 hidden text-[10px] font-semibold tracking-wider text-cyan-400 uppercase sm:inline-block px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                PRO
              </span>
            </div>
          </div>

          {/* Target Role Selector pill in Navbar */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800/90 transition-all"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-400">Target:</span>
              <span className="font-semibold text-cyan-300">{targetRole}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Target Track
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRole(r.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      targetRole === r.label
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{r.label}</span>
                    {targetRole === r.label && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-slate-800/80 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          
          {/* AI Skill Scan CTA button */}
          <button
            onClick={onOpenAnalyzer}
            className="hidden sm:flex items-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-900/30 hover:shadow-cyan-500/25 hover:opacity-95 transition-all duration-200 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-200 fill-cyan-200 animate-bounce" />
            <span>AI Scan</span>
          </button>

        </div>

      </div>

      {/* Mobile sub-bar nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-900 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              activeTab === item
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
};
