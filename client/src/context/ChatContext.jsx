import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);


const ENDPOINT = 'http://localhost:5000';
let socket;

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socketConnected, setSocketConnected] = useState(false);
    const [newMessages, setNewMessages] = useState([]);

    useEffect(() => {
        if (user) {
            socket = io(ENDPOINT);
            socket.emit('setup', user);
            socket.on('connected', () => setSocketConnected(true));

            socket.on('message received', (newMessage) => {
                setNewMessages((prev) => [...prev, newMessage]);
                
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket.off();
                setSocketConnected(false);
            }
        }
    }, [user]);

    return (
        <ChatContext.Provider value={{ socket, socketConnected, newMessages, setNewMessages }}>
            {children}
        </ChatContext.Provider>
    );
};
