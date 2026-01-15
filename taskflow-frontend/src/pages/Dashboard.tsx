import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.services';
import { CheckCircle2, Clock, Folder, Calendar, ArrowRight, Activity, Zap, Rocket, Target } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold mb-4">Unable to load statistics</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Tasks In Progress',
      value: stats.tachesEnCours,
      icon: Zap,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Tasks Completed',
      value: stats.tachesTerminees,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Completion Rate',
      value: `${stats.tauxCompletion}%`,
      icon: Target,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {timeOfDay}, {user.prenom} 👋
              </h1>
              <p className="text-slate-600 text-lg">
                Here's an overview of your projects and tasks
              </p>
            </div>
            <button
              onClick={() => navigate('/projets')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <span>My Projects</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-slate-600 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Progress */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Monthly Progress
              </h3>
              <p className="text-slate-600">Task completion over time</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.progressionMensuelle}>
                <defs>
                  <linearGradient id="colorTaches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompletees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="mois" 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="taches" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  fill="url(#colorTaches)" 
                  name="Total Tasks" 
                />
                <Area 
                  type="monotone" 
                  dataKey="completees" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fill="url(#colorCompletees)" 
                  name="Completed" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Task Distribution
              </h3>
              <p className="text-slate-600">{totalTaches} total tasks</p>
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
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {repartitionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Recent Activities
              </h3>
              <p className="text-slate-600">Latest updates</p>
            </div>
            <div className="space-y-3">
              {stats.activitesRecentes.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No recent activity</p>
                </div>
              ) : (
                stats.activitesRecentes.map((activite: any) => (
                  <div 
                    key={activite.id} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      activite.type === 'create' ? 'bg-blue-100 text-blue-600' :
                      activite.type === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {activite.type === 'create' && <Folder className="w-4 h-4" />}
                      {activite.type === 'complete' && <CheckCircle2 className="w-4 h-4" />}
                      {activite.type === 'comment' && <Activity className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium">
                        {activite.action}
                      </p>
                      <p className="text-sm text-slate-600">{activite.projet}</p>
                      <p className="text-xs text-slate-400 mt-1">{activite.temps}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Upcoming Deadlines
              </h3>
              <p className="text-slate-600">Urgent tasks</p>
            </div>
            <div className="space-y-3">
              {stats.tachesProchaines.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No upcoming tasks</p>
                </div>
              ) : (
                stats.tachesProchaines.map((tache: any) => (
                  <div 
                    key={tache.id} 
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 line-clamp-1">
                        {tache.titre}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                        tache.priorite === 'HAUTE' ? 'bg-red-100 text-red-700' :
                        tache.priorite === 'MOYENNE' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tache.priorite}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{tache.projet}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{tache.echeance}</span>
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