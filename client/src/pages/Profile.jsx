import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { User, Mail, MapPin, Calendar, Trash2, Edit2, Camera } from 'lucide-react';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [myLostItems, setMyLostItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        university: user?.university || ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name,
                university: user.university
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('university', editForm.university);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const { data } = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser(data);
            setIsEditing(false);
            setAvatarFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const { data: products } = await api.get('/products');
                const userProducts = products.filter(p => p.user._id === user._id);
                setMyListings(userProducts);

                const { data: lostItems } = await api.get('/lost-and-found');
                const userLostItems = lostItems.filter(i => i.user._id === user._id);
                setMyLostItems(userLostItems);

            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleDeleteProduct = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            await api.delete(`/products/${id}`);
            setMyListings(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete product");
        }
    };

    const handleResolveLostItem = async (id) => {
        try {
            await api.put(`/lost-and-found/${id}/resolve`);
            setMyLostItems(myLostItems.map(item => item._id === id ? { ...item, status: 'resolved' } : item));
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return <div style={{ textAlign: 'center', padding: '2rem' }}>Please login to view profile.</div>;

    return (
        <div className="page-enter" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>

            {/* Profile Header */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: user.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '3px solid var(--glass-border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    {!user.avatar && <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>{user.name.charAt(0)}</span>}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{user.name}</h1>
                            <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={18} />
                                    <span>{user.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={18} />
                                    <span>{user.university || 'University not set'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={18} />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                            >
                                <Edit2 size={16} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Update Profile</h2>
                        <button onClick={() => setIsEditing(false)} style={{ background: 'none', color: '#94a3b8' }}>Close</button>
                    </div>

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', marginLeft: '0.2rem' }}>Full Name</label>
                                <input
                                    className="input-field"
                                    style={{ margin: 0 }}
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', marginLeft: '0.2rem' }}>My University</label>
                                <input
                                    className="input-field"
                                    style={{ margin: 0 }}
                                    value={editForm.university}
                                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                    list="uni-list-profile"
                                />
                                <datalist id="uni-list-profile">
                                    <option value="Mahindra University" />
                                    <option value="IIT Hyderabad" />
                                    <option value="IIIT Hyderabad" />
                                    <option value="Osmania University" />
                                    <option value="JNTU Hyderabad" />
                                    <option value="BITS Pilani Hyderabad" />
                                    <option value="University of Hyderabad" />
                                    <option value="ISB Hyderabad" />
                                    <option value="NALSAR University of Law" />
                                    <option value="Woxsen University" />
                                    <option value="SRM University" />
                                    <option value="VIT Vellore" />
                                    <option value="Manipal University" />
                                </datalist>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Camera size={24} color="white" />
                                </div>
                                <input type="file" hidden id="avatar-input" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="avatar-input" style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--primary)' }}>Change Profile Picture</label>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{avatarFile ? avatarFile.name : 'Upload a new avatar'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                            <button type="submit" className="btn-primary" disabled={uploading} style={{ padding: '0.8rem 2rem' }}>
                                {uploading ? 'Saving Changes...' : 'Save All Changes'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '0.8rem 2rem' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>My Listings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {loading ? <p>Loading...</p> : myListings.length === 0 ? <p style={{ color: '#94a3b8' }}>You haven't listed anything yet.</p> : (
                    myListings.map(product => (
                        <div key={product._id} style={{ position: 'relative' }}>
                            <ProductCard product={product} />
                            <button
                                onClick={(e) => handleDeleteProduct(product._id, e)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#ef4444',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    zIndex: 10,
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>My Lost & Found Reports</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? <p>Loading...</p> : myLostItems.length === 0 ? <p style={{ color: '#94a3b8' }}>No reports.</p> : (
                    myLostItems.map(item => (
                        <div key={item._id} className="glass-panel" style={{ padding: '1rem', position: 'relative', opacity: item.status === 'resolved' ? 0.6 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{
                                    background: item.type === 'Lost' ? '#ef4444' : '#22c55e',
                                    color: 'white',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}>
                                    {item.type}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem' }}>{item.description}</p>

                            {item.status !== 'resolved' && (
                                <button
                                    onClick={() => handleResolveLostItem(item._id)}
                                    className="btn-secondary"
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                                >
                                    Mark as Resolved
                                </button>
                            )}
                            {item.status === 'resolved' && (
                                <div style={{ textAlign: 'center', color: '#22c55e', fontWeight: 'bold', border: '1px solid #22c55e', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                    Resolved
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

        </div >
    );
};

export default Profile;
