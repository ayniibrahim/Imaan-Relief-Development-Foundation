# Imaan Relief & Development Foundation
### Full-Stack NGO Management Platform & Public Portal

A complete, production-ready full-stack humanitarian management platform and public website built for **Imaan Relief & Development Foundation**. The platform bridges rapid emergency relief delivery with long-term sustainable development programs, incorporating verified field telemetry, 100% Zakat direct stewardship tracking, and administrative content management.

---

## Architecture Overview

```
USER BROWSER / CLIENT
       │
       ▼
REACT 19 SPA (Vite, React Router, Tailwind CSS, Lucide Icons)
       │
       ▼  (Axios REST Client with JWT Bearer Interceptors)
EXPRESS.JS SERVER (Node.js REST API with CORS, Helmet, Rate Limits)
       │
   ┌───┴────────────────────────┬────────────────────────┐
   ▼                            ▼                        ▼
JWT AUTH & RBAC            MONGOOSE / MONGODB      CLOUDINARY CDN
(bcrypt password hashing)  (MongoDB Atlas Cluster  (Production Image
(SuperAdmin/Editor/CM)      or Embedded Fallback)   Optimization)
```

---

## Key Features

### 1. Public Facing Humanitarian Website
- **Hero & Documentary Showcase:** Responsive editorial design featuring verified borehole and field mission visual assets.
- **Urgent Emergency Appeal Card:** Interactive giving tier selector ($25, $50, $100, $250) with live financial progress bar and dynamic impact microcopy.
- **Programs System (`/programs`, `/programs/:slug`):** Filter by category (Clean Water & WASH, Emergency Relief, Food & Livelihood, Education & Child Protection) with strategic objectives and regional locations.
- **Field Projects System (`/projects`, `/projects/:slug`):** Transparent tracking of upcoming, active, and completed infrastructure projects with target beneficiaries and budgets.
- **Documentary Field Stories (`/stories`, `/stories/:slug`):** Firsthand long-form narratives with reading times and field locations.
- **News & Bulletins CMS (`/news`, `/news/:slug`):** Official press releases, emergency updates, and audit statements.
- **Events Calendar (`/events`, `/events/:slug`):** Upcoming symposiums, webinars, and banquets with RSVP pass reservations.
- **Photojournalism Archives (`/gallery`):** High-resolution photography gallery with category filters and interactive modal lightbox.
- **Volunteer Application System (`/get-involved`):** Full application with skills, availability, motivation message, and CV document upload.
- **Interactive Donation Engine (`/donate`):** One-time and monthly sustainer pledges, verified fund designations, optional 2.5% fee coverage, dedications, and official instant charitable receipts.
- **Secretariat Contact (`/contact`):** Live inquiry submission stored directly in MongoDB, with headquarters and 24/7 disaster hotline contacts.
- **Audited Direct Impact (`/impact`):** Independent audit disclosures, Form 990 access, and 100% Zakat Direct Covenant.

### 2. Admin Operations & Governance Portal (`/admin/*`)
- **JWT Authentication & bcrypt Security:** Secure login with automatic token verification, session expiration handling, and demo account pre-fill.
- **Role-Based Access Control (RBAC):**
  - **Super Administrator:** Complete system access, staff account provisioning, website settings, and deletion privileges.
  - **Editor:** Content management, volunteer screening, message handling, and donation records.
  - **Content Manager:** Programs, projects, news, stories, events, and photo gallery management.
- **Executive Dashboard (`/admin/dashboard`):** Real-time metrics for programs, active projects, stories, news, donations, funds raised, and live audit activity logs.
- **Resource Management (CRUD):**
  - Program CMS (Create, Edit, Delete, Objective lists, Publish)
  - Project CMS (Milestones, Budgets, Target Beneficiaries, Status)
  - News & Stories CMS (Rich content editor, author, tags)
  - Events CMS (Date, time, location, hybrid livestream link, status)
  - Gallery CMS (Direct file upload via Cloudinary or local storage)
  - Team Management (Board of Trustees, Executive Leadership)
  - Volunteer Coordination (Search, status filtering, review notes, approve/reject)
  - Financial Ledger & Donations (Search, status updates, receipt inspection)
  - Secretariat Inbox (Inquiries, internal reply notes, archiving)
  - Staff Account Governance (Provisioning, role assignments, deactivation)
  - Website Configuration (Mission, vision, emergency hotline, impact statistics, homepage hero content)

---

## Technology Stack

- **Frontend:** React 19, JavaScript/JSX, React Router v7, Axios, Tailwind CSS v4, Lucide React Icons
- **Backend:** Node.js, Express.js, REST API Architecture, Multer (file uploads)
- **Database:** MongoDB & Mongoose (with embedded persistent storage fallback for immediate local evaluation)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Media Storage:** Cloudinary API integration with automatic fallback to static local storage
- **Runtime:** `tsx` / Vite

---

## Folder Structure

```
├── backend/
│   ├── config/
│   │   ├── db.ts               # MongoDB Mongoose connection
│   │   └── cloudinary.ts       # Cloudinary API configuration
│   ├── controllers/            # Controller business logic
│   ├── data/                   # Embedded persistent data store
│   ├── middleware/             # Auth, role check, upload, error handler
│   ├── models/                 # Mongoose schemas (13 core models)
│   ├── routes/                 # Express REST API routes (/api/*)
│   ├── scripts/
│   │   ├── seed.ts             # Database seeder script
│   │   └── createAdmin.ts      # Super Admin creation script
│   ├── services/               # Cloudinary, ActivityLog & DB storage
│   └── utils/                  # Seed dataset & JWT helpers
├── src/
│   ├── admin/                  # Admin portal layout, route guards & pages
│   ├── components/             # Reusable UI, logo, navigation & state feedback
│   ├── context/                # AuthContext & SettingsContext
│   ├── pages/                  # Public facing website pages
│   ├── services/               # Centralized Axios API service
│   ├── App.tsx                 # Router definition & route mapping
│   ├── index.css               # Design system typography & styling
│   └── main.tsx                # React root entry point
├── server.ts                   # Full-stack server entry point (Express + Vite)
├── .env.example                # Sample environment variables
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# MongoDB Connection (Optional: connects to MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imaan_relief?retryWrites=true&w=majority

# Cloudinary Credentials (Optional: enables direct CDN upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Running the Application
```bash
npm run dev
```
The server will start on port `3000`. Open your browser to `http://localhost:3000`.

### 5. Seeding Database & Creating Admin
The application seeds initial foundation records automatically on boot. To re-seed or create custom admin accounts:
```bash
# Seed initial demo programs, projects, and settings
npm run seed

# Interactively provision a new Super Admin
npm run create-admin
```

Default credentials:
- **Email:** `admin@imanrelief.org`
- **Password:** `Password123!`

---

## Production Deployment

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges.
3. In Network Access, allow IP access (`0.0.0.0/0`).
4. Copy the connection string and add to production environment variables as `MONGODB_URI`.

### 2. Cloudinary Setup
1. Create an account on [Cloudinary](https://cloudinary.com/).
2. Retrieve your `Cloud Name`, `API Key`, and `API Secret`.
3. Add these credentials to production environment variables.

### 3. Deploying Full-Stack Application
- **Render / Railway / Cloud Run:**
  - Build command: `npm run build`
  - Start command: `node server.ts` or `npm start`
  - Set `NODE_ENV=production`

### 4. Custom Domain Setup (`imanrelief.org`)
1. In your DNS provider (e.g. Cloudflare, Namecheap, Route 53):
   - Add an `A` record pointing `@` to your server IP.
   - Add a `CNAME` record pointing `www` to your host alias.
2. Ensure SSL/TLS encryption is enabled (Full Strict recommended).
