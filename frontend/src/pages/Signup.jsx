import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      setError('');
      try {
        const res = await googleLogin(response.access_token);
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
    },
    onError: () => setError('Google authentication failed.')
  });

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
      {/* Background Decorative Elements */}
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
           <div className="relative">
             <div className="absolute inset-0 flex items-center">
               {/* <div className="w-full border-t border-border"></div> */}
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-surface/80 text-muted">Or continue with</span>
             </div>
           </div>

           <div className="mt-2">
             <button
               onClick={handleGoogleLogin}
               disabled={loading}
               className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg flex items-center justify-center gap-3 transition-all duration-200"
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.２２ 1 1２s.43 ３．４５ １．１８ ４．９３l２．８５-２．２２．８１-.６２z  "/>
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
               </svg>
               Continue with Google
             </button>
           </div>
         </div>

         <div className="mt-4 pt-4  border-t border-border text-center text-sm">
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
