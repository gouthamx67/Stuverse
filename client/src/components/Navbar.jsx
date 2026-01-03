import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, User, Search, Home as HomeIcon, MessageSquare, Menu, X, Car, ShoppingBag, Zap } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            margin: '0 1rem',
            zIndex: 100,
            padding: '0.8rem 1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/student3.png" alt="Stuverse Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }} />
                    <span className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Stuverse</span>
                </Link>

                <div className="mobile-only" style={{ display: 'none' }}>
                    <button onClick={toggleMenu} style={{ background: 'none', color: 'white' }}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HomeIcon size={18} />
                        <span style={{ fontWeight: 500 }}>Home</span>
                    </Link>
                    <Link to="/search" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={18} />
                        <span style={{ fontWeight: 500 }}>Marketplace</span>
                    </Link>
                    <Link to="/lost-and-found" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 500 }}>Lost & Found</span>
                    </Link>
                    <Link to="/rides" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Car size={18} />
                        <span style={{ fontWeight: 500 }}>Rides</span>
                    </Link>
                    <Link to="/buzz" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={18} />
                        <span style={{ fontWeight: 500 }}>Campus Buzz</span>
                    </Link>
                </div>

                <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            <NotificationDropdown />
                            <Link to="/chat" className="nav-link" style={{ position: 'relative' }}>
                                <MessageSquare size={20} />
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                                <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {user.name?.charAt(0)}
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button onClick={handleLogout} className="nav-link" style={{ background: 'none', color: '#ef4444' }}>
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
                            <Link to="/signup" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            {isMobileMenuOpen && (
                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <Link to="/" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <HomeIcon size={18} />
                        <span>Home</span>
                    </Link>
                    <Link to="/search" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <ShoppingBag size={18} />
                        <span>Marketplace</span>
                    </Link>
                    <Link to="/lost-and-found" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <Search size={18} />
                        <span>Lost & Found</span>
                    </Link>
                    <Link to="/rides" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <Car size={18} />
                        <span>Rides</span>
                    </Link>
                    <Link to="/buzz" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <Zap size={18} />
                        <span>Campus Buzz</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/chat" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <MessageSquare size={18} />
                                <span>Messages</span>
                            </Link>
                            <Link to="/profile" onClick={closeMenu} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <User size={18} />
                                <span>Profile</span>
                            </Link>

                            <button onClick={handleLogout} className="nav-link" style={{ color: '#ef4444', background: 'none', textAlign: 'left', padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/login" onClick={closeMenu} className="nav-link" style={{ padding: '0.5rem' }}>Login</Link>
                            <Link to="/signup" onClick={closeMenu} className="btn-secondary" style={{ textAlign: 'center' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .gradient-text {
                    transition: all 0.3s ease;
                }

                .gradient-text:hover {
                    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
                }

                .nav-link {
                    color: var(--text-muted);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 0.5rem 0.8rem;
                    border-radius: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }

                .nav-link:hover {
                    color: white !important;
                    text-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
                    background: rgba(99, 102, 241, 0.15);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
                }

                .nav-link:active {
                    transform: translateY(0);
                }

                @media (max-width: 768px) {
                    .desktop-links {
                        display: none !important;
                    }
                    .mobile-only {
                        display: block !important;
                    }
                }
            `}</style>
        </nav >
    );
};

export default Navbar;
