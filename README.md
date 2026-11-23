# 🔥 AI Resume Roaster

> **Your resume called. It wants to know why you listed Microsoft Word as a skill.**

AI Resume Roaster is a full-stack AI-powered resume analysis platform that gives users honest, direct, and actionable feedback on their resumes.

Users can upload a PDF resume, authenticate with Google, get an AI-generated roast and score, and access their previous analyses through a personal history page.

<p align="center">
  <a href="https://ai-resume-roaster-87oz.vercel.app">
    <strong>🚀 Try the Live Demo</strong>
  </a>
</p>

---

## 🌐 Live Demo

🔗 **https://ai-resume-roaster-87oz.vercel.app/**

---

## ✨ Features

### 📄 Resume Upload
Upload your resume as a PDF and let the application extract and analyze its content.

### 🤖 AI-Powered Resume Roast
The application sends the extracted resume content to an LLM through the Groq API and generates direct, constructive feedback.

### 📊 Structured Resume Feedback
The AI response is structured and validated before being displayed to the user.

The analysis includes areas such as:

- Overall resume score (calculated server-side from weighted category scores)
- Scores for 7 categories: content, impact, clarity, ATS, structure, skills, professionalism
- Prioritized top issues with a roast, explanation and fix for each
- Rewritten examples of the weakest bullet points
- Quick wins and a final verdict

### 🔐 Google Authentication
Users can securely sign in using Google OAuth through NextAuth.js.

### 🗃️ Roast History
Authenticated users can save and view their previous resume analyses.

### 🧠 AI Output Validation
AI-generated responses are validated using Zod to ensure the application receives the expected structure instead of blindly trusting model output.

### 🚀 Production Deployment
The application is deployed and publicly accessible through Vercel.

### 🐘 PostgreSQL Database
User accounts, authentication sessions, and roast history are persisted using PostgreSQL and Prisma ORM.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | Full-stack React framework |
| **React** | Frontend UI |
| **TypeScript** | Type-safe development |
| **NextAuth.js** | Google OAuth authentication |
| **PostgreSQL** | Persistent database |
| **Prisma** | Database ORM |
| **Groq API** | AI-powered resume analysis |
| **Zod** | AI response validation |
| **pdf-parse** | PDF text extraction |
| **Vercel** | Production deployment |
| **GitHub** | Version control |

---

# 🏗️ How It Works

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Upload PDF Resume │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PDF Parsing      │
                    │    pdf-parse        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Resume Text +      │
                    │  Structured Prompt  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Groq LLM       │
                    │   AI Analysis       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Zod Validation   │
                    │  Validate AI JSON   │
                    └──────────┬──────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
            ┌─────────────────┐   ┌─────────────────┐
            │ Display Result  │   │ Save to Postgres│
            │   to User       │   │    via Prisma   │
            └─────────────────┘   └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │  Roast History  │
                                  └─────────────────┘
```

---

# 📁 Project Structure

```text
ai-resume-roaster/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   NextAuth handler
│   │   └── roast/                POST: analyze a resume
│   │       └── [id]/             DELETE: remove a saved roast
│   ├── history/                  Saved roasts (server-rendered)
│   ├── roast/                    Upload page
│   ├── roast/[id]/               A single saved roast
│   ├── example/                  Sample roast
│   ├── login/
│   └── page.tsx                  Landing page
├── components/                   UI (shared class strings live in ui.ts)
├── lib/
│   ├── api.ts                    errorResponse helper
│   ├── auth.ts                   NextAuth options
│   ├── constants.ts              Shared limits and messages
│   ├── exampleRoast.ts           Data for /example
│   ├── file.ts                   PDF / size checks (client + server)
│   ├── llm.ts                    Groq client
│   ├── pdf.ts                    PDF text extraction
│   ├── prisma.ts
│   ├── roast.ts                  Prompt + generation + retry
│   ├── session.ts                getUserId()
│   └── validation.ts             Zod schemas + scoring
├── prisma/schema.prisma
├── types/
└── package.json
```

> Prisma Client is generated during installation/build and is not committed as generated source code.

---

# 🔄 Application Flow

### 1. Authentication

The user signs in using Google OAuth.

```text
User
 ↓
Google OAuth
 ↓
NextAuth
 ↓
PostgreSQL
 ↓
Authenticated Session
```

### 2. Resume Analysis

```text
PDF Upload
 ↓
Server-side PDF Parsing
 ↓
Extract Resume Text
 ↓
Send Structured Prompt
 ↓
Groq AI
 ↓
Receive JSON
 ↓
Validate with Zod
 ↓
Calculate Score
 ↓
Display Roast
```

### 3. History

```text
Authenticated User
        ↓
      Roast
        ↓
     Prisma
        ↓
   PostgreSQL
        ↓
   Roast History
```

---

# 🔑 Environment Variables

Create a `.env` file in the root of the project for local development.

```env
DATABASE_URL="your_postgresql_connection_string"

GROQ_API_KEY="your_groq_api_key"

GOOGLE_CLIENT_ID="your_google_client_id"

GOOGLE_CLIENT_SECRET="your_google_client_secret"

NEXTAUTH_SECRET="your_random_secret"

NEXTAUTH_URL="http://localhost:3000"
```

### Environment variables used

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection |
| `GROQ_API_KEY` | Groq API authentication |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_SECRET` | NextAuth session encryption |
| `NEXTAUTH_URL` | Application URL used by NextAuth |

> ⚠️ **Never commit `.env` files or API keys to GitHub.**

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Bhagyashri-Joshi/AI-resume-roaster.git
```

## 2. Enter the project directory

```bash
cd AI-resume-roaster
```

## 3. Install dependencies

```bash
npm install
```

Prisma Client is automatically generated through the project's `postinstall` script.

You can also manually generate it:

```bash
npx prisma generate
```

## 4. Configure environment variables

Create:

```text
.env
```

and add the required variables listed above.

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🗄️ Database Setup

This project uses **PostgreSQL + Prisma**.

After configuring `DATABASE_URL`, generate Prisma Client:

```bash
npx prisma generate
```

For a development database schema, use Prisma migrations according to your database setup.

You can inspect your database using:

```bash
npx prisma studio
```

---

# 🔐 Google OAuth Setup

Create an OAuth 2.0 Client ID in Google Cloud Console.

Choose:

```text
Application Type: Web application
```

### Authorized JavaScript origins

For local development:

```text
http://localhost:3000
```

For production:

```text
https://ai-resume-roaster-87oz.vercel.app
```

### Authorized redirect URIs

For local development:

```text
http://localhost:3000/api/auth/callback/google
```

For production:

```text
https://ai-resume-roaster-87oz.vercel.app/api/auth/callback/google
```

Both can be configured so authentication works locally and in production.

---

# 🤖 Groq AI Integration

The application uses the Groq API to analyze extracted resume text.

The API key is stored server-side using:

```env
GROQ_API_KEY="your_groq_api_key"
```

The application sends a structured prompt containing the resume content and expects a structured JSON response.

The response is then validated before being used by the application.

---

# 📄 PDF Processing

Resume PDFs are processed server-side.

The application:

1. Receives the uploaded PDF.
2. Extracts text using `pdf-parse`.
3. Validates the extracted content.
4. Sends the resume text to the AI model.
5. Processes the structured AI response.
6. Returns the result to the frontend.

The roast API uses the **Node.js runtime** because PDF parsing requires Node-compatible functionality.

---

# 🧠 AI Response Validation

LLM responses cannot always be assumed to follow the requested structure.

To make the application more reliable, the AI response is validated using **Zod** before being returned to the client.

```text
LLM Response
     ↓
    Zod
     ↓
Valid?
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ▼        ▼
Return   Error
Result
```

This prevents malformed AI responses from silently breaking the application.

---

# 📊 Resume Scoring

The application generates an overall resume score based on the structured AI analysis.

The goal is not simply to criticize the resume, but to provide feedback that helps users improve:

- Content
- Clarity
- Impact
- Skills
- Experience descriptions
- Resume presentation
- Recruiter/ATS readability

---

# 🔌 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | Various | Handles authentication |
| `/api/roast` | `POST` | Uploads and analyzes a resume |
| `/api/roast/[id]` | `DELETE` | Deletes one of the signed-in user's roasts |

The history list (`/history`), a single saved roast (`/roast/[id]`) and the example roast (`/example`) are server-rendered pages that read their data directly, so they need no API routes.

---

# ☁️ Deployment

The application is deployed using **Vercel**.

### Production URL

```text
https://ai-resume-roaster-87oz.vercel.app/
```

### Deployment process

```text
GitHub
   ↓
Vercel
   ↓
Install Dependencies
   ↓
Prisma Generate
   ↓
Next.js Production Build
   ↓
Deployment
   ↓
Live Application
```

### Required Vercel environment variables

```text
DATABASE_URL
GROQ_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
```

For production:

```env
NEXTAUTH_URL="https://ai-resume-roaster-87oz.vercel.app"
```

---

# 🧪 Production Build

To verify the project before deployment:

```bash
npm run build
```

The project should successfully complete:

```text
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization
```

To run the production build locally:

```bash
npm start
```

---

# 🔒 Security

The project follows several basic security practices:

- 🔐 API keys are stored in environment variables.
- 🚫 `.env` files are excluded from Git.
- 🔑 Google OAuth secrets remain server-side.
- 🤖 Groq API credentials are never exposed to the client.
- 🗃️ Database access is handled server-side through Prisma.
- 🧠 AI responses are validated using Zod.
- 📄 Resume processing is performed through server-side API routes.

---

# ⚠️ Current Limitations

As an MVP, the project still has areas that can be improved for production-scale usage.

### API Usage

The application currently depends on the rate and token limits of the configured Groq API account.

### Rate Limiting

A more advanced production implementation could add per-user API rate limiting and usage tracking.

### Large Resumes

Very large or image-only/scanned PDFs may require additional handling such as OCR or document size limits.

### AI Availability

The application currently relies on the configured AI provider, so provider outages or rate limits can affect analysis availability.

---

# 🚧 Future Improvements

Planned or possible improvements include:

- [ ] Per-user daily/monthly roast limits
- [ ] Subscription and paid plans
- [ ] Resume-to-job-description matching
- [ ] Resume version comparison
- [ ] Downloadable PDF roast reports
- [ ] Resume improvement suggestions
- [ ] More AI model/provider options
- [ ] OCR support for scanned resumes
- [ ] Advanced API rate limiting
- [ ] Usage analytics
- [ ] Background processing for large resumes
- [ ] Better monitoring and observability
- [ ] Email notifications for completed analyses

---

# 🎯 What This Project Demonstrates

This project demonstrates an end-to-end AI full-stack application involving:

### Frontend

- React
- Next.js App Router
- TypeScript
- Responsive UI
- Client/server interaction

### Backend

- Next.js API routes
- Server-side PDF processing
- Authentication
- Database operations

### AI Engineering

- LLM API integration
- Prompt engineering
- Structured JSON output
- Zod schema validation
- AI-generated scoring and recommendations

### Database

- PostgreSQL
- Prisma ORM
- User relationships
- Authentication persistence
- Roast history

### Deployment

- GitHub
- Vercel
- Production environment variables
- Google OAuth production configuration

---

# 🏆 Project Highlights

> **End-to-end AI application**

Unlike a simple AI chatbot, this project combines:

```text
Authentication
      +
File Upload
      +
PDF Processing
      +
LLM Integration
      +
Structured AI Output
      +
Validation
      +
PostgreSQL
      +
Persistent History
      +
Production Deployment
```

into a single full-stack application.

---

# 👩‍💻 Author

**Bhagyashri Joshi**

Built as an AI/full-stack development project to demonstrate practical experience with modern web development, LLM integration, authentication, databases, and cloud deployment.

---

# 📜 License

This project is currently intended as a portfolio/learning project.

If you plan to distribute it as an open-source project, add an appropriate license such as MIT.

---

<p align="center">
  <strong>🔥 Upload your resume. Get roasted. Get better.</strong>
</p>

<p align="center">
  <a href="https://ai-resume-roaster-87oz.vercel.app/">
    🚀 Try AI Resume Roaster
  </a>
</p>
