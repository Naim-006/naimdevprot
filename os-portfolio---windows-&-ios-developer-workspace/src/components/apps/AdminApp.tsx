import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
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
  Star,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ProjectItem, SkillItem, ExperienceItem, EducationItem, TestimonialItem, BlogPost } from '../../types';

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

  const [loginUser, setLoginUser] = useState('admin');
  const [loginPass, setLoginPass] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'personal' | 'projects' | 'skills' | 'experience' | 'inbox' | 'testimonials' | 'blog' | 'system'
  >('dashboard');

  // Form states for personal info
  const [personalForm, setPersonalForm] = useState(personalInfo);

  // Modal / Add states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [newPass, setNewPass] = useState('');

  if (!isAdminAuthenticated) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal Access</h2>
          <p className="text-xs text-slate-500">Sign in to manage portfolio content dynamically.</p>
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
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email / Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin@email.com"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="password"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            {loggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg">
          Supabase Auth or local fallback: <span className="font-bold text-slate-700 dark:text-slate-200">admin / admin123</span>
        </p>
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
                    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
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

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Avatar Image URL</label>
              <input
                type="text"
                value={personalForm.avatarUrl}
                onChange={(e) => setPersonalForm({ ...personalForm, avatarUrl: e.target.value })}
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
              />
            </div>

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
                  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
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
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={editingProject.category || 'Full-Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold">Image URL</label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.techStack ? editingProject.techStack.join(', ') : ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        techStack: e.target.value.split(',').map((s) => s.trim())
                      })
                    }
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold">Short Description</label>
                <input
                  type="text"
                  value={editingProject.shortDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Full Description</label>
                <textarea
                  rows={3}
                  value={editingProject.fullDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                  className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs border border-slate-200 dark:border-slate-600 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!editingProject.title) return;
                    if (editingProject.id) {
                      updateProject(editingProject.id, editingProject);
                    } else {
                      addProject(editingProject as any);
                    }
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition"
                >
                  Save Project
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
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
                  <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
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
