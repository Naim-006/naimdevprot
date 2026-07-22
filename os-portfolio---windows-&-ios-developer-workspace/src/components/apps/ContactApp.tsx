import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Info, MessageSquare } from 'lucide-react';
import { IconHelper } from '../common/IconHelper';

export const ContactApp: React.FC = () => {
  const { personalInfo, sendMessage } = usePortfolio();
  const [formData, setFormData] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.senderEmail || !formData.message) return;
    sendMessage(formData);
    setSubmitted(true);
    setFormData({ senderName: '', senderEmail: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const socialIcons: Record<string, string> = {
    github: 'Github', linkedin: 'Linkedin', twitter: 'Twitter', devto: 'Globe', website: 'Globe'
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <span>Contact</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Have a project, role, or inquiry? Send a message below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            Send Message
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-300">Message Sent!</h3>
              <p className="text-xs text-emerald-400/80">Your message has been delivered to the admin inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Name *</label>
                  <input type="text" required value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Email *</label>
                  <input type="email" required value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Subject</label>
                <input type="text" value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project / Opportunity"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Message *</label>
                <textarea rows={5} required value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Contact Info
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { icon: Mail, color: 'text-cyan-400', label: 'Email', value: personalInfo.email },
                { icon: Phone, color: 'text-emerald-400', label: 'Phone', value: personalInfo.phone },
                { icon: MapPin, color: 'text-purple-400', label: 'Location', value: personalInfo.location },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5">
                  <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500">{item.label}</div>
                    <div className="font-semibold text-white truncate">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Social</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(personalInfo.socials).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-xs font-semibold capitalize text-slate-300 hover:text-white transition border border-white/5 hover:border-cyan-500/30">
                  <IconHelper name={socialIcons[platform] || 'Globe'} className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
