'use client';

import { useState } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'المعذرة، حدث خطأ ما. حاول لاحقاً يا فندم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Gold Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold)',
          color: '#000',
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'all 0.3s ease'
        }}
      >
        ✨
      </button>

      {/* Slide-out Sidebar Chat */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid var(--border-color)',
          zIndex: 999,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '20px 0 50px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--accent-gold)' }}>مساعد الفخامة</h2>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>إغلاق</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>يا هلا بك.. كيف أقدر أخدمك اليوم؟</p>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                backgroundColor: m.role === 'user' ? 'var(--bg-tertiary)' : 'var(--accent-gold-soft)',
                padding: '1rem',
                borderRadius: '8px',
                maxWidth: '85%',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                {m.content}
              </div>
            ))}
            {loading && <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>جاري التفكير...</p>}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="اطلب أي شيء طال عمرك..."
              style={{
                flex: 1,
                backgroundColor: '#000',
                border: '1px solid var(--border-color)',
                padding: '1rem',
                color: '#fff',
                fontSize: '0.8rem'
              }}
            />
            <button 
              onClick={sendMessage}
              style={{ padding: '0 1.5rem', backgroundColor: 'var(--accent-gold)', border: 'none', cursor: 'pointer' }}
            >
              إرسال
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
