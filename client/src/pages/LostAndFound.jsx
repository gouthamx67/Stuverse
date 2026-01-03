import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Calendar, CheckCircle, Download } from 'lucide-react';
import MapViewer from '../components/MapViewer';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMapId, setExpandedMapId] = useState(null);
    const [locationStatus, setLocationStatus] = useState('checking');

    const toggleMap = (id) => {
        if (expandedMapId === id) {
            setExpandedMapId(null);
        } else {
            setExpandedMapId(id);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {

                const getPosition = () => {
                    return new Promise((resolve) => {
                        if (!navigator.geolocation) {
                            resolve(null);
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(
                            (position) => resolve(position),
                            (error) => {
                                console.log("Location denied/error", error);
                                resolve(null);
                            }
                        );
                    });
                };

                const position = await getPosition();
                let params = {};

                if (position) {
                    setLocationStatus('allowed');
                    params = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        radius: 5
                    };
                } else {
                    setLocationStatus('denied');
                }

                const { data } = await api.get('/lost-and-found', { params });
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="page-enter" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Lost & Found</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                        <p>Community notices.</p>
                        {locationStatus === 'allowed' && (
                            <span style={{
                                fontSize: '0.8rem',
                                background: 'rgba(34, 197, 94, 0.2)',
                                color: '#4ade80',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}>
                                Nearby (5km)
                            </span>
                        )}
                    </div>
                </div>
                <Link to="/report-lost" className="btn-primary">Report Item</Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading notices...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {items.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8' }}>No active notices.</p>
                    ) : (
                        items.map(item => (
                            <div key={item._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ width: '120px', height: '120px', backgroundColor: '#334155', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                        {item.image ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%', group: 'image-container' }}>
                                                <a href={item.image} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </a>
                                                <a
                                                    href={item.image}
                                                    download={`stuverse-lost-${item.title}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '5px',
                                                        right: '5px',
                                                        background: 'rgba(0,0,0,0.6)',
                                                        color: 'white',
                                                        padding: '5px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Download Image"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Download size={14} />
                                                </a>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>No Image</div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                <span style={{
                                                    backgroundColor: item.type === 'Lost' ? '#ef4444' : '#22c55e',
                                                    color: 'white',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    verticalAlign: 'middle',
                                                    marginRight: '0.5rem'
                                                }}>
                                                    {item.type.toUpperCase()}
                                                </span>
                                                {item.title}
                                            </h3>
                                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>{item.description}</p>

                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MapPin size={16} />
                                                <span>{item.location}</span>
                                                {item.coordinates && (
                                                    <button
                                                        onClick={() => toggleMap(item._id)}
                                                        style={{
                                                            background: 'none',
                                                            border: '1px solid var(--primary)',
                                                            color: 'var(--primary)',
                                                            borderRadius: '4px',
                                                            padding: '2px 6px',
                                                            fontSize: '0.7rem',
                                                            cursor: 'pointer',
                                                            marginLeft: '0.5rem'
                                                        }}
                                                    >
                                                        {expandedMapId === item._id ? 'Hide Map' : 'View Map'}
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <UserPill user={item.user} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {expandedMapId === item._id && item.coordinates && (
                                    <MapViewer position={item.coordinates} label={item.title} />
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const UserPill = ({ user }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        Posted by <strong style={{ color: 'white' }}>{user?.name || 'Unknown'}</strong>
    </span>
);

export default LostAndFound;
