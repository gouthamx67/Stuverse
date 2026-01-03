import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Upload, IndianRupee } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const CreateListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Textbooks',
        condition: 'Good',
        type: 'Sale',
    });

    
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles([...e.target.files]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('condition', formData.condition);
            data.append('type', formData.type);

            if (coordinates) {
                data.append('coordinates', JSON.stringify(coordinates));
            }

            
            selectedFiles.forEach((file) => {
                data.append('images', file);
            });

            await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to create listing', error);
            alert('Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    List an Item
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                        <input className="input-field" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Calc 101 Textbook" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price</label>
                            <div style={{ position: 'relative' }}>
                                <IndianRupee size={16} style={{ position: 'absolute', top: '14px', left: '12px', color: '#94a3b8' }} />
                                <input className="input-field" type="number" name="price" value={formData.price} onChange={handleChange} style={{ paddingLeft: '2rem' }} required placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Type</label>
                            <select className="input-field" name="type" value={formData.type} onChange={handleChange}>
                                <option value="Sale">For Sale</option>
                                <option value="Swap">For Swap</option>
                                <option value="Both">Sale & Swap</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                            <select className="input-field" name="category" value={formData.category} onChange={handleChange}>
                                <option value="Textbooks">Textbooks</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Condition</label>
                            <select className="input-field" name="condition" value={formData.condition} onChange={handleChange}>
                                <option value="New">New</option>
                                <option value="Like New">Like New</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                        <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe the item..." />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Images (Max 3)</label>
                        <div style={{
                            border: '2px dashed var(--glass-border)',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            background: 'rgba(15, 23, 42, 0.3)'
                        }}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <p style={{ margin: 0 }}>Click to browse or drag files here</p>
                            {selectedFiles.length > 0 && (
                                <p style={{ marginTop: '0.5rem', color: '#22c55e' }}>{selectedFiles.length} files selected</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Pickup / Meetup Location</label>
                        <LocationPicker onLocationSelect={setCoordinates} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Publishing...' : 'Publish Listing'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateListing;
