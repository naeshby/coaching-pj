# Coaching PJ

A full-stack Customer Relationship Management (CRM) platform built specifically for coaching businesses. It provides a centralised system for managing client relationships, tracking sales leads through a visual pipeline, scheduling appointments, and analysing business performance through real-time analytics.

The platform is built with a Node.js/Express backend, a PostgreSQL database hosted on Supabase, and a lightweight single-page frontend delivered as a static HTML file. It is deployed on Vercel with automatic CI/CD through GitHub Actions.

## Key Features

- Secure authentication using Supabase JWT tokens
- Customer management with status tracking and revenue history
- Lead pipeline with 6 stages: New, Discovery, Qualified, Proposal, Won, Lost
- Appointment scheduling with type classification and duration tracking
- Real-time analytics dashboard with KPI cards and pipeline charts
- Revenue tracking grouped by month
- Google Analytics 4 integration with custom event tracking
- Delete functionality with confirmation dialogs for all record types
- Responsive design with mobile sidebar collapse

## Technology Stack

| Layer          | Technology            | Purpose                                      |
| -------------- | --------------------- | -------------------------------------------- |
| Runtime        | Node.js 25.9.0        | JavaScript server environment                |
| Framework      | Express.js            | HTTP server and API routing                  |
| Database       | Supabase (PostgreSQL) | Relational data storage                      |
| Authentication | Supabase Auth (JWT)   | Secure user login and token verification     |
| Frontend       | HTML/CSS/JS           | Single-page application in public/index.html |
| Email          | Nodemailer (SMTP)     | Appointment confirmation and reminder emails |
| Analytics      | Google Analytics 4    | User behaviour and event tracking            |
| Deployment     | Vercel                | Serverless hosting with auto-deploy          |
| CI/CD          | GitHub Actions        | Automated testing and deployment pipeline    |
| Testing        | Jest + Supertest      | Unit and integration testing                 |
| Security       | Helmet.js             | HTTP security headers and CSP                |
| Logging        | Winston               | Structured server-side logging               |

## System Architecture

The application follows a traditional MVC (Model-View-Controller) architecture adapted for a RESTful API backend with a decoupled frontend.

### Request Flow

Every user interaction follows this path:

1. User opens coaching-pj.vercel.app in their browser
2. Browser loads public/index.html — the entire frontend UI
3. User enters credentials; Supabase Auth verifies and returns a JWT token
4. Frontend stores the token in memory and includes it in every API request
5. Express server receives the request and runs the authenticate() middleware
6. Middleware verifies the JWT with Supabase Auth
7. If valid, the request passes to the appropriate controller
8. Controller queries the Supabase PostgreSQL database
9. Database returns data; controller formats and sends the JSON response
10. Frontend renders the data as HTML in the browser

### Frontend vs Backend

| Component       | Location               | Runs In           | Visible to Users    |
| --------------- | ---------------------- | ----------------- | ------------------- |
| index.html      | public/index.html      | User's browser    | Yes — the entire UI |
| server.js       | src/server.js          | Vercel serverless | No — server only    |
| Controllers     | src/controllers/       | Vercel serverless | No — server only    |
| Routes          | src/routes/            | Vercel serverless | No — server only    |
| Middleware      | src/middleware/        | Vercel serverless | No — server only    |
| Supabase config | src/config/supabase.js | Vercel serverless | No — server only    |

## Live Application

**URL:** https://coaching-pj.vercel.app

**GitHub Repository:** https://github.com/Anesu-Chinyangare/coaching-pj
