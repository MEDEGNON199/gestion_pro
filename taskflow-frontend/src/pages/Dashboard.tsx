import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.services';
import { CheckCircle2, Clock, Folder, Calendar, ArrowRight, Activity, Zap, Rocket, Target, TrendingUp, Users, Star } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    loadStats();
    setGreeting();
  }, []);

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Good morning');
    else if (hour < 18) setTimeOfDay('Good afternoon');
    else setTimeOfDay('Good evening');
  };

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-700 font-semibold mt-6 text-lg">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load statistics</h3>
          <p className="text-slate-600 mb-6">There was an issue loading your dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const repartitionData = [
    { name: 'To Do', value: stats.repartitionTaches.aFaire, color: '#f59e0b' },
    { name: 'In Progress', value: stats.repartitionTaches.enCours, color: '#3b82f6' },
    { name: 'Completed', value: stats.repartitionTaches.terminees, color: '#10b981' },
  ];

  const totalTaches = stats.repartitionTaches.aFaire + stats.repartitionTaches.enCours + stats.repartitionTaches.terminees;

  const statsCards = [
    {
      label: 'Active Projects',
      value: stats.projetsActifs,
      icon: Rocket,
      bgGradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Tasks In Progress',
      value: stats.tachesEnCours,
      icon: Zap,
      bgGradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Tasks Completed',
      value: stats.tachesTerminees,
      icon: CheckCircle2,
      bgGradient: 'from-emerald-500 to-green-500',
      bgLight: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      trend: '+24%',
      trendUp: true,
    },
    {
      label: 'Completion Rate',
      value: `${stats.tauxCompletion}%`,
      icon: Target,
      bgGradient: 'from-purple-500 to-indigo-500',
      bgLight: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      trend: '+5%',
      trendUp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {timeOfDay}, {user.prenom} 👋
                  </h1>
                </div>
              </div>
              <p className="text-slate-600 text-lg font-medium">
                Here's an overview of your projects and tasks
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500">All systems operational</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/projets')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold group"
              >
                <span>My Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgLight} rounded-2xl p-6 border ${stat.borderColor} hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${stat.iconBg} rounded-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <TrendingUp className={`w-3 h-3 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={stat.trendUp ? 'text-green-600' : 'text-red-600'}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900 mb-1 group-hover:scale-105 transition-transform">
                      {stat.value}
                    </p>
                    <p className="text-slate-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Monthly Progress */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Monthly Progress
                  </h3>
                  <p className="text-slate-600">Task completion over time</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.progressionMensuelle}>
                <defs>
                  <linearGradient id="colorTaches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorCompletees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="mois" 
                  stroke="#64748b" 
                  style={{ fontSize: '12px', fontWeight: '500' }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: '12px', fontWeight: '500' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="taches" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  fill="url(#colorTaches)" 
                  name="Total Tasks" 
                />
                <Area 
                  type="monotone" 
                  dataKey="completees" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fill="url(#colorCompletees)" 
                  name="Completed" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Task Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Task Distribution
                  </h3>
                  <p className="text-slate-600">{totalTaches} total tasks</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={repartitionData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {repartitionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Recent Activities
                  </h3>
                  <p className="text-slate-600">Latest updates</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {stats.activitesRecentes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent activity</p>
                  <p className="text-slate-400 text-sm mt-1">Your activities will appear here</p>
                </div>
              ) : (
                stats.activitesRecentes.map((activite: any, index: number) => (
                  <div 
                    key={activite.id} 
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
                      activite.type === 'create' ? 'bg-blue-100 text-blue-600' :
                      activite.type === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {activite.type === 'create' && <Folder className="w-4 h-4" />}
                      {activite.type === 'complete' && <CheckCircle2 className="w-4 h-4" />}
                      {activite.type === 'comment' && <Activity className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-semibold group-hover:text-blue-600 transition-colors">
                        {activite.action}
                      </p>
                      <p className="text-sm text-slate-600 font-medium">{activite.projet}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activite.temps}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Upcoming Deadlines
                  </h3>
                  <p className="text-slate-600">Urgent tasks</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {stats.tachesProchaines.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No upcoming tasks</p>
                  <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                stats.tachesProchaines.map((tache: any, index: number) => (
                  <div 
                    key={tache.id} 
                    className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {tache.titre}
                      </h4>
                      <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-2 font-semibold ${
                        tache.priorite === 'HAUTE' ? 'bg-red-100 text-red-700 border border-red-200' :
                        tache.priorite === 'MOYENNE' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {tache.priorite}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">{tache.projet}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{tache.echeance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">Assigned</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}