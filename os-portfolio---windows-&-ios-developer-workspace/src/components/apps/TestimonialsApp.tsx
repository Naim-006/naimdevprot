import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Star, Quote, Award } from 'lucide-react';

export const TestimonialsApp: React.FC = () => {
  const { testimonials } = usePortfolio();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-pink-400" />
          <span>Testimonials</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Feedback from tech leads, directors, and founders I've collaborated with.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.id}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-pink-500/30 transition flex flex-col justify-between space-y-4 relative">
            <Quote className="w-8 h-8 text-pink-500/15 absolute top-4 right-4 pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed">"{t.quote}"</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img src={t.avatarUrl} alt={t.clientName} loading="lazy"
                className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/30" />
              <div>
                <h4 className="text-xs font-bold text-white">{t.clientName}</h4>
                <div className="text-[10px] text-pink-400 font-semibold">{t.role}</div>
                <div className="text-[10px] text-slate-500">{t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
