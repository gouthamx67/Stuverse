import { useNavigate } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate(`/product/${product._id}`)}>
            <div style={{ height: '200px', background: '#334155', position: 'relative' }}>
                {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {product.type}
                </div>
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{product.title}</h3>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>₹{product.price}</span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={12} />
                        <span>{product.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span>{product.university}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
