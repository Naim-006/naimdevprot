import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BlogPost } from '../../types';
import { FileText, Search, Clock, Calendar, X, Tag, ExternalLink } from 'lucide-react';
import { fetchBlogPosts } from '../../lib/blog';

export const BlogApp: React.FC = () => {
  const { blogs } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [devPosts, setDevPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchBlogPosts({ signal: controller.signal }).then((posts) => {
      if (!controller.signal.aborted) {
        setDevPosts(posts);
        setLoading(false);
      }
    }).catch(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, []);

  const allPosts = [...devPosts, ...blogs].filter(
    (b) => b.published && (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlogs = allPosts;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Notes & Blog</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Articles, architecture notes, and technical deep-dives.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search articles..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-slate-700 rounded w-1/3" />
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-full" />
              </div>
            </div>
          ))
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No articles found.</p>
          </div>
        ) : (
          filteredBlogs.map((post) => (
            <div key={post.id} onClick={() => setSelectedPost(post)}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition cursor-pointer flex flex-col">
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img src={post.coverImage} alt={post.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <Tag className="w-3 h-3" />
                  {post.tag}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-xs font-bold text-indigo-400 group-hover:underline">
                  Read Article →
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-400 hover:text-white transition z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="rounded-xl overflow-hidden h-52 bg-slate-800">
              <img src={selectedPost.coverImage} alt={selectedPost.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-lg border border-indigo-500/30">
                  {selectedPost.tag}
                </span>
                <span>{selectedPost.date}</span>
                <span className="text-slate-600">•</span>
                <span>{selectedPost.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line border-t border-white/10 pt-4">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
