import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Download, ExternalLink, MapPin, Mail, Phone, MessageCircle, Award, Shield, CheckCircle2, Briefcase, Code, Users, TrendingUp, Globe, Github, Linkedin, Twitter, Facebook } from 'lucide-react';

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  devto: <Facebook className="w-4 h-4" />,
};

const SOCIAL_LABELS: Record<string, string> = {
  devto: 'facebook',
};

export const AboutApp: React.FC = () => {
  const { personalInfo, openWindow } = usePortfolio();

  const metrics = [
    { value: `${personalInfo.metrics.yearsExp}+`, label: 'Years Experience', icon: Briefcase, color: 'text-blue-400' },
    { value: `${personalInfo.metrics.projectsCompleted}+`, label: 'Projects Shipped', icon: Code, color: 'text-emerald-400' },
    { value: `${personalInfo.metrics.satisfiedClients}+`, label: 'Happy Clients', icon: Users, color: 'text-purple-400' },
    { value: personalInfo.metrics.codeQualityRating, label: 'Code Quality', icon: TrendingUp, color: 'text-amber-400' },
  ];

  const contacts = [
    { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: Phone, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    { icon: MessageCircle, label: 'WhatsApp', value: personalInfo.phone, href: `https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}` },
    { icon: MapPin, label: 'Location', value: personalInfo.location, href: null },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 shadow-2xl border border-white/10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition" />
            <img src={personalInfo.avatarUrl} alt={personalInfo.name} loading="lazy"
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-2 border-white/30 shadow-xl transition transform group-hover:scale-105" />
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {personalInfo.availability}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{personalInfo.name}</h1>
            <p className="text-base md:text-lg text-blue-200/80 font-medium">{personalInfo.title}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a href={personalInfo.resumeUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-100 transition shadow-lg shadow-white/10">
                <Download className="w-4 h-4" /> Resume
              </a>
              <button onClick={() => openWindow('contact')} type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition">
                <Mail className="w-4 h-4" /> Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label}
            className="group bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 text-center hover:border-white/20 transition cursor-default">
            <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
            <div className={`text-2xl md:text-3xl font-extrabold ${m.color}`}>{m.value}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Contact + Bio + Socials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            Contact
          </h3>
          <div className="space-y-2">
            {contacts.map((c) => (
              c.href ? (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 text-xs transition border border-white/5 hover:border-blue-500/30">
                  <c.icon className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500">{c.label}</div>
                    <div className="font-semibold text-slate-200 truncate">{c.value}</div>
                  </div>
                </a>
              ) : (
                <div key={c.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 text-xs border border-white/5">
                  <c.icon className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500">{c.label}</div>
                    <div className="font-semibold text-slate-200 truncate">{c.value}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Biography */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            Biography
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
            {personalInfo.detailedBio}
          </p>
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
            <button onClick={() => openWindow('skills')} type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition border border-blue-500/30">
              Explore Skills <ExternalLink className="w-3 h-3" />
            </button>
            <button onClick={() => openWindow('projects')} type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition border border-purple-500/30">
              View Projects <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          Social Links
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(personalInfo.socials).map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 text-xs font-semibold capitalize text-slate-300 hover:text-white transition border border-white/5 hover:border-blue-500/30">
              {SOCIAL_ICONS[key] || <Globe className="w-4 h-4" />}
              <span>{SOCIAL_LABELS[key] || key}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
