# Imaan Relief & Development Foundation — REST API Documentation

Base URL: `/api`

All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

Consistent Response Schema:
- **Success:** `{ "success": true, "data": ... }`
- **Error:** `{ "success": false, "message": "Reason for error" }`

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/login`
Authenticates an administrator and returns a JWT session token.
- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@imanrelief.org",
  "password": "Password123!"
}
```
- **Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin_super_01",
    "name": "Super Administrator",
    "email": "admin@imanrelief.org",
    "role": "super_admin"
  }
}
```

### GET `/api/auth/me`
Retrieves currently authenticated user profile.
- **Access:** Protected (Bearer token)
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "admin_super_01",
    "name": "Super Administrator",
    "email": "admin@imanrelief.org",
    "role": "super_admin"
  }
}
```

---

## 2. Programs (`/api/programs`)

### GET `/api/programs`
List all published programs with optional filtering.
- **Query Parameters:**
  - `category` (string, optional)
  - `search` (string, optional)
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
- **Access:** Public

### GET `/api/programs/:identifier`
Fetch program details by slug or ID. Includes related projects.
- **Access:** Public

### POST `/api/programs`
Create a new program.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)
- **Request Body:** `title`, `shortDescription`, `description`, `image`, `category`, `objectives`, `locations`

### PUT `/api/programs/:id`
Update an existing program.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

### DELETE `/api/programs/:id`
Delete a program.
- **Access:** Protected (`super_admin`, `editor`)

---

## 3. Projects (`/api/projects`)

### GET `/api/projects`
List projects with status and location filters.
- **Query Parameters:** `program`, `status`, `location`, `search`, `page`, `limit`
- **Access:** Public

### GET `/api/projects/:identifier`
Get project detail by slug or ID.
- **Access:** Public

### POST `/api/projects`
Create a new project.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

### PUT `/api/projects/:id`
Update an existing project.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

### DELETE `/api/projects/:id`
Delete a project.
- **Access:** Protected (`super_admin`, `editor`)

---

## 4. Stories (`/api/stories`)

### GET `/api/stories`
Get all published documentary stories.
- **Access:** Public

### GET `/api/stories/:identifier`
Get story by slug or ID.
- **Access:** Public

### POST `/api/stories`
Create a new field story.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

---

## 5. News & Bulletins (`/api/news`)

### GET `/api/news`
List news articles and press releases.
- **Access:** Public

### GET `/api/news/:identifier`
Get news article by slug or ID.
- **Access:** Public

### POST `/api/news`
Publish a news bulletin.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

---

## 6. Events (`/api/events`)

### GET `/api/events`
List scheduled events.
- **Access:** Public

### GET `/api/events/:identifier`
Get event details.
- **Access:** Public

### POST `/api/events`
Schedule an event.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

---

## 7. Gallery (`/api/gallery`)

### GET `/api/gallery`
List photography items.
- **Query Parameters:** `category`, `search`
- **Access:** Public

### POST `/api/gallery`
Add a photo to the archive.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

---

## 8. Volunteers (`/api/volunteers`)

### POST `/api/volunteers`
Submit a new volunteer application.
- **Access:** Public
- **Request Body:**
```json
{
  "fullName": "Amina Hassan",
  "email": "amina@example.org",
  "phone": "+1 555-0199",
  "location": "London, UK",
  "skills": ["Nursing", "Translating"],
  "availability": "Part-time (5-10 hrs/week)",
  "interests": ["Medical & Health Outreach"],
  "message": "I would love to support child nutrition logistics.",
  "cvUrl": "/uploads/cv-12345.pdf"
}
```

### GET `/api/volunteers`
List volunteer applications with status filtering.
- **Access:** Protected (`super_admin`, `editor`)

### PUT `/api/volunteers/:id`
Update volunteer application status (`Approved`, `Reviewing`, `Rejected`, `Contacted`) and admin notes.
- **Access:** Protected (`super_admin`, `editor`)

---

## 9. Donations (`/api/donations`)

### POST `/api/donations`
Register a donation contribution.
- **Access:** Public
- **Request Body:**
```json
{
  "donorName": "Zahra Al-Farooq",
  "email": "zahra@example.org",
  "phone": "+1 555-0182",
  "amount": 75,
  "currency": "USD",
  "frequency": "Monthly",
  "purpose": "Clean Water & Solar Boreholes Fund",
  "coverFees": true,
  "dedication": {
    "honoreeName": "Dr. Omar"
  }
}
```

### GET `/api/donations`
List all donations with aggregates (total raised, total count).
- **Access:** Protected (`super_admin`, `editor`)

---

## 10. Contact Inquiries (`/api/contact`)

### POST `/api/contact`
Submit an inquiry to the secretariat.
- **Access:** Public

### GET `/api/contact`
List messages.
- **Access:** Protected (`super_admin`, `editor`)

### PUT `/api/contact/:id`
Update message status (`Read`, `Replied`, `Archived`) and add internal reply notes.
- **Access:** Protected (`super_admin`, `editor`)

---

## 11. Website Settings (`/api/settings`)

### GET `/api/settings`
Get current website configuration and impact statistics.
- **Access:** Public

### PUT `/api/settings`
Update organizational settings and hero parameters.
- **Access:** Protected (`super_admin`, `editor`)

### GET `/api/settings/dashboard/stats`
Retrieve aggregated system telemetry for the admin dashboard.
- **Access:** Protected (`super_admin`, `editor`, `content_manager`)

---

## 12. File Uploads (`/api/upload`)

### POST `/api/upload`
Upload an image or document (PDF/DOC) via `multipart/form-data` with field name `file`.
- **Access:** Public (for CVs) & Authenticated (for CMS images)
- **Response (200):**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/... or /uploads/filename.jpg",
  "filename": "water-well-123.jpg",
  "isCloudinary": true
}
```
