import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/TranslationContext';
import { 
  Eye, EyeOff, ArrowRight, Check, Gift, ListTodo
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

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!emailValid && email) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // ✅ Appel login sans rememberMe
        await login(email, password);
      } else {
        // ✅ Appel register avec firstName et lastName
        await register(email, password, firstName, lastName);
      }

      if (invitationToken) {
        navigate(`/invitations/${invitationToken}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 lg:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <ListTodo className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">TaskFlow</h1>
          </div>

          {/* Toggle Sign In / Sign Up - GROS BOUTONS */}
          <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Invitation Message */}
          {invitationToken && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">You're invited!</p>
                <p className="text-xs text-slate-600 mt-1">Create an account to join the team</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Name fields for Sign Up */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Last Name"
                  required
                />
              </div>
            )}

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder="Email"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
              {isLogin && (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-slate-500">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-3 sm:px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs sm:text-sm font-medium"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-3 sm:px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs sm:text-sm font-medium"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs sm:text-sm text-slate-400 mt-6 sm:mt-8">
              Bradley Hypox 2025
            </div>
          </form>
        </div>

        {/* Right Panel - Illustration (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 xl:p-16 flex-col justify-center items-center text-white relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center max-w-lg">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Task Management Platform</span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Manage Your Tasks<br />Efficiently
            </h2>

            {/* Description */}
            <p className="text-base xl:text-lg text-slate-300 mb-12 leading-relaxed">
              An all-in-one platform to track your projects, automate tasks, and increase productivity
            </p>

            {/* Illustration Image */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Task management dashboard"
                  className="rounded-xl shadow-2xl w-full"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-3 -left-3 xl:-top-4 xl:-left-4 bg-emerald-500 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-xl shadow-xl font-bold text-xs xl:text-sm">
                ✓ 1,247 Tasks Done
              </div>
              <div className="absolute -bottom-3 -right-3 xl:-bottom-4 xl:-right-4 bg-blue-500 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-xl shadow-xl font-bold text-xs xl:text-sm">
                24 Active Projects
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}