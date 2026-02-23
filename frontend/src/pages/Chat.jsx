import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const CHIPS = ['Do I need GST?','ITR deadline?','What is 44AD?','Late filing penalty?','How to register Udyam?'];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { sendChat, getChatHistory, clearChat, profile } = useApp();
  const bottomRef = useRef();

  useEffect(() => {
    getChatHistory().then(history => {
      if (history.length > 0) setMessages(history);
      else setMessages([{ role:'bot', text:`Namaste ${profile?.name || ''}! 🙏 I'm TaxSaathi. Ask me anything about GST, income tax, or compliance!` }]);
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const send = async (msg = input) => {
    if (!msg.trim() || loading) return;
    setInput('');
    setMessages(m => [...m, { role:'user', text: msg }]);
    setLoading(true);
    try {
      const reply = await sendChat(msg);
      setMessages(m => [...m, { role:'bot', text: reply }]);
    } catch {
      setMessages(m => [...m, { role:'bot', text:'❌ Error. Check your API key in Profile settings.' }]);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    await clearChat();
    setMessages([{ role:'bot', text:'Chat cleared! How can I help you?' }]);
  };

  return (
    <div className="page" style={{height:'calc(100vh - 64px)', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontFamily:'var(--font-head)', fontSize:'18px', fontWeight:'700'}}>🤖 AI Tax Copilot</div>
          <div style={{fontSize:'12px', color:'var(--muted)'}}>Powered by Claude AI · Chat history saved to database</div>
        </div>
        <button className="edit-btn" onClick={handleClear}>Clear History</button>
      </div>

      <div className="chat-messages" style={{flex:1}}>
        {messages.map((m,i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className={`msg-avatar ${m.role}`}>{m.role === 'bot' ? '🤖' : '👤'}</div>
            <div className="msg-bubble" style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg">
            <div className="msg-avatar bot">🤖</div>
            <div className="msg-bubble">
              <div className="msg-typing">
                <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="chat-input-area">
        <div className="quick-chips">
          {CHIPS.map((q,i) => <button key={i} className="chip" onClick={() => send(q)}>{q}</button>)}
        </div>
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Ask your tax question..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
          />
          <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>→</button>
        </div>
      </div>
    </div>
  );
}