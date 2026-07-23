import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectCategory, ProjectItem } from '../../types';
import { Search, ExternalLink, Github, Star, Filter, FolderGit2, X, Award } from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All', 'Full-Stack', 'Mobile App', 'Frontend', 'Cloud & Systems', 'Open Source'
];

export const ProjectsApp: React.FC = () => {
  const { projects } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filteredProjects = projects.filter((p) => {
    const mCat = selectedCategory === 'All' || p.category === selectedCategory;
    const mSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.techStack || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return mCat && mSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              <span>Projects</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Production apps, mobile systems, cloud architectures, and open-source tools.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search projects..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No projects found.</p>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} onClick={() => setActiveProject(p)}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition cursor-pointer flex flex-col">
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img src={p.imageUrl} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                  {p.category}
                </div>
                {p.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                    <Award className="w-3 h-3" />
                    Featured
                  </div>
                )}
                {p.stars && (
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {p.stars}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition">{p.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{p.shortDesc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {(p.techStack || []).slice(0, 4).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-white/10 text-slate-300 text-[9px] font-medium rounded border border-white/10">
                      {t}
                    </span>
                  ))}
                  {(p.techStack || []).length > 4 && (
                    <span className="px-2 py-0.5 text-[9px] text-slate-500">+{(p.techStack || []).length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-400 hover:text-white transition z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="rounded-xl overflow-hidden h-52 bg-slate-800">
              <img src={activeProject.imageUrl} alt={activeProject.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-lg border border-blue-500/30">{activeProject.category}</span>
                <span className="text-[11px] text-slate-500">{activeProject.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeProject.title}</h2>
              <p className="text-sm leading-relaxed text-slate-300">{activeProject.fullDesc}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {(activeProject.techStack || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-[11px] font-semibold rounded-lg border border-blue-500/20">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              {activeProject.demoUrl && (
                <a href={activeProject.demoUrl} target="_blank" rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-md">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {activeProject.githubUrl && (
                <a href={activeProject.githubUrl} target="_blank" rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition border border-white/10">
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
