# 🤖 Aara — Personal AI Voice & Chat Assistant

> **"Your personal assistant, always ready to help."**  
> Dedicated Personal AI Voice and Chat Assistant built exclusively for **Mr. Dinesh Kumar**.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com)
[![Zero Cost](https://img.shields.io/badge/External_Budget-%E2%82%B90_(Free)-success?style=for-the-badge)](https://github.com)

---

## 🌟 1. Project Overview & Identity

**Aara** is a production-ready, full-stack MERN application that provides both natural text chat and speech-driven interaction with an intelligent, friendly, polite, and supportive assistant persona.

### Core Identity
Whenever asked:
- *"Who are you?"*
- *"What is your name?"*
- *"Who do you assist?"*

Aara naturally and consistently responds:
> **"I'm Aara, Mr. Dinesh Kumar's personal AI assistant. I'm here to help you with coding, learning, interview preparation, and everyday questions."**

---

## 🚀 2. Strict Zero-Cost Architecture (₹0 Budget)

Aara is designed with a **100% Zero-Cost Guarantee**:
- **Zero Mandatory Paid APIs:** Runs out-of-the-box with a built-in **Intelligent Local Knowledge Engine** that handles identity, coding queries, mock interviews, and English grammar practice without requiring any credit card or paid token subscriptions.
- **Optional Free-Tier AI Adapters:** Supports free-tier Google Gemini (`gemini-1.5-flash`), Groq (`llama-3.3-70b-versatile`), or local Ollama endpoints via backend environment variables.
- **Zero-Cost Storage Resilience:** Automatically attempts to connect to MongoDB. If MongoDB is offline or unavailable, Aara seamlessly transitions to a persistent local JSON file store (`backend/data/conversations.json`) without throwing errors or interrupting service.
- **Browser-Native Voice Engine:** Utilizes the browser's native **Web Speech Recognition API** and **SpeechSynthesis API**, eliminating expensive external STT/TTS cloud subscription fees.

---

## 💎 3. Key Features

### 🎙️ Voice & Speech Capabilities
- **Natural Voice Recognition:** Push-to-talk and click-to-speak via browser speech recognition with real-time interim transcription.
- **Sweet Female Voice Synthesis:** Intelligent voice filtering prioritizes available soft, natural female English voices (e.g., *Microsoft Zira*, *Google US English Female*, *Samantha*, *Jenny*, *Aria*).
- **Interactive Controls:** Start/stop listening, interrupt/mute active speech, auto-speak toggle, speech pitch (0.7x – 1.4x), and speed rate (0.75x – 1.35x) controls.
- **Voice Test & Preview:** Dedicated button to preview Aara's voice settings anytime.
- **Animated Glowing Orb:** Visual audio indicator displaying four distinct states:
  - 🟣 **Idle**: Soft rhythmic breathing pulse.
  - 🔴 **Listening**: Energetic pink pulse with sound wave animations.
  - 🟡 **Thinking**: Rotating cognitive orbit.
  - 🔵 **Speaking**: Ripple wave visualizer synchronized with speech output.

### 🧠 4 Specialized Assistant Modes
1. **🌟 Personal Assistant:** Everyday queries, task breakdown, schedule planning, and productivity guidance.
2. **💻 Coding Mentor:** Java, JavaScript (ES6+), React, Node.js, Express, MongoDB, SQL, DSA (Data Structures & Algorithms), OOP concepts, and real-time bug diagnosis with formatted code blocks and copy buttons.
3. **🎙️ Interview Coach:** Interactive technical and behavioral mock interview rounds with constructive feedback rubrics (STAR method).
4. **🗣️ English Practice:** Conversational fluency partner, gentle grammar corrections, and workplace vocabulary recommendations.

### 🎨 User Interface & Design
- **Theme:** Dark navy, indigo, and subtle violet palette with glassmorphism cards.
- **Theme Toggle:** Dark and Light mode support with local persistence.
- **Conversation History:** Collapsible sidebar with history search, conversation selection, and individual or bulk chat deletion.
- **Formatted Code Blocks:** Syntax-styled blocks with language badges and one-click copy feedback.
- **Engine Transparency Badge:** Clearly labels whether a response came from the *Local Zero-Cost Engine* or a *Live AI Provider*.
- **Responsive Layout:** Optimized for mobile phones, tablets, and desktop displays.

---

## 📂 4. Project Directory Structure

```text
aara-ai-assistant/
├── backend/
│   ├── data/
│   │   ├── .gitkeep
│   │   └── conversations.json          # Zero-cost local persistence fallback
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection with resilient fallback
│   │   │   └── env.js                  # Environment variable configuration
│   │   ├── middlewares/
│   │   │   └── errorHandler.js         # Centralized error handling
│   │   ├── models/
│   │   │   └── Conversation.js         # Mongoose conversation schema
│   │   ├── routes/
│   │   │   ├── chatRoutes.js           # POST /api/chat
│   │   │   ├── configRoutes.js         # GET /api/status
│   │   │   └── conversationRoutes.js   # CRUD /api/conversations
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── geminiProvider.js   # Google Gemini API adapter
│   │   │   │   ├── groqProvider.js     # Groq API adapter
│   │   │   │   ├── openAiProvider.js   # OpenAI & Ollama adapter
│   │   │   │   ├── localFallbackEngine.js # Zero-cost local knowledge engine
│   │   │   │   ├── systemPrompts.js    # Aara identity & 4 mode prompts
│   │   │   │   └── index.js            # Unified AI adapter router
│   │   │   ├── storage/
│   │   │   │   └── localStore.js       # File-based JSON storage implementation
│   │   │   └── conversationService.js  # Abstract persistence layer (Mongo/Local)
│   │   └── server.js                   # Express server entry point
│   ├── .env                            # Active backend configuration
│   ├── .env.example                    # Environment template (no secrets)
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx           # Input bar, mic trigger, and mode chips
│   │   │   ├── ChatWindow.jsx          # Welcome hero, messages, and quick prompts
│   │   │   ├── CodeBlock.jsx           # Formatted code container with copy button
│   │   │   ├── GlowingOrb.jsx          # Animated voice visualizer & wave bars
│   │   │   ├── MessageBubble.jsx       # Chat bubble with markdown parser
│   │   │   ├── ModeSelector.jsx        # 4-mode pill selector
│   │   │   ├── Navbar.jsx              # Brand header, status badges, voice modal
│   │   │   ├── Sidebar.jsx             # Chat history, search, and clear controls
│   │   │   ├── StatusBadge.jsx         # Live DB/AI engine indicator
│   │   │   └── VoiceSettingsModal.jsx  # Voice picker, pitch/rate, test button
│   │   ├── hooks/
│   │   │   ├── useChat.js              # Message state & API integration
│   │   │   ├── useSpeechRecognition.js # Web Speech STT hook
│   │   │   └── useSpeechSynthesis.js   # Web Speech TTS hook with female voice
│   │   ├── services/
│   │   │   └── api.js                  # Frontend HTTP client
│   │   ├── styles/
│   │   │   └── index.css               # Modern CSS variables, glassmorphism, animations
│   │   ├── App.jsx                     # Top-level React container
│   │   └── main.jsx                    # React DOM mount point
│   ├── index.html                      # HTML entry with Outfit font
│   ├── vite.config.js                  # Vite configuration with /api proxy
│   └── package.json
├── .gitignore                          # Ignores node_modules, .env, dist, and logs
├── README.md                           # Documentation and technical guide
└── package.json                        # Root helper scripts
```

---

## 💻 5. Windows PowerShell Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on v22.14.0)
- **npm**: v9+ (tested on 10.9.2)
- **MongoDB** *(Optional)*: Local MongoDB server or free MongoDB Atlas cluster. (If omitted, Aara automatically activates local file persistence).

### Step 1: Open PowerShell and Navigate to Workspace
```powershell
cd C:\Users\LENOVO\Desktop\aara-ai-assistant
```

### Step 2: Install Backend & Frontend Dependencies
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
cd ..
```

### Step 3: Configure Environment Variables
A default `.env` is already created. You can review or customize `backend/.env`:
```powershell
# Copy example if setting up fresh
Copy-Item backend\.env.example backend\.env
```

Default zero-cost configuration (`backend/.env`):
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/aara_assistant
AI_PROVIDER=local
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=
```

### Step 4: Run the Application
Open two PowerShell terminals:

**Terminal 1 (Backend Server):**
```powershell
cd C:\Users\LENOVO\Desktop\aara-ai-assistant\backend
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```powershell
cd C:\Users\LENOVO\Desktop\aara-ai-assistant\frontend
npm run dev
# Vite starts on http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 6. REST API Documentation

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Sample Request / Response |
| :--- | :--- | :--- | :--- |
| **GET** | `/status` | Returns system health, DB status, active AI provider, and available modes | `{ "database": { "connected": true, "type": "MongoDB" }, "ai": { "isZeroCostMode": true } }` |
| **POST** | `/chat` | Sends a message to Aara and returns structured response | **Body:** `{"message": "Who are you?", "mode": "assistant", "conversationId": "conv_123"}` |
| **GET** | `/conversations` | Lists all stored conversations sorted by latest update | `{ "count": 3, "data": [...] }` |
| **GET** | `/conversations/:id` | Returns message history of a specific conversation | `{ "data": { "id": "conv_123", "messages": [...] } }` |
| **DELETE**| `/conversations/:id` | Deletes a conversation by ID | `{ "success": true, "message": "Conversation deleted." }` |
| **DELETE**| `/conversations` | Clears all conversation history | `{ "success": true, "message": "All conversations cleared." }` |

---

## ☁️ 7. Free Deployment Guide (₹0 Services)

| Layer | Recommended Free Platform | Deployment Instructions |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** *(Free Hobby Tier)* | 1. Import repository on Vercel.<br>2. Set Root Directory to `frontend`.<br>3. Set Build Command to `npm run build` and Output Directory to `dist`.<br>4. Configure rewrite rules to route `/api/:path*` to the backend URL. |
| **Backend** | **Render** *(Free Web Service)* | 1. Create a Web Service pointing to `backend`.<br>2. Build Command: `npm install`<br>3. Start Command: `npm start`<br>4. Add Environment Variables (`PORT=5000`, `CLIENT_ORIGIN=https://your-frontend.vercel.app`, `AI_PROVIDER=local`). |
| **Database** | **MongoDB Atlas** *(M0 Free Cluster)* | 1. Create a free shared M0 cluster on [MongoDB Cloud](https://cloud.mongodb.com).<br>2. Whitelist `0.0.0.0/0` in Network Access.<br>3. Set `MONGODB_URI` in backend environment variables. |

---

## 🐙 8. GitHub Publishing Instructions

To publish your project to a new GitHub repository:

```powershell
# 1. Initialize git in workspace root
git init

# 2. Add files (respects .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete functional Aara AI Voice and Chat Assistant"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/aara-ai-assistant.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 📄 9. Resume Description

Add this to your resume under **Projects**:

> **Aara — Personal AI Voice & Chat Assistant (MERN Stack)**  
> *React, Vite, Node.js, Express.js, MongoDB, Mongoose, Web Speech API, CSS3 Glassmorphism*  
> - Engineered an AI voice and chat assistant for Mr. Dinesh Kumar featuring multi-modal voice interaction (Speech Recognition STT + natural female voice synthesis TTS) and zero mandatory cloud costs.
> - Implemented 4 specialized operational modes: Coding Mentor (Java/MERN/DSA), Interview Coach (STAR feedback), English Practice (Grammar corrections), and Personal Assistant.
> - Architected a resilient dual-tier persistence layer that automatically connects to MongoDB/Mongoose or seamlessly falls back to a file-based JSON store with 100% uptime.
> - Designed a modular AI adapter router supporting Google Gemini, Groq, and an offline local knowledge engine with transparent UI provenance badges.

---

## 🎙️ 10. Technical Decisions Explained (Interview Ready)

1. **Why use native Web Speech APIs over cloud APIs (like ElevenLabs or AWS Polly)?**  
   *Answer:* Native browser `SpeechRecognition` and `SpeechSynthesis` operate with zero latency overhead, require zero backend API keys, protect user privacy by processing audio on-device, and satisfy the strict ₹0 external service cost requirement while delivering natural spoken responses.

2. **How does the storage fallback ensure high availability?**  
   *Answer:* The backend abstracts data access through a unified `conversationService`. On server boot, Mongoose attempts connection with a 3-second timeout. If MongoDB is unreachable, the system gracefully shifts to `localStore` (a transactional JSON file store) without crashing or disrupting API consumers.

3. **How is the AI provider decoupling structured?**  
   *Answer:* The AI service uses an Adapter pattern (`index.js`). The router dynamically evaluates the configured `AI_PROVIDER` and key availability. If an external API fails (rate limits or network timeout), it fails over to the `localFallbackEngine`, ensuring the user never experiences a broken chat session.

4. **Why Vite + React over traditional Create React App?**  
   *Answer:* Vite provides instant Hot Module Replacement (HMR) powered by native ES modules, significantly smaller production build footprints (under 2MB uncompressed), and straightforward proxy configuration for development.

---

## 👤 Author & Ownership
- **Owner & Beneficiary:** Mr. Dinesh Kumar
- **Assistant Persona:** Aara ("Your personal assistant, always ready to help.")
- **License:** MIT License
