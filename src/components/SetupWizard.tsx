import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Key, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Info,
  ExternalLink,
  Lock
} from 'lucide-react';
import { WordPressConfig } from '../types';
import { CompanionPlugin } from './CompanionPlugin';
import { cn } from '../lib/utils';

interface SetupWizardProps {
  onConnect: (config: WordPressConfig) => void;
  onDemo: () => void;
}

export const SetupWizard = ({ onConnect, onDemo }: SetupWizardProps) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<WordPressConfig>({
    url: '',
    username: '',
    applicationPassword: ''
  });
  const [geminiKey, setGeminiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      // Basic validation
      if (!config.url || !config.username || !config.applicationPassword) {
        throw new Error('Please fill in all WordPress connection details.');
      }
      if (!geminiKey) {
        throw new Error('Gemini API Key is required.');
      }

      // Store Gemini key in localStorage for the session
      localStorage.setItem('GEMINI_API_KEY', geminiKey);
      
      onConnect(config);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20">
              <Zap className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to WP Sentinel AI</h2>
              <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Let's get your WordPress site connected to the most powerful AI management suite.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Secure Connection</p>
                  <p className="text-[11px] text-zinc-500">We use Application Passwords for safe access.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Full Site Control</p>
                  <p className="text-[11px] text-zinc-500">Manage SEO, Security, and Performance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Configuration</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gemini API Key</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Don't have a key? You can get one for free from the Google AI.
                  </p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Get Gemini API Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">WordPress Connection</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Site URL</label>
                <input 
                  type="url"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="https://your-site.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Username</label>
                <input 
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  placeholder="Admin username"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Application Password</label>
                <input 
                  type="password"
                  value={config.applicationPassword}
                  onChange={(e) => setConfig({ ...config, applicationPassword: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Go to Users {'>'} Profile {'>'} Application Passwords in your WP Admin to create a secure key.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">The Bridge Plugin</h3>
            </div>
            <CompanionPlugin />
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white tracking-tight">Ready to Launch!</h2>
              <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Everything is configured. Click below to connect and start managing your WordPress site with AI.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl text-left space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Site URL</span>
                <span className="text-sm text-white font-medium">{config.url}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Username</span>
                <span className="text-sm text-white font-medium">{config.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">AI Status</span>
                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-lg font-bold">READY</span>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i + 1 <= step ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-zinc-800"
              )}
            />
          ))}
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/5 blur-[100px] rounded-full" />

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="mt-10 flex gap-4">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition-all font-bold"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button 
                onClick={handleNext}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-white" />}
                {loading ? 'Connecting...' : 'Connect Site'}
              </button>
            )}
          </div>

          {step === 1 && (
            <button 
              onClick={onDemo}
              className="w-full mt-4 py-3 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
            >
              Try Demo Mode First
            </button>
          )}
        </div>

        <p className="text-center mt-8 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          Powered by WP AI Sentinel Team
        </p>
      </div>
    </div>
  );
};
