import { AARA_CANONICAL_IDENTITY_REPLY } from './systemPrompts.js';

/**
 * Intelligent Local Knowledge & Rule Engine
 * Guarantees zero-cost, offline operation without requiring any paid API or external service.
 */

// Helper to clean and normalize text
const normalize = (text = '') => text.toLowerCase().trim().replace(/[^\w\s]/gi, '');

export function generateLocalReply({ message, mode = 'assistant', history = [] }) {
  const norm = normalize(message);

  // 1. Mandatory Identity Check
  const isIdentityQuestion =
    norm.includes('who are you') ||
    norm.includes('what is your name') ||
    norm.includes('who do you assist') ||
    norm.includes('tell me about yourself') ||
    norm.includes('introduce yourself') ||
    norm.includes('who made you') ||
    norm.includes('who created you');

  if (isIdentityQuestion) {
    return (
      AARA_CANONICAL_IDENTITY_REPLY +
      "\n\nHow can I assist you right now? You can switch modes anytime between **Personal Assistant**, **Coding Mentor**, **Interview Coach**, and **English Practice**!"
    );
  }

  // 2. Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|namaste)\b/i.test(message.trim())) {
    return (
      `Hello! I'm Aara, Mr. Dinesh Kumar's personal AI assistant. It's wonderful to connect with you today!\n\n` +
      `We're currently in **${formatModeName(mode)}** mode. What would you like to explore or work on together?`
    );
  }

  // 3. Mode-specific handlers
  if (mode === 'coding') {
    return handleCodingMode(norm, message);
  } else if (mode === 'interview') {
    return handleInterviewMode(norm, message, history);
  } else if (mode === 'english') {
    return handleEnglishMode(norm, message);
  } else {
    return handleAssistantMode(norm, message);
  }
}

function formatModeName(mode) {
  switch (mode) {
    case 'coding':
      return 'Coding Mentor';
    case 'interview':
      return 'Interview Coach';
    case 'english':
      return 'English Practice';
    default:
      return 'Personal Assistant';
  }
}

/* -------------------------------------------------------------
   CODING MENTOR KNOWLEDGE ENGINE
------------------------------------------------------------- */
function handleCodingMode(norm, original) {
  // React queries
  if (norm.includes('react') || norm.includes('useeffect') || norm.includes('usestate') || norm.includes('hook')) {
    if (norm.includes('useeffect')) {
      return (
        `### Understanding React's \`useEffect\` Hook\n\n` +
        `\`useEffect\` lets you synchronize a component with external systems (such as fetching data, DOM manipulation, or subscriptions).\n\n` +
        `\`\`\`jsx\n` +
        `import React, { useState, useEffect } from 'react';\n\n` +
        `function UserProfile({ userId }) {\n` +
        `  const [user, setUser] = useState(null);\n` +
        `  const [loading, setLoading] = useState(true);\n\n` +
        `  useEffect(() => {\n` +
        `    let isCancelled = false;\n` +
        `    setLoading(true);\n\n` +
        `    fetch(\`/api/users/\${userId}\`)\n` +
        `      .then(res => res.json())\n` +
        `      .then(data => {\n` +
        `        if (!isCancelled) {\n` +
        `          setUser(data);\n` +
        `          setLoading(false);\n` +
        `        }\n` +
        `      });\n\n` +
        `    // Cleanup function runs when userId changes or unmounts\n` +
        `    return () => {\n` +
        `      isCancelled = true;\n` +
        `    };\n` +
        `  }, [userId]); // Dependency array: only re-runs if userId changes\n\n` +
        `  if (loading) return <div>Loading user profile...</div>;\n` +
        `  return <div>Welcome, {user?.name}!</div>;\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `**Key Rules:**\n` +
        `1. **Empty array \`[]\`**: Runs once on mount and cleans up on unmount.\n` +
        `2. **With dependencies \`[prop, state]\`**: Runs on mount and whenever those dependencies change.\n` +
        `3. **No array**: Runs after every single render (rarely intended).`
      );
    }
    return (
      `### React Best Practices & Architecture\n\n` +
      `Here are essential React design principles I recommend:\n\n` +
      `- **State Colocation**: Keep state as close as possible to where it's used.\n` +
      `- **Pure Functions & Immutability**: Always update state using immutable patterns (\`[...prev, newItem]\` or \`{ ...prev, key: val }\`).\n` +
      `- **Custom Hooks**: Extract reusable stateful logic into functions starting with \`use\`.\n` +
      `- **Component Breakdown**: Separate Container/Data components from Presentational UI components.\n\n` +
      `What specific React feature, hook, or debugging issue are you tackling today?`
    );
  }

  // Node & Express
  if (norm.includes('express') || norm.includes('node') || norm.includes('middleware') || norm.includes('rest')) {
    return (
      `### Node.js & Express REST API Architecture\n\n` +
      `In a clean Express application, we separate routing, controllers, and services:\n\n` +
      `\`\`\`javascript\n` +
      `// server.js\n` +
      `import express from 'express';\n` +
      `import cors from 'cors';\n\n` +
      `const app = express();\n` +
      `app.use(cors());\n` +
      `app.use(express.json());\n\n` +
      `// Custom Logging Middleware\n` +
      `app.use((req, res, next) => {\n` +
      `  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);\n` +
      `  next();\n` +
      `});\n\n` +
      `// Sample REST Route with Error Handling\n` +
      `app.get('/api/health', (req, res, next) => {\n` +
      `  try {\n` +
      `    res.status(200).json({ status: 'ok', uptime: process.uptime() });\n` +
      `  } catch (err) {\n` +
      `    next(err);\n` +
      `  }\n` +
      `});\n\n` +
      `// Global Error Handler Middleware (Must have 4 arguments)\n` +
      `app.use((err, req, res, next) => {\n` +
      `  console.error('Server Error:', err.stack);\n` +
      `  res.status(err.status || 500).json({\n` +
      `    success: false,\n` +
      `    message: err.message || 'Internal Server Error'\n` +
      `  });\n` +
      `});\n\n` +
      `app.listen(5000, () => console.log('Server running on port 5000'));\n` +
      `\`\`\`\n\n` +
      `Would you like to build authentication (JWT), database integration, or API validation next?`
    );
  }

  // MongoDB & Mongoose
  if (norm.includes('mongo') || norm.includes('mongoose') || norm.includes('schema') || norm.includes('nosql')) {
    return (
      `### MongoDB & Mongoose Schema & Aggregation\n\n` +
      `Mongoose provides schema validation, middleware hooks, and type casting on top of MongoDB.\n\n` +
      `\`\`\`javascript\n` +
      `import mongoose from 'mongoose';\n\n` +
      `const userSchema = new mongoose.Schema({\n` +
      `  name: { type: String, required: [true, 'Name is required'], trim: true },\n` +
      `  email: { type: String, required: true, unique: true, lowercase: true },\n` +
      `  role: { type: String, enum: ['user', 'admin'], default: 'user' },\n` +
      `  skills: [String],\n` +
      `  createdAt: { type: Date, default: Date.now }\n` +
      `});\n\n` +
      `// Compound index for fast queries\n` +
      `userSchema.index({ email: 1 });\n\n` +
      `export const User = mongoose.model('User', userSchema);\n` +
      `\`\`\`\n\n` +
      `**Performance Pro-tip:** Always use \`.lean()\` on read-only queries (e.g. \`User.find().lean()\`) to bypass Mongoose document hydration, boosting read speed by up to 5x!`
    );
  }

  // Java & OOP
  if (norm.includes('java') || norm.includes('oop') || norm.includes('inheritance') || norm.includes('polymorphism')) {
    return (
      `### Core Java & Object-Oriented Programming (OOP)\n\n` +
      `The four pillars of Object-Oriented Programming in Java are:\n\n` +
      `1. **Encapsulation**: Bundling state and behavior inside a class while hiding internal details using \`private\` variables and public getters/setters.\n` +
      `2. **Abstraction**: Hiding complex implementation details using abstract classes and interfaces.\n` +
      `3. **Inheritance**: Code reusability where a subclass inherits properties and methods from a superclass using \`extends\`.\n` +
      `4. **Polymorphism**:\n` +
      `   - *Compile-time (Method Overloading)*: Same method name with different parameters.\n` +
      `   - *Runtime (Method Overriding)*: Subclass provides a specific implementation of a method defined in its superclass using \`@Override\`.\n\n` +
      `\`\`\`java\n` +
      `// Polymorphism example\n` +
      `interface PaymentMethod {\n` +
      `    void pay(double amount);\n` +
      `}\n\n` +
      `class UPIPayment implements PaymentMethod {\n` +
      `    @Override\n` +
      `    public void pay(double amount) {\n` +
      `        System.out.println("Processing ₹" + amount + " via UPI.");\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Would you like to review Java Collections (\`HashMap\`, \`ArrayList\`, \`PriorityQueue\`) or Multithreading?`
    );
  }

  // DSA
  if (norm.includes('dsa') || norm.includes('algorithm') || norm.includes('tree') || norm.includes('array') || norm.includes('binary search')) {
    return (
      `### Data Structures & Algorithms: Binary Search\n\n` +
      `**Problem Pattern:** Searching in a sorted collection in $O(\\log N)$ time.\n\n` +
      `\`\`\`javascript\n` +
      `function binarySearch(arr, target) {\n` +
      `  let left = 0;\n` +
      `  let right = arr.length - 1;\n\n` +
      `  while (left <= right) {\n` +
      `    // Avoid integer overflow in other languages: left + Math.floor((right - left) / 2)\n` +
      `    const mid = Math.floor((left + right) / 2);\n\n` +
      `    if (arr[mid] === target) {\n` +
      `      return mid; // Found index\n` +
      `    } else if (arr[mid] < target) {\n` +
      `      left = mid + 1; // Search right half\n` +
      `    } else {\n` +
      `      right = mid - 1; // Search left half\n` +
      `    }\n` +
      `  }\n` +
      `  return -1; // Target not present\n` +
      `}\n\n` +
      `// Example:\n` +
      `console.log(binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)); // Output: 5\n` +
      `\`\`\`\n\n` +
      `**Complexity:**\n` +
      `- Time: $O(\\log N)$\n` +
      `- Space: $O(1)$ auxiliary memory\n\n` +
      `Shall we look into Sliding Window, Two Pointers, or Dynamic Programming next?`
    );
  }

  // Generic Coding Mentor reply
  return (
    `### Coding Mentor: Let's solve this together!\n\n` +
    `You asked: *"${original}"*\n\n` +
    `As your coding mentor, I can help you with:\n` +
    `- **Full-stack MERN**: React, Node.js, Express, MongoDB\n` +
    `- **Core Java & OOP**: Classes, interfaces, multithreading, collections\n` +
    `- **Data Structures & Algorithms**: Arrays, linked lists, trees, graphs, dynamic programming\n` +
    `- **Database & SQL**: Joins, indexing, normalization, transactions\n` +
    `- **Bug Fixing**: Paste your error trace or code snippet and I will diagnose it!\n\n` +
    `Could you share the specific code snippet, language, or logic question you'd like to work on?`
  );
}

/* -------------------------------------------------------------
   INTERVIEW COACH KNOWLEDGE ENGINE
------------------------------------------------------------- */
function handleInterviewMode(norm, original, history) {
  // If user says "ready", "start", "next question", or first time
  if (
    norm.includes('start') ||
    norm.includes('ready') ||
    norm.includes('next question') ||
    norm.includes('mock interview') ||
    norm.includes('practice')
  ) {
    return (
      `### 🎙️ Mock Interview Session Initialized\n\n` +
      `Welcome to your technical mock interview! I will ask you questions one at a time, listen to your answer, provide constructive feedback, and then proceed.\n\n` +
      `**Question 1 (MERN & JavaScript Fundamentals):**\n` +
      `> *"Can you explain the difference between Synchronous and Asynchronous JavaScript, and how the Event Loop handles asynchronous tasks like Promises versus \`setTimeout\`?"*\n\n` +
      `Take your time, articulate your answer clearly, and speak or type your response when ready!`
    );
  }

  // If user is answering question 1 (mentioning event loop, microtask, macrotask, promise)
  if (
    norm.includes('event loop') ||
    norm.includes('microtask') ||
    norm.includes('macrotask') ||
    norm.includes('call stack') ||
    norm.includes('callback') ||
    norm.includes('async')
  ) {
    return (
      `### 📋 Interviewer Evaluation & Feedback\n\n` +
      `**Score:** 8.5 / 10 — Excellent technical grasp!\n\n` +
      `**Strengths:**\n` +
      `- Good explanation of the single-threaded nature of JavaScript.\n` +
      `- You correctly distinguished between the call stack and task queues.\n\n` +
      `**Pro-tip for Real Interviews:**\n` +
      `- Specifically mention **Microtask Queue** (Promises, \`process.nextTick\`, \`queueMicrotask\`) vs **Macrotask Queue / Callback Queue** (\`setTimeout\`, \`setInterval\`, I/O). Remind the interviewer that the Event Loop drains the entire Microtask queue before picking the next Macrotask!\n\n` +
      `---\n\n` +
      `**Question 2 (React & Architecture):**\n` +
      `> *"How does React's Virtual DOM work, what is the reconciliation process, and why are \`key\` props crucial when rendering lists?"*\n\n` +
      `What would be your answer?`
    );
  }

  // React virtual dom question response
  if (norm.includes('virtual dom') || norm.includes('reconciliation') || norm.includes('diff') || norm.includes('key')) {
    return (
      `### 📋 Interviewer Evaluation & Feedback\n\n` +
      `**Score:** 9 / 10 — Solid architectural explanation!\n\n` +
      `**Highlights:**\n` +
      `- Emphasizing that React computes a lightweight in-memory representation (Virtual DOM) and batches DOM operations via the diffing algorithm (Reconciliation).\n` +
      `- Correctly clarifying that \`key\` gives React a stable identity to track items across renders, avoiding unnecessary DOM re-creations.\n\n` +
      `---\n\n` +
      `**Question 3 (Backend & System Design):**\n` +
      `> *"In an Express + MongoDB application, how would you protect user routes using JWT authentication, and how do you prevent SQL/NoSQL injection?"*\n\n` +
      `Go ahead with your answer!`
    );
  }

  // Behavioral / HR question
  if (norm.includes('behavioral') || norm.includes('tell me about a time') || norm.includes('conflict') || norm.includes('hr')) {
    return (
      `### 💼 Behavioral Mock Question (STAR Method)\n\n` +
      `Here is a classic behavioral interview question:\n\n` +
      `> *"Tell me about a challenging technical bug or tight deadline you faced in a project. How did you diagnose the issue, manage your priorities, and what was the outcome?"*\n\n` +
      `**Tip:** Structure your answer with **Situation**, **Task**, **Action**, and **Result** (STAR). What's your story?`
    );
  }

  // Generic interview response
  return (
    `### 🎯 Interview Coach Feedback\n\n` +
    `Thank you for sharing your thoughts on: *"${original}"*.\n\n` +
    `**Coaching Note:** In technical interviews, interviewers evaluate:\n` +
    `1. **Clarity**: High-level summary first, then dive into implementation details.\n` +
    `2. **Trade-offs**: Mention why you chose approach A over approach B.\n` +
    `3. **Edge cases**: Consider scale, null checks, and error boundaries.\n\n` +
    `Would you like to try a **MERN stack question**, a **Java/OOP question**, a **DSA problem**, or a **Behavioral (STAR) question** next?`
  );
}

/* -------------------------------------------------------------
   ENGLISH PRACTICE KNOWLEDGE ENGINE
------------------------------------------------------------- */
function handleEnglishMode(norm, original) {
  // Common conversational starts
  if (norm.includes('how are you') || norm.includes('how do you do')) {
    return (
      `I'm doing splendidly, thank you for asking! How is your day going so far?\n\n` +
      `**English Tip:** You can also ask in natural conversational English:\n` +
      `- *"How's your day been treating you?"*\n` +
      `- *"How have things been on your end?"*\n\n` +
      `What topics would you like to talk about today? We can discuss your hobbies, daily routines, career goals, or practice workplace discussions!`
    );
  }

  // Check for common grammatical mistakes
  let grammarFeedback = '';
  if (/\bi did went\b/i.test(original)) {
    grammarFeedback = `💡 *Correction Notice:* Instead of *"I did went"*, say *"I went"* or *"I did go"*. When using auxiliary "did", keep the main verb in base form.\n\n`;
  } else if (/\bi have seen it yesterday\b/i.test(original)) {
    grammarFeedback = `💡 *Correction Notice:* When specifying an exact past time like "yesterday", use Simple Past: *"I saw it yesterday"* instead of Present Perfect *"I have seen"*.\n\n`;
  } else if (/\bevery students\b/i.test(original)) {
    grammarFeedback = `💡 *Correction Notice:* "Every" is followed by a singular noun: *"Every student"*.\n\n`;
  }

  return (
    `${grammarFeedback}### 🗣️ English Conversation Partner\n\n` +
    `That is a great thought! Communicating clearly is all about confidence and practice.\n\n` +
    `**Enhanced phrasing suggestion:**\n` +
    `> In a professional setting, you could phrase this as: *"I'd like to delve deeper into this topic and enhance my overall communication proficiency."*\n\n` +
    `**Vocabulary of the day:**\n` +
    `- **Articulate** *(adjective/verb)*: Able to express ideas clearly and effectively.\n` +
    `  *Example:* "She gave an articulate presentation during the team meeting."\n\n` +
    `Tell me, what is one achievement you were proud of recently? Try using full sentences to describe it!`
  );
}

/* -------------------------------------------------------------
   PERSONAL ASSISTANT KNOWLEDGE ENGINE
------------------------------------------------------------- */
function handleAssistantMode(norm, original) {
  // Help or features query
  if (norm.includes('what can you do') || norm.includes('help') || norm.includes('features')) {
    return (
      `### What I Can Do For You\n\n` +
      `As Mr. Dinesh Kumar's personal AI assistant, I'm here to support you in four primary domains:\n\n` +
      `1. 🌟 **Personal Assistant Mode**: Answer general questions, brainstorm ideas, draft emails, organize your schedule, and summarize information.\n` +
      `2. 💻 **Coding Mentor Mode**: Deep dive into Java, JavaScript, React, Node.js, Express, MongoDB, SQL, OOP, and DSA with step-by-step code.\n` +
      `3. 🎙️ **Interview Coach Mode**: Practice technical, system design, and behavioral questions with structured feedback.\n` +
      `4. 🗣️ **English Practice Mode**: Conversational practice, grammar tips, vocabulary enrichment, and pronunciation guidance.\n\n` +
      `You can switch modes anytime using the pill buttons above the chat input!`
    );
  }

  // Time / Date questions
  if (norm.includes('what time') || norm.includes('what date') || norm.includes('today')) {
    const now = new Date();
    return (
      `Today is **${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**, and the current local time is **${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}**.\n\n` +
      `How can I help you plan your schedule today?`
    );
  }

  // Thank you
  if (norm.includes('thank') || norm.includes('thanks')) {
    return (
      `You're very welcome! It's always my pleasure to assist you. If you have any more questions, feel free to ask anytime!`
    );
  }

  // General helpful response
  return (
    `### Helpful Guidance from Aara\n\n` +
    `I've noted your question: *"${original}"*.\n\n` +
    `Here is a structured overview:\n` +
    `- **Direct Insight**: Focus on breaking down the problem into small, manageable milestones.\n` +
    `- **Recommended Next Step**: Review your priorities and let me know if you would like me to draft a plan or explain any concept in detail.\n\n` +
    `Feel free to speak to me using the microphone button or type any question!`
  );
}

export default {
  generateLocalReply
};
