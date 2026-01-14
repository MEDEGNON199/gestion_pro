import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Lock, User as UserIcon, Check, Shield, Eye, EyeOff, Sparkles, Mail, Crown, AlertCircle, CheckCircle2, Settings as SettingsIcon, Zap } from 'lucide-react';
import Avatar from '../components/Avatar';
import { utilisateursService } from '../services/utilisateurs.service';

type Tab = 'profil' | 'securite';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profil');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState({
    ancien: false,
    nouveau: false,
    confirm: false,
  });

  // États pour le profil
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [nom, setNom] = useState(user?.nom || '');
  const [email, setEmail] = useState(user?.email || '');

  // États pour le mot de passe
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  if (!user) return null;

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Faible';
    if (passwordStrength === 3) return 'Moyen';
    return 'Fort';
  };

  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      await utilisateursService.updateProfil({ prenom, nom, email });
      setSuccessMessage('Profil mis à jour avec succès !');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (nouveauMotDePasse.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (nouveauMotDePasse !== confirmMotDePasse) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await utilisateursService.changePassword({
        ancien_mot_de_passe: ancienMotDePasse,
        nouveau_mot_de_passe: nouveauMotDePasse,
      });
      
      setSuccessMessage('Mot de passe modifié avec succès ! Vous allez être déconnecté...');
      
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profil' as Tab, label: 'Profil', icon: UserIcon, gradient: 'from-blue-500 to-purple-600' },
    { id: 'securite' as Tab, label: 'Sécurité', icon: Lock, gradient: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-3 rounded-2xl">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                Paramètres
              </h1>
              <p className="text-white/60 text-lg mt-2 font-medium">
                Gérez votre compte et vos préférences
              </p>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 p-5 rounded-2xl backdrop-blur-xl border border-emerald-500/50 bg-emerald-500/10 flex items-center gap-4 animate-fade-in">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-emerald-300 font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Tabs Premium */}
        <div 
          className="rounded-3xl overflow-hidden backdrop-blur-xl animate-scale-in"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="border-b border-white/10">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {isActive && (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-20`} />
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient}`} />
                      </>
                    )}
                    <div className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${tab.gradient}` : 'bg-white/5'} transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="relative">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-8">
            {activeTab === 'profil' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <UserIcon className="w-6 h-6 text-white/60" />
                  <h2 className="text-2xl font-black text-white">Informations personnelles</h2>
                </div>

                {/* Avatar Section Premium */}
                <div 
                  className="flex items-center gap-6 p-6 rounded-2xl border border-white/10"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse-glow" />
                    <Avatar prenom={user.prenom} nom={user.nom} size="xl" />
                    <div className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full border-2 border-slate-900">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg mb-1">Photo de profil</h3>
                    <p className="text-sm text-white/60 font-medium">
                      Votre avatar est généré automatiquement à partir de vos initiales
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                        <span className="text-xs font-black text-white uppercase tracking-wider">Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire profil */}
                <form onSubmit={handleUpdateProfil} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-white/60" />
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-white/60" />
                        Nom
                      </label>
                      <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/60" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 font-bold overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Save className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'securite' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-white/60" />
                  <h2 className="text-2xl font-black text-white">Sécurité du compte</h2>
                </div>

                {/* Security Info Card */}
                <div 
                  className="p-6 rounded-2xl border border-emerald-500/30"
                  style={{ background: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white mb-2">Conseils de sécurité</h3>
                      <ul className="space-y-2 text-sm text-white/60">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Utilisez au moins 8 caractères</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Mélangez majuscules, minuscules et chiffres</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Ajoutez des caractères spéciaux</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-5 rounded-2xl backdrop-blur-xl border border-red-500/50 bg-red-500/10 flex items-center gap-4 animate-fade-in">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-red-300 font-semibold">{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.ancien ? 'text' : 'password'}
                        value={ancienMotDePasse}
                        onChange={(e) => setAncienMotDePasse(e.target.value)}
                        className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, ancien: !prev.ancien }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                      >
                        {showPassword.ancien ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white/60" />
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.nouveau ? 'text' : 'password'}
                        value={nouveauMotDePasse}
                        onChange={(e) => {
                          setNouveauMotDePasse(e.target.value);
                          calculatePasswordStrength(e.target.value);
                        }}
                        className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, nouveau: !prev.nouveau }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                      >
                        {showPassword.nouveau ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {nouveauMotDePasse && (
                      <div className="mt-3">
                        <div className="flex gap-1 mb-2">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                i < passwordStrength ? getPasswordStrengthColor() : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        {passwordStrength > 0 && (
                          <p className="text-xs font-bold text-white/60">
                            Force: <span className={passwordStrength >= 3 ? 'text-emerald-400' : 'text-orange-400'}>
                              {getPasswordStrengthText()}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-white/60" />
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        value={confirmMotDePasse}
                        onChange={(e) => setConfirmMotDePasse(e.target.value)}
                        className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 font-bold overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Lock className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{isLoading ? 'Changement...' : 'Changer le mot de passe'}</span>
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}