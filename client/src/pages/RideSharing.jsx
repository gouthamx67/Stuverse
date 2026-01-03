import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Clock, Car, Users, Plus, ArrowRight } from 'lucide-react';

const RideSharing = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All'); 

    const fetchRides = async () => {
        try {
            const { data } = await api.get('/rides');
            setRides(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const handleJoinRide = async (id) => {
        try {
            await api.put(`/rides/${id}/join`);
            
            fetchRides();
            alert("Success! You have joined the ride.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to join ride");
        }
    };

    const handleLeaveRide = async (id) => {
        if (!confirm("Are you sure you want to leave this ride?")) return;
        try {
            await api.put(`/rides/${id}/leave`);
            fetchRides();
        } catch (error) {
            alert("Failed to leave ride");
        }
    };

    const filteredRides = filterType === 'All' ? rides : rides.filter(r => r.type === filterType);

    return (
        <div className="page-enter" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Campus Rides</h1>
                    <p style={{ color: '#94a3b8' }}>Share a cab, find a carpool, travel together.</p>
                </div>
                <Link to="/create-ride" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Offer/Request Ride
                </Link>
            </div>

            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setFilterType('All')}
                    className={filterType === 'All' ? 'btn-primary' : 'btn-secondary'}
                >All</button>
                <button
                    onClick={() => setFilterType('Offer')}
                    className={filterType === 'Offer' ? 'btn-primary' : 'btn-secondary'}
                >Drivers Offering</button>
                <button
                    onClick={() => setFilterType('Request')}
                    className={filterType === 'Request' ? 'btn-primary' : 'btn-secondary'}
                >Students Requesting</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading rides...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {filteredRides.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8' }}>No active ride listings found.</p>
                    ) : (
                        filteredRides.map(ride => (
                            <RideCard
                                key={ride._id}
                                ride={ride}
                                currentUser={user}
                                onJoin={handleJoinRide}
                                onLeave={handleLeaveRide}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const RideCard = ({ ride, currentUser, onJoin, onLeave }) => {
    const isHost = currentUser && ride.host._id === currentUser._id;
    const isParticipant = currentUser && ride.participants.some(p => p.user._id === currentUser._id);
    const isFull = ride.participants.length >= ride.seats;
    const availableSeats = ride.seats - ride.participants.length;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: ride.type === 'Offer' ? '4px solid #22c55e' : '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span style={{ color: '#cbd5e1' }}>{ride.origin.name}</span>
                        <ArrowRight size={18} color="#94a3b8" />
                        <span style={{ color: 'white' }}>{ride.destination.name}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={14} />
                            <span>{new Date(ride.date).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={14} />
                            <span>{new Date(ride.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Users size={14} />
                            <span>{ride.participants.length} / {ride.seats} seats filled</span>
                        </div>
                        {ride.price > 0 && (
                            <div style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{ride.price} each</div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '20px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#475569', overflow: 'hidden' }}>
                            {ride.host.avatar && <img src={ride.host.avatar} style={{ width: '100%', height: '100%' }} />}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <span style={{ display: 'block', lineHeight: 1 }}>{ride.host.name}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ride.type === 'Offer' ? 'Driver' : 'Organizer'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {ride.description && (
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    "{ride.description}"
                </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {ride.vehicle && <span>Vehicle: {ride.vehicle}</span>}
                </div>

                <div>
                    {isHost ? (
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>You are managing this ride</span>
                    ) : isParticipant ? (
                        <button
                            onClick={() => onLeave(ride._id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                        >
                            Leave Ride
                        </button>
                    ) : (
                        <button
                            onClick={() => onJoin(ride._id)}
                            disabled={isFull}
                            className={isFull ? 'btn-secondary' : 'btn-primary'}
                            style={{ opacity: isFull ? 0.5 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
                        >
                            {isFull ? 'Full' : 'Join Ride'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideSharing;
