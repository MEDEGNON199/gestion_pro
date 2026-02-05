import React from 'react';
import { Wifi, WifiOff, Users, AlertCircle } from 'lucide-react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface WebSocketStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { state } = useWebSocketContext();

  const getStatusColor = () => {
    if (state.connected) return 'text-emerald-500';
    if (state.connecting) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusText = () => {
    if (state.connected) return 'Connecté';
    if (state.connecting) return 'Connexion...';
    return 'Déconnecté';
  };

  const getStatusIcon = () => {
    if (state.connected) return <Wifi className="w-4 h-4" />;
    if (state.connecting) return <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />;
    return <WifiOff className="w-4 h-4" />;
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={getStatusColor()}>
          {getStatusIcon()}
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Statut Temps Réel</h3>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Erreur de connexion</p>
            <p className="text-xs text-red-600 mt-1">{state.error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Socket ID:</span>
          <span className="text-slate-900 font-mono text-xs">
            {state.socketId || 'N/A'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">Projet actuel:</span>
          <span className="text-slate-900">
            {state.currentProject || 'Aucun'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-600">Utilisateurs actifs:</span>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-slate-900 font-medium">
              {state.activeUsers.length}
            </span>
          </div>
        </div>

        {state.reconnectAttempts > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-600">Reconnexions:</span>
            <span className="text-amber-600 font-medium">
              {state.reconnectAttempts}
            </span>
          </div>
        )}
      </div>

      {state.activeUsers.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Utilisateurs en ligne</h4>
          <div className="space-y-1">
            {state.activeUsers.slice(0, 5).map((user) => (
              <div key={user.userId} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  user.status === 'online' ? 'bg-emerald-500' :
                  user.status === 'idle' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span className="text-xs text-slate-600">
                  {user.prenom} {user.nom}
                </span>
                {user.isTyping && (
                  <span className="text-xs text-blue-600 italic">tape...</span>
                )}
              </div>
            ))}
            {state.activeUsers.length > 5 && (
              <div className="text-xs text-slate-500">
                +{state.activeUsers.length - 5} autres
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketStatus;