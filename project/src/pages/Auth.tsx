import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthProps {
  onSuccess: () => void;
}

export function Auth({ onSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-md mx-auto">
        <div className="hero-section text-center">
          <h1 className="hero-title">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="hero-description">
            {isSignUp
              ? 'Sign up to save your calm plans, schedules, and scout profiles'
              : 'Sign in to access your saved data'}
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert-box alert-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input pl-10"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                'Please wait...'
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="mt-6 info-card">
          <p className="text-sm text-muted">
            <strong>Privacy Note:</strong> Your personal data is stored securely and is never shared.
            You control what information you save and who you share it with.
          </p>
        </div>
      </div>
    </div>
  );
}
