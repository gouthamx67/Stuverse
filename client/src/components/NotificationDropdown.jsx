import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Bell, Check, Info, Car, MessageSquare, AlertTriangle } from 'lucide-react';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = () => {
        if (!isOpen && unreadCount > 0) {
            markAllRead();
        }
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'RIDE_JOIN': return <Car size={16} color="#3b82f6" />;
            case 'MESSAGE': return <MessageSquare size={16} color="#22c55e" />;
            case 'LOST_MATCH': return <AlertTriangle size={16} color="#eab308" />;
            default: return <Info size={16} color="#94a3b8" />;
        }
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={handleToggle}
                style={{ position: 'relative', background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #0f172a'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '120%',
                    right: '-50px', 
                    width: '320px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0',
                    zIndex: 1000,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ padding: '0.8rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} style={{ fontSize: '0.7rem', color: '#3b82f6', background: 'none' }}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    style={{
                                        padding: '0.8rem',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        background: notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        gap: '0.8rem',
                                        alignItems: 'start'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.1)'}
                                >
                                    <div style={{ marginTop: '2px' }}>{getIcon(notification.type)}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>{notification.message}</p>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {!notification.isRead && (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }}></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
