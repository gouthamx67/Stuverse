import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Building2, ArrowRight } from 'lucide-react';

const UniversityModal = () => {
    const { user, updateUser } = useAuth();
    const [university, setUniversity] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        
        if (user && (!user.university || user.university === 'Unspecified')) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!university.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { university });
            updateUser(data); 
            setIsVisible(false); 
        } catch (error) {
            console.error('Failed to update university', error);
            alert('Failed to update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                    }}>
                        <Building2 size={30} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>One Last Step! 🎓</h2>
                    <p style={{ color: '#cbd5e1' }}>Please select your university to see relevant campus rides, events, and marketplace items.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem', position: 'relative' }}>
                        <Building2 size={20} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }} />
                        <input
                            type="text"
                            placeholder="Search your University..."
                            className="input-field"
                            style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            list="uni-list-modal"
                            required
                            autoFocus
                        />
                        <datalist id="uni-list-modal">
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

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem'
                        }}
                    >
                        <span>Confirm University</span>
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UniversityModal;
