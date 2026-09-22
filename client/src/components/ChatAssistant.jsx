import { useState, useRef, useEffect } from 'react';
import api from '../services/api.js';

export const ChatAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am ApexAI, your personal financial co-pilot. Ask me anything about your accounts or transactions!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat history
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        
        // Append user message to state
        const updatedMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(updatedMessages);

        try {
            setLoading(true);
            // Send the full message history to maintain context
            const response = await api.post('/ai/chat', { messages: updatedMessages });
            
            // Append assistant response
            setMessages([...updatedMessages, { role: 'assistant', content: response.data.reply }]);
        } catch (err) {
            console.error('Failed to get AI response:', err);
            setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, I encountered an error connecting to my financial database. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            height: '450px',
            overflow: 'hidden'
        }}>
            {/* Chat Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                }}></div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                    ApexAI Financial Assistant
                </h3>
            </div>

            {/* Messages Scroll Area */}
            <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#ffffff'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6',
                        color: msg.role === 'user' ? '#ffffff' : '#1f2937',
                        borderBottomRightRadius: msg.role === 'user' ? '2px' : '10px',
                        borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '10px',
                    }}>
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div style={{
                        alignSelf: 'flex-start',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        ApexAI is thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{
                padding: '12px 16px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                gap: '8px'
            }}>
                <input 
                    type="text"
                    placeholder="Ask about your spending, balances, or transactions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                    }}
                />
                <button 
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                        padding: '10px 18px',
                        backgroundColor: loading || !input.trim() ? '#9ca3af' : '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};