# servora — Service Booking Platform

A full-stack service booking platform built with React, Bootstrap, Node.js, Express.js and PostgreSQL.

## Features

- Customer / Provider / Admin roles
- JWT authentication
- Provider service management
- Service search and category filtering
- Booking creation and cancellation
- Provider booking management
- Admin statistics and booking overview
- PostgreSQL relational schema and indexes
- Parameterized SQL queries
- Responsive Bootstrap UI

## Project structure

```text
service-booking-platform/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── index.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
└── database/
    └── schema.sql
```

## 1. Requirements

- Node.js 20.19+ (or a current compatible LTS)
- PostgreSQL
- npm

## 2. Database

Create a database named `servora`.

Run:

```bash
psql -U postgres -c "CREATE DATABASE servora;"
psql -U postgres -d servora -f database/schema.sql
```

Or open `database/schema.sql` in pgAdmin and execute it.

## 3. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update the database values.

Example:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/servora
JWT_SECRET=change_this_in_a_real_project
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed demo users and services:

```bash
npm run seed
```

Demo local-development accounts:

- Admin: `admin@example.com` / `Admin@123`
- Provider: `provider@example.com` / `Provider@123`

Start API:

```bash
npm run dev
```

API runs on `http://localhost:5000`.

## 4. Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## 5. Suggested demo flow

1. Register a customer.
2. Browse services.
3. Open a service.
4. Choose a future date/time and create a booking.
5. Log in as the provider and change the booking to accepted/completed.
6. Log in as admin to view the dashboard.

## Resume-ready project summary

Built a full-stack service marketplace using React, Bootstrap, Node.js, Express.js and PostgreSQL with JWT authentication, role-based authorization, provider service management, booking lifecycle workflows, admin analytics, relational database constraints and parameterized SQL queries.
