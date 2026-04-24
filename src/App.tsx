import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  MessageSquare, 
  AlertCircle, 
  MapPin, 
  ChevronRight,
  RefreshCw,
  BarChart3,
  Newspaper,
  ThumbsUp,
  ThumbsDown,
  Activity,
  User,
  Calendar,
  Zap,
  Info,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  X,
  Trash2,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { trackElectionData, verifyCandidateSocials, type ElectionData, type Candidate, type CalendarEvent } from './services/geminiService';
import { BOOTSTRAP_CANDIDATES } from './constants/electionData';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#10B981', '#EF4444', '#6B7280'];

export default function App() {
  const [location, setLocation] = useState<'Texas City' | 'La Marque'>('Texas City');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ElectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [compareList, setCompareList] = useState<Candidate[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('background');
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState('All');

  useEffect(() => {
    // Light theme focused
  }, []);

  const filteredCandidates = data?.candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.background.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = posFilter === 'All' || c.position === posFilter;
    return matchesSearch && matchesPos;
  }) || [];

  const availablePositions = data ? ['All', ...Array.from(new Set(data.candidates.map(c => c.position)))] : ['All'];

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id);
  };

  const handleVerify = async (candidateId: string) => {
    if (!candidateId) return;
    setIsVerifying(true);
    try {
      await verifyCandidateSocials(candidateId);
      // Update local state
      if (data) {
        const newData = {
          ...data,
          candidates: data.candidates.map(c => 
            c.id === candidateId ? { ...c, socialsVerified: true } : c
          )
        };
        setData(newData);
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate({ ...selectedCandidate, socialsVerified: true });
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleComparison = (candidate: Candidate) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.name === candidate.name);
      if (exists) {
        return prev.filter(c => c.name !== candidate.name);
      }
      if (prev.length < 2) {
        return [...prev, candidate];
      }
      // Replace the second one if we already have two
      return [prev[0], candidate];
    });
  };

  const getInitialState = (loc: 'Texas City' | 'La Marque'): ElectionData => ({
    news: [],
    sentiment: { positive: 0, negative: 0, neutral: 0, summary: "Gathering sentiment..." },
    trends: [],
    patterns: [],
    candidates: BOOTSTRAP_CANDIDATES[loc],
    calendar: [],
    deepDive: { topic: "Analysis Pending", analysis: "Live intelligence is being synchronized...", impact: "Stand by." }
  });

  const fetchData = async (loc: 'Texas City' | 'La Marque', bypassCache = false) => {
    setLoading(true);
    setError(null);
    
    // Always reset to bootstrap data when switching locations to ensure immediate feedback
    const initial = getInitialState(loc);
    setData(initial);
    setSelectedCandidate(initial.candidates[0]);

    try {
      const cacheKey = `election_data_${loc.toLowerCase().replace(' ', '_')}_v3`;
      
      const result = await trackElectionData(loc, bypassCache);
      
      if (!result || !result.candidates || result.candidates.length === 0) {
        throw new Error("Intelligence engine returned incomplete data.");
      }

      localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      setData(result);
      if (result.candidates.length > 0) {
        // Find existing selected if possible
        if (selectedCandidate) {
          const updated = result.candidates.find(c => c.name === selectedCandidate.name);
          if (updated) setSelectedCandidate(updated);
        } else {
          setSelectedCandidate(result.candidates[0]);
        }
      }
    } catch (err) {
      setError('Intelligence sync pending. Using regional records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(location);
  }, [location]);

  const sentimentData = data ? [
    { name: 'Positive', value: data.sentiment.positive },
    { name: 'Negative', value: data.sentiment.negative },
    { name: 'Neutral', value: data.sentiment.neutral },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#EBEBEB] text-gray-900 selection:bg-[#00A7E1]/20">
      {/* Mobile Header Nav */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <Zap className="w-5 h-5 text-[#00A7E1]" />
           <h1 className="font-black text-lg tracking-tighter">BALLOT<span className="text-[#00A7E1]">LOGIC</span></h1>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => { setLocation('Texas City'); setCompareList([]); }}
             className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", location === 'Texas City' ? "bg-[#00A7E1] text-white shadow-lg shadow-[#00A7E1]/20" : "bg-gray-100 text-gray-500")}
           >
             Texas City
           </button>
           <button 
             onClick={() => { setLocation('La Marque'); setCompareList([]); }}
             className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", location === 'La Marque' ? "bg-[#00A7E1] text-white shadow-lg shadow-[#00A7E1]/20" : "bg-gray-100 text-gray-500")}
           >
             La Marque
           </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 h-screen sticky top-0 overflow-y-auto hidden lg:flex shadow-xl shadow-black/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00A7E1] rounded-lg shadow-lg shadow-[#00A7E1]/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight text-gray-900 tracking-tighter">BALLOT<span className="text-[#00A7E1]">LOGIC</span></h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Texas Coastal District</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1">Target Region</span>
          <button 
            onClick={() => { setLocation('Texas City'); setCompareList([]); }}
            className={cn(
              "flex items-center justify-between p-3.5 rounded-2xl transition-all text-sm font-black uppercase tracking-tight",
              location === 'Texas City' ? "bg-[#00A7E1] text-white shadow-lg shadow-[#00A7E1]/30 ring-4 ring-[#00A7E1]/10" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <MapPin className={cn("w-4 h-4", location === 'Texas City' ? "text-white" : "text-gray-300")} />
              Texas City
            </div>
            {location === 'Texas City' && <ChevronRight className="w-4 h-4 text-white/50" />}
          </button>
          <button 
            onClick={() => { setLocation('La Marque'); setCompareList([]); }}
            className={cn(
              "flex items-center justify-between p-3.5 rounded-2xl transition-all text-sm font-black uppercase tracking-tight",
              location === 'La Marque' ? "bg-[#00A7E1] text-white shadow-lg shadow-[#00A7E1]/30 ring-4 ring-[#00A7E1]/10" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <MapPin className={cn("w-4 h-4", location === 'La Marque' ? "text-white" : "text-gray-300")} />
              La Marque
            </div>
            {location === 'La Marque' && <ChevronRight className="w-4 h-4 text-white/50" />}
          </button>
        </nav>

        {data && (
          <div className="flex flex-col gap-6">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">Upcoming Calendar</span>
             <div className="space-y-4">
               {data.calendar.slice(0, 3).map((ev, i) => (
                 <div key={i} className="flex gap-3 px-3">
                   <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100">
                     <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">{ev.date.split(' ')[0]}</span>
                     <span className="text-sm font-black text-gray-800">{ev.date.split(' ')[1]}</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-800 line-clamp-1">{ev.event}</span>
                     <span className="text-[10px] text-gray-400 font-medium line-clamp-1">{ev.description}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto bg-[#EBEBEB]">
        <header className="flex flex-col lg:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-[#FFA630]/10 text-[#FFA630] text-[10px] font-black uppercase rounded-md tracking-tighter border border-[#FFA630]/20">Live Monitor</span>
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            </div>
            <h2 className="text-4xl font-serif font-black text-gray-900 tracking-tight">{location} Election Core</h2>
            <p className="text-gray-500 font-medium">Real-time candidate tracking and sentiment intelligence for the 2026 cycle.</p>
            <div className="flex items-center gap-2 mt-2">
               <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-gray-50 cursor-help">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Verified Source</span>
                  <span className="text-[9px] font-bold text-[#FFA630]">GALVESTONVOTES.ORG</span>
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FFA630]/10 rounded-lg border border-[#FFA630]/20">
                  <Activity className="w-2.5 h-2.5 text-[#FFA630]" />
                  <span className="text-[9px] font-black text-[#FFA630] uppercase tracking-tighter">Candidate DB Multi-Sync Active</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(location, true)}
              disabled={loading}
              className="group flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 hover:border-[#00A7E1] hover:ring-4 hover:ring-[#00A7E1]/10 hover:shadow-2xl hover:shadow-[#00A7E1]/10 transition-all disabled:opacity-50 active:scale-95 shadow-sm overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00A7E1]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <RefreshCw className={cn("w-4 h-4 text-[#00A7E1] transition-transform duration-500 group-hover:rotate-180", loading && "animate-spin")} />
              Update intelligence
            </button>
          </div>
        </header>

        {loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-[#00A7E1]/20 border-t-[#00A7E1] rounded-full animate-spin" />
                <Zap className="w-6 h-6 text-[#00A7E1] absolute inset-0 m-auto animate-pulse" />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-black text-gray-900">Bootstrapping Election Logic</h3>
                <p className="text-gray-500 font-medium">Connecting to Galveston County records...</p>
             </div>
          </div>
        ) : data ? (
          <div className="space-y-10">
            {loading && (
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#00A7E1] text-white rounded-full shadow-2xl flex items-center gap-3 border border-[#00A7E1]/20 backdrop-blur-xl"
               >
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FFA630]" />
                  <span className="text-xs font-black uppercase tracking-widest">Synchronizing Intelligence Cloud...</span>
               </motion.div>
            )}
            
            {error && (
               <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-800">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-bold">{error}</span>
               </div>
            )}
            {/* Sentiment Deep Dive */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-1 rounded-[3rem] border border-gray-200 shadow-xl overflow-hidden"
            >
               <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                  <div className="flex-1 p-8 lg:p-12 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#FFA630]/10 rounded-2xl">
                               <BarChart3 className="w-6 h-6 text-[#FFA630] drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Intelligence Feed</h3>
                         </div>
                         <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                             <Activity className="w-3.5 h-3.5 text-[#00A7E1]" />
                             <span className="text-[10px] font-black text-gray-700 uppercase">Live Sampling</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 group hover:border-green-300 transition-all">
                            <div className="flex items-center gap-2 mb-4">
                               <ThumbsUp className="w-4 h-4 text-green-600" />
                               <span className="text-xs font-black text-green-700 uppercase tracking-tighter">Support</span>
                            </div>
                            <div className="text-4xl font-black text-green-800 mb-1">{data.sentiment.positive}%</div>
                            <p className="text-xs text-green-600 font-medium line-clamp-1">Favorable mentions found</p>
                         </div>
                         <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 group hover:border-red-300 transition-all">
                            <div className="flex items-center gap-2 mb-4">
                               <ThumbsDown className="w-4 h-4 text-red-600" />
                               <span className="text-xs font-black text-red-700 uppercase tracking-tighter">Criticism</span>
                            </div>
                            <div className="text-4xl font-black text-red-800 mb-1">{data.sentiment.negative}%</div>
                            <p className="text-xs text-red-600 font-medium line-clamp-1">Negative discourse detected</p>
                         </div>
                         <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 group hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-2 mb-4">
                               <Activity className="w-4 h-4 text-[#00A7E1]" />
                               <span className="text-xs font-black text-[#00A7E1] uppercase tracking-tighter">Neutral</span>
                            </div>
                            <div className="text-4xl font-black text-[#00A7E1] mb-1">{data.sentiment.neutral}%</div>
                            <p className="text-xs text-[#00A7E1] font-medium line-clamp-1">Objective local reporting</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                         {[
                           { name: 'Facebook', url: `https://www.facebook.com/search/top?q=${encodeURIComponent(location + ' TX Election')}`, color: 'bg-[#1877F2]' },
                           { name: 'X / Twitter', url: `https://twitter.com/search?q=${encodeURIComponent(location + ' TX Election')}&f=live`, color: 'bg-black' },
                           { name: 'Nextdoor', url: `https://nextdoor.com/news_feed/`, color: 'bg-[#00B55A]' },
                           { name: 'Galv News', url: `https://www.galvnews.com/search/?q=${encodeURIComponent(location + ' election')}`, color: 'bg-[#004A99]' },
                           { name: 'Instagram', url: `https://www.instagram.com/explore/tags/${location.replace(' ', '')}Election/`, color: 'bg-[#E4405F]' },
                           { name: 'TikTok', url: `https://www.tiktok.com/search?q=${encodeURIComponent(location + ' Election')}`, color: 'bg-black' },
                           { name: 'Telegram', url: `https://t.me/s/TexasCityNews`, color: 'bg-[#0088CC]' },
                           { name: 'Discord', url: `https://discord.com/search?f=0&q=${encodeURIComponent(location + ' Election')}`, color: 'bg-[#5865F2]' },
                           { name: 'Mastodon', url: `https://mastodon.social/search?q=${encodeURIComponent(location + ' Election')}`, color: 'bg-[#6364FF]' },
                           { name: 'Bluesky', url: `https://bsky.app/search?q=${encodeURIComponent(location + ' Election')}`, color: 'bg-[#0085FF]' },
                         ].map((source) => (
                           <a 
                             key={source.name}
                             href={source.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#00A7E1]/40 hover:shadow-xl hover:shadow-[#00A7E1]/10 transition-all group"
                           >
                              <div className={`w-8 h-8 ${source.color} rounded-lg mb-2 flex items-center justify-center text-white text-[10px] font-black group-hover:scale-110 transition-transform`}>
                                 {source.name.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter text-center">{source.name}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </a>
                         ))}
                      </div>

                      <div className="p-8 bg-[#00A7E1] rounded-[2.5rem] text-white shadow-2xl shadow-[#00A7E1]/20 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 scale-150 opacity-10 group-hover:rotate-12 transition-transform">
                            <Zap className="w-24 h-24" />
                         </div>
                         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4">
                               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Market Insight</span>
                               <h4 className="text-2xl font-serif italic text-white leading-tight">
                                  {data.sentiment.summary}
                               </h4>
                               <div className="flex items-center gap-2 text-white/80">
                                   <Info className="w-4 h-4" />
                                   <div className="flex flex-col gap-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 flex items-center gap-1.5">
                                         <Zap className="w-3 h-3 text-[#FFA630] fill-current" />
                                         Sourced from 10+ social & news networks
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                         {['X', 'FB', 'Nextdoor', 'IG', 'TT', 'TG', 'Discord', 'Mastodon', 'Bluesky', 'GCD News'].map(p => (
                                           <span key={p} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/10 text-white leading-none">
                                              {p}
                                           </span>
                                         ))}
                                      </div>
                                   </div>
                               </div>
                            </div>
                            <div className="w-52 h-52 flex-shrink-0">
                               <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={sentimentData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={55}
                                      outerRadius={75}
                                      paddingAngle={4}
                                      dataKey="value"
                                      stroke="none"
                                      animationBegin={200}
                                      animationDuration={1200}
                                      animationEasing="ease-out"
                                    >
                                      {sentimentData.map((_entry, index) => (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill={['#4ADE80', '#F87171', '#94A3B8'][index % 3]} 
                                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip 
                                      contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                        padding: '10px 14px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                      }}
                                      formatter={(value: number, name: string) => [`${value}%`, name]}
                                      itemStyle={{ padding: '2px 0' }}
                                    />
                                  </PieChart>
                               </ResponsiveContainer>
                            </div>
                         </div>
                      </div>
                  </div>

                  <div className="w-full lg:w-96 bg-gray-50 p-8 lg:p-12 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#00A7E1]/10 rounded-2xl">
                           <Zap className="w-6 h-6 text-[#00A7E1]" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Pattern Tracking</h3>
                     </div>
                     <div className="space-y-4">
                        {data.patterns.map((p, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4"
                          >
                             <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-[#00A7E1] shadow-lg shadow-[#00A7E1]/50" />
                             <span className="text-sm text-gray-800 leading-relaxed font-medium">{p}</span>
                          </motion.div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.section>

            {/* Candidate Intelligence */}
            <section className="space-y-8">
              <div className="flex flex-col xl:flex-row gap-10">
                <div className="w-full xl:w-80 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#FFA630]/10 rounded-2xl">
                      <User className="w-6 h-6 text-[#FFA630]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ballot Intel</h3>
                      <p className="text-xs text-gray-700 font-medium">May 2026 Election Cycle</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Election Metrics</span>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                           <div className="text-2xl font-black text-gray-900">{filteredCandidates.length}</div>
                           <div className="text-[9px] font-bold text-gray-400 uppercase">Visible</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                           <div className="text-2xl font-black text-gray-900">
                              {new Set(filteredCandidates.map(c => c.position)).size}
                           </div>
                           <div className="text-[9px] font-bold text-gray-400 uppercase">Roles</div>
                        </div>
                     </div>
                     <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                        Applied Filters: {posFilter === 'All' ? 'All Roles' : posFilter} {searchQuery ? `+ "${searchQuery}"` : ''}
                     </p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                   <div className="bg-white p-2 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-2">
                      <div className="flex-1 relative w-full">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input 
                           type="text"
                           placeholder="Search by name or background profile..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-[11px] font-bold text-gray-900 border-none focus:ring-2 focus:ring-[#00A7E1]/20 transition-all outline-none"
                         />
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                           <select 
                             value={posFilter}
                             onChange={(e) => setPosFilter(e.target.value)}
                             className="w-full md:w-56 pl-4 pr-10 py-3 bg-gray-50 rounded-2xl text-[11px] font-black text-gray-900 border-none focus:ring-2 focus:ring-[#00A7E1]/20 transition-all outline-none appearance-none cursor-pointer"
                           >
                             {availablePositions.map(pos => (
                               <option key={pos} value={pos}>{pos === 'All' ? 'All Positions' : pos}</option>
                             ))}
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                        { (searchQuery || posFilter !== 'All') && (
                          <button 
                            onClick={() => { setSearchQuery(''); setPosFilter('All'); }}
                            className="p-3 bg-[#FFA630]/10 text-[#FFA630] rounded-2xl hover:bg-[#FFA630]/20 transition-colors"
                            title="Clear Filters"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                   </div>

                   <div className="flex flex-col gap-8">
                       {Array.from(new Set(filteredCandidates.map(c => c.position))).map((pos) => (
                        <div key={pos} className="bg-white p-8 rounded-[3rem] border border-gray-200 shadow-xl space-y-6 hover:border-[#FFA630]/20 transition-colors">
                           <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                              <div className="space-y-1">
                                 <h5 className="text-[11px] font-black text-[#FFA630] uppercase tracking-[0.2em]">{pos}</h5>
                                 <p className="text-[10px] text-gray-600 font-bold uppercase">Official Certified Seat</p>
                              </div>
                              <span className="text-[10px] font-black text-gray-600 bg-gray-50 px-3 py-1 rounded-full">{filteredCandidates.filter(c => c.position === pos).length} Candidates</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {filteredCandidates.filter(c => c.position === pos).map((c, i) => (
                                  <div key={i} className="flex gap-2">
                                  <button 
                                    onClick={() => setSelectedCandidate(c)}
                                    className={cn(
                                     "flex-1 px-6 py-4 rounded-2xl text-[12px] font-black transition-all text-left flex items-center justify-between group/btn relative overflow-hidden",
                                     selectedCandidate?.name === c.name 
                                      ? "bg-[#00A7E1] text-white shadow-lg shadow-[#00A7E1]/30 ring-4 ring-[#00A7E1]/10" 
                                      : "text-gray-800 bg-gray-50 hover:bg-gray-100"
                                    )}
                                  >
                                    <div className="flex flex-col gap-1 relative z-10">
                                      <div className="flex items-center gap-2">
                                        <span>{c.name}</span>
                                        {c.sourceVerified && (
                                          <CheckCircle2 className={cn("w-3 h-3", selectedCandidate?.name === c.name ? "text-white/80" : "text-[#00A7E1]")} />
                                        )}
                                      </div>
                                      <div className="flex gap-1.5">
                                        {c.background.toLowerCase().includes('incumbent') && (
                                          <span className={cn("text-[8px] px-1.5 py-0.5 rounded uppercase", selectedCandidate?.name === c.name ? "bg-white/20 text-white" : "bg-[#FFA630]/10 text-[#FFA630] underline decoration-dotted font-black")}>
                                            Incumbent
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 transition-all duration-300", selectedCandidate?.name === c.name ? "translate-x-0" : "translate-x-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 text-gray-400")} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleComparison(c); }}
                                    className={cn(
                                      "px-4 rounded-2xl border transition-all flex items-center justify-center",
                                      compareList.find(comp => comp.name === c.name)
                                        ? "bg-[#0474BA] border-[#0474BA] text-white shadow-lg shadow-[#0474BA]/20"
                                        : "bg-gray-50 border-gray-200 text-gray-400 hover:border-[#00A7E1] hover:text-[#00A7E1]"
                                    )}
                                    title="Add to comparison"
                                  >
                                    <ArrowLeftRight className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                      {filteredCandidates.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                           <div className="p-6 bg-gray-100 rounded-full">
                              <Search className="w-10 h-10 text-gray-300" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-gray-900">No synchronized intelligence found</h4>
                              <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Try adjusting your filters or refining your search term to discover candidates.</p>
                           </div>
                           <button 
                             onClick={() => { setSearchQuery(''); setPosFilter('All'); }}
                             className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-black shadow-lg hover:scale-105 transition-all"
                           >
                             Reset All Intelligence Filters
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Comparison Logic & Trigger */}
            {compareList.length > 0 && (
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-fit"
              >
                <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-3 rounded-[2.5rem] shadow-2xl flex items-center gap-4 ring-1 ring-black/5">
                   {compareList.map((c) => (
                     <div key={c.name} className="flex items-center gap-3 bg-gray-50/50 pr-4 rounded-full border border-gray-100">
                        <img 
                          src={c.imageUrl} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                          alt={c.name} 
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-black text-gray-900">{c.name.split(' ')[0]}</span>
                        <button 
                          onClick={() => toggleComparison(c)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                           <X className="w-3 h-3 text-gray-400" />
                        </button>
                     </div>
                   ))}
                   {compareList.length === 1 && (
                     <div className="w-32 h-10 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Add Second</span>
                     </div>
                   )}
                   {compareList.length === 2 && (
                     <>
                       <div className="w-px h-6 bg-gray-200 mx-1" />
                       <button 
                         onClick={() => setShowComparison(true)}
                         className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-xs font-black shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                       >
                         Compare Now
                       </button>
                       <button 
                         onClick={() => setCompareList([])}
                         className="p-2.5 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                         title="Clear all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </>
                   )}
                </div>
              </motion.div>
            )}

             <AnimatePresence>
               {showComparison && compareList.length === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-[#EBEBEB] overflow-y-auto p-4 lg:p-10"
                >
                   <div className="max-w-7xl mx-auto space-y-10 pb-20">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Candidate Clash</h2>
                            <p className="text-gray-700 font-medium text-sm">Side-by-side comparison of campaign DNA</p>
                         </div>
                         <button 
                           onClick={() => setShowComparison(false)}
                           className="p-4 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-xl"
                         >
                            <X className="w-6 h-6 text-gray-900" />
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <div className="w-16 h-16 bg-white rounded-full border-4 border-[#EBEBEB] flex items-center justify-center shadow-2xl">
                               <span className="font-black text-[#00A7E1] italic">VS</span>
                            </div>
                         </div>

                         {compareList.map((c, idx) => (
                           <div key={idx} className="bg-white rounded-[3rem] border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
                              <div className="relative h-64">
                                 {c.imageUrl ? (
                                   <img 
                                     src={c.imageUrl} 
                                     className="w-full h-full object-cover" 
                                     alt={c.name}
                                     referrerPolicy="no-referrer"
                                     onError={(e) => {
                                        (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-100');
                                        (e.target as HTMLImageElement).style.display = 'none';
                                     }}
                                   />
                                 ) : (
                                   <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                      <User className="w-12 h-12" />
                                   </div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                 <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-3xl font-black text-white">{c.name}</h3>
                                    <p className="text-[#FFA630] font-bold text-xs uppercase tracking-widest">{c.position}</p>
                                 </div>
                              </div>

                              <div className="p-10 space-y-10 flex-1">
                                 <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Background & Intel</span>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-[8]">{c.background}</p>
                                 </div>

                                 <div className="space-y-6">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Policy Stances</span>
                                    <div className="space-y-3">
                                       {c.stances.map((s, si) => (
                                         <div key={si} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00A7E1]" />
                                            <span className="text-xs font-bold text-gray-800">{s}</span>
                                         </div>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Election Highlights</span>
                                    <div className="space-y-3">
                                       {c.highlights.map((h, hi) => (
                                         <div key={hi} className="p-4 bg-[#FFA630]/10 rounded-2xl border border-[#FFA630]/20">
                                            <p className="text-xs font-black text-gray-900 italic">"{h}"</p>
                                         </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {selectedCandidate && (
                  <motion.div 
                    key={selectedCandidate.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 lg:grid-cols-6 gap-0 bg-white rounded-[3.5rem] border border-gray-200 shadow-2xl overflow-hidden"
                  >
                    <div className="lg:col-span-2 relative h-[400px] lg:h-full bg-gray-50 flex items-center justify-center overflow-hidden">
                       {selectedCandidate.imageUrl ? (
                         <img 
                           src={selectedCandidate.imageUrl} 
                           alt={selectedCandidate.name}
                           referrerPolicy="no-referrer"
                           className="absolute inset-0 w-full h-full object-cover"
                           onError={(e) => {
                              (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-100');
                              (e.target as HTMLImageElement).style.display = 'none';
                           }}
                         />
                       ) : (
                         <div className="flex flex-col items-center gap-2 text-gray-300">
                           <User className="w-12 h-12" />
                           <span className="text-[10px] font-black uppercase">No Official Image Found</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-transparent to-transparent" />
                       <div className="absolute bottom-0 left-0 p-8 space-y-2 w-full">
                          <h4 className="text-3xl font-black text-white leading-tight">{selectedCandidate.name}</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-0.5 bg-[#00A7E1] text-white text-[10px] font-black uppercase rounded-md tracking-tighter">Verified</span>
                               <p className="text-[#00A7E1] font-bold tracking-widest text-[10px] uppercase">{selectedCandidate.position || "Election Nominee"}</p>
                            </div>
                            {selectedCandidate.socials && selectedCandidate.socials.length > 0 && (
                              <div className="flex gap-2">
                                {selectedCandidate.socials.map((soc, idx) => (
                                  <a 
                                    key={idx} 
                                    href={soc.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg backdrop-blur-sm transition-colors border border-gray-200"
                                    title={soc.platform}
                                  >
                                    {soc.platform.toLowerCase().includes('facebook') ? (
                                      <Facebook className="w-3.5 h-3.5 text-white" />
                                    ) : soc.platform.toLowerCase().includes('twitter') || soc.platform.toLowerCase().includes('x') ? (
                                      <Twitter className="w-3.5 h-3.5 text-white" />
                                    ) : soc.platform.toLowerCase().includes('instagram') ? (
                                      <Instagram className="w-3.5 h-3.5 text-white" />
                                    ) : (
                                      <Globe className="w-3.5 h-3.5 text-white" />
                                    )}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-4 p-8 lg:p-12 space-y-6 bg-white overflow-hidden">
                        {/* Verification Alert */}
                        {!selectedCandidate.socialsVerified && (
                           <motion.div 
                             initial={{ opacity: 0, y: -20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-between gap-4"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="p-2.5 bg-blue-500/20 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-blue-100 uppercase tracking-tight">Social Media Unverified</p>
                                    <p className="text-[10px] text-blue-300 font-medium">Initiate verification to confirm official campaign channels.</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => selectedCandidate.id && handleVerify(selectedCandidate.id)}
                                disabled={isVerifying}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95"
                              >
                                 {isVerifying ? "Verifying..." : "Verify Now"}
                              </button>
                           </motion.div>
                        )}

                        {/* Accordion Container */}
                        <div className="space-y-4">
                           {/* Background Section */}
                           <div className="border border-white/5 rounded-[2rem] overflow-hidden transition-all bg-gray-50/10">
                              <button 
                                onClick={() => toggleAccordion('background')}
                                className={cn(
                                  "w-full flex items-center justify-between p-6 transition-colors",
                                  activeAccordion === 'background' ? "bg-blue-500/10" : "hover:bg-[#252D37]"
                                )}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-500/20 rounded-xl">
                                       <Info className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-widest">Background & Profile</h5>
                                 </div>
                                 <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", activeAccordion === 'background' && "rotate-180")} />
                              </button>
                              <AnimatePresence>
                                 {activeAccordion === 'background' && (
                                   <motion.div 
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: "auto", opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="overflow-hidden"
                                   >
                                      <div className="p-8 pt-0 text-gray-600 leading-relaxed font-medium space-y-4">
                                         {selectedCandidate.background.split('\n').map((p, i) => (
                                            <p key={i}>{p}</p>
                                         ))}
                                      </div>
                                   </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>

                           {/* Stances Section */}
                           <div className="border border-gray-100 rounded-[2rem] overflow-hidden transition-all">
                              <button 
                                onClick={() => toggleAccordion('stances')}
                                className={cn(
                                  "w-full flex items-center justify-between p-6 transition-colors",
                                  activeAccordion === 'stances' ? "bg-green-50/50" : "hover:bg-gray-50"
                                )}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-xl">
                                       <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest">Core Policy Stances</h5>
                                 </div>
                                 <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", activeAccordion === 'stances' && "rotate-180")} />
                              </button>
                              <AnimatePresence>
                                 {activeAccordion === 'stances' && (
                                   <motion.div 
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: "auto", opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="overflow-hidden"
                                   >
                                      <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {selectedCandidate.stances.map((s, i) => (
                                           <div key={i} className="flex gap-4 group">
                                              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                                 <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                              </div>
                                              <p className="text-gray-700 font-bold leading-snug flex-1 pt-1.5">{s}</p>
                                           </div>
                                         ))}
                                      </div>
                                   </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                       </div>

                       {/* Highlights Section */}
                       <div className="pt-4 space-y-4">
                           <div className="border border-gray-100 rounded-[2rem] overflow-hidden transition-all">
                              <button 
                                onClick={() => toggleAccordion('highlights')}
                                className={cn(
                                  "w-full flex items-center justify-between p-6 transition-colors",
                                  activeAccordion === 'highlights' ? "bg-orange-50/50" : "hover:bg-gray-50"
                                )}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-orange-100 rounded-xl">
                                       <Zap className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest">Campaign Highlights</h5>
                                 </div>
                                 <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", activeAccordion === 'highlights' && "rotate-180")} />
                              </button>
                              <AnimatePresence>
                                 {activeAccordion === 'highlights' && (
                                   <motion.div 
                                     initial={{ height: 0, opacity: 0 }}
                                     animate={{ height: "auto", opacity: 1 }}
                                     exit={{ height: 0, opacity: 0 }}
                                     className="overflow-hidden"
                                   >
                                      <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                                         {selectedCandidate.highlights.map((h, i) => (
                                           <div key={i} className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100/50">
                                              <p className="text-gray-900 font-black leading-relaxed italic">"{h}"</p>
                                           </div>
                                         ))}
                                      </div>
                                   </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                       </div>
                       {/* Sources Footer */}
                       <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                          <div className="flex items-center gap-4 text-gray-400">
                             <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                <Info className="w-4 h-4 text-gray-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Verified Intelligence</p>
                                <p className="text-[10px] text-gray-500 font-medium italic leading-none">Click sections to expand verified candidate data points.</p>
                             </div>
                          </div>

                          {selectedCandidate.socials && selectedCandidate.socials.length > 0 && (
                             <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 p-5 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 mb-4 lg:mb-0">
                                <div className="flex items-center gap-3 pr-6 sm:border-r border-orange-200">
                                   <ThumbsUp className="w-4 h-4 text-orange-600" />
                                   <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Connect</h6>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                   {selectedCandidate.socials.map((soc, i) => (
                                     <a 
                                       key={i} 
                                       href={soc.url} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group/soc"
                                     >
                                       <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-orange-50 group-hover/soc:bg-orange-100 transition-colors">
                                         {soc.platform.toLowerCase().includes('facebook') ? (
                                           <Facebook className="w-3.5 h-3.5 text-orange-600" />
                                         ) : soc.platform.toLowerCase().includes('twitter') || soc.platform.toLowerCase().includes('x') ? (
                                           <Twitter className="w-3.5 h-3.5 text-orange-600" />
                                         ) : soc.platform.toLowerCase().includes('instagram') ? (
                                           <Instagram className="w-3.5 h-3.5 text-orange-600" />
                                         ) : (
                                           <Globe className="w-3.5 h-3.5 text-orange-600" />
                                         )}
                                       </div>
                                       <span className="text-[10px] font-black text-gray-700 uppercase">{soc.platform}</span>
                                     </a>
                                   ))}
                                </div>
                             </div>
                          )}

                          <div className="w-full md:w-auto flex items-center gap-6 p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100/50">
                             <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
                                <Search className="w-4 h-4 text-gray-400" />
                                <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sources</h6>
                             </div>
                             <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {selectedCandidate.sources?.map((s, i) => {
                                  const isGeneral = s.url.endsWith('.gov') || s.url.endsWith('.org') || s.url.endsWith('.gov/') || s.url.endsWith('.org/');
                                  return (
                                    <a 
                                      key={i} 
                                      href={s.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={cn(
                                        "flex items-center gap-2 text-[10px] font-black transition-all group/link",
                                        isGeneral ? "text-gray-400 hover:text-gray-600" : "text-blue-600 hover:text-blue-800"
                                      )}
                                    >
                                      <div className={cn(
                                        "w-5 h-5 rounded-md flex items-center justify-center transition-colors",
                                        isGeneral ? "bg-gray-100 group-hover/link:bg-gray-200 text-gray-400" : "bg-blue-50 group-hover/link:bg-blue-100 text-blue-600"
                                      )}>
                                        {isGeneral ? <Globe className="w-2.5 h-2.5" /> : <ExternalLink className="w-2.5 h-2.5" />}
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="uppercase tracking-tighter">{s.title}</span>
                                         {isGeneral && <span className="text-[8px] font-medium opacity-60">Verified Primary Domain</span>}
                                      </div>
                                    </a>
                                  );
                                })}
                             </div>
                          </div>
                       </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Trends & Deep Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="lg:col-span-2 bg-white p-8 lg:p-12 rounded-[3.5rem] border border-gray-200 shadow-xl space-y-8"
               >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                           <TrendingUp className="w-6 h-6 text-[#00A7E1]" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Election Momentum</h3>
                     </div>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Mention Volume</span>
                  </div>

                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trends}>
                           <defs>
                              <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#FFA630" stopOpacity={0.15}/>
                                 <stop offset="95%" stopColor="#FFA630" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <XAxis dataKey="date" hide />
                           <YAxis hide />
                           <Tooltip 
                             contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#FFFFFF', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                             itemStyle={{ fontWeight: '800', color: '#111827' }}
                           />
                           <Area 
                             type="monotone" 
                             dataKey="mentions" 
                             stroke="#FFA630" 
                             fillOpacity={1} 
                             fill="url(#colorMentions)" 
                             strokeWidth={4}
                             dot={{ r: 4, fill: '#FFA630', strokeWidth: 4, stroke: '#FFFFFF' }}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </motion.div>

               <motion.div 
                 whileHover={{ y: -5 }}
                 className="lg:col-span-1 bg-white p-10 rounded-[3.5rem] text-gray-900 shadow-2xl shadow-gray-200 flex flex-col justify-between border border-gray-200"
               >
                  <div className="space-y-6">
                     <div className="p-3 bg-blue-50 rounded-2xl w-fit backdrop-blur-md border border-blue-100">
                        <MessageSquare className="w-6 h-6 text-[#00A7E1]" />
                     </div>
                     <div className="space-y-2">
                        <span className="text-[#FFA630] font-black text-[10px] uppercase tracking-[0.2em]">Deep Dive Report</span>
                        <h4 className="text-3xl font-black leading-tight tracking-tight text-gray-900">{data.deepDive.topic}</h4>
                     </div>
                     <p className="text-sm text-gray-800 leading-relaxed font-medium">
                        {data.deepDive.analysis}
                     </p>
                  </div>

                  <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                         <Activity className="w-4 h-4 text-[#FFA630]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#FFA630]">Projected Impact</span>
                      </div>
                      <p className="text-sm font-black text-gray-900 leading-snug">
                         {data.deepDive.impact}
                      </p>
                  </div>
               </motion.div>
            </div>

            {/* Feed & Calendar for Mobile/Tablets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#FFA630]/10 rounded-2xl">
                      <Newspaper className="w-6 h-6 text-[#FFA630]" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Stream</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.news.map((item, i) => (
                      <motion.a 
                        whileHover={{ scale: 1.02 }}
                        key={i} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm hover:border-[#FFA630]/50 hover:shadow-xl hover:shadow-[#FFA630]/5 transition-all group overflow-hidden relative"
                      >
                         <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform">
                            <ArrowRight className="w-12 h-12 text-[#FFA630]" />
                         </div>
                         <div className="relative z-10 space-y-4">
                            <span className="px-3 py-1 bg-[#FFA630]/10 text-[#FFA630] text-[10px] font-black uppercase rounded-full border border-[#FFA630]/20">{item.source}</span>
                            <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-[#FFA630] transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-700 font-medium line-clamp-3 leading-relaxed">{item.snippet}</p>
                         </div>
                      </motion.a>
                    ))}
                  </div>
               </div>

               <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <Calendar className="w-6 h-6 text-[#00A7E1]" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Election Roadmap</h3>
                  </div>
                  <div className="space-y-4">
                     {data.calendar.map((ev, i) => (
                        <div key={i} className="p-6 bg-white rounded-[2.5rem] border border-gray-200 shadow-sm flex gap-6 items-center group">
                           <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-3xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-[#00A7E1] group-hover:border-[#00A7E1] transition-all">
                              <span className="text-[10px] font-black text-[#00A7E1] uppercase group-hover:text-white transition-colors">{ev.date.split(' ')[0]}</span>
                              <span className="text-xl font-black text-gray-900 group-hover:text-white transition-colors">{ev.date.split(' ')[1]}</span>
                           </div>
                           <div className="space-y-1">
                              <h5 className="font-black text-gray-900 text-lg leading-tight">{ev.event}</h5>
                              <p className="text-xs text-gray-700 font-medium leading-relaxed">{ev.description}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        ) : !loading && !data && !error ? (
           <div className="text-center mt-32 space-y-6">
              <div className="p-6 bg-white inline-block rounded-[3rem] border border-gray-200 shadow-xl shadow-gray-200/50">
                 <Search className="w-12 h-12 text-[#00A7E1] animate-bounce" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2">Systems Ready</h3>
                 <p className="text-gray-700 font-medium">Click "Update Intelligence" to bridge to live election data.</p>
              </div>
           </div>
        ) : null}
      </main>
    </div>
  );
}
