import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await signup(username, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void relative overflow-hidden px-4 text-text transition-colors duration-300">
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-sky/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-acid/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative z-10 transition-all hover:border-acid/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text mb-2 font-display">Create Account</h1>
          <p className="text-muted">Join MockifyAI today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dim">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-base"
              placeholder="johndoe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dim">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-base"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dim">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-base"
              placeholder=""
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center shadow-glow"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-void" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex justify-center text-sm mb-4">
            <span className="px-2 bg-surface/80 text-muted">Or continue with</span>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google authentication failed.')}
            width="100%"
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border text-center text-sm">
          <p className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-acid border-b border-acid/0 hover:border-acid transition-all font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}