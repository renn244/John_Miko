<div align="center">

# John Miko's Place Resort Management System

**Integrated Resort Booking, Operations, and Staff Management Platform**

*Purpose-built for John Miko's Place Resort*

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-Data_Fetching-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge)
![Dialogflow](https://img.shields.io/badge/Dialogflow-Chatbot-FF9800?style=for-the-badge&logo=googlecloud&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/Git-Version_Control-F05032?style=for-the-badge&logo=git&logoColor=white)

<br/>

![Status](https://img.shields.io/badge/Status-Active_Development-22c55e?style=flat-square)
![Type](https://img.shields.io/badge/Type-Capstone_Project-6366f1?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-Monorepo-0ea5e9?style=flat-square)
![License](https://img.shields.io/badge/License-Private-ef4444?style=flat-square)

</div>

---

## Overview

John Miko's Place Resort needs more than a simple reservation tracker. Resort operations involve accommodation setup, guest bookings, stay scheduling, overlapping availability, add-on service inventory, food pre-orders, payment verification, staff coordination, maintenance workflows, feedback collection, and guest assistance.

This system centralizes those workflows into one platform across three delivery surfaces:

- a **NestJS backend API** for business rules and data management
- a **React web admin panel** for resort administration and back-office workflows
- an **Expo mobile application** for staff-facing operational tools

The result is a single resort management platform that supports both guest transactions and day-to-day resort operations.

---

## Modules

| # | Module | Description |
|:-:|--------|-------------|
| 1 | **Accommodation Management** | Manage rooms, cottages, and event spaces with pricing, capacity, amenities, and preset stay options. |
| 2 | **Booking & Stay Scheduling** | Multi-step guest booking flow with stay-type selection, booking review, manual booking support, and stay-window-based validation. |
| 3 | **Add-on Service Inventory** | Shared-stock add-on services such as resort extras, with overlap-aware availability across bookings. |
| 4 | **Pre-order & Kitchen Workflow** | Food pre-order handling for bookings, with dedicated kitchen staff mobile views for incoming orders and status tracking. |
| 5 | **Payments & Verification** | Full and partial payment handling, proof-of-payment submission, payment approval/rejection flows, and revenue tracking. |
| 6 | **Guest Feedback & Analytics** | Guest feedback submission, admin feedback review, ratings analytics, and feedback reports. |
| 7 | **AI Chatbot / FAQ Assistant** | Guest-facing chatbot with admin-manageable rules and responses for automated resort inquiries. |
| 8 | **Staff Operations & Maintenance** | Resort staff and maintenance staff mobile workflows for booking assistance, incident reporting, and operational support. |
| 9 | **Reports & Dashboard Analytics** | Administrative dashboards and reporting for bookings, payments, revenue, and operational summaries. |
| 10 | **User & Access Management** | Role-based access for Admin, Guest, Kitchen Staff, Maintenance Staff, and Resort Staff across web and mobile surfaces. |

---

## Features

### Booking and Accommodation
- Accommodation creation and management with type, capacity, amenities, and preset stay options
- Day Stay, Overnight, 12 Hours Flexible, and 22 Hours Stay scheduling support
- Multi-step booking flow with guest details, add-ons, pre-orders, review, and payment
- Manual booking support for administrative workflows
- Stay-window-aware availability and overlap checks

### Add-ons and Food Ordering
- Shared-stock add-on service inventory management
- Overlap-aware add-on availability across conflicting stay windows
- Food pre-order attachment to bookings
- Kitchen staff mobile workflow for pre-order visibility and handling

### Payments and Operations
- Full and partial payment processing
- Proof-of-payment upload and admin verification flow
- Booking lifecycle handling including confirmation, cancellation, and rescheduling
- Staff operational support for resort-side booking assistance

### Feedback and Chatbot
- Guest feedback submission and editing
- Admin-side feedback review, reports, and rating analytics
- Guest-facing chatbot on the frontend
- Admin management of chatbot rules, quick replies, and response behavior

### Staff and Maintenance
- Mobile interfaces for kitchen staff, maintenance staff, and resort staff
- Maintenance reporting and task-oriented staff workflows
- Role-based boundaries between admin, guest, and operational users

---

## User Roles

| Role | Interface | Access |
|------|-----------|--------|
| **Admin** | Web admin panel | Accommodations, bookings, add-on services, menu items, reports, payments, feedback, chatbot rules, and staff operations |
| **Guest** | Web guest experience | Browse accommodations, create bookings, choose add-ons, submit payments, and send feedback |
| **Kitchen Staff** | Mobile app | View and manage booking-linked pre-orders |
| **Maintenance Staff** | Mobile app | View and manage maintenance-related operational tasks |
| **Resort Staff** | Mobile app | Assist with booking-side operational workflows and on-site coordination |

---

## Mobile Staff Interfaces

The mobile application is not just a companion app. It includes dedicated operational surfaces for:

- **Kitchen Staff** - pre-order visibility and handling
- **Maintenance Staff** - maintenance-focused workflow access
- **Resort Staff** - booking support and resort-side operational access

This keeps time-sensitive resort tasks accessible away from the admin desk.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | NestJS 11 | REST API, authentication, validation, and business logic |
| **ORM** | Prisma | Data access and schema management |
| **Database** | PostgreSQL via `DATABASE_URL` | Relational data storage |
| **Frontend** | React 19 + Vite | Web admin and guest-facing interface |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Web UI styling and reusable components |
| **State / Data** | TanStack Query, Zustand, React Hook Form, Zod | Fetching, local state, forms, and validation |
| **Mobile** | Expo Router + React Native | Staff mobile application |
| **Chatbot** | Google Dialogflow + managed chatbot rules | Guest assistance and resort FAQ automation |
| **Email** | Nest mailer / Nodemailer | Booking and account email flows |
| **Testing** | Jest, ts-jest | Backend unit and integration-style testing |
| **Version Control** | Git + GitHub | Source control and collaboration |

---

## Project Structure

```text
John Mickos Capstone/
|-- backend/        # NestJS API, Prisma schema, booking/payment/add-on logic, templates, tests
|-- frontend/       # React web app for admins and guests
|-- mobile/         # Expo mobile app for kitchen, maintenance, and resort staff
|-- docs/           # Planning notes, specs, and implementation documents
|-- README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database

### Installation and Run

**1. Backend**
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Configure environment variables such as `DATABASE_URL` before starting the backend.

### Cloudinary signed uploads

Image uploads require two **signed** Cloudinary upload presets with identical file limits:

- allowed formats: `jpg`, `jpeg`, `png`, `webp`
- maximum file size: 10 MB
- overwrite disabled
- public preset delivery type: `upload`
- private preset delivery type: `authenticated`

Accommodation, menu-item, add-on, and payment-method QR images use the public preset. Payment proofs, staff-report evidence, and maintenance evidence use the private preset.

Add these values to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_PUBLIC_UPLOAD_PRESET=
CLOUDINARY_PRIVATE_UPLOAD_PRESET=
```

Web and mobile clients obtain all Cloudinary upload parameters from the authenticated backend endpoint. The signature binds the preset, public ID, and delivery type. Their old unsigned upload presets should be disabled only after both clients have been updated and verified.

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Mobile**
```bash
cd mobile
npm install
npx expo start
```

If your setup requires them, configure additional environment files and service keys such as chatbot-related credentials before running the full system.

---

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

Useful backend test commands:

```bash
npm run test:watch
npm run test:cov
npm run test:e2e
```

### Frontend Build Check
```bash
cd frontend
npm run build
```

### Mobile Lint
```bash
cd mobile
npm run lint
```

---

## Project Info

| | |
|-|-|
| **Project Name** | John Miko's Place Resort Management System |
| **Client / Business** | John Miko's Place Resort |
| **Project Type** | Capstone Project |
| **Architecture** | Monorepo |
| **Platforms** | Web Admin, Web Guest, Mobile Staff |
| **Core Domain** | Resort Booking, Operations, Payments, Add-ons, Pre-orders, Feedback, Chatbot |

---
