import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [oauthError, setOauthError] = useState('');

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'google_not_configured') {
            setOauthError('Google OAuth is not configured. Please contact the administrator.');
        } else if (errorParam === 'microsoft_not_configured') {
            setOauthError('Microsoft OAuth is not configured. Please contact the administrator.');
        } else if (errorParam === 'google_auth_failed') {
            setOauthError('Google authentication failed. Please try again.');
        } else if (errorParam === 'microsoft_auth_failed') {
            setOauthError('Microsoft authentication failed. Please try again.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/');

        } catch (err) { } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Welcome Back
                </h2>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {oauthError && <div style={{ color: '#f59e0b', marginBottom: '1rem', textAlign: 'center', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>{oauthError}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem', position: 'relative' }}>
                        <Mail size={20} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <Lock size={20} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>


                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>


                <a
                    href={`${import.meta.env.VITE_API_URL || 'https://stuverse.onrender.com'}/api/auth/google`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'white',
                        color: '#1f2937',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        border: '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </a>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    New to Stuverse?{' '}
                    <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
