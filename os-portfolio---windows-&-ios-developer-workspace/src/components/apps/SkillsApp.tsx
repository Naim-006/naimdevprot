import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillCategory } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { Search, Target, Filter, Code, Star } from 'lucide-react';

const CATEGORIES: (SkillCategory | 'All')[] = [
  'All', 'Frontend', 'Mobile', 'Backend & Database', 'Cloud & DevOps', 'Tools & Methods'
];

const CAT_COLORS: Record<string, string> = {
  Frontend: 'blue', Mobile: 'purple', 'Backend & Database': 'emerald',
  'Cloud & DevOps': 'amber', 'Tools & Methods': 'cyan',
};

const CAT_STYLES: Record<string, { bg: string; text: string; border: string; from: string; to: string }> = {
  blue:    { bg: 'bg-blue-500/20',    text: 'text-blue-400',    border: 'border-blue-500/20',    from: 'from-blue-500',    to: 'to-blue-400' },
  purple:  { bg: 'bg-purple-500/20',  text: 'text-purple-400',  border: 'border-purple-500/20',  from: 'from-purple-500',  to: 'to-purple-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20', from: 'from-emerald-500', to: 'to-emerald-400' },
  amber:   { bg: 'bg-amber-500/20',   text: 'text-amber-400',   border: 'border-amber-500/20',   from: 'from-amber-500',   to: 'to-amber-400' },
  cyan:    { bg: 'bg-cyan-500/20',    text: 'text-cyan-400',    border: 'border-cyan-500/20',    from: 'from-cyan-500',    to: 'to-cyan-400' },
};

export const SkillsApp: React.FC = () => {
  const { skills } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');

  const filteredSkills = skills.filter((s) => {
    const mCat = selectedCategory === 'All' || s.category === selectedCategory;
    const mSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return mCat && mSearch;
  });

  const featured = skills.filter((s) => s.featured);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <span>Skills & Technologies</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Core competencies across frontend, mobile, backend, cloud, and tooling.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search skills..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Featured */}
      {selectedCategory === 'All' && !searchTerm && featured.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Featured
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featured.slice(0, 4).map((s) => (
              <div key={s.id} className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-md">
                  <IconHelper name={s.iconName || 'Code'} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{s.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{s.proficiency}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No skills found.</p>
          </div>
        ) : (
          filteredSkills.map((s) => {
            const catColor = CAT_COLORS[s.category] || 'blue';
            const st = CAT_STYLES[catColor] || CAT_STYLES.blue;
            return (
              <div key={s.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition space-y-2.5 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${st.bg} ${st.text}`}>
                      <IconHelper name={s.iconName || 'Code'} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.category}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-extrabold ${st.text} ${st.bg} px-2 py-0.5 rounded-full border ${st.border}`}>
                    {s.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-gradient-to-r ${st.from} ${st.to} h-full rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${s.proficiency}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
