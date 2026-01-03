import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, Tag, MapPin, Car, Briefcase, Info, ArrowRight, Clock } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    const fetchAllData = async (search = '') => {
        setLoading(true);
        try {
            // Fetch everything in parallel
            const [productsRes, lostItemsRes, ridesRes] = await Promise.all([
                api.get(`/products?keyword=${search}`),
                api.get('/lost-and-found'),
                api.get('/rides')
            ]);

            // Normalize Marketplace Products
            const normalizedProducts = productsRes.data.map(p => ({
                ...p,
                serviceType: 'Marketplace',
                displayDate: p.createdAt,
                targetUrl: `/product/${p._id}`
            }));

            // Normalize Lost & Found Items
            const normalizedLostItems = lostItemsRes.data.map(item => ({
                ...item,
                serviceType: 'Lost & Found',
                displayDate: item.date,
                targetUrl: '/lost-and-found'
            }));

            // Normalize Rides
            const normalizedRides = ridesRes.data.map(ride => ({
                ...ride,
                serviceType: 'Ride Share',
                title: `${ride.origin.name} → ${ride.destination.name}`,
                displayDate: ride.date,
                targetUrl: '/rides'
            }));

            // Combine and sort by date (newest first)
            let combined = [...normalizedProducts, ...normalizedLostItems, ...normalizedRides];

            // Filter by keyword if search exists (basic client-side filtering for combined feed)
            if (search) {
                const searchLower = search.toLowerCase();
                combined = combined.filter(item =>
                    item.title?.toLowerCase().includes(searchLower) ||
                    item.description?.toLowerCase().includes(searchLower) ||
                    item.serviceType.toLowerCase().includes(searchLower)
                );
            }

            combined.sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));
            setFeedItems(combined);
        } catch (error) {
            console.error("Error fetching homepage feed:", error);
        } finally {
            setLoading(false);
        }
    };

    const [showPostOptions, setShowPostOptions] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAllData(keyword);
    };

    const postOptions = [
        { title: 'Marketplace', icon: <Tag size={24} />, url: '/create-listing', color: '#3b82f6', desc: 'Sell or swap your items' },
        { title: 'Lost & Found', icon: <Briefcase size={24} />, url: '/report-lost', color: '#ef4444', desc: 'Report lost or found items' },
        { title: 'Ride Share', icon: <Car size={24} />, url: '/create-ride', color: '#22c55e', desc: 'Offer or request a ride' },
        { title: 'Campus Buzz', icon: <Info size={24} />, url: '/buzz', color: '#a855f7', desc: 'Post a confession or alert' },
    ];

    return (
        <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                    {user ? `Hey ${user.name?.split(' ')[0]}, Welcome Back!` : 'Welcome to Stuverse'}
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
                    {user?.university && user.university !== 'Unspecified' && user.university !== 'Not specified'
                        ? `Explore the latest updates at ${user.university}.`
                        : 'Your ultimate campus companion. Marketplace, Rides, and Community alerts all in one place.'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0' }}>
                    <form onSubmit={handleSearch} style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '12px', color: '#94a3b8' }} />
                        <input
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '50px', border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.4)', color: 'white', outline: 'none' }}
                            placeholder="Search marketplace, rides, or lost items..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => setShowPostOptions(true)}
                        className="btn-primary"
                        style={{ borderRadius: '50px', whiteSpace: 'nowrap' }}
                    >
                        Post Something
                    </button>
                </div>
            </div>

            {/* Post Options Modal */}
            {showPostOptions && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowPostOptions(false)}>
                    <div className="glass-panel page-enter" style={{ maxWidth: '600px', width: '100%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>What would you like to post?</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Select a category to get started.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {postOptions.map((opt) => (
                                <div
                                    key={opt.title}
                                    className="glass-panel card-hover"
                                    style={{ padding: '1.5rem', cursor: 'pointer', borderTop: `4px solid ${opt.color}` }}
                                    onClick={() => navigate(opt.url)}
                                >
                                    <div style={{ color: opt.color, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{opt.icon}</div>
                                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{opt.title}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowPostOptions(false)}
                            style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading your feed...</div>
            ) : (
                <>
                    {feedItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <p style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#94a3b8' }}>No activity found yet.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button onClick={() => setShowPostOptions(true)} className="btn-primary">Post the first update</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {feedItems.map((item, index) => (
                                <UnifiedFeedCard key={item._id || index} item={item} navigate={navigate} />
                            ))}
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

const UnifiedFeedCard = ({ item, navigate }) => {
    const getServiceColor = () => {
        switch (item.serviceType) {
            case 'Marketplace': return '#3b82f6'; // Blue
            case 'Lost & Found': return '#ef4444'; // Red
            case 'Ride Share': return '#22c55e'; // Green
            default: return '#94a3b8';
        }
    };

    const renderImage = () => {
        if (item.serviceType === 'Marketplace' && item.images?.[0]) {
            return <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        }
        if (item.serviceType === 'Lost & Found' && item.image) {
            return <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        }
        if (item.serviceType === 'Ride Share') {
            return (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#22c55e' }}>
                    <Car size={48} />
                    <span style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        {item.type === 'Offer' ? 'Offering Ride' : 'Requesting Ride'}
                    </span>
                </div>
            );
        }
        return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}><Info size={32} /></div>;
    };

    return (
        <div
            className="glass-panel card-hover"
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderTop: `4px solid ${getServiceColor()}`
            }}
            onClick={() => navigate(item.targetUrl)}
        >
            <div style={{ height: '180px', background: '#1e293b', position: 'relative' }}>
                {renderImage()}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: getServiceColor(),
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                    {item.serviceType.toUpperCase()}
                </div>
                {item.price !== undefined && item.price > 0 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#22c55e'
                    }}>
                        ₹{item.price}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: 'white',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {item.title}
                </h3>

                <p style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5'
                }}>
                    {item.description || 'No description provided.'}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '0.8rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{new Date(item.displayDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.university || item.location || 'Universal'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

