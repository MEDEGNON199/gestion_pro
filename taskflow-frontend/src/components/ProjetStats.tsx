import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface ProjetStatsProps {
  totalTaches: number;
  aFaire: number;
  enCours: number;
  terminees: number;
}

export default function ProjetStats({ totalTaches, aFaire, enCours, terminees }: ProjetStatsProps) {
  const progression = totalTaches > 0 ? Math.round((terminees / totalTaches) * 100) : 0;

  const stats = [
    {
      label: 'À faire',
      value: aFaire,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'En cours',
      value: enCours,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Terminées',
      value: terminees,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Progression',
      value: `${progression}%`,
      icon: TrendingUp,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}