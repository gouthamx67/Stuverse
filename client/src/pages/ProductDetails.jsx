import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MapPin, Tag, User as UserIcon, MessageCircle, ArrowLeft, Star } from 'lucide-react';
import MapViewer from '../components/MapViewer';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket } = useChat();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/products/${id}/reviews`);
                setReviews(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const handleContactSeller = async () => {
        if (!user) {
            alert("Please login to contact the seller!");
            navigate('/login');
            return;
        }
        if (user._id === product.user._id) {
            alert("You can't message yourself!");
            return;
        }
        navigate('/chat', { state: { seller: product.user, sellerId: product.user._id } });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to post a review!");
            navigate('/login');
            return;
        }
        try {
            const { data } = await api.post(`/products/${id}/reviews`, reviewForm);
            setReviews([data, ...reviews]);
            setReviewForm({ rating: 5, comment: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to submit review');
        }
    };

    if (loading) return <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>Loading details...</div>;
    if (!product) return <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '2rem' }}>Product not found.</div>;

    return (
        <div className="page-enter" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                            {product.type}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Posted {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{product.title}</h1>
                    <div style={{ fontSize: '2rem', color: 'var(--secondary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        ₹{product.price}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={18} color="var(--primary)" />
                            <span>{product.category}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={18} color="var(--primary)" />
                            <span>{product.university}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Condition: <strong>{product.condition}</strong></span>
                        </div>
                    </div>

                    {product.images && product.images.length > 0 && (
                        <div style={{ marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', maxHeight: '400px' }}>
                            <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Description</h3>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>{product.description}</p>
                    </div>

                    {product.coordinates && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Meetup Location</h3>
                            <MapViewer position={product.coordinates} label={product.title} />
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Reviews ({reviews.length})</h3>

                        {user && user._id !== product.user._id && (
                            <form onSubmit={submitReview} style={{ marginBottom: '2rem', background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: '1rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginRight: '1rem', fontSize: '0.9rem' }}>Rating:</label>
                                    <select
                                        value={reviewForm.rating}
                                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                        style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.5rem' }}
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Average</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                                <textarea
                                    className="input-field"
                                    placeholder="Write a review..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn-secondary" style={{ marginTop: '0.5rem' }}>Post Review</button>
                            </form>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviews.length === 0 && <p style={{ color: '#94a3b8' }}>No reviews yet.</p>}
                            {reviews.map(review => (
                                <div key={review._id} style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1rem', borderRadius: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                <UserIcon size={14} />
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.user?.name || 'User'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                                        </div>
                                    </div>
                                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserIcon size={24} color="#e2e8f0" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{product.user.name}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Seller</p>
                            </div>
                        </div>

                        <button onClick={handleContactSeller} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageCircle size={18} />
                            Contact Seller
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
