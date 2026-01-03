import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Search } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || 13);
        }
    }, [center, zoom, map]);
    return null;
};

const LocationPicker = ({ onLocationSelect, initialPosition, placeholder }) => {
    const [position, setPosition] = useState(initialPosition || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [mapCenter, setMapCenter] = useState(initialPosition || { lat: 28.6139, lng: 77.2090 });
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);


    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchQuery.trim() || searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
                );
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Suggestion fetch error:", error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSelectSuggestion = (suggestion) => {
        const location = {
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon)
        };
        setPosition(location);
        setMapCenter(location);
        setSearchQuery(suggestion.display_name);
        setShowSuggestions(false);
        if (onLocationSelect) onLocationSelect(location, suggestion.display_name);
    };

    const mapRef = useRef(null);


    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        }
    }, [position]);


    useEffect(() => {
        if (!initialPosition && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    setMapCenter(currentLocation);
                },
                () => { }
            );
        }
    }, [initialPosition]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentLocation = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                setPosition(currentLocation);
                setMapCenter(currentLocation);
                setGettingLocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please check your browser permissions.');
                setGettingLocation(false);
            }
        );
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        setShowSuggestions(false);
        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const location = {
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon)
                };
                setPosition(location);
                setMapCenter(location);
                if (onLocationSelect) onLocationSelect(location, result.display_name);
            } else {
                alert('Location not found. Please try a different search term.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            alert('Failed to search location. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            setShowSuggestions(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder={placeholder || "Search for a location..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                        className="input-field"
                        style={{ paddingLeft: '2.2rem', fontSize: '0.9rem', height: '38px', width: '100%' }}
                    />


                    {showSuggestions && suggestions.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: '#1e293b',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.5rem',
                            marginTop: '0.5rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                            zIndex: 1001
                        }}>
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: index < suggestions.length - 1 ? '1px solid #334155' : 'none',
                                        fontSize: '0.9rem',
                                        color: '#cbd5e1',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {suggestion.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching || !searchQuery.trim()}
                    className="btn-secondary"
                    style={{
                        padding: '0 1rem',
                        fontSize: '0.85rem',
                        height: '38px',
                        opacity: (searching || !searchQuery.trim()) ? 0.6 : 1
                    }}
                >
                    {searching ? 'Searching...' : 'Search'}
                </button>
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={gettingLocation}
                    className="btn-primary"
                    style={{
                        padding: '0 0.8rem',
                        fontSize: '0.85rem',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        opacity: gettingLocation ? 0.6 : 1
                    }}
                    title="Use my current location"
                >
                    <Navigation size={16} />
                    {gettingLocation ? 'Getting...' : 'Current'}
                </button>
            </div>


            <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                    <MapController center={mapCenter} zoom={position ? 15 : 13} />
                </MapContainer>
            </div>


            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', justifyContent: 'center' }}>
                <MapPin size={14} />
                <span>Click on map, search address, or use current location</span>
            </div>
        </div>
    );
};

export default LocationPicker;
