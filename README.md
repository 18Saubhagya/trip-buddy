# Travel Buddy

Travel Buddy is a full-stack, AI-powered trip planning application that helps users create, manage, and improve personalized travel itineraries.  
The project focuses on clean architecture, real-world backend patterns, and scalable AI integration rather than being a simple demo.

---

## ✈️ What is Travel Buddy?

Travel Buddy allows users to plan trips by selecting destinations, dates, budgets, and interests.  
An AI system then generates a detailed, day-wise itinerary. Users can rate the generated plans, regenerate them, and gradually improve future results through feedback-driven intelligence.

The project is built as an MVP but follows production-oriented design principles such as background workers, queues, retries, and extensible schemas.

---

## ✨ Features

### Landing Page
- Clean landing page introducing the product and its value.
- Entry point for authentication and onboarding.

### Authentication
- Signup, login, and logout using JWT-based authentication.
- Secure API routes with user-level authorization.

### Dashboard
- Overview of travel insights.
- Upcoming and past trips.
- Quick access to create new trips.
- Trip calendar view.
- Paginated and filterable trips table.

### New Trip Creation
- Select country, state, and multiple cities.
- Choose travel dates and budget range.
- Select interests (culture, food, adventure, etc.).
- AI-powered itinerary generation triggered asynchronously.

### Trip Details Page
- Detailed, day-wise AI-generated itinerary.
- Clean UI with expandable daily plans.
- Rating system:
  - Overall rating (1–5).
  - Interest-based ratings.
  - Optional textual feedback.
- Re-generate itinerary option using feedback and past context.
- Real-time status updates while itinerary is being generated.

### Background Processing
- Itinerary generation handled via background workers.
- Redis-backed queues with BullMQ.
- Safe retry handling and job deduplication.
- Worker runs independently from the Next.js app.

### Email Notifications
- Email notifications triggered by workers after itinerary generation.
- Integrated using Mailgun.

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**  
  Used for UI, routing, and API endpoints.
- **Tailwind CSS + shadcn/ui**  
  Clean, modern, and consistent UI components.
- **Axios**  
  Client-side API communication.

### Backend
- **Next.js API Routes**  
  Core backend logic and authenticated APIs.
- **Node.js Worker Service**  
  Separate service for background jobs (BullMQ workers).

### Database
- **PostgreSQL (Neon)**  
  Primary relational database.
- **Drizzle ORM**  
  Type-safe schema, migrations, and queries.

### Queues & Caching
- **Redis (Upstash)**  
  Queue management and background job coordination.
- **BullMQ**  
  Reliable job processing with retries and backoff.

### AI & LLMs
- **OpenRouter**  
  LLM gateway for AI-powered itinerary generation.
- **Structured JSON responses**  
  Ensures consistent and renderable itineraries.

### Email
- **Mailgun**  
  Free-tier friendly email service for notifications.

---

## 🧱 Architecture Overview

- **Next.js App**  
  Handles UI, authentication, trip creation, and API orchestration.
- **Worker Service**  
  Listens to Redis queues and performs heavy tasks like:
  - AI itinerary generation
  - Email notifications
- **Shared Database**  
  Both services connect to the same PostgreSQL instance.
- **Event-driven design**  
  API triggers jobs; workers process them asynchronously.

---

## 🧠 Feedback-Driven Intelligence

Travel Buddy is designed to learn over time:

- Each itinerary generation is stored separately.
- User ratings are linked to specific generations.
- Interest-level ratings are captured in structured form.
- This data is intended to improve future generations.

---

## 🔮 Future Scope

Planned and possible extensions:

- Model Context Protocol style context server for AI generation.
- Aggregating user and global ratings to bias future itineraries.
- Embedding-based similarity search for trips and preferences.
- Smarter regeneration using past failures and feedback.
- Notification system using Server-Sent Events (SSE).
- Collaborative trips and shared itineraries.
- Cost-aware generation and real-time budget tracking.
- Multi-language itinerary generation.

---

## 🚀 Deployment

- **Frontend + API**: Vercel  
- **Workers**: Separate Node service (Render)
- **Database**: Neon Postgres
- **Redis**: Upstash

