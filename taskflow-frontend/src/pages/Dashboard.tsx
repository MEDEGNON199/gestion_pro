import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.services';
import { TrendingUp, CheckCircle2, Clock, Folder, Calendar, Target, ArrowRight, Activity, Zap, Users, Star, Award, BarChart3, PieChart as PieChartIcon, Sparkles, Trophy, Flame, Rocket, Brain, TrendingDown } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    loadStats();
    setGreeting();
  }, []);

  useEffect(() => {
    if (stats) {
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [stats]);

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Bonjour');
    else if (hour < 18) setTimeOfDay('Bon après-midi');
    else setTimeOfDay('Bonsoir');
  };

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 border border-slate-200/50 shadow-lg animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
        <div className="w-20 h-8 bg-slate-200 rounded-xl" />
      </div>
      <div className="w-24 h-10 bg-slate-200 rounded-xl mb-2" />
      <div className="w-36 h-5 bg-slate-200 rounded-lg" />
    </div>
  );

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="mb-8 animate-pulse">
            <div className="w-80 h-12 bg-white/10 rounded-2xl mb-3" />
            <div className="w-[500px] h-8 bg-white/10 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto mb-6 flex items-center justify-center backdrop-blur-xl border border-white/20">
            <Activity className="w-10 h-10 text-white/60" />
          </div>
          <p className="text-white/80 font-semibold text-lg">Impossible de charger les statistiques</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const repartitionData = [
    { name: 'À faire', value: stats.repartitionTaches.aFaire, color: '#f59e0b', emoji: '📋' },
    { name: 'En cours', value: stats.repartitionTaches.enCours, color: '#3b82f6', emoji: '⚡' },
    { name: 'Terminées', value: stats.repartitionTaches.terminees, color: '#10b981', emoji: '✅' },
  ];

  const totalTaches = stats.repartitionTaches.aFaire + stats.repartitionTaches.enCours + stats.repartitionTaches.terminees;

  const performanceData = [
    { metric: 'Rapidité', value: 85, fullMark: 100 },
    { metric: 'Qualité', value: 92, fullMark: 100 },
    { metric: 'Organisation', value: stats.tauxCompletion, fullMark: 100 },
    { metric: 'Collaboration', value: 78, fullMark: 100 },
    { metric: 'Innovation', value: 88, fullMark: 100 },
  ];

  const statsCards = [
    {
      label: 'Projets actifs',
      value: stats.projetsActifs.toString(),
      change: '+12%',
      changeValue: 3,
      icon: Rocket,
      trend: 'up',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      description: 'En progression',
    },
    {
      label: 'Tâches en cours',
      value: stats.tachesEnCours.toString(),
      change: '+8%',
      changeValue: 5,
      icon: Zap,
      trend: 'up',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      description: 'À compléter',
    },
    {
      label: 'Tâches terminées',
      value: stats.tachesTerminees.toString(),
      change: '+23%',
      changeValue: 12,
      icon: Trophy,
      trend: 'up',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      description: 'Cette semaine',
    },
    {
      label: 'Performance',
      value: `${stats.tauxCompletion}%`,
      change: '+5%',
      changeValue: 4,
      icon: Flame,
      trend: 'up',
      gradient: 'from-pink-500 via-rose-500 to-purple-600',
      glowColor: 'rgba(236, 72, 153, 0.3)',
      description: 'Score global',
    },
  ];

  const CircularProgress = ({ percentage, color, label, emoji, delay = 0 }: any) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    
    useEffect(() => {
      setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, delay);
    }, [percentage, delay]);

    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - animatedPercentage / 100);

    return (
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-xl" />
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
          <circle
            cx="80" cy="80" r={radius} stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-[2000ms] ease-out"
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-1">{emoji}</p>
            <p className="text-4xl font-black text-white transition-all duration-1000">{animatedPercentage}%</p>
            <p className="text-xs text-white/60 font-bold mt-1 uppercase tracking-wider">{label}</p>
          </div>
        </div>
      </div>
    );
  };

  const MiniSparkline = ({ data, gradient }: any) => (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${gradient}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke="rgba(255,255,255,0.8)" strokeWidth={3} fill={`url(#gradient-${gradient})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const productivitePercentage = stats.tauxCompletion;
  const delaisPercentage = totalTaches > 0 ? Math.round((stats.tachesTerminees / totalTaches) * 100) : 0;
  const collaborationPercentage = 78;

  const sparklineData = statsCards.map((_, i) => 
    Array.from({ length: 10 }, (_, j) => ({ value: Math.random() * 100 + 40 + i * 10 }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
                  <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-3 rounded-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-5xl font-black text-white tracking-tight">
                      Intelligence Dashboard
                    </h1>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-lg opacity-60 animate-pulse" />
                      <span className="relative px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black rounded-full shadow-lg">
                        ⚡ LIVE
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-lg mt-2 font-medium">
                    {timeOfDay} <span className="text-white font-bold">{user.prenom}</span> 👋 • Votre performance en temps réel
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Streak actuel</p>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-black text-white">7 jours 🔥</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/projets')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 font-bold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                  <span>Mes Projets</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-3xl p-6 transition-all duration-700 cursor-pointer hover:scale-105 ${
                  animateCards ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-700`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm" />
                      <Icon className="w-7 h-7 text-white relative z-10" />
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                        stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-black">{stat.change}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-1 font-bold">+{stat.changeValue} ce mois</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-5xl font-black text-white mb-2 tracking-tight">{stat.value}</p>
                    <p className="text-white/80 font-bold text-base mb-1">{stat.label}</p>
                    <p className="text-white/40 text-sm font-semibold">{stat.description}</p>
                  </div>
                  <div className="h-12 -mx-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <MiniSparkline data={sparklineData[index]} gradient={`sparkline-${index}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Performance Analytics</h3>
                <p className="text-white/60 font-semibold">Progression sur 6 mois • Tendance 📈 +18%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={stats.progressionMensuelle}>
                <defs>
                  <linearGradient id="colorTaches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompletees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mois" stroke="rgba(255,255,255,0.6)" style={{ fontSize: '13px', fontWeight: 700 }} />
                <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '13px', fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 700, color: '#fff' }} />
                <Area type="monotone" dataKey="taches" stroke="#8b5cf6" strokeWidth={4} fill="url(#colorTaches)" name="Total tâches" dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 3, stroke: '#fff' }} />
                <Area type="monotone" dataKey="completees" stroke="#10b981" strokeWidth={4} fill="url(#colorCompletees)" name="Complétées" dot={{ fill: '#10b981', r: 6, strokeWidth: 3, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-700" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-white">Distribution</h3>
                <PieChartIcon className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-white/60 font-semibold">{totalTaches} tâches totales</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  {repartitionData.map((entry, index) => (
                    <filter key={index} id={`glow-${index}`}>
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  ))}
                </defs>
                <Pie 
                  data={repartitionData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={6} 
                  dataKey="value"
                  strokeWidth={2}
                  stroke="rgba(255,255,255,0.1)"
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} filter={`url(#glow-${index})`} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    fontSize: '13px', 
                    fontWeight: 700,
                    color: '#fff',
                    backdropFilter: 'blur(20px)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 mt-6">
              {repartitionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl shadow-xl flex items-center justify-center text-xl" style={{ backgroundColor: item.color }}>
                        {item.emoji}
                      </div>
                    </div>
                    <span className="font-bold text-white">{item.name}</span>
                  </div>
                  <span className="text-2xl font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Productivité', percentage: productivitePercentage, color: '#10b981', label: 'complétées', emoji: '🎯', icon: Target, gradient: 'from-emerald-500 to-teal-500' },
            { title: 'Ponctualité', percentage: delaisPercentage, color: '#3b82f6', label: 'à temps', emoji: '⏰', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
            { title: 'Collaboration', percentage: collaborationPercentage, color: '#a855f7', label: 'engagement', emoji: '🤝', icon: Users, gradient: 'from-purple-500 to-pink-500' }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="relative rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 group overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-white">{item.title}</h3>
                    <div className={`p-3 bg-gradient-to-br ${item.gradient} rounded-xl shadow-xl`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CircularProgress percentage={item.percentage} color={item.color} label={item.label} emoji={item.emoji} delay={index * 300} />
                  <div className="flex items-center justify-center">
                    <span className={`text-sm font-black px-4 py-2 rounded-xl bg-gradient-to-r ${item.gradient} text-white`}>
                      +{Math.floor(Math.random() * 15 + 8)}% ce mois 🚀
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Radar Chart - NEW! */}
          <div className="rounded-3xl p-8 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-700" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Performance Radar</h3>
                <p className="text-white/60 font-semibold">Analyse multidimensionnelle de vos compétences</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.7)" style={{ fontSize: '12px', fontWeight: 700 }} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                <Radar name="Performance" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} strokeWidth={3} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                    backdropFilter: 'blur(20px)'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Activities */}
          <div className="rounded-3xl p-8 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-700" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Activités récentes</h3>
                <p className="text-white/60 font-semibold">En temps réel</p>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-bold transition-colors flex items-center gap-2">
                Tout voir <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {stats.activitesRecentes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-white/40" />
                  </div>
                  <p className="text-white/60 font-semibold">Aucune activité récente</p>
                </div>
              ) : (
                stats.activitesRecentes.map((activite: any, index: number) => (
                  <div key={activite.id} className={`group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer border border-white/5 ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${(index + 12) * 50}ms` }}>
                    <div className={`relative p-3 rounded-xl shadow-xl ${activite.type === 'create' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : activite.type === 'complete' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : activite.type === 'comment' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}>
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm" />
                      {activite.type === 'create' && <Folder className="w-5 h-5 text-white relative z-10" />}
                      {activite.type === 'complete' && <CheckCircle2 className="w-5 h-5 text-white relative z-10" />}
                      {activite.type === 'comment' && <Activity className="w-5 h-5 text-white relative z-10" />}
                      {activite.type === 'invite' && <Star className="w-5 h-5 text-white relative z-10" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white"><span className="text-blue-400">{user.prenom}</span> {activite.action}</p>
                      <p className="text-sm text-white/70 font-semibold mt-1">{activite.projet}</p>
                      <p className="text-xs text-white/40 mt-2 font-semibold">{activite.temps}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-3xl p-8 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-700 mb-10" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Prochaines échéances</h3>
              <p className="text-white/60 font-semibold">Planification intelligente</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          {stats.tachesProchaines.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-white/60 font-semibold">Aucune tâche à venir</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.tachesProchaines.map((tache: any, index: number) => (
                <div key={tache.id} className={`group p-6 border-2 border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/5 hover:shadow-xl transition-all duration-300 cursor-pointer ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${(index + 12) * 50}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-black text-white text-lg line-clamp-2">{tache.titre}</h4>
                    <span className={`text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap ml-2 ${tache.priorite === 'HAUTE' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : tache.priorite === 'MOYENNE' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : 'bg-white/10 text-white/80'}`}>
                      {tache.priorite === 'HAUTE' ? '🔥 Haute' : tache.priorite === 'MOYENNE' ? '⚡ Moyenne' : '📌 Basse'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-4 font-semibold line-clamp-1">{tache.projet}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/50 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>Dans {tache.echeance}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section - NEW! */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🏆', title: 'Expert', desc: '100 tâches complétées', color: 'from-yellow-500 to-orange-500' },
            { icon: '⚡', title: 'Rapide', desc: '10 jours consécutifs', color: 'from-blue-500 to-cyan-500' },
            { icon: '🎯', title: 'Précis', desc: '95% de précision', color: 'from-emerald-500 to-teal-500' },
            { icon: '🌟', title: 'Leader', desc: '5 projets créés', color: 'from-purple-500 to-pink-500' },
          ].map((achievement, index) => (
            <div 
              key={index}
              className={`group relative rounded-2xl p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ 
                animationDelay: `${(index + 20) * 50}ms`,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`} />
              <div className="relative text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl shadow-xl mb-3 text-3xl`}>
                  {achievement.icon}
                </div>
                <h4 className="font-black text-white text-lg mb-1">{achievement.title}</h4>
                <p className="text-white/60 text-sm font-semibold">{achievement.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}