import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import Avatar from './Avatar';
import { WebSocketStatus } from './WebSocketStatus';
import { notificationsService, Notification } from '../services/notifications.service';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { state: wsState } = useWebSocketContext();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      // Rafraîchir toutes les 10 secondes pour les notifications
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de notifications non lues:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.est_lue) {
      try {
        await notificationsService.markAsRead(notification.id);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, est_lue: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    }

    // Navigation selon le type de notification
    if (notification.type === 'INVITATION' && notification.invitation_id) {
      navigate('/mes-invitations');
    } else if (notification.tache_id && notification.projet_id) {
      navigate(`/projets/${notification.projet_id}?tache=${notification.tache_id}`);
    } else if (notification.projet_id) {
      navigate(`/projets/${notification.projet_id}`);
    }

    setShowNotifications(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days}j`;
    }
  };

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, tasks, members..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* WebSocket Status */}
            <WebSocketStatus />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={async () => {
                  if (!showNotifications) {
                    await loadNotifications();
                  }
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2.5 hover:bg-slate-100 rounded-lg transition"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-40">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <p className="text-xs text-slate-500 mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            try {
                              await notificationsService.markAllAsRead();
                              setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })));
                              setUnreadCount(0);
                            } catch (error) {
                              console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                          Chargement...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                          Aucune notification
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition ${
                              !notif.est_lue ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <p className="text-sm text-slate-900">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTimeAgo(notif.date_creation)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          navigate('/mes-invitations');
                          setShowNotifications(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Voir toutes les notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Avatar prenom={user.prenom} nom={user.nom} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.prenom} {user.nom}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-40">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <Avatar prenom={user.prenom} nom={user.nom} size="md" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}