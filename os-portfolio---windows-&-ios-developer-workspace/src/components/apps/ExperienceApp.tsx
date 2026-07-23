import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, GraduationCap, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const ExperienceApp: React.FC = () => {
  const { experience, education } = usePortfolio();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 text-white">
      {/* Work */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Experience</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track record leading engineering initiatives and shipping products.</p>
        </div>

        <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-6">
          {experience.map((exp) => (
            <div key={exp.id} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-900 shadow-md group-hover:scale-125 transition" />
              <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <div className="text-sm font-semibold text-amber-400">{exp.company}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Key Achievements</h4>
                  <ul className="space-y-1">
                    {(exp.achievements || []).map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(exp.technologies || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] font-semibold rounded-md border border-amber-500/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <span>Education</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu) => (
            <div key={edu.id} className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                  <div className="text-xs font-semibold text-indigo-400">{edu.field}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{edu.institution}</div>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white/10 px-2.5 py-1 rounded-lg">{edu.year}</span>
              </div>
              {edu.grade && (
                <span className="inline-block px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md border border-emerald-500/20">{edu.grade}</span>
              )}
              <ul className="space-y-1 pt-2 border-t border-white/10">
                {(edu.highlights || []).map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
