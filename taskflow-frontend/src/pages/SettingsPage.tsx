import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import Avatar from '../components/Avatar';
import { utilisateursService } from '../services/utilisateurs.service';

type Tab = 'profile' | 'security';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  // Profile states
  const [firstName, setFirstName] = useState(user?.prenom || '');
  const [lastName, setLastName] = useState(user?.nom || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Medium';
    return 'Strong';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      await utilisateursService.updateProfil({ email });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await utilisateursService.changePassword({
        ancien_mot_de_passe: currentPassword,
        nouveau_mot_de_passe: newPassword,
      });

      setSuccessMessage('Password changed successfully! You will be logged out...');
      setTimeout(() => logout(), 2000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Error changing password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: UserIcon, gradient: 'from-blue-500 to-purple-600' },
    { id: 'security' as Tab, label: 'Security', icon: Lock, gradient: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-5 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-emerald-600 font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10">
          <div className="border-b border-white/10 flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold transition-all ${
                    isActive ? 'text-slate-900 bg-white/10' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${tab.gradient} text-white` : 'bg-white/5 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-8 space-y-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6 p-6 rounded-2xl border border-white/10 bg-white/5">
                  <Avatar prenom={user.prenom} nom={user.nom} size="xl" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Profile Picture</h3>
                    <p className="text-slate-600 text-sm">Automatically generated from your initials</p>
                  </div>
                </div>

                {/* Profile form */}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none text-slate-900" required/>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none text-slate-900" required/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none text-slate-900" required/>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Security tips */}
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-white/5">
                  <h3 className="font-bold text-slate-900 mb-3">Security Tips</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Use at least 8 characters</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Mix uppercase, lowercase, and numbers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Add special characters</li>
                  </ul>
                </div>

                {passwordError && (
                  <div className="p-5 rounded-2xl border border-red-500/50 bg-red-500/10 flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 text-red-500"/>
                    <span className="text-red-500 font-semibold">{passwordError}</span>
                  </div>
                )}

                {/* Password form */}
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type={showPassword.current ? 'text' : 'password'} value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-900"/>
                      <button type="button" onClick={()=>setShowPassword(p=>({...p,current:!p.current}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword.current ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type={showPassword.new ? 'text' : 'password'} value={newPassword} onChange={e=>{setNewPassword(e.target.value); calculatePasswordStrength(e.target.value)}} className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-900"/>
                      <button type="button" onClick={()=>setShowPassword(p=>({...p,new:!p.new}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword.new ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(4)].map((_,i)=>(
                          <div key={i} className={`h-2 flex-1 rounded-full ${i<passwordStrength?getPasswordStrengthColor():'bg-white/10'}`}/>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input type={showPassword.confirm ? 'text' : 'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-900"/>
                      <button type="button" onClick={()=>setShowPassword(p=>({...p,confirm:!p.confirm}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword.confirm ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    {isLoading?'Changing...':'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
