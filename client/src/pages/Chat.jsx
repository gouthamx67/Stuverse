import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Send, User as UserIcon } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const { socket, newMessages, setNewMessages } = useChat();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (location.state?.sellerId) {
            const initChat = async () => {
                const existing = conversations.find(c => c.user && c.user._id === location.state.sellerId);
                if (existing) {
                    setSelectedUser(existing.user);
                } else {
                    if (location.state.seller) {
                        setSelectedUser(location.state.seller);
                    }
                }
            };

            if (conversations.length > 0) initChat();
            else if (location.state.seller) setSelectedUser(location.state.seller);
        }
    }, [location.state, conversations]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            socket.emit('join chat', selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (newMessages.length > 0) {
            const latest = newMessages[newMessages.length - 1];
            if (selectedUser && latest.sender._id === selectedUser._id) {
                setMessages(prev => [...prev, latest]);
            } else {
                fetchConversations();
            }
        }
    }, [newMessages]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const { data } = await api.get(`/chat/${userId}`);
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedUser) return;

        try {
            setInput('');
            const { data } = await api.post('/chat', {
                recipientId: selectedUser._id,
                content: input,
            });

            socket.emit('new message', data);
            setMessages([...messages, data]);
            scrollToBottom();
            fetchConversations();
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="page-enter" style={{
            maxWidth: '1200px',
            margin: '2rem auto',
            height: '80vh',
            display: 'flex',
            gap: '1rem',
            padding: '0 1rem'
        }}>
            <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Messages</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <p style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>No conversations yet.</p>
                    ) : (
                        conversations.map((c, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedUser(c.user)}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    background: selectedUser?._id === c.user._id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    borderBottom: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserIcon size={20} color="#e2e8f0" />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <h4 style={{ margin: 0 }}>{c.user.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.5)' }}>
                            <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                        </div>

                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{
                                    alignSelf: msg.sender._id === user._id ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    background: msg.sender._id === user._id ? 'var(--primary)' : '#334155',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '1rem',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="input-field"
                                style={{ margin: 0 }}
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
