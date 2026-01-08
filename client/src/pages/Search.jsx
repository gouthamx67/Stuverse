import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Search as SearchIcon, Filter, X, Plus } from 'lucide-react';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);


    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        handleSearch();
    }, [initialQuery]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {

            const params = new URLSearchParams();
            if (query) params.append('keyword', query);

            const { data } = await api.get(`/products?keyword=${query}`);


            let filtered = data;

            if (category) filtered = filtered.filter(p => p.category === category);
            if (type) filtered = filtered.filter(p => p.type === type || p.type === 'Both');
            if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
            if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

            setProducts(filtered);


            if (query) {
                navigate(`/search?q=${query}`, { replace: true });
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setCategory('');
        setType('');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="page-enter" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Marketplace</h1>
                    <p style={{ color: '#94a3b8' }}>Buy, sell, and swap items with other students.</p>
                </div>
                <button
                    onClick={() => {
                        if (!user) {
                            alert("Please login to sell or swap items!");
                            navigate('/login');
                        } else {
                            navigate('/create-listing');
                        }
                    }}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <Plus size={18} /> Sell/Swap Item
                </button>
            </div>


            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <SearchIcon size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                        <input
                            className="input-field"
                            style={{ margin: 0, paddingLeft: '2.5rem', height: '48px' }}
                            placeholder="Search for textbooks, electronics, etc..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0 2rem' }}>
                        Search
                    </button>
                </form>


                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                        <Filter size={18} />
                        <span>Filters:</span>
                    </div>

                    <select
                        className="input-field"
                        style={{ width: 'auto', margin: 0, padding: '0.5rem 2rem 0.5rem 1rem' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Textbooks">Textbooks</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        className="input-field"
                        style={{ width: 'auto', margin: 0, padding: '0.5rem 2rem 0.5rem 1rem' }}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Sale">For Sale</option>
                        <option value="Swap">For Swap</option>
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            className="input-field"
                            placeholder="Min ₹"
                            type="number"
                            style={{ width: '80px', margin: 0, padding: '0.5rem' }}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span style={{ color: '#94a3b8' }}>-</span>
                        <input
                            className="input-field"
                            placeholder="Max ₹"
                            type="number"
                            style={{ width: '80px', margin: 0, padding: '0.5rem' }}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    {(category || type || minPrice || maxPrice) && (
                        <button onClick={clearFilters} style={{ background: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>


            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Searching...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.length === 0 ? (
                        query ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                No results found for "{query}".
                            </div>
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                Enter a search term to find items.
                            </div>
                        )
                    ) : (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
