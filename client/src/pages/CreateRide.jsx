import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LocationPicker from '../components/LocationPicker';
import { Car, AlertCircle } from 'lucide-react';

const CreateRide = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    
    const [type, setType] = useState('Request'); 
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seats, setSeats] = useState(1);
    const [price, setPrice] = useState(0);
    const [vehicle, setVehicle] = useState('');
    const [description, setDescription] = useState('');

    
    const [origin, setOrigin] = useState({ lat: null, lng: null, name: '' });
    const [destination, setDestination] = useState({ lat: null, lng: null, name: '' });

    const handleOriginSelect = (coords, name) => {
        setOrigin(prev => ({ ...prev, ...coords, name: name || prev.name }));
    };

    const handleDestinationSelect = (coords, name) => {
        setDestination(prev => ({ ...prev, ...coords, name: name || prev.name }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!origin.lat || !destination.lat) {
            alert("Please select both Origin and Destination on the map.");
            return;
        }

        if (!origin.name) origin.name = "Selected Origin";
        if (!destination.name) destination.name = "Selected Destination";

        setLoading(true);
        try {
            await api.post('/rides', {
                type,
                originName: origin.name,
                originLat: origin.lat,
                originLng: origin.lng,
                destName: destination.name,
                destLat: destination.lat,
                destLng: destination.lng,
                date,
                time,
                seats,
                price,
                vehicle,
                description
            });
            navigate('/rides');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create ride");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                    {type === 'Offer' ? 'Offer a Ride' : 'Request a Ride'}
                </h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setType('Request')}
                        className={type === 'Request' ? 'btn-primary' : 'btn-secondary'}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        Need a Ride? (Request)
                    </button>
                    <button
                        onClick={() => setType('Offer')}
                        className={type === 'Offer' ? 'btn-primary' : 'btn-secondary'}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        Have a Car? (Offer)
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Starting Point</h3>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.85rem', color: '#94a3b8' }}>Name (e.g. Campus Gate)</label>
                            <input
                                className="input-field"
                                value={origin.name}
                                onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                                placeholder="Enter origin name"
                                required
                            />
                        </div>
                        <LocationPicker
                            onLocationSelect={handleOriginSelect}
                            placeholder="Search start location..."
                        />
                    </div>

                    
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Destination</h3>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.85rem', color: '#94a3b8' }}>Name (e.g. Airport)</label>
                            <input
                                className="input-field"
                                value={destination.name}
                                onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                                placeholder="Enter destination name"
                                required
                            />
                        </div>
                        <LocationPicker
                            onLocationSelect={handleDestinationSelect}
                            placeholder="Search destination..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
                            <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required style={{ colorScheme: 'dark' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Time</label>
                            <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} required style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Seats {type === 'Request' ? '(Needed)' : '(Available)'}</label>
                            <input type="number" min="1" max="10" className="input-field" value={seats} onChange={e => setSeats(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cost per person (₹)</label>
                            <input type="number" min="0" className="input-field" value={price} onChange={e => setPrice(e.target.value)} placeholder="0 for free" />
                        </div>
                    </div>

                    {type === 'Offer' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Vehicle Model</label>
                            <input className="input-field" value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="e.g. Honda City, Uber XL" />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes</label>
                        <textarea className="input-field" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Any specific details? e.g. 'Leaving strictly at 5PM', 'Only small bags'" />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : (type === 'Offer' ? 'Post Ride Offer' : 'Post Ride Request')}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateRide;
