# LeadDesk Mini

LeadDesk Mini is a lightweight, high-performance lead-capture application built for digital design and engineering agencies. It features a responsive public landing page with an interactive project inquiry form and a secure, information-dense administration panel for managing leads, tracking pipeline statuses, and searching/filtering inquiries.

---

## Features

### Public Landing Page & Lead Capture Form
* **Agency Presentation**: Modern, minimal layout outlining studio capabilities, values, and collaboration processes.
* **Interactive Inquiry Form**: Standard capture for **Name**, **Email**, **Budget Range**, and **Message**.
* **Strict Validation**: Field-level validation on the client using React Hook Form bound with Zod, and parallel independent validation on the server.
* **Responsive Layout**: Designed for mobile (360px), tablet (768px), and desktop (1440px) screen viewports.

### Admin Dashboard (`/admin`)
* **Lead List**: Displays real-time database inquiries sorted newest-first in a semantic table on desktop and responsive cards on mobile.
* **Global Statistics**: Real-time summary counts showing Total Leads, New, Contacted, and Closed leads.
* **Search and Filter**: Supports text search by name/email (case-insensitive) and filtering by lead status.
* **Status Management**: Dropdown toggling for status changes (`NEW`, `CONTACTED`, `CLOSED`) that persist to the database.
* **Long Message Inspector**: Accessible inline clamp-and-expand toggles to inspect messages.
* **Mailto Email Links**: Direct links to email clients from lead records.

---

## Tech Stack
* **Framework**: Next.js (App Router, React 19)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Database**: MongoDB Atlas + Mongoose
* **Form Handling**: React Hook Form
* **Validation**: Zod & @hookform/resolvers

---

## Architecture
```
Browser (React Hook Form)
   ↓ (relative API calls / Client Zod Schema)
Next.js API Route Handlers (POST / GET / PATCH)
   ↓ (strict Server Zod Schema & input sanitization)
Mongoose Schema ORM Layer
   ↓ (cached DB connection manager)
MongoDB Atlas (Cloud database persistence)
```

---

## Data Model

The application defines a Mongoose model for `Lead` with the following attributes:

| Field | Type | Validation / Constraints | Default |
|---|---|---|---|
| `name` | `String` | Required, trimmed, 2 - 80 chars | - |
| `email` | `String` | Required, trimmed, lowercase, valid email pattern | - |
| `budget` | `String` | Required, enum (`UNDER_1K`, `BETWEEN_1K_5K`, `BETWEEN_5K_10K`, `ABOVE_10K`, `NOT_SURE`) | - |
| `message` | `String` | Required, trimmed, 10 - 2000 chars | - |
| `status` | `String` | Required, enum (`NEW`, `CONTACTED`, `CLOSED`) | `NEW` |
| `createdAt` | `Date` | Mongoose auto-generated timestamp | - |
| `updatedAt` | `Date` | Mongoose auto-generated timestamp | - |

---

## API Endpoints

### 1. Create a Lead
* **Route**: `POST /api/leads`
* **Payload**:
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "budget": "BETWEEN_5K_10K",
    "message": "We need assistance building a custom payment pipeline."
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a635c2e1474d0e8d99b68dc",
      "name": "Alex Morgan",
      "email": "alex@example.com",
      "budget": "BETWEEN_5K_10K",
      "message": "We need assistance building a custom payment pipeline.",
      "status": "NEW",
      "createdAt": "2026-07-24T12:35:58.161Z",
      "updatedAt": "2026-07-24T12:35:58.161Z"
    }
  }
  ```

### 2. Retrieve Leads
* **Route**: `GET /api/leads`
* **Query Parameters**:
  * `search` (Optional): Text search matching name or email.
  * `status` (Optional): Filter by status (`NEW`, `CONTACTED`, `CLOSED`).
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

### 3. Update Lead Status
* **Route**: `PATCH /api/leads/[id]/status`
* **Payload**:
  ```json
  {
    "status": "CONTACTED"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a635c2e1474d0e8d99b68dc",
      "status": "CONTACTED",
      ...
    }
  }
  ```

---

## Validation
* **Client-Side**: Uses `react-hook-form` paired with `zodResolver(leadSchema)`. Shows instant field-level warnings to improve input correction UX.
* **Server-Side**: The API endpoints validate incoming requests using Zod schemas (`.strict()`) to prevent mass assignment, malformed payloads, or invalid status insertions.

---

## Local Development

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the lead dashboard.

---

## Deployment

### MongoDB Atlas
1. Create a MongoDB Atlas cluster and database.
2. Under Network Access, whitelist IP ranges required for your environment (or `0.0.0.0/0` to allow Vercel Serverless Functions to connect).
3. Create a Database User with read/write access to the database (avoid administrative credentials).
4. Copy the connection string.

### Vercel
1. Import your repository into Vercel.
2. Set the Framework Preset to `Next.js`.
3. Add the `MONGODB_URI` environment variable under Project Settings.
4. Deploy the application.

---

## Task Context
This project was built as part of the qualification assignment for the Digital Heroes Full Stack Developer training program.

---

## AI Usage
AI-assisted development tools were used during planning, implementation review, and debugging. The generated suggestions were reviewed and adapted to the project's architecture, validation requirements, API design, and UI behavior before being included.
