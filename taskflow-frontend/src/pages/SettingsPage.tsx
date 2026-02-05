import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2, Settings as SettingsIcon, Shield, Bell, Palette, Globe, Smartphone, Key, Crown, Sparkles, Star } from 'lucide-react';
import Avatar from '../components/Avatar';
import { utilisateursService } from '../services/utilisateurs.service';

type Tab = 'profile' | 'security' | 'notifications' | 'preferences';

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

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);

  // Preference states
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

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
    { 
      id: 'profile' as Tab, 
      label: 'Profile', 
      icon: UserIcon, 
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      description: 'Manage your personal information'
    },
    { 
      id: 'security' as Tab, 
      label: 'Security', 
      icon: Shield, 
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      description: 'Password and security settings'
    },
    { 
      id: 'notifications' as Tab, 
      label: 'Notifications', 
      icon: Bell, 
      gradient: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50',
      description: 'Configure your notifications'
    },
    { 
      id: 'preferences' as Tab, 
      label: 'Preferences', 
      icon: Palette, 
      gradient: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50',
      description: 'Customize your experience'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-10 relative">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Settings
                </h1>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full">
                  PRO
                </div>
              </div>
              <p className="text-slate-600 text-lg font-medium">Manage your account and preferences</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500 font-medium">Account verified and secure</span>
              </div>
            </div>
          </div>

          {/* User Quick Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar prenom={user.prenom} nom={user.nom} size="lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {user.prenom} {user.nom}
                  </h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-slate-600 font-medium">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-slate-500 font-semibold">Premium Member</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-semibold">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-8 p-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 backdrop-blur-sm flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-800">Success!</h4>
              <p className="text-emerald-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-6 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-xl hover:shadow-2xl transform hover:scale-105` 
                      : `${tab.bgLight} hover:shadow-lg hover:scale-105 border border-white/50`
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="relative">
                    <div className={`p-3 rounded-xl mb-4 ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'} transition-all duration-300 w-fit`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {tab.label}
                    </h3>
                    <p className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-600'} font-medium`}>
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                    <p className="text-slate-600">Update your personal details and information</p>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar prenom={user.prenom} nom={user.nom} size="xl" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2">Profile Picture</h3>
                      <p className="text-slate-600 mb-3">Automatically generated from your initials</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                          Change Avatar
                        </button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">First Name</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors" 
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Security Settings</h2>
                    <p className="text-slate-600">Manage your password and security preferences</p>
                  </div>
                </div>

                {/* Security Status */}
                <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-800">Security Status: Excellent</h3>
                      <p className="text-emerald-600 text-sm">Your account is well protected</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                      <span className="text-sm text-emerald-700 font-medium">Strong Password</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                      <span className="text-sm text-emerald-700 font-medium">Email Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                      <span className="text-sm text-emerald-700 font-medium">Secure Connection</span>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-6 rounded-2xl border border-red-200 bg-red-50/80 flex items-center gap-4">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-800">Error</h4>
                      <p className="text-red-700 font-medium">{passwordError}</p>
                    </div>
                  </div>
                )}

                {/* Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword.current ? 'text' : 'password'} 
                        value={currentPassword} 
                        onChange={e=>setCurrentPassword(e.target.value)} 
                        className="w-full px-4 py-4 pr-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={()=>setShowPassword(p=>({...p,current:!p.current}))} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword.current ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword.new ? 'text' : 'password'} 
                        value={newPassword} 
                        onChange={e=>{setNewPassword(e.target.value); calculatePasswordStrength(e.target.value)}} 
                        className="w-full px-4 py-4 pr-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={()=>setShowPassword(p=>({...p,new:!p.new}))} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword.new ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-3">
                        <div className="flex gap-1 mb-2">
                          {[...Array(4)].map((_,i)=>(
                            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i<passwordStrength?getPasswordStrengthColor():'bg-slate-200'}`}/>
                          ))}
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          Password strength: <span className={passwordStrength <= 2 ? 'text-red-600' : passwordStrength === 3 ? 'text-orange-600' : 'text-emerald-600'}>{getPasswordStrengthText()}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword.confirm ? 'text' : 'password'} 
                        value={confirmPassword} 
                        onChange={e=>setConfirmPassword(e.target.value)} 
                        className="w-full px-4 py-4 pr-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-900 font-medium hover:border-slate-300 transition-colors"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={()=>setShowPassword(p=>({...p,confirm:!p.confirm}))} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading?'Changing Password...':'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notification Preferences</h2>
                    <p className="text-slate-600">Choose how you want to be notified</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email', state: emailNotifications, setState: setEmailNotifications },
                    { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', state: pushNotifications, setState: setPushNotifications },
                    { id: 'tasks', label: 'Task Reminders', description: 'Reminders for upcoming tasks', state: taskReminders, setState: setTaskReminders },
                    { id: 'projects', label: 'Project Updates', description: 'Updates about your projects', state: projectUpdates, setState: setProjectUpdates },
                  ].map((item) => (
                    <div key={item.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
                          <p className="text-slate-600 text-sm">{item.description}</p>
                        </div>
                        <button
                          onClick={() => item.setState(!item.state)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${item.state ? 'bg-blue-500' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${item.state ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Preferences</h2>
                    <p className="text-slate-600">Customize your TaskFlow experience</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'auto'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setTheme(themeOption)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            theme === themeOption 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {themeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 mb-3">Language</h3>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 mb-3">Timezone</h3>
                    <select 
                      value={timezone} 
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
