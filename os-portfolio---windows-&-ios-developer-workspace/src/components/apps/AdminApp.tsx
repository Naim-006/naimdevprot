import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ImageUpload } from '../common/ImageUpload';
import { uploadImage } from '../../lib/storage';
import {
  Shield,
  Key,
  LogOut,
  BarChart3,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Mail,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  X,
  Download,
  Upload,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  Lock,
  Image,
  Link
} from 'lucide-react';
import { ProjectItem, ProjectMedia, ProjectLink, SkillItem, ExperienceItem, EducationItem, TestimonialItem, BlogPost } from '../../types';

export const AdminApp: React.FC = () => {
  const {
    personalInfo,
    skills,
    projects,
    experience,
    education,
    testimonials,
    messages,
    blogs,
    settings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updatePersonalInfo,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    markMessageRead,
    deleteMessage,
    addBlog,
    updateBlog,
    deleteBlog,
    updateSettings,
    exportJSONData,
    importJSONData
  } = usePortfolio();

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'personal' | 'projects' | 'skills' | 'experience' | 'inbox' | 'testimonials' | 'blog' | 'system'
  >('dashboard');

  // Form states for personal info
  const [personalForm, setPersonalForm] = useState(personalInfo);

  // Modal / Add states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [editingTest, setEditingTest] = useState<Partial<TestimonialItem> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [newPass, setNewPass] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState<number | null>(null);

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
        {/* Animated gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(-45deg, #0f172a, #1e1b4b, #0c4a6e, #0f766e, #1e1b4b)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          }}
        />
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[100px]" />

        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl motion-safe:animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl motion-safe:animate-pulse delay-1000" />

        {/* Login card */}
        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 space-y-7
            shadow-black/20">
            {/* Logo */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Access</h2>
                <p className="text-xs text-slate-400/80">Sign in to manage your portfolio</p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoggingIn(true);
                await loginAdmin(loginUser, loginPass);
                setLoggingIn(false);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300/90">Email</label>
                <div className="relative group">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition" />
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/20 transition group-hover:border-white/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300/90">Password</label>
                <div className="relative group">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/20 transition group-hover:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition" />
                {loggingIn ? (
                  <span className="relative flex items-center gap-2">
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2"><Lock className="w-3.5 h-3.5" />Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Management Console</h1>
            <p className="text-xs text-slate-400">Full dynamic control over portfolio content & messages.</p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Exit Admin Session</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'personal', label: 'Hero & Bio', icon: User },
          { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
          { id: 'skills', label: `Skills (${skills.length})`, icon: Cpu },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'inbox', label: `Inbox ${unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}`, icon: Mail },
          { id: 'testimonials', label: 'Testimonials', icon: Star },
          { id: 'blog', label: 'Blog Articles', icon: FileText },
          { id: 'system', label: 'Backup & Security', icon: Lock }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-3xl font-extrabold text-blue-600">{projects.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Projects</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600">{skills.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Tech Skills</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-3xl font-extrabold text-purple-600">{messages.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Received Messages</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-3xl font-extrabold text-amber-600">{settings.visitorCount}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Simulated Visits</div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Content Management</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingProject({
                    title: '',
                    shortDesc: '',
                    fullDesc: '',
                    category: 'Full-Stack',
                    techStack: ['React', 'TypeScript'],
                    imageUrl: '',
                    featured: true,
                    date: '2026-07'
                  });
                  setActiveTab('projects');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-purple-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>

              <button
                onClick={() => {
                  setEditingSkill({ name: '', category: 'Frontend', proficiency: 85, iconName: 'Code', featured: true });
                  setActiveTab('skills');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tech Skill</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                <Mail className="w-4 h-4" />
                <span>View Messages ({unreadMessagesCount} unread)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL INFO EDITOR */}
      {activeTab === 'personal' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePersonalInfo(personalForm);
          }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Hero & Personal Coordinates</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                value={personalForm.name}
                onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Professional Title</label>
              <input
                type="text"
                value={personalForm.title}
                onChange={(e) => setPersonalForm({ ...personalForm, title: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <ImageUpload
              currentUrl={personalForm.avatarUrl}
              folder="avatars"
              onUrlChange={(url) => setPersonalForm({ ...personalForm, avatarUrl: url })}
              label="Avatar Image"
            />

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Location</label>
              <input
                type="text"
                value={personalForm.location}
                onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Contact Email</label>
              <input
                type="text"
                value={personalForm.email}
                onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Phone / WhatsApp</label>
              <input
                type="text"
                value={personalForm.phone}
                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Resume URL</label>
              <input
                type="text"
                value={personalForm.resumeUrl}
                onChange={(e) => setPersonalForm({ ...personalForm, resumeUrl: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Availability Status</label>
              <input
                type="text"
                value={personalForm.availability}
                onChange={(e) => setPersonalForm({ ...personalForm, availability: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Short Bio Tagline</label>
            <input
              type="text"
              value={personalForm.tagline}
              onChange={(e) => setPersonalForm({ ...personalForm, tagline: e.target.value })}
              className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Detailed Biography</label>
            <textarea
              rows={4}
              value={personalForm.detailedBio}
              onChange={(e) => setPersonalForm({ ...personalForm, detailedBio: e.target.value })}
              className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['github', 'linkedin', 'twitter', 'devto', 'website'] as const).map((key) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 capitalize">{key} URL</label>
                  <input
                    type="text"
                    value={(personalForm.socials as any)[key] || ''}
                    onChange={(e) => setPersonalForm({
                      ...personalForm,
                      socials: { ...personalForm.socials, [key]: e.target.value }
                    })}
                    className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Years Exp.</label>
                <input type="number" value={personalForm.metrics.yearsExp}
                  onChange={(e) => setPersonalForm({ ...personalForm, metrics: { ...personalForm.metrics, yearsExp: Number(e.target.value) } })}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Projects</label>
                <input type="number" value={personalForm.metrics.projectsCompleted}
                  onChange={(e) => setPersonalForm({ ...personalForm, metrics: { ...personalForm.metrics, projectsCompleted: Number(e.target.value) } })}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Clients</label>
                <input type="number" value={personalForm.metrics.satisfiedClients}
                  onChange={(e) => setPersonalForm({ ...personalForm, metrics: { ...personalForm.metrics, satisfiedClients: Number(e.target.value) } })}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quality</label>
                <input type="text" value={personalForm.metrics.codeQualityRating}
                  onChange={(e) => setPersonalForm({ ...personalForm, metrics: { ...personalForm.metrics, codeQualityRating: e.target.value } })}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </form>
      )}

      {/* TAB 3: PROJECTS MANAGER */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Projects ({projects.length})</h2>
            <button
              onClick={() =>
                setEditingProject({
                  title: '',
                  shortDesc: '',
                  fullDesc: '',
                  category: 'Full-Stack',
                  techStack: ['React', 'TypeScript'],
                  imageUrl: '',
                  media: [],
                  links: [],
                  featured: true,
                  date: '2026-07'
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {editingProject && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-purple-500/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-purple-600 dark:text-purple-300">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Title</label>
                  <input type="text" value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Category</label>
                  <select value={editingProject.category || 'Full-Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600">
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
                <ImageUpload currentUrl={editingProject.imageUrl || ''} folder="projects"
                  onUrlChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })} label="Cover Image" />
                <div>
                  <label className="text-xs font-semibold">Tech Stack (comma separated)</label>
                  <input type="text" value={editingProject.techStack ? editingProject.techStack.join(', ') : ''}
                    onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value.split(',').map((s) => s.trim()) })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold">Short Description</label>
                <input type="text" value={editingProject.shortDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
              <div>
                <label className="text-xs font-semibold">Full Description</label>
                <textarea rows={3} value={editingProject.fullDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none" />
              </div>

              {/* Media Gallery — uploaded to Supabase Storage */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4 text-blue-500" />
                  Media Gallery (images & videos)
                </h4>
                <div className="space-y-2">
                  {((editingProject as any).media || []).map((m: ProjectMedia, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <span className="text-[10px] font-mono text-slate-400 w-12">{m.type}</span>
                      {m.url ? (
                        <div className="flex-1 flex items-center gap-2">
                          {m.type === 'video' ? (
                            <video src={m.url} className="w-12 h-8 rounded object-cover" />
                          ) : (
                            <img src={m.url} loading="lazy" className="w-12 h-8 rounded object-cover" />
                          )}
                          <span className="text-[10px] text-slate-400 truncate flex-1">{m.url.split('/').pop()}</span>
                        </div>
                      ) : (
                        <span className="flex-1 text-[10px] text-slate-500 italic">No file uploaded</span>
                      )}
                      <label className="px-2 py-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white text-[10px] font-bold rounded-lg cursor-pointer transition">
                        {uploadingMedia === i ? 'Uploading...' : 'Choose File'}
                        <input type="file" accept={m.type === 'video' ? 'video/*' : 'image/*'} className="hidden" disabled={uploadingMedia !== null}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || uploadingMedia !== null) return;
                            setUploadingMedia(i);
                            const result = await uploadImage(file, 'projects');
                            setUploadingMedia(null);
                            if (result) {
                              const media = [...((editingProject as any).media || [])];
                              media[i] = { ...media[i], url: result.url };
                              setEditingProject({ ...editingProject, media } as any);
                            }
                          }} />
                      </label>
                      <button onClick={() => {
                        const media = [...((editingProject as any).media || [])];
                        media.splice(i, 1);
                        setEditingProject({ ...editingProject, media } as any);
                      }} className="p-1 text-rose-500 hover:bg-rose-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProject({
                      ...editingProject,
                      media: [...((editingProject as any).media || []), { type: 'image', url: '' }]
                    } as any)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition">+ Image</button>
                    <button onClick={() => setEditingProject({
                      ...editingProject,
                      media: [...((editingProject as any).media || []), { type: 'video', url: '' }]
                    } as any)}
                      className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-700 transition">+ Video</button>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4 text-emerald-500" />
                  External Links (shown in gallery popup)
                </h4>
                <div className="space-y-2">
                  {((editingProject as any).links || []).map((link: ProjectLink, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={link.label} placeholder="Label"
                        onChange={(e) => {
                          const links = [...((editingProject as any).links || [])];
                          links[i] = { ...links[i], label: e.target.value };
                          setEditingProject({ ...editingProject, links } as any);
                        }}
                        className="w-28 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                      <input type="text" value={link.url} placeholder="https://..."
                        onChange={(e) => {
                          const links = [...((editingProject as any).links || [])];
                          links[i] = { ...links[i], url: e.target.value };
                          setEditingProject({ ...editingProject, links } as any);
                        }}
                        className="flex-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                      <button onClick={() => {
                        const links = [...((editingProject as any).links || [])];
                        links.splice(i, 1);
                        setEditingProject({ ...editingProject, links } as any);
                      }} className="p-1 text-rose-500 hover:bg-rose-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => setEditingProject({
                    ...editingProject,
                    links: [...((editingProject as any).links || []), { label: '', url: '' }]
                  } as any)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition">+ Link</button>
                </div>
              </div>

              {/* Demo URL + Featured + Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div>
                  <label className="text-xs font-semibold">Demo URL (optional)</label>
                  <input type="text" value={editingProject.demoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">GitHub URL (optional)</label>
                  <input type="text" value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold">Date</label>
                    <input type="text" value={editingProject.date || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                      className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={editingProject.featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="rounded" />
                    Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => {
                  if (!editingProject.title) return;
                  if (editingProject.id) { updateProject(editingProject.id, editingProject); }
                  else { addProject(editingProject as any); }
                  setEditingProject(null);
                }}
                  className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition">Save Project</button>
                <button type="button" onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3 truncate">
                  <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.title}</h4>
                    <span className="text-[10px] text-purple-500 font-semibold">{p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-purple-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SKILLS MANAGER */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tech Skills ({skills.length})</h2>
            <button
              onClick={() =>
                setEditingSkill({ name: '', category: 'Frontend', proficiency: 85, iconName: 'Code', featured: true })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          {editingSkill && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-emerald-500/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-emerald-600">
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold">Skill Name</label>
                  <input
                    type="text"
                    value={editingSkill.name || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={editingSkill.category || 'Frontend'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Backend & Database">Backend & Database</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Tools & Methods">Tools & Methods</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold">Proficiency % ({editingSkill.proficiency}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={editingSkill.proficiency || 80}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!editingSkill.name) return;
                    if (editingSkill.id) {
                      updateSkill(editingSkill.id, editingSkill);
                    } else {
                      addSkill(editingSkill as any);
                    }
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition"
                >
                  Save Skill
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</h4>
                  <span className="text-[10px] text-emerald-500 font-semibold">{s.category} ({s.proficiency}%)</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingSkill(s)}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-emerald-500"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(s.id)}
                    className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPERIENCE TAB */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Work Experience ({experience.length})</h2>
            <button
              onClick={() => setEditingExp({ company: '', role: '', period: '', location: '', description: '', achievements: [], technologies: [] })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-amber-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>

          {editingExp && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-amber-500/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-amber-600">{editingExp.id ? 'Edit Experience' : 'Add Experience'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Company</label>
                  <input type="text" value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Role</label>
                  <input type="text" value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Period</label>
                  <input type="text" value={editingExp.period || ''} placeholder="e.g. 2023 - Present"
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Location</label>
                  <input type="text" value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold">Description</label>
                <textarea rows={2} value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold">Achievements (one per line)</label>
                <textarea rows={3} value={(editingExp.achievements || []).join('\n')}
                  onChange={(e) => setEditingExp({ ...editingExp, achievements: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold">Technologies (comma separated)</label>
                <input type="text" value={(editingExp.technologies || []).join(', ')}
                  onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { if (!editingExp.company) return; if (editingExp.id) { updateExperience(editingExp.id, editingExp as any); } else { addExperience(editingExp as any); } setEditingExp(null); }}
                  className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-amber-700 transition">Save</button>
                <button onClick={() => setEditingExp(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {experience.map((e) => (
              <div key={e.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{e.role} <span className="text-amber-500 font-semibold">@ {e.company}</span></h4>
                  <span className="text-[10px] text-slate-400">{e.period} &middot; {e.location}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditingExp(e)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-amber-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteExperience(e.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Education ({education.length})</h2>
              <button onClick={() => setEditingExp({
                id: 'edu-new', company: '', role: '', period: '', location: '',
                description: '', achievements: [], technologies: [],
                _isEducation: true, institution: '', degree: '', field: '', year: '', grade: '', highlights: []
              } as any)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition">
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                      <span className="text-[10px] text-indigo-500 font-semibold">{edu.institution}</span>
                      <div className="text-[10px] text-slate-400">{edu.year} {edu.grade ? `| ${edu.grade}` : ''}</div>
                    </div>
                    <button onClick={() => deleteEducation(edu.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Testimonials ({testimonials.length})</h2>
            <button
              onClick={() => setEditingTest({ clientName: '', role: '', company: '', avatarUrl: '', quote: '', rating: 5 })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-pink-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          {editingTest && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-pink-500/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-pink-600">{editingTest.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Client Name</label>
                  <input type="text" value={editingTest.clientName || ''}
                    onChange={(e) => setEditingTest({ ...editingTest, clientName: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Role</label>
                  <input type="text" value={editingTest.role || ''}
                    onChange={(e) => setEditingTest({ ...editingTest, role: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Company</label>
                  <input type="text" value={editingTest.company || ''}
                    onChange={(e) => setEditingTest({ ...editingTest, company: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Rating (1-5)</label>
                  <select value={editingTest.rating || 5}
                    onChange={(e) => setEditingTest({ ...editingTest, rating: parseInt(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600">
                    {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <ImageUpload currentUrl={editingTest.avatarUrl || ''} folder="avatars"
                onUrlChange={(url) => setEditingTest({ ...editingTest, avatarUrl: url })} label="Avatar Image" />
              <div>
                <label className="text-xs font-semibold">Quote</label>
                <textarea rows={3} value={editingTest.quote || ''}
                  onChange={(e) => setEditingTest({ ...editingTest, quote: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { if (!editingTest.clientName) return; if (editingTest.id) { updateTestimonial(editingTest.id, editingTest as any); } else { addTestimonial(editingTest as any); } setEditingTest(null); }}
                  className="px-4 py-2 bg-pink-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-pink-700 transition">Save</button>
                <button onClick={() => setEditingTest(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <img src={t.avatarUrl} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.clientName}</h4>
                    <span className="text-[10px] text-pink-500 font-semibold">{t.role} @ {t.company}</span>
                    <div className="text-[9px] text-slate-400 truncate">{t.quote.slice(0, 60)}...</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditingTest(t)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-pink-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOG TAB */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Blog Articles ({blogs.length})</h2>
            <button
              onClick={() => setEditingBlog({ title: '', slug: '', tag: 'General', excerpt: '', content: '', readTime: '5 min read', date: '', coverImage: '', published: true })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Article</span>
            </button>
          </div>

          {editingBlog && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-indigo-500/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-indigo-600">{editingBlog.id ? 'Edit Article' : 'Add Article'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold">Title</label>
                  <input type="text" value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Slug</label>
                  <input type="text" value={editingBlog.slug || ''} placeholder="my-article-slug"
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Tag</label>
                  <input type="text" value={editingBlog.tag || 'General'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, tag: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Read Time</label>
                  <input type="text" value={editingBlog.readTime || '5 min read'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600" />
                </div>
              </div>
              <ImageUpload currentUrl={editingBlog.coverImage || ''} folder="blogs"
                onUrlChange={(url) => setEditingBlog({ ...editingBlog, coverImage: url })} label="Cover Image" />
              <div>
                <label className="text-xs font-semibold">Excerpt</label>
                <textarea rows={2} value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold">Content (Markdown)</label>
                <textarea rows={6} value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none font-mono" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { if (!editingBlog.title) return; if (editingBlog.id) { updateBlog(editingBlog.id, editingBlog as any); } else { addBlog(editingBlog as any); } setEditingBlog(null); }}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition">Save Article</button>
                <button onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  {b.coverImage && <img src={b.coverImage} alt="" loading="lazy" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{b.title}</h4>
                    <span className="text-[10px] text-indigo-500 font-semibold">{b.tag} &middot; {b.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditingBlog(b)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteBlog(b.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INBOX MESSAGES */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Received Contact Messages ({messages.length})</h2>

          {messages.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              No messages received yet.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition shadow-sm ${
                    m.read
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-90'
                      : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-400/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{m.senderName}</span>
                      <span className="text-xs text-slate-400 ml-2">({m.senderEmail})</span>
                      {m.whatsapp && (
                        <a href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                          className="text-xs text-emerald-500 ml-2 hover:text-emerald-400 font-semibold">
                          {m.whatsapp}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                      {!m.read && (
                        <button
                          onClick={() => markMessageRead(m.id)}
                          className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{m.subject || 'No Subject'}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SYSTEM & BACKUP */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              <span>Export & Backup Portfolio JSON Database</span>
            </h3>

            <p className="text-xs text-slate-500">
              Download or copy full JSON structure containing projects, skills, profile, and settings.
            </p>

            <button
              onClick={() => {
                const dataStr = exportJSONData();
                navigator.clipboard.writeText(dataStr);
                alert('Portfolio JSON copied to clipboard!');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Copy Full Portfolio JSON</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              <span>Import Portfolio JSON Payload</span>
            </h3>

            <textarea
              rows={4}
              placeholder="Paste valid JSON database payload..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-600 resize-none"
            />

            <button
              onClick={() => {
                if (!importJsonText) return;
                importJSONData(importJsonText);
                setImportJsonText('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Portfolio from JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
