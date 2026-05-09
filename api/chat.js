// api/chat.js — Vercel Serverless Function
// Groq API key is stored securely in Vercel Environment Variables
// Never expose this key in frontend code!

const SYSTEM_PROMPT = `You are GopalBot, an AI assistant built exclusively for Gopal Muri's portfolio website.
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

--- CERTIFICATIONS ---
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
3. HackFusion 2K25: Participated in 12-hour National Level Hackathon at A.G.M Rural College on May 17, 2025.
4. TCS TechBytes 2025: Participated in statewide Engineering IT Quiz by TCS and BITES.
5. Eyesec Cyber Security Visit: Industrial visit to Eyesec Cyber Security Solutions on April 11, 2025.
6. Technical Treasure Hunt: Secured 2nd Place with team "Hack Hunter" on September 15, 2025.
7. Major Project Team: Collaborated with team to design, develop, and defend final year major engineering project.

=== END OF PORTFOLIO ===

STRICT RULES:
1. Answer ONLY from the portfolio data above. Do NOT use any outside knowledge.
2. If a question cannot be answered from the data above, say: "I can only answer questions about Gopal's portfolio. Please contact him at gopalmuri2004@gmail.com"
3. Do NOT answer general knowledge, math, coding help for others, jokes, or anything unrelated.
4. Do NOT share any passwords, admin credentials, or phone numbers.
5. Keep answers short and friendly (3–5 lines max).
6. Always refer to Gopal in third person.
7. NEVER calculate years of experience yourself. Always use the exact dates/durations stated above.`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  // ─── IP-based Rate Limiting via Upstash Redis ───────────────────────────
  const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const MAX_MSGS    = 5;
  const TTL_SECONDS = 60 * 60 * 24; // 24 hours

  // Get user IP
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const redisKey = `gopalbot:ip:${ip}`;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      // GET current count
      const getRes = await fetch(`${REDIS_URL}/get/${redisKey}`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      });
      const getData = await getRes.json();
      const currentCount = parseInt(getData.result || '0', 10);

      if (currentCount >= MAX_MSGS) {
        return res.status(429).json({
          error: 'limit_reached',
          message: `🚫 You've reached the ${MAX_MSGS}-message limit for this session!\n\nI hope I was helpful 😊 To continue the conversation or get in touch with Gopal directly:\n\n📧 Email: gopalmuri2004@gmail.com\n💼 LinkedIn: linkedin.com/in/gopalmuri\n🐙 GitHub: github.com/gopalmuri\n📺 YouTube: youtube.com/@gopal_muri\n\nGopal usually responds within 24 hours!`,
        });
      }

      // INCR and set TTL (only set TTL on first message)
      await fetch(`${REDIS_URL}/incr/${redisKey}`, {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      });
      if (currentCount === 0) {
        await fetch(`${REDIS_URL}/expire/${redisKey}/${TTL_SECONDS}`, {
          headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
        });
      }
    } catch (e) {
      // Redis unavailable — continue without rate limiting
      console.warn('Redis unavailable, skipping IP rate limit:', e.message);
    }
  }
  // ─── End Rate Limiting ───────────────────────────────────────────────────

  // Helper: call Groq with a specific key
  const callGroq = async (apiKey) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message.trim() },
        ],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  };

  let reply = null;

  // 🔑 Tier 1 — Primary Groq key
  try {
    const key1 = process.env.GROQ_API_KEY;
    if (key1) reply = await callGroq(key1);
  } catch (e) {
    console.error('Key 1 failed:', e.message);
  }

  // 🔑 Tier 2 — Fallback Groq key
  if (!reply) {
    try {
      const key2 = process.env.GROQ_API_KEY_2;
      if (key2) reply = await callGroq(key2);
    } catch (e) {
      console.error('Key 2 failed:', e.message);
    }
  }

  // 🗝️ Tier 3 — No key worked, tell frontend to use keyword fallback
  if (!reply) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  return res.status(200).json({ reply });
}
