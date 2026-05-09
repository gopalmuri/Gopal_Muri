// src/components/ChatBot/ChatBot.jsx
import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import aiAvatar from '../../assets/images/ai-assistant.png';

// REPLACE email below
const CONTACT_EMAIL = 'gopalmuri2004@gmail.com';

const BOT_RESPONSES = {
  skills: `Here are my core skills:\n🐍 Python & Django / FastAPI (Backend APIs)\n⚛️ React.js & React Native (Frontend)\n☕ Java & Spring Boot\n🗄️ MySQL, PostgreSQL, MongoDB\n🔀 Git, Docker, Linux\n☁️ Azure, Google Cloud (basics)`,
  hire: `To hire or connect with me:\n📧 Email: ${CONTACT_EMAIL}\n💼 LinkedIn: linkedin.com/in/gopalmuri\n🐙 GitHub: github.com/gopalmuri\nOr use the Contact section on this site!`,
  projects: `scrollTo:projects|I have built some cool projects! Let me scroll you to the Projects section. You can also check my GitHub: github.com/gopalmuri`,
  experience: `My experience:\n💼 Full Stack Developer @ ThirdEye Data, Hubli (Jan 2026 – Present)\n🏆 Recognized as Top Performer at ThirdEye's Learning Path Program\n🎓 B.E. Computer Science @ KLS VDIT, Haliyal (CGPA: 9.12, Expected 2026)\n📂 Built AI recruitment platforms, crowd analytics systems & RAG assistants`,
  available: `🟢 Yes! I'm currently open to:\n• Full-time developer roles\n• Freelance / contract projects\n• Remote or onsite positions\nFeel free to reach out at ${CONTACT_EMAIL}!`,
  education: `🎓 B.E. in Computer Science\nKLS Vishwanathrao Deshpande Institute of Technology, Haliyal\nCGPA: 9.12 | Expected Graduation: 2026\n📚 12th: 90.66% — Vishweshwaraya SC PU College, Dharwad`,
  about: `I'm Gopal Muri — a passionate Full Stack Developer currently working at ThirdEye Data, Hubli (Jan 2026 – Present).\nI build robust web apps using FastAPI, Django on the backend and React on the frontend.\nI'm also pursuing my B.E. CS with a 9.12 CGPA!`,
};

function getResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('skill') || msg.includes('technolog') || msg.includes('know') || msg.includes('stack') || msg.includes('language'))
    return { text: BOT_RESPONSES.skills };
  if (msg.includes('hire') || msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('work with') || msg.includes('connect'))
    return { text: BOT_RESPONSES.hire };
  if (msg.includes('project') || msg.includes('portfolio') || msg.includes('built') || msg.includes('show'))
    return { text: BOT_RESPONSES.projects };
  if (msg.includes('experience') || msg.includes('journey') || msg.includes('background') || msg.includes('career') || msg.includes('job') || msg.includes('work'))
    return { text: BOT_RESPONSES.experience };
  if (msg.includes('available') || msg.includes('open') || msg.includes('opportunit') || msg.includes('free') || msg.includes('looking'))
    return { text: BOT_RESPONSES.available };
  if (msg.includes('education') || msg.includes('college') || msg.includes('degree') || msg.includes('study') || msg.includes('cgpa') || msg.includes('university') || msg.includes('vdit'))
    return { text: BOT_RESPONSES.education };
  if (msg.includes('who') || msg.includes('about') || msg.includes('yourself') || msg.includes('gopal') || msg.includes('tell me'))
    return { text: BOT_RESPONSES.about };
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hola') || msg.includes('namaste'))
    return { text: `Hey there! 👋 I'm GopalBot.\nI can only answer questions about Gopal's profile. Ask me about:\n• 🛠️ Skills & Technologies\n• 💼 Work Experience\n• 🎓 Education\n• 📂 Projects\n• 📩 How to hire Gopal` };

  // Fallback for ALL unrelated questions
  return { text: `🤖 I'm GopalBot — I can only answer questions related to Gopal's profile, skills, projects, and experience.\n\nFor anything else, please reach out directly:\n📧 ${CONTACT_EMAIL}` };
}

const INITIAL_MESSAGE = { id: 0, from: 'bot', text: `Hi! I'm GopalBot 🤖\nI can answer questions about Gopal's skills, projects, experience, and how to hire him.\nWhat would you like to know?`, time: new Date() };

const MAX_USER_MSGS = 5;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chatbot_history');
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    } catch { return [INITIAL_MESSAGE]; }
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  // ✅ Use localStorage so limit persists across ALL tabs + browser restarts
  const [limitReached, setLimitReached] = useState(() => {
    try {
      const count = parseInt(localStorage.getItem('gopalbot_msg_count') || '0', 10);
      return count >= MAX_USER_MSGS;
    } catch {}
    return false;
  });
  const bottomRef = useRef(null);

  // Count from localStorage (cross-tab persistent)
  const userMsgCount = (() => {
    try { return parseInt(localStorage.getItem('gopalbot_msg_count') || '0', 10); } catch { return 0; }
  })();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    try { sessionStorage.setItem('chatbot_history', JSON.stringify(messages)); } catch {}
  }, [messages]);

  // ⚠️ TEMPORARY: Direct Groq call for LOCAL TESTING ONLY
  // TODO: Revert to /api/chat before final deployment
  const SYSTEM_PROMPT_LOCAL = `You are GopalBot, an AI assistant built exclusively for Gopal Muri's portfolio website.
Answer questions ONLY using the portfolio information below. Do NOT use any outside knowledge. Do NOT make up anything.

=== GOPAL MURI — COMPLETE PORTFOLIO ===

--- PERSONAL INFO ---
Name: Gopal Muri
Role: Junior Full Stack Developer
Location: Karnataka, India
Email: gopalmuri2004@gmail.com
LinkedIn: linkedin.com/in/gopalmuri
GitHub: github.com/gopalmuri
YouTube: youtube.com/@gopal_muri
X (Twitter): x.com/MuriGopal98677
Instagram: instagram.com/gopalmuri
LeetCode: leetcode.com/gopalmuri
Response time: Usually within 24 hours

--- EDUCATION ---
1. B.E. in Computer Science & Engineering
   KLS Vishwanathrao Deshpande Institute of Technology, Haliyal, Karnataka
   Dec 2022 – Jul 2026 (Expected) | CGPA: 9.12
   Core subjects: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering, OOP with Java

2. Pre-University (PCMB)
   Vishweshwaraya SC PU College, Dharwad, Karnataka
   Aug 2020 – Apr 2022 | Score: 90.66%

--- WORK EXPERIENCE / JOURNEY ---
1. Junior Full Stack Developer — ThirdEye Data, Hubli (Jan 2026 – Present)
   Exact duration: ~5 months (as of May 2026). DO NOT say "1 year" — it is NOT 1 year.
   - Developed QSR system: React Native mobile app (POC) integrated with FastAPI backend
   - Implemented POS (Point of Sale) functionalities for order processing
   - Building QSR web application using React + FastAPI
   - Recognized as Top 1 Performer in ThirdEye Data Learning Path Program
   - Awarded the Meenakshi Phalguni Das Scholarship by Founder & CEO DJ Das
   - Conducted interactive interview session with industry leaders

2. AI Intern — ThirdEye Data, Hubli (Jun 2025 – Mar 2026)
   Exact duration: ~9 months
   - Worked on AI pipelines and model integration for production use-cases
   - Gained hands-on experience in backend and ML infrastructure

Total professional experience at ThirdEye Data: ~1 year 1 month combined (internship + full-time)

--- SKILLS (with proficiency) ---
Frontend: HTML5 (92%), CSS3 (88%), Bootstrap (82%), JavaScript (85%), React.js (83%), React Native (75%)
Backend: Java (90%), Python (90%), Django (86%), FastAPI (84%), Flask (78%)
Databases: MySQL (85%), Oracle SQL (75%), MongoDB (78%)
Tools: Git (90%), GitHub (90%), Postman (85%)
Core Concepts: OOP (88%), DSA (80%)

--- PROJECTS ---
1. HiringAI Platform — AI Recruitment Platform (Jan 2026)
   - Screens & ranks 100+ resumes using Sentence Transformers + ChromaDB semantic search
   - AI voice interviews with real-time transcription (95% accuracy)
   - Secure coding assessment using Piston API
   - Tech: Python, FastAPI, React, MySQL, ChromaDB, Groq, Vapi, Piston API
   - GitHub: https://github.com/gopalmuri/HiringAI
   - Live Demo: https://hiring-ai-blush.vercel.app/

2. Real-Time Crowd Analytics — AI Monitoring Platform (Jul 2025)
   - Real-time person detection, crowd density estimation, gender classification from live video
   - Detects 50+ people with 90%+ accuracy, under 1 second latency
   - Flask dashboard with gender-targeted advertising and alert generation
   - Tech: Python, Flask, OpenCV, MobileNetSSD, Caffe DNN
   - GitHub: https://github.com/gopalmuri/Crowd-Analytics
   - Live Demo: Not available (runs locally)

3. AI Document Assistant (RAG) — Document Analysis Platform (Nov 2025)
   - Processes and analyzes 100+ PDFs using ChromaDB vector embeddings
   - 90%+ retrieval accuracy, under 500ms latency
   - Tech: Python, Django, ChromaDB, MySQL, SentenceTransformers
   - GitHub: https://github.com/gopalmuri
   - Live Demo: https://docquery-ai-app.onrender.com/

--- CERTIFICATIONS (all visible in portfolio) ---
1. Introduction to Generative AI Studio — Google Cloud / Simplilearn (Jan 2026)
2. Data & AI Technologies Internship — ThirdEye Data (Oct 2025)
3. Infosys Springboard / ICT Academy — Infosys (Sep 2025)
4. ThirdEye Learning Path Program — ThirdEye Data (Aug 2025)
5. Hackfusion-2K25 — A.G.M Rural College (May 2025)
6. TCS TechBytes 2025 — TCS (2025)
7. Python Full Stack Virtual Internship — AICTE / EduSkills (Dec 2024)
8. Aviny Hackathon — VDIT Haliyal (Jul 2024)
9. Microsoft Azure AI Fundamentals — Microsoft (Jun 2024)

--- MILESTONES & ACHIEVEMENTS ---
1. ThirdEye Data — Top Performer: Recognised as Top Performer in ThirdEye Data Learning Path Program on Data Science & AI. Awarded the Meenakshi Phalguni Das Scholarship by CEO DJ Das.
2. HackHunter Quiz: Organized and conducted a technical quiz for CS students.
3. HackFusion 2K25: Participated in 12-hour National Level Hackathon at A.G.M Rural College (Agratha-2k25) on May 17, 2025.
4. TCS TechBytes 2025: Participated in statewide Engineering IT Quiz by TCS and BITES.
5. Eyesec Cyber Security Visit: Industrial visit to Eyesec Cyber Security Solutions on April 11, 2025. Learned about AI-powered Crowd Management and ethical hacking.
6. Technical Treasure Hunt: Secured 2nd Place with team "Hack Hunter" on September 15, 2025.
7. Major Project Team: Collaborated with team to design, develop, and defend final year major engineering project.

=== END OF PORTFOLIO ===

STRICT RULES:
1. Answer ONLY from the portfolio data above. Do NOT use any outside knowledge.
2. If a question cannot be answered from the data above, say exactly: "I can only answer questions about Gopal's portfolio. Please contact him at gopalmuri2004@gmail.com"
3. Do NOT answer general knowledge, math, coding help for others, jokes, or anything unrelated.
4. Do NOT share any passwords, admin credentials, or phone numbers.
5. Keep answers short and friendly (3–5 lines max).
6. Always refer to Gopal in third person.
7. NEVER calculate years of experience yourself. Always use the exact dates/durations provided above.`;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || limitReached) return;

    // Check message limit BEFORE sending
    if (userMsgCount >= MAX_USER_MSGS) {
      setLimitReached(true);
      setMessages((m) => [...m,
        { id: Date.now(), from: 'user', text, time: new Date() },
        { id: Date.now() + 1, from: 'bot', text: `🚫 You've reached the ${MAX_USER_MSGS}-message limit for this session!

I hope I was helpful 😊 To continue the conversation or get in touch with Gopal directly:

📧 Email: gopalmuri2004@gmail.com
💼 LinkedIn: linkedin.com/in/gopalmuri
🐙 GitHub: github.com/gopalmuri
📺 YouTube: youtube.com/@gopal_muri

Gopal usually responds within 24 hours!`, time: new Date() },
      ]);
      setInput('');
      return;
    }

    // ✅ Increment count in localStorage BEFORE sending
    try {
      const newCount = userMsgCount + 1;
      localStorage.setItem('gopalbot_msg_count', String(newCount));
      if (newCount >= MAX_USER_MSGS) setLimitReached(true);
    } catch {}

    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    let replyText = null;

    // ─── Production: Try /api/chat first (Vercel serverless — has IP rate limiting) ───
    try {
      const prodRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (prodRes.status === 429) {
        // IP-based limit reached (from Upstash Redis)
        const data = await prodRes.json();
        setLimitReached(true);
        localStorage.setItem('gopalbot_msg_count', String(MAX_USER_MSGS));
        setTyping(false);
        setMessages((m) => [...m, {
          id: Date.now() + 1,
          from: 'bot',
          text: `🚫 ${data.message || `You've reached the ${MAX_USER_MSGS}-message limit.\n\nPlease contact Gopal directly:\n📧 gopalmuri2004@gmail.com\n💼 linkedin.com/in/gopalmuri`}`,
          time: new Date(),
        }]);
        return;
      }

      if (prodRes.ok) {
        const data = await prodRes.json();
        replyText = data.reply || null;
      }
    } catch {
      // /api/chat not available (local dev) — fall through to direct Groq calls below
    }

    // Helper: call Groq with a given API key
    const callGroq = async (apiKey) => {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_LOCAL },
            { role: 'user', content: text },
          ],
          max_tokens: 200,
          temperature: 0.6,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || null;
    };

    // 🔑 Tier 1 — Primary Groq key
    try {
      const key1 = process.env.REACT_APP_GROQ_API_KEY;
      if (key1) replyText = await callGroq(key1);
    } catch { /* try next */ }

    // 🔑 Tier 2 — Fallback Groq key
    if (!replyText) {
      try {
        const key2 = process.env.REACT_APP_GROQ_API_KEY_2;
        if (key2) replyText = await callGroq(key2);
      } catch { /* try next */ }
    }

    // 🗝️ Tier 3 — Keyword matching fallback (activates if both Groq keys fail)
    if (!replyText) {
      const response = getResponse(text);
      if (response.text.startsWith('scrollTo:')) {
        const [, rest] = response.text.split('scrollTo:');
        const [sectionId, displayText] = rest.split('|');
        replyText = displayText;
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        replyText = response.text;
      }
    }

    setTyping(false);
    setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: replyText || '❌ No response', time: new Date() }]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* FAB button */}
      <button
        className={`chatbot__fab ${open ? 'chatbot__fab--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chatbot"
      >
        {!open ? (
          <>
            <div className="chatbot__avatar-container">
              <img src={aiAvatar} alt="AI Assistant" className="chatbot__avatar-img" />
            </div>
            <span className="chatbot__fab-online"></span>
            <span className="chatbot__fab-tooltip">Chat with Gopal 👋</span>
          </>
        ) : (
          '✕'
        )}
        {!open && messages.length > 1 && (
          <span className="chatbot__badge">{messages.filter(m => m.from === 'bot').length}</span>
        )}
      </button>

      {/* Chat window */}
      <div className={`chatbot__window ${open ? 'chatbot__window--open' : ''}`}>
        {/* Header */}
        <div className="chatbot__header">
          <div className="chatbot__avatar">
            <img src={aiAvatar} alt="AI" className="chatbot__header-img" />
          </div>
          <div>
            <p className="chatbot__bot-name">GopalBot</p>
            <p className="chatbot__bot-status">
              <span className="chatbot__online-dot" /> Online
            </p>
          </div>
          <button className="chatbot__close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="chatbot__messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot__msg chatbot__msg--${msg.from}`}>
              <div className="chatbot__bubble">
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
              <span className="chatbot__time">{formatTime(msg.time)}</span>
            </div>
          ))}
          {typing && (
            <div className="chatbot__msg chatbot__msg--bot">
              <div className="chatbot__bubble chatbot__bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chatbot__input-bar">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={limitReached ? '🚫 Message limit reached — contact Gopal directly' : 'Ask me anything...'}
            className="chatbot__input"
            maxLength={200}
            disabled={limitReached}
            style={limitReached ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
          <button
            className="chatbot__send"
            onClick={sendMessage}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
