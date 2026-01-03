import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, MapPin, Calendar } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const ReportLost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        type: 'Lost',
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('date', formData.date);
            data.append('type', formData.type);

            if (coordinates) {
                data.append('coordinates', JSON.stringify(coordinates));
            }

            if (selectedFile) {
                data.append('image', selectedFile);
            }

            await api.post('/lost-and-found', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/lost-and-found');
        } catch (error) {
            console.error(error);
            alert('Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    Report Item
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>What happened?</label>
                        <select className="input-field" name="type" value={formData.type} onChange={handleChange}>
                            <option value="Lost">I Lost an Item</option>
                            <option value="Found">I Found an Item</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                        <input className="input-field" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Blue Hydroflask" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>When?</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={16} style={{ position: 'absolute', top: '14px', left: '12px', color: '#94a3b8' }} />
                            <input className="input-field" type="date" name="date" value={formData.date} onChange={handleChange} style={{ paddingLeft: '2rem', colorScheme: 'dark' }} required />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Where?</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', top: '14px', left: '12px', color: '#94a3b8' }} />
                            <input className="input-field" name="location" value={formData.location} onChange={handleChange} style={{ paddingLeft: '2rem' }} required placeholder="e.g. Library 2nd Floor" />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Pin Exact Location</label>
                        <LocationPicker onLocationSelect={setCoordinates} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                        <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Provide details.." />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image (Optional)</label>
                        <div style={{
                            border: '2px dashed var(--glass-border)',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            background: 'rgba(15, 23, 42, 0.3)'
                        }}
                            onClick={() => document.getElementById('report-file-upload').click()}
                        >
                            <input
                                id="report-file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <p style={{ margin: 0 }}>Click to upload an image</p>
                            {selectedFile && (
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}>Selected: {selectedFile.name}</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ReportLost;
