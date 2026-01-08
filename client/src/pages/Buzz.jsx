import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, Heart, Clock } from 'lucide-react';

const Buzz = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);


    const colors = [
        'linear-gradient(135deg, #6366f1, #a855f7)',
        'linear-gradient(135deg, #3b82f6, #06b6d4)',
        'linear-gradient(135deg, #f43f5e, #f97316)',
        'linear-gradient(135deg, #10b981, #3b82f6)',
    ];

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/buzz');
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to post on Campus Buzz!");
            navigate('/login');
            return;
        }
        if (!newPost.trim()) return;

        setPosting(true);
        try {

            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            await api.post('/buzz', {
                content: newPost,
                color: randomColor
            });

            setNewPost('');
            fetchPosts();
        } catch (error) {
            alert("Failed to post");
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (id) => {
        if (!user) {
            alert("Please login to like buzz posts!");
            navigate('/login');
            return;
        }
        try {

            setPosts(prev => prev.map(p => {
                if (p._id === id) {
                    const isLiked = p.likes.includes(user._id);
                    return {
                        ...p,
                        likes: isLiked
                            ? p.likes.filter(uid => uid !== user._id)
                            : [...p.likes, user._id]
                    };
                }
                return p;
            }));

            await api.put(`/buzz/${id}/like`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem' }}>Campus Buzz</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Anonymous thoughts, confessions, and spicy takes.</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', marginTop: '1rem' }}>
                    <Clock size={14} />
                    <span>Disappears in 3 days</span>
                </div>
            </div>


            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="input-field"
                        placeholder="What's strictly on your mind? (Anonymous)"
                        rows="3"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        style={{ fontSize: '1.1rem', resize: 'none' }}
                        maxLength={500}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{newPost.length}/500</span>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={posting || !newPost.trim()}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Send size={18} /> Warn Everyone
                        </button>
                    </div>
                </form>
            </div>


            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Listening for whispers...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {posts.map(post => (
                        <div key={post._id} className="glass-panel" style={{
                            padding: '1.5rem',
                            background: post.color || 'rgba(255,255,255,0.03)',
                            border: 'none',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>

                            <div style={{ position: 'absolute', top: '-10px', right: '10px', fontSize: '6rem', opacity: 0.1, fontFamily: 'serif', pointerEvents: 'none' }}>"</div>

                            <p style={{
                                fontSize: '1.25rem',
                                lineHeight: '1.6',
                                fontWeight: '500',
                                color: 'white',
                                marginBottom: '1.5rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {post.content}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>
                                <span style={{ fontSize: '0.85rem' }}>
                                    {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                <button
                                    onClick={() => handleLike(post._id)}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s'
                                    }}
                                >
                                    <Heart
                                        size={18}
                                        fill={post.likes.includes(user._id) ? "white" : "none"}
                                        color="white"
                                    />
                                    <span>{post.likes.length}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Buzz;
