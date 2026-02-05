import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/TranslationContext';
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check, Gift, 
  Sparkles, Github, Users
} from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('invitation');
  const { t } = useT();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (invitationToken) {
      setIsLogin(false);
    }
  }, [invitationToken]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t('auth.errors.fillAllFields'));
      return;
    }

    if (!emailValid && email) {
      setError(t('auth.errors.validEmail'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.passwordLength'));
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }

      if (invitationToken) {
        navigate(`/invitations/${invitationToken}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Panel - Form (Responsive) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-left-4 duration-700">
          {/* Logo Header */}
          <div className="mb-6 sm:mb-8 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-100">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-8">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">TaskFlow</h1>
            </div>
          </div>

          {/* Invitation Message */}
          {invitationToken && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-200">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t('auth.youreInvited')}</p>
                <p className="text-xs text-slate-600 mt-1">{t('auth.createAccountToJoin')}</p>
              </div>
            </div>
          )}

          {/* Toggle */}
          <div className="flex gap-1 mb-4 sm:mb-6 p-1 bg-slate-100 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-300">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all text-sm duration-300 ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-sm transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-medium transition-all text-sm duration-300 ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-sm transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t('auth.signUp')}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-400">
            {/* Name fields */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in-0 slide-in-from-left-2 duration-400">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-sm hover:border-slate-300"
                    placeholder={t('auth.firstName')}
                    required
                  />
                </div>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-sm hover:border-slate-300"
                    placeholder={t('auth.lastName')}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-sm hover:border-slate-300"
                placeholder={t('auth.email')}
                required
              />
              {email && emailValid && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in fade-in-0 scale-in-0 duration-200" />
              )}
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-sm hover:border-slate-300"
                placeholder={t('auth.password')}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-600">{t('auth.rememberMe')}</span>
              </label>
              {isLogin && (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('auth.forgotPassword')}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t('auth.loading')}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? t('auth.signIn') : t('auth.createAccount')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">{t('auth.orContinueWith')}</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm font-medium transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('auth.google')}
              </button>
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/auth/github'}
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm font-medium transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Github className="w-4 h-4" />
                {t('auth.github')}
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-slate-500 mt-4 sm:mt-6">
              {t('footer.copyright')}
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Illustration (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-50 via-white to-purple-50 items-center justify-center p-8 xl:p-12 relative overflow-hidden animate-in fade-in-0 slide-in-from-right-8 duration-800 delay-200 order-1 lg:order-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-2xl text-center">
          {/* Feature Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-sm animate-in fade-in-0 slide-in-from-top-4 duration-600 delay-500 hover:shadow-md transition-shadow duration-200">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-slate-700 font-semibold text-sm">{t('landing.features.taskManagement.title')}</span>
          </div>

          {/* Main Illustration Content */}
          <div className="mb-12 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-600">
            <h2 className="text-4xl xl:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t('landing.hero.title').split(' ').slice(0, 2).join(' ')}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {t('landing.hero.title').split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="text-lg xl:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          {/* Beautiful Project Management Image */}
          <div className="relative mb-12 animate-in fade-in-0 zoom-in-95 duration-800 delay-700">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                alt="Team collaboration and project management"
                className="w-full h-80 xl:h-96 object-cover"
              />
              {/* Overlay with glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Floating stats cards on the image */}
              <div className="absolute top-6 left-6 animate-in fade-in-0 slide-in-from-left-4 duration-600 delay-1000">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t('tasks.statuses.done')}</p>
                      <p className="text-2xl font-bold text-emerald-600">1,247</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 animate-in fade-in-0 slide-in-from-right-4 duration-600 delay-1200">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t('projects.title')}</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 xl:gap-8 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-1000">
            <div className="hover:transform hover:scale-105 transition-transform duration-200">
              <p className="text-2xl xl:text-3xl font-bold text-slate-900 mb-2">50K+</p>
              <p className="text-slate-600 text-sm">{t('landing.stats.activeUsers')}</p>
            </div>
            <div className="hover:transform hover:scale-105 transition-transform duration-200">
              <p className="text-2xl xl:text-3xl font-bold text-slate-900 mb-2">1M+</p>
              <p className="text-slate-600 text-sm">{t('landing.stats.tasksCompleted')}</p>
            </div>
            <div className="hover:transform hover:scale-105 transition-transform duration-200">
              <p className="text-2xl xl:text-3xl font-bold text-slate-900 mb-2">99.9%</p>
              <p className="text-slate-600 text-sm">{t('landing.stats.uptime')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}