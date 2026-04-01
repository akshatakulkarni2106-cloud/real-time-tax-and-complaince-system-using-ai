import { useState, useEffect, useRef } from 'react';

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap';
if (!document.head.querySelector('link[href*="Bebas+Neue"]')) {
  document.head.appendChild(fontLink);
}

// ─── Language Config ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en-IN', label: 'EN',  full: 'English',  greeting: 'Ask me anything about taxes...' },
  { code: 'hi-IN', label: 'हि',  full: 'Hindi',    greeting: 'कर के बारे में कुछ भी पूछें...' },
  { code: 'mr-IN', label: 'म',   full: 'Marathi',  greeting: 'करांबद्दल काहीही विचारा...' },
  { code: 'en-IN', label: 'HIN', full: 'Hinglish', greeting: 'Tax ke baare mein kuch bhi poocho...' },
];

const SYSTEM_PROMPT = `You are TaxSaathi Voice Assistant — a friendly, expert Indian tax advisor.
You help small business owners, gig workers, freelancers, and informal sector workers with:
- GST filing, returns, and compliance
- Income tax, ITR filing
- TDS deductions
- Government schemes eligibility (MUDRA, PM SVANidhi, Udyam, etc.)
- Tax saving tips
- Deadlines and penalties

Rules:
- Keep answers SHORT and conversational (2-4 sentences max) since this is voice
- Use simple language, avoid jargon
- If user speaks Hindi/Marathi/Hinglish, reply in the same language
- Always be encouraging and helpful
- Give specific actionable advice
- For amounts, use Indian format (lakhs, crores)`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.97); } }
  @keyframes ripple   { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(2.5); opacity:0; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes wave     { 0%,100% { transform:scaleY(0.4); } 50% { transform:scaleY(1); } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
  @keyframes glow     { 0%,100% { box-shadow: 0 0 30px rgba(0,200,150,0.2); } 50% { box-shadow: 0 0 60px rgba(0,200,150,0.5); } }
  @keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes orb1     { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(30px,-20px) scale(1.1); } }
  @keyframes orb2     { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-20px,30px) scale(0.9); } }

  .va-root * { box-sizing:border-box; margin:0; padding:0; }

  .va-root {
    font-family: 'DM Sans', sans-serif;
    background: #060808;
    min-height: 100vh;
    color: #E8E8E0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 20px 60px;
    position: relative;
    overflow: hidden;
  }

  /* Background orbs */
  .va-orb1, .va-orb2, .va-orb3 {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }
  .va-orb1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,200,150,0.06), transparent 70%);
    top: -100px; left: -100px;
    animation: orb1 8s ease-in-out infinite;
  }
  .va-orb2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(240,165,0,0.04), transparent 70%);
    bottom: -80px; right: -80px;
    animation: orb2 10s ease-in-out infinite;
  }
  .va-orb3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(77,143,255,0.03), transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }

  .va-inner {
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  /* Header */
  .va-header {
    text-align: center;
    margin-bottom: 36px;
    animation: fadeUp 0.5s ease both;
  }

  .va-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    color: #00C896; letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .va-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00C896;
    animation: pulse 1.5s infinite;
    display: inline-block;
  }

  .va-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(42px, 8vw, 72px);
    line-height: 0.92;
    letter-spacing: 0.02em;
    margin-bottom: 10px;
  }

  .va-title-accent {
    background: linear-gradient(135deg, #00C896, #00FFB3, #00C896);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .va-subtitle {
    font-size: 13px; color: #555;
    line-height: 1.6; max-width: 340px; margin: 0 auto;
  }

  /* Lang Selector */
  .va-langs {
    display: flex; gap: 6px;
    margin-bottom: 40px;
    animation: fadeUp 0.5s 0.1s ease both;
  }

  .va-lang-btn {
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px; font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.08em;
    cursor: pointer;
    border: 1px solid #1a1a1a;
    background: rgba(255,255,255,0.02);
    color: #444;
    transition: all 0.18s;
  }

  .va-lang-btn:hover { color: #888; border-color: #333; }
  .va-lang-btn.active {
    background: rgba(0,200,150,0.08);
    border-color: rgba(0,200,150,0.4);
    color: #00C896;
  }

  /* Mic Button Area */
  .va-mic-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    animation: fadeUp 0.5s 0.15s ease both;
  }

  .va-mic-wrap {
    position: relative;
    width: 160px; height: 160px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }

  .va-ripple {
    position: absolute;
    width: 100%; height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(0,200,150,0.4);
    animation: ripple 1.5s ease-out infinite;
  }

  .va-ripple:nth-child(2) { animation-delay: 0.5s; }
  .va-ripple:nth-child(3) { animation-delay: 1s; }

  .va-mic-btn {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 2;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    transition: transform 0.2s, box-shadow 0.2s;
    background: linear-gradient(135deg, #00C896, #009970);
    box-shadow: 0 0 40px rgba(0,200,150,0.3), 0 8px 32px rgba(0,0,0,0.5);
  }

  .va-mic-btn:hover { transform: scale(1.05); box-shadow: 0 0 60px rgba(0,200,150,0.5), 0 12px 40px rgba(0,0,0,0.6); }
  .va-mic-btn:active { transform: scale(0.97); }

  .va-mic-btn.listening {
    background: linear-gradient(135deg, #FF4444, #CC2200);
    box-shadow: 0 0 40px rgba(255,68,68,0.4), 0 8px 32px rgba(0,0,0,0.5);
    animation: glow 1s ease-in-out infinite;
  }

  .va-mic-btn.listening { --glow-color: rgba(255,68,68,0.4); }

  .va-mic-btn.loading {
    background: linear-gradient(135deg, #F0A500, #CC8800);
    box-shadow: 0 0 40px rgba(240,165,0,0.3);
    cursor: not-allowed;
  }

  .va-mic-status {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #444;
    transition: color 0.3s;
  }

  .va-mic-status.listening { color: #FF4444; animation: pulse 1s infinite; }
  .va-mic-status.loading   { color: #F0A500; }
  .va-mic-status.speaking  { color: #00C896; }

  /* Waveform */
  .va-wave {
    display: flex; align-items: center; gap: 3px;
    height: 24px; margin-top: 8px;
    opacity: 0; transition: opacity 0.3s;
  }
  .va-wave.active { opacity: 1; }
  .va-wave-bar {
    width: 3px; border-radius: 2px;
    background: #FF4444;
    height: 100%;
    transform: scaleY(0.3);
  }
  .va-wave-bar:nth-child(1) { animation: wave 0.8s 0.0s ease-in-out infinite; }
  .va-wave-bar:nth-child(2) { animation: wave 0.8s 0.1s ease-in-out infinite; }
  .va-wave-bar:nth-child(3) { animation: wave 0.8s 0.2s ease-in-out infinite; }
  .va-wave-bar:nth-child(4) { animation: wave 0.8s 0.3s ease-in-out infinite; }
  .va-wave-bar:nth-child(5) { animation: wave 0.8s 0.15s ease-in-out infinite; }
  .va-wave-bar:nth-child(6) { animation: wave 0.8s 0.05s ease-in-out infinite; }
  .va-wave-bar:nth-child(7) { animation: wave 0.8s 0.25s ease-in-out infinite; }

  /* Transcript Box */
  .va-transcript {
    width: 100%;
    padding: 18px 22px;
    border-radius: 16px;
    border: 1px solid #1a1a1a;
    background: #0D0D0D;
    margin-bottom: 16px;
    min-height: 64px;
    display: flex; align-items: center;
    animation: fadeUp 0.5s 0.2s ease both;
  }

  .va-transcript-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 600;
    color: #333; letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }

  .va-transcript-text {
    font-size: 15px; color: #ccc; line-height: 1.5;
    font-style: italic;
  }

  .va-transcript-text.empty { color: #333; font-style: normal; font-size: 13px; }

  /* Response Box */
  .va-response {
    width: 100%;
    border-radius: 16px;
    border: 1px solid rgba(0,200,150,0.15);
    background: linear-gradient(135deg, #0a1510, #080d0b);
    overflow: hidden;
    margin-bottom: 24px;
    animation: fadeUp 0.5s 0.25s ease both;
    transition: border-color 0.3s;
  }

  .va-response.active { border-color: rgba(0,200,150,0.35); }

  .va-response-header {
    padding: 12px 22px;
    border-bottom: 1px solid rgba(0,200,150,0.08);
    display: flex; align-items: center; gap: 8px;
  }

  .va-response-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00C896;
  }

  .va-response-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; font-weight: 600;
    color: #00C896; letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .va-response-body {
    padding: 20px 22px;
    font-size: 15px; color: #bbb;
    line-height: 1.7;
    min-height: 80px;
  }

  .va-response-body.empty { color: #333; font-size: 13px; font-style: italic; }

  /* Loading spinner */
  .va-spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(240,165,0,0.2);
    border-top-color: #F0A500;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  }

  /* History */
  .va-history {
    width: 100%;
    animation: fadeUp 0.5s 0.3s ease both;
  }

  .va-history-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    color: #333; letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #111;
  }

  .va-history-item {
    padding: 14px 18px;
    border-radius: 12px;
    border: 1px solid #141414;
    background: #0A0A0A;
    margin-bottom: 8px;
    animation: slideIn 0.3s ease both;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .va-history-item:hover { border-color: #222; }

  .va-history-q {
    font-size: 12px; color: #666;
    margin-bottom: 6px;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .va-history-q::before {
    content: '🎤';
    font-size: 10px; margin-top: 1px; flex-shrink: 0;
  }

  .va-history-a {
    font-size: 12px; color: #444;
    line-height: 1.5;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .va-history-a::before {
    content: '🤖';
    font-size: 10px; margin-top: 1px; flex-shrink: 0;
  }

  /* Error */
  .va-error {
    width: 100%;
    padding: 14px 18px;
    border-radius: 12px;
    background: rgba(255,59,59,0.06);
    border: 1px solid rgba(255,59,59,0.2);
    color: #FF6B6B;
    font-size: 13px;
    margin-bottom: 16px;
    animation: fadeUp 0.3s ease;
  }

  /* Tips */
  .va-tips {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 24px;
    animation: fadeUp 0.5s 0.35s ease both;
  }

  .va-tip {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #141414;
    background: #0A0A0A;
    cursor: pointer;
    transition: all 0.18s;
    font-size: 12px; color: #555;
    display: flex; align-items: center; gap: 8px;
  }

  .va-tip:hover {
    border-color: rgba(0,200,150,0.25);
    color: #888;
    background: rgba(0,200,150,0.03);
  }

  .va-tip-icon { font-size: 14px; flex-shrink: 0; }

  /* Stop speaking btn */
  .va-stop-btn {
    padding: 8px 20px;
    border-radius: 100px;
    border: 1px solid rgba(255,107,53,0.3);
    background: rgba(255,107,53,0.08);
    color: #FF6B35;
    font-size: 12px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.08em;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.18s;
  }
  .va-stop-btn:hover { background: rgba(255,107,53,0.15); }

  @media (max-width: 480px) {
    .va-tips { grid-template-columns: 1fr; }
    .va-mic-btn { width: 86px; height: 86px; font-size: 30px; }
    .va-mic-wrap { width: 130px; height: 130px; }
  }
`;

const SAMPLE_QUESTIONS = [
  { icon: '🧾', text: 'How do I file GSTR-1?' },
  { icon: '💰', text: 'How to save tax on ₹5L income?' },
  { icon: '🏭', text: 'Am I eligible for MUDRA loan?' },
  { icon: '📅', text: 'When is the ITR deadline?' },
];

export default function VoiceAssistant() {
  const [langIdx, setLangIdx]       = useState(0);
  const [status, setStatus]         = useState('idle'); // idle | listening | loading | speaking
  const [transcript, setTranscript] = useState('');
  const [response, setResponse]     = useState('');
  const [history, setHistory]       = useState([]);
  const [error, setError]           = useState('');

  const recognitionRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);
  const lang           = LANGUAGES[langIdx];

  // ── Speech Recognition setup ──────────────────────────────────────────────
  const startListening = () => {
    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang.code;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart  = () => setStatus('listening');
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    recognition.onerror  = (e) => {
      setError('Could not hear you. Please try again.');
      setStatus('idle');
    };
    recognition.onend = () => {
      if (status === 'listening') askGemini();
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    askGemini();
  };

  // ── Ask Groq via backend ───────────────────────────────────────────────────
  const askGemini = async (customText) => {
    const question = customText || transcript;
    if (!question.trim()) { setStatus('idle'); return; }

    setStatus('loading');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      const answer = data.reply || data.message || data.response || 'Sorry, I could not understand that.';
      setResponse(answer);
      setHistory(h => [{ q: question, a: answer }, ...h.slice(0, 4)]);
      speakResponse(answer);
    } catch (err) {
      setError('Could not connect to server. Make sure your backend is running.');
      setStatus('idle');
    }
  };

  // ── Text to Speech ─────────────────────────────────────────────────────────
  const speakResponse = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.code;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setStatus('speaking');
    utterance.onend   = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');
    synthRef.current.speak(utterance);
    setStatus('speaking');
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setStatus('idle');
  };

  // ── Mic button click ───────────────────────────────────────────────────────
  const handleMicClick = () => {
    if (status === 'listening') { stopListening(); return; }
    if (status === 'speaking')  { stopSpeaking(); return; }
    if (status === 'loading')   return;
    setTranscript('');
    setResponse('');
    startListening();
  };

  // ── Sample question click ──────────────────────────────────────────────────
  const handleSampleClick = (text) => {
    setTranscript(text);
    setResponse('');
    askGemini(text);
  };

  // ── Mic icon & status label ────────────────────────────────────────────────
  const micIcon = status === 'listening' ? '⏹' : status === 'loading' ? '⏳' : status === 'speaking' ? '🔊' : '🎤';
  const statusLabel = {
    idle: 'TAP TO SPEAK',
    listening: 'LISTENING...',
    loading: 'THINKING...',
    speaking: 'SPEAKING...',
  }[status];

  return (
    <>
      <style>{styles}</style>
      <div className="va-root">
        <div className="va-orb1" /><div className="va-orb2" /><div className="va-orb3" />

        <div className="va-inner">

          {/* Header */}
          <div className="va-header">
            <div className="va-eyebrow">
              <span className="va-live-dot" /> AI Voice Assistant
            </div>
            <div className="va-title">
              TAX<br /><span className="va-title-accent">SAATHI</span>
            </div>
            <div className="va-subtitle">
              Speak in any language — get instant answers about GST, ITR, TDS and government schemes.
            </div>
          </div>

          {/* Language Selector */}
          <div className="va-langs">
            {LANGUAGES.map((l, i) => (
              <button
                key={i}
                className={`va-lang-btn ${langIdx === i ? 'active' : ''}`}
                onClick={() => setLangIdx(i)}
              >
                {l.label} · {l.full}
              </button>
            ))}
          </div>

          {/* Mic */}
          <div className="va-mic-area">
            <div className="va-mic-wrap">
              {status === 'listening' && (
                <><div className="va-ripple" /><div className="va-ripple" /><div className="va-ripple" /></>
              )}
              <button
                className={`va-mic-btn ${status}`}
                onClick={handleMicClick}
                title={statusLabel}
              >
                {micIcon}
              </button>
            </div>

            <div className={`va-mic-status ${status}`}>{statusLabel}</div>

            {/* Waveform */}
            <div className={`va-wave ${status === 'listening' ? 'active' : ''}`}>
              {[...Array(7)].map((_, i) => <div key={i} className="va-wave-bar" />)}
            </div>

            {status === 'speaking' && (
              <button className="va-stop-btn" onClick={stopSpeaking}>⏹ Stop Speaking</button>
            )}
          </div>

          {/* Error */}
          {error && <div className="va-error">⚠️ {error}</div>}

          {/* Transcript */}
          <div className="va-transcript">
            <div style={{ width: '100%' }}>
              <span className="va-transcript-label">You said</span>
              <div className={`va-transcript-text ${!transcript ? 'empty' : ''}`}>
                {transcript || lang.greeting}
              </div>
            </div>
          </div>

          {/* Response */}
          <div className={`va-response ${response ? 'active' : ''}`}>
            <div className="va-response-header">
              <div className="va-response-dot" />
              <div className="va-response-title">TaxSaathi Response</div>
              {status === 'loading' && <span className="va-spinner" />}
            </div>
            <div className={`va-response-body ${!response ? 'empty' : ''}`}>
              {response || 'Your answer will appear here after you speak...'}
            </div>
          </div>

          {/* Sample Questions */}
          {!transcript && (
            <div className="va-tips">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <div key={i} className="va-tip" onClick={() => handleSampleClick(q.text)}>
                  <span className="va-tip-icon">{q.icon}</span>
                  {q.text}
                </div>
              ))}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="va-history">
              <div className="va-history-title">Recent Conversations</div>
              {history.map((h, i) => (
                <div key={i} className="va-history-item" onClick={() => { setTranscript(h.q); setResponse(h.a); }}>
                  <div className="va-history-q">{h.q}</div>
                  <div className="va-history-a">{h.a.slice(0, 100)}{h.a.length > 100 ? '...' : ''}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
